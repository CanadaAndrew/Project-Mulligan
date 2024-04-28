import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { notify, SERVICES } from './Enums/Enums';
import { RootSiblingParent } from 'react-native-root-siblings'
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { useLocalSearchParams } from 'expo-router';

//Declaring Window as a global variable to be accessed
declare global {
    interface Window { // ⚠️ notice that "Window" is capitalized here
      RecaptchaVerifier: any;
    }
  }
  
export default function NewClientInfo_AdminView(){

    const [selected, setSelected] = React.useState([]);
    let [hairStyleSelected, setHairStyleSelected] = React.useState([])
    //options for drop down menu
    const hairOptions = [
        {key: 'MENS_HAIRCUT', value: 'Mens Haircut'},
        {key: 'WOMANS_HAIRCUT', value: 'Womens Haircut'},
        {key: 'KIDS_HAIRCUT', value: 'Kids Haircut'},
        {key: 'PARTIAL_HIGHLIGHT', value: 'Partial Highlight'},
        {key: 'FULL_HIGHLIGHT', value: 'Full Highlight'},
        {key: 'ROOT_TOUCH_UP', value: 'Root Touch Up'},
        {key: 'FULL_COLOR', value: 'Full Color'},
        {key: 'EXTENSION_CONSULTATION', value: 'Extension Consultation'},
        {key: 'EXTENSION_INSTALLATION', value: 'Extension Installation'},
        {key: 'EXTENSION_MOVE_UP', value: 'Extension Move-Up'},
        {key: 'MAKEUP', value: 'Make-Up'},
        {key: 'SPECIAL_OCCASION_HAIRSTYLE', value: 'Special Occasion Hairstyle'},
        {key: 'PERM', value: 'Perm'},
        {key: 'DEEP_CONDITIONING_TREATMENT', value: 'Deep Conditioning Treatment'},
        {key: 'BLOW_DRY_AND_STYLE', value: 'Blow Dry and Style'},
        {key: 'WAXING', value: 'Waxing'}
    ];


    const { ID } = useLocalSearchParams<{ID:string}>();
    const id = parseInt(ID);

    console.log(id);

    const [defaultOptions, setDefaultOptions] = useState([]);

    //Variables to set customer info

    //This userID is temporary right now as there is no feature to bring the userID over from the previous page yet.
    //Need this to be changed later!!!!*************
    let userID = id; //for testing purposes
    //const userID = 6; //for testing purposes

    const [editingContactInfo, setEditingContactInfo] = useState(false);
    const [custName, setCustName] = useState('');
    const [originalCustPhone, setOriginalCustPhone] = useState('');
    const [newCustPhone, setNewCustPhone] = useState('');
    const [originalCustEmail, setOriginalCustEmail] = useState('');
    const [newCustEmail, setNewCustEmail] = useState('');

    //const [originalCustAddress, setOriginalCustAddress] = useState('');
    //const [newCustAddress, setNewCustAddress] = useState('');
    const [originalCustStreet, setOriginalCustStreet] = useState('');
    const [newCustStreet, setNewCustStreet] = useState('');
    const [originalCustAddress2, setOriginalCustAddress2] = useState('');
    const [newCustAddress2, setNewCustAddress2] = useState('');
    const [originalCustCity, setOriginalCustCity] = useState('');
    const [newCustCity, setNewCustCity] = useState('');
    const [originalCustStateAbbrev, setOriginalCustStateAbbrev] = useState('');
    const [newCustStateAbbrev, setNewCustStateAbbrev] = useState('');
    const [originalCustZip, setOriginalCustZip] = useState('');
    const [newCustZip, setNewCustZip] = useState('');

    const [editingPreferences, setEditingPreferences] = useState(false);
    const [originalCustNotes, setOriginalCustNotes] = useState('');
    const [newCustNotes, setNewCustNotes] = useState('');

    const auth = getAuth(firebase);
    auth.languageCode = 'en';

    //Toggles the edit permissions for the contact info box
    const toggleEditContactInfo = () => {
        setEditingContactInfo(prevState => !prevState);
    };
    
    //Toggles the edit permissions for the preferences info box
    const toggleEditPreferences = () => {
        setEditingPreferences(prevState => !prevState);
    };
    
    //updates database with contact info changes
    const saveContactInfoChanges = () => {
        if (newCustStreet !== originalCustStreet || newCustAddress2 !== originalCustAddress2 || newCustCity != originalCustCity
            || newCustStateAbbrev != originalCustStateAbbrev || newCustZip != originalCustZip) { //new address info entered

            /*const addressTokens = newCustAddress.split(','); //tokenize address string
            if (addressTokens.length !== 4) { //address must have 4 parts
                alert('Address must have four parts separated by commas: street, city, state abbreviation, and zip code');
                return;
            };*/

            //update client's address info in database
            try {
                const custStreet = newCustStreet.trim();
                const custAddress2 = newCustAddress2.trim();
                const custCity = newCustCity.trim();
                const custStateAbbrev = newCustStateAbbrev.trim();
                const custZip = newCustZip.trim();

                database.patch('/updateCurrentClientsAddress', {
                    userID: userID,
                    street: custStreet,
                    addressLine2: custAddress2,
                    city: custCity,
                    stateAbbreviation: custStateAbbrev,
                    zip: custZip
                });
                notify('Address updated successfully!');
                //setOriginalCustAddress(newCustAddress); //update original address info with new address info
                setOriginalCustStreet(custStreet);
                setOriginalCustAddress2(custAddress2);
                setOriginalCustCity(custCity);
                setOriginalCustStateAbbrev(custStateAbbrev);
                setOriginalCustZip(custZip);
            } catch (error) {
                console.error('Problem updating address info', error);
                notify('Problem updating address info: ' + error)
            };
        };

        if (newCustEmail !== originalCustEmail) { //new email info entered}
            //update client's email in database
            try {
                database.patch('/updateUsersEmail', {
                    userID: userID,
                    email: newCustEmail,
                });
                notify('Email updated successfully!');
                setOriginalCustEmail(newCustEmail); //update original email info with new email info
            } catch (error) {
                console.error('Problem updating email', error);
                notify('Problem updating email: ' + error)
            };
        };

        if (newCustPhone !== originalCustPhone) { //new phone number info entered
            //update client's phone number in database
            try {
                database.patch('/updateUsersPhone', {
                    userID: userID,
                    phoneNumber: newCustPhone
                });
                notify('Phone number updated successfully!');
                setOriginalCustPhone(newCustPhone); //update original phone number info with new phone number info
            } catch (error) {
                console.error('Problem updating phone number', error);
                notify('Problem updating phone number: ' + error);
            };
        }
        setEditingContactInfo(false); //after saving, switch back to view mode
    };

    //updates database with preferences changes
    const savePreferencesChanges = () => {
        if (newCustNotes !== originalCustNotes) { //new notes info entered
            //update client's notes in database
            try {
                database.patch('/updateCurrentClientsNotes', {
                    userID: userID,
                    clientNotes: newCustNotes
                });
                notify('Notes updated successfully!');
                setOriginalCustNotes(newCustNotes); //update original notes info with new notes info
            } catch (error) {
                console.error("Problem updating client's notes", error);
                notify("Problem updating client's notes: " + error);
            };
        };
        
        setEditingPreferences(false); //after saving, switch back to view mode*/
    };

    //this function gets the client info based on the UserID that is passed in to this page
    async function getClientInfo()
    {
        //queries the database for the regular client view because this part gets the clients name, email, and phone number
        //all clients new and current should have these in the database. This is all based on the UserID up above
        let clientData;
        let response = await database.get('/queryClientViewWithID', {
            params: {
                UserID: userID
            }
        });
        clientData = response.data;

        //formatting the clients name and sets it along with the email and phone number of the client
        let clientName = clientData[0].FirstName + " " + clientData[0].LastName;
        setCustName(clientName);
        setOriginalCustEmail(clientData[0].Email);
        setNewCustEmail(clientData[0].Email);
        setOriginalCustPhone(clientData[0].PhoneNumber);
        setNewCustPhone(clientData[0].PhoneNumber);
        
        //the next one queries the current client View for the rest of the entries on the page, based on the userID above
        let response2 = await database.get('/queryCurrentClientViewWithID', {
            params: {
                UserID: userID
            }
        });
        let clientData2 = response2.data;

        //this if Statement checks to see if there is any data given back from the current client view query. If there is
        //then that means that the client is a current client and has the necessary information to fill out the remaining fields.
        //if the query comes back empty it means that the client being searched for is not in the current client view and is 
        //therefore a new client. if that is the case then it fills the remaining fields with "New Client, Space is Blank"
        if(clientData2 != null)
        {
            //formatting the address of the client and setting it along with the clients notes
            setOriginalCustStreet(clientData2[0].Street);
            setNewCustStreet(clientData2[0].Street);
            setOriginalCustAddress2(clientData2[0].AddressLine2);
            setNewCustAddress2(clientData2[0].AddressLine2);
            setOriginalCustCity(clientData2[0].City);
            setNewCustCity(clientData2[0].City);
            setOriginalCustStateAbbrev(clientData2[0].StateAbbreviation);
            setNewCustStateAbbrev(clientData2[0].StateAbbreviation);
            setOriginalCustZip(clientData2[0].Zip);
            setNewCustZip(clientData2[0].Zip);
            setOriginalCustNotes(clientData2[0].ClientNotes);
            setNewCustNotes(clientData2[0].ClientNotes);
            

        }
        else
        {
            //if the client being searched for is not a current client they will not have the necessary data to fill out the remaining
            //fields so this is the place holder text
            const newClientString = 'New Client, Space is Blank'
            setOriginalCustStreet(newClientString);
            setNewCustStreet(newClientString);
            setOriginalCustAddress2(newClientString);
            setNewCustAddress2(newClientString);
            setOriginalCustCity(newClientString);
            setNewCustCity(newClientString);
            setOriginalCustStateAbbrev(newClientString);
            setNewCustStateAbbrev(newClientString);
            setOriginalCustZip(newClientString);
            setNewCustZip(newClientString);
            setOriginalCustNotes(newClientString);
            setNewCustNotes(newClientString);
        }

    }

    const formattingPhoneNumber = (input) => {
        if (/^\d*$/.test(input)){
            if (input.length <=10){
                return input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        } else {
            return input
        }
    }
    const setPhoneNumFormat = (input) => {
        if( input.length <= 12){
            if( /^\d*$/.test(input)){
                const formatPhoNum = formattingPhoneNumber(input);
                setNewCustPhone(formatPhoNum);
            }else{
                const newPhone = input.replace(/\D/g, ''); 
                setNewCustPhone(newPhone);
            }
        }
    }




    useEffect(() => {
        getClientInfo();
    }, [])

    return (
        <RootSiblingParent>
        <View >
          <ScrollView>
            
            <LinearGradient
              locations = {[0.7, 1]}
              colors = {['#DDA0DD', 'white']}
              style = {styles.background}
             >

                <View>
                    <Text >{'\n'}</Text>
                </View>
                <View style = {styles.titleBox}>
                    <Text style = {styles.clientNameTitle}>{custName}</Text>
                </View>
                <View>
                    <Text >{'\n'}</Text>
                </View>

                {/*Edit button and title*/}
                <View style={styles.inlineLayout}>
                    <Text style={styles.objectTitle}>Contact Info</Text>
                    <TouchableOpacity
                    style={styles.editButton}
                    onPress={editingContactInfo ? saveContactInfoChanges : toggleEditContactInfo}
                    >
                    <Text style={styles.editButtonText}>{editingContactInfo ? 'Save' : 'Edit'}</Text>
                    </TouchableOpacity>
                </View>

                {/*Client Info Box*/}
                <View style={[styles.clientBox, styles.container]}>
                    <Text style={styles.clientTilteText}>Email</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustEmail}
                            onChangeText={setNewCustEmail}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustEmail}</Text>
                    )}
                    <Text>{'\n'}</Text>
                    <Text style={styles.clientTilteText}>Phone Number (###-###-####)</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustPhone}
                            onChangeText={setPhoneNumFormat}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustPhone}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>Street</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustStreet}
                            onChangeText={setNewCustStreet}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustStreet}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>Apt/Suite #</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustAddress2}
                            onChangeText={setNewCustAddress2}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustAddress2}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>City</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustCity}
                            onChangeText={setNewCustCity}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustCity}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>State Abbreviation</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustStateAbbrev}
                            onChangeText={setNewCustStateAbbrev}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustStateAbbrev}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>Zip Code</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={newCustZip}
                            onChangeText={setNewCustZip}
                        />
                    ) : (
                    <Text style={styles.clientText}>{originalCustZip}</Text>
                    )}
                </View>
                <View>
                    <Text>{'\n'}</Text>
                </View>

                {/* Edit button and title for Preferences */}
                <View style={styles.inlineLayout}>
                <Text style={styles.objectTitle}>Notes</Text>
                <TouchableOpacity
                style={styles.editButton}
                onPress={editingPreferences ? savePreferencesChanges : toggleEditPreferences}
                >
                    {/*Just copied the editing button from the first one above seems to work fine*/}
                    <Text style={styles.editButtonText}>{editingPreferences ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

                {/* Client Info Box for Preferences */}
            <View style={[styles.clientBox, styles.container]}>

                {editingPreferences ? (
                <TextInput
                    style={styles.clientTextInput}
                    value={newCustNotes}
                    onChangeText={setNewCustNotes}
                    multiline={true}
                />
                ) : (
                <Text style={styles.clientText}>{originalCustNotes}</Text>
                )}
            </View>

            </LinearGradient>
             
            </ScrollView>
        </View>
        </RootSiblingParent>
    );
}

