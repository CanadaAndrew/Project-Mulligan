import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

//Declaring Window as a global variable to be accessed
declare global {
    interface Window { // ⚠️ notice that "Window" is capitalized here
      RecaptchaVerifier: any;
    }
  }
  
export default function NewClientInfo_AdminView({ navigation, route}){

    const database = axios.create({
        //baseURL: 'http://10.0.0.192:3000', //Andrew pc local
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.133:3000',
        //baseURL: 'http://10.0.0.14:3000', //Cameron pc local
        baseURL: 'http://10.0.0.112:3000',
    })

    const { id } = route.params;

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
    const [originalCustCity, setOriginalCustCity] = useState('');
    const [newCustCity, setNewCustCity] = useState('');
    const [originalCustStateAbbrev, setOriginalCustStateAbbrev] = useState('');
    const [newCustStateAbbrev, setNewCustStateAbbrev] = useState('');
    const [originalCustZip, setOriginalCustZip] = useState('');
    const [newCustZip, setNewCustZip] = useState('');

    const [editingPreferences, setEditingPreferences] = useState(false);
    const [originalCustServices, setOriginalCustServices] = useState('');
    const [newCustServices, setNewCustServices] = useState('');
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
        if (newCustStreet !== originalCustStreet || newCustCity != originalCustCity
            || newCustStateAbbrev != originalCustStateAbbrev || newCustZip != originalCustZip) { //new address info entered

            /*const addressTokens = newCustAddress.split(','); //tokenize address string
            if (addressTokens.length !== 4) { //address must have 4 parts
                alert('Address must have four parts separated by commas: street, city, state abbreviation, and zip code');
                return;
            };*/

            //update client's address info in database
            try {
                const custStreet = newCustStreet.trim();
                const custCity = newCustCity.trim();
                const custStateAbbrev = newCustStateAbbrev.trim();
                const custZip = newCustZip.trim();

                database.patch('/updateCurrentClientsAddress', {
                    userID: userID,
                    street: custStreet,
                    city: custCity,
                    stateAbbreviation: custStateAbbrev,
                    zip: custZip
                });
                alert('Address updated successfully');
                //setOriginalCustAddress(newCustAddress); //update original address info with new address info
                setOriginalCustStreet(custStreet);
                setOriginalCustCity(custCity);
                setOriginalCustStateAbbrev(custStateAbbrev);
                setOriginalCustZip(custZip);
            } catch (error) {
                console.error('Problem updating address info', error);
            };
        };

        if (newCustEmail !== originalCustEmail) { //new email info entered}
            //update client's email in database
            try {
                database.patch('/updateUsersEmail', {
                    userID: userID,
                    email: newCustEmail,
                });
                alert('Email updated successfully');
                setOriginalCustEmail(newCustEmail); //update original email info with new email info
            } catch (error) {
                console.error('Problem updating email', error);
            };
        };

        if (newCustPhone !== originalCustPhone) { //new phone number info entered
            //update client's phone number in database
            try {
                database.patch('/updateUsersPhone', {
                    userID: userID,
                    phoneNumber: newCustPhone
                });
                alert('Phone number updated successfully');
                setOriginalCustPhone(newCustPhone); //update original phone number info with new phone number info
            } catch (error) {
                console.error('Problem updating phone number', error);
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
                alert('Notes updated successfully');
                setOriginalCustNotes(newCustNotes); //update original notes info with new notes info
            } catch (error) {
                console.error("Problem updating client's notes", error);
            };
        };
        
        //update client's services wanted in database
        if (newCustServices !== originalCustServices) { //new services wanted info entered
           
            //determine which services were added and/or removed
            const newServices = newCustServices.split(',').map(service => service.trim()).filter(Boolean); 
            const oldServices = originalCustServices.split(',').map(service => service.trim()).filter(Boolean); 
            const addedServices = newServices.filter(service => !oldServices.includes(service)); //remove old services from new services to get added services
            const removedServices = oldServices.filter(service => !newServices.includes(service)); //remove new services from old services to get removed services
            //console.log('addedServices:', addedServices); //for testing purposes
            //console.log('removedServices:', removedServices); //for testing purposes

            if (addedServices.length > 0) { //there are services to be added
                try {
                    addedServices.forEach(async (service) => {
                        await database.post('/servicesWantedPost', {
                            userID: userID,
                            serviceName: service
                        });
                    });
                alert('Services added successfully');
                } catch (error) {
                    console.error('Problem updating services wanted', error);
                };
            };
            
            if (removedServices.length > 0) { //there are services to be removed
                try {
                    removedServices.forEach(async (service) => {
                        await database.delete('/deleteServicesWanted', {
                            data: {
                                userID: userID,
                                serviceName: service
                            }
                        });
                    });
                alert('Services removed successfully');
                } catch (error) {
                    console.error('Problem updating services wanted', error);
                };
            };
            setOriginalCustServices(newCustServices); //update original services wanted info with new services wanted info
            setEditingPreferences(false); //after saving, switch back to view mode*/
        };
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
            setOriginalCustCity(clientData2[0].City);
            setNewCustCity(clientData2[0].City);
            setOriginalCustStateAbbrev(clientData2[0].StateAbbreviation);
            setNewCustStateAbbrev(clientData2[0].StateAbbreviation);
            setOriginalCustZip(clientData2[0].Zip);
            setNewCustZip(clientData2[0].Zip);
            setOriginalCustNotes(clientData2[0].ClientNotes);
            setNewCustNotes(clientData2[0].ClientNotes);
            
            //the last query gets the services wanted. Since we know the client is in the current client view in this block of the code
            //they should have entered in their preferred services when being made a current client. 
            let response3 = await database.get('/queryServicesWantedWithID', {
                params: {
                    UserID: userID
                }
            });
            let clientServices = response3.data;

            //formats the preferred services. This block really only matters if there is more than one preferred service
            //it will look the same for everyone who has just one preferred service
            let prefServices = "";
            for(let i = 0; i < clientServices.length; i++)
            {
                if (i < clientServices.length - 1){
                prefServices = prefServices + clientServices[i].ServiceName + ", "
                }
                else{
                    prefServices = prefServices + clientServices[i].ServiceName;
                }
            }

            //sets the clients services
            setOriginalCustServices(prefServices);
            setNewCustServices(prefServices);
        }
        else
        {
            //if the client being searched for is not a current client they will not have the necessary data to fill out the remaining
            //fields so this is the place holder text
            const newClientString = 'New Client, Space is Blank'
            setOriginalCustStreet(newClientString);
            setNewCustStreet(newClientString);
            setOriginalCustCity(newClientString);
            setNewCustCity(newClientString);
            setOriginalCustStateAbbrev(newClientString);
            setNewCustStateAbbrev(newClientString);
            setOriginalCustZip(newClientString);
            setNewCustZip(newClientString);
            setOriginalCustServices(newClientString);
            setNewCustServices(newClientString);
            setOriginalCustNotes(newClientString);
            setNewCustNotes(newClientString);
        }

    }

    const formattingPhoneNumber = (input) => {
        if (/^\d*$/.test(input)){
            if (input.length <=10){
                return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
        } else {
            return input
        }
    }
    const setPhoneNumFormat = (input) => {
        if( input.length <= 14){
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
                <Text style={styles.objectTitle}>Preferences</Text>
                <TouchableOpacity
                style={styles.editButton}
                onPress={editingPreferences ? savePreferencesChanges : toggleEditPreferences}
                >
                <Text style={styles.editButtonText}>{editingPreferences ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

                {/* Client Info Box for Preferences */}
            <View style={[styles.clientBox, styles.container]}>
                <Text style={styles.clientTilteText}>Preferred Services (Commas between services)</Text>
                {editingPreferences ? (
                <TextInput
                    style={styles.clientTextInput}
                    value={newCustServices}
                    onChangeText={setNewCustServices}
                    multiline={true}
                />
                ) : (
                <Text style={styles.clientText}>{originalCustServices}</Text>
                )}
                <Text>{'\n'}</Text>
                <Text style={styles.clientTilteText}>Notes</Text>
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