const styles = StyleSheet.create({
    container: {
        //borderRadius: 90,
        //justifyContent: 'flex-start'
    },
    // title styling 
    objectTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
        flex: 1,
        paddingBottom: 10
    },
    // background under logo image
    background: {
        paddingBottom: 250,
        alignItems: 'center',
    },
    // shadow for objects IOS
    boxShadowIOS: {
        shadowColor: 'black',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 4
    },
     // shadow for objects Android
     boxShadowAndroid: {
        elevation: 10
    },
    // client text info
    clientText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18
    },

    clientTextInput: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 18
    },
    // titles for client text info
    clientTilteText: {
        color: '#942989',
        fontWeight: 'bold',
        fontSize: 18
    },
    // white appointment block
    clientBox: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 40,
        flexDirection: 'column',
        alignItems: 'flex-start',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
    },
    // Submit button style
    titleBox: {
        width: 350, //
        height: 100, //
        paddingTop: 30,
        backgroundColor: '#942989',
        borderRadius: 20,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
    },
    // Client Name 
    clientNameTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
        //marginTop: 25
    },
    // Edit Button text
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    // Edit Button
    editButton: {
        width: 65, 
        height: 40, 
        paddingTop: 12,
        marginBottom: 20,
        marginLeft: 'auto',//25,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: '#BE42B2',
        borderRadius: 20,
    },
    //Unused for now. Was too glitchy. Was going to use to change save button color
    saveButton: {
        backgroundColor: 'green',
    },
    // to split title and edit button on one line
    inlineLayout: {
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10,
    }
});