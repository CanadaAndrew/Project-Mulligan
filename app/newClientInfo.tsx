import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Pressable,
    FlatList,
    Image,
    TextInput,
    Keyboard,
} from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { Link } from 'expo-router';
import axios from 'axios';
//import {initializeApp} from 'firebase/app';
import { listOfStates, funcObj, functionGetRetry, notify } from './Enums/Enums';
import Constants from 'expo-constants';
import { RootSiblingParent } from 'react-native-root-siblings'
import { response } from 'express';

export default function NewClientInfo({route}) {

    //server connection
    const database = axios.create({
        //baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
        //baseURL: 'http://10.0.0.192:3000'
        baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.112:3000',
    });

   const { userData } = route.params;

   //console.log(userData); //for testing purposes

    async function getName(userID){
        let funcObj:funcObj = {
            entireFunction: () => database.get('/findNewClientViewByID', {
                params: {
                    Id : userID
                }
            }),
            type: 'get'
        };
        let name
        try{
            name = await functionGetRetry(funcObj)
        }catch(error){
                notify(error)
                return 'NA'
            }
            return name.data[0].FirstName;
    }

    

    //temp name, need to import the client's name from somewhere else
    const [firstName, newFirstName] = useState(''); 
    const welcomeMessage = 'Congratulations ' + firstName + '! You\'ve been approved as a new client. Fill in some additional info to complete your sign up process.';

    const [StreetAddress, newStreetAddress] = useState('');
    const [Address2, newAddress2] = useState('');
    const [City, newCity] = useState('');
    const [State, newState] = useState(''); 
    const [ZipCode, newZipCode] = useState(''); 

    const [StreetAddressValid, setStreetAddressValid] =  useState(false);
    const [CityValid, setCityValid] = useState(false);
    const [StateValid, setStateValid] = useState(false); 
    const [ZipValid, setZipValid] = useState(false); 

    const formComplete = StreetAddressValid && CityValid && StateValid && ZipValid;

    //dummy data for testing purposes
    //const user_ID = 10; //will need to be replaced with actual userID once ok'd from admin (ApprovalStatus in NewClients) -> do we need to check approval status?
    // const strt = "1234 Main St";
    // const cty = "Anytown";
    // const stat = "TX";
    // const zp = "12345";

    const user_ID = userData.userID;
    //const user_ID = 4; //for testing purposes

    //adds current client to database
    const handleCurrentClientPost = async () => {
        try {
            let funcObj:funcObj;
            if (Address2 !== null && Address2.trim().length > 0) { //if Address2 is not empty
                funcObj = {
                    entireFunction: () => database.post('/currentClientPost', { //userID, street, addressLine2, city, state, zip
                        userID: user_ID, //for demo -> need to replace with actual imported userID -> can use UserID 9-22 for testing but must increment after each use
                        //street: strt,
                        //city: cty,
                        //state: stat,
                        //zip: zp
                        street: StreetAddress,
                        addressLine2: Address2,
                        city: City,
                        state: State,
                        zip: ZipCode
                    }),
                    type: 'post'
                };
            } else {
                funcObj = {
                    entireFunction: () => database.post('/currentClientPostNo2', { //userID, street, city, state, zip
                        userID: user_ID, //for demo -> need to replace with actual imported userID -> can use UserID 9-22 for testing but must increment after each use
                        //street: strt,
                        //city: cty,
                        //state: stat,
                        //zip: zp
                        street: StreetAddress,
                        city: City,
                        state: State,
                        zip: ZipCode
                    }),
                    type: 'post'
                };
            }
            const response = await functionGetRetry(funcObj);
            //console.log(response); //for testing purposes
            notify('Your information has been updated!');
            //should navigate to home page after successful submission -> need to implement
        } catch (error) {
            console.error('Error adding current client:', error.response.data);
            notify('Error adding current client: ' + error.response.data)
        }
    }

    function getApprovalStatus(userId){
        let data;
        let funcObj:funcObj = {
            entireFunction: () => database.get('/customQuery', {
                params: {
                    query: 'SELECT UserID, ApprovalStatus FROM NewClientView WHERE UserID = ' + userId + ';'
                }
            }),
            type: 'get'
        };
            functionGetRetry(funcObj)
            .then((ret) => data = ret.data)
            .then(() => { isApproved(data) })
            .catch(() => { notify("error"); });
    }


    function isApproved(data){
        if (data[0].ApprovalStatus == 0) {
            handleCurrentClientPost()
        }
    }

    function checkStreetAddressValid()
    {
        //Street addresses have lots of variences that regex doesn't cover, so using a address verifier would be preferable.
        //but for now we're checking if length > 5
        setStreetAddressValid(StreetAddress.length > 5 ? true : false);
        //console.log('StreetAddressValid', StreetAddressValid); //for testing purposes
        //console.log('formComplete', formComplete); //for testing purposes
    }

    function checkCityValid()
    {
        //checks for regular characters only and that city length isn't 0
        setCityValid(/^[a-zA-Z ]*$/.test(City) && City.length > 0 ? true : false);
        //console.log('CityValid', CityValid); //for testing purposes
        //console.log('formComplete', formComplete); //for testing purposes
    }

    function checkStateValid()
    {
        //Checks with a list of states in enum.tsx, if State matches with anything on the list, then it's a valid state.
        //Also accepts state abbreviations like CA and NV.
        setStateValid(Object.values(listOfStates).includes(State) || listOfStates[State.toUpperCase()] ? true : false);
        //console.log('StateValid', StateValid); //for testing purposes
        //console.log('formComplete', formComplete); //for testing purposes
    }

    function checkZipValid()
    {
        //zip codes are 5 digits
        setZipValid(ZipCode.length == 5 ? true : false);
        //console.log('ZipValid', ZipValid); //for testing purposes
        //console.log('formComplete', formComplete); //for testing purposes
    }
    async function setFirstName()
    {
        const updateName =  await getName(userData.userID);
        //const updateName =  await getName(user_ID);  //for testing purposes
        // if(firstName == '')
        // newFirstName(updateName);
        if ( typeof updateName === 'string' && firstName === '') {
            newFirstName(updateName);
        }
    }
    
    useEffect(() => {
        setFirstName()
    }, [])
    return (
    <RootSiblingParent>
    <>
    <ScrollView>
        <LinearGradient locations={[0.7, 1]} colors={['#DDA0DD', 'white']} style={styles.container2}> 
            <Text >{'\n'}</Text>
            <View style = {[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                <Text style={styles.appointText}>{welcomeMessage}</Text>
            </View> 
            <View style={styles.textFieldContainer}>
                <Text style= {styles.textFieldHeader} >Street Address</Text>
                    <TextInput
                        style={styles.textField}
                        value={StreetAddress}
                        onChangeText={newStreetAddress}
                        onTextInput={() => checkStreetAddressValid()}
                        placeholder="Street Address"
                />
                <Text style= {styles.textFieldHeader} >Apt/Suite # (optional)</Text>
                    <TextInput
                        style={styles.textField}
                        value={Address2}
                        onChangeText={newAddress2}
                        placeholder="Apt/Suite #"
                />
                <Text style= {styles.textFieldHeader} >City</Text>
                    <TextInput
                        style={styles.textField}
                        value={City}
                        onChangeText={newCity}
                        onTextInput={() => checkCityValid()}
                        placeholder="City"
                />
                <Text style= {styles.textFieldHeader} >State & Zip Code</Text>
                    <View style={[
                        styles.container,
                        {
                            flexDirection: 'row',
                        },
                    ]}>
                        <TextInput
                            style={styles.textFieldState}
                            value={State}
                            onChangeText={newState}
                            onTextInput={() => checkStateValid()}
                            placeholder="State"
                        />
                        <Text> </Text>
                        <TextInput
                            style={styles.textFieldZip}
                            value={ZipCode}
                            maxLength={5}
                            keyboardType="number-pad"
                            onChangeText={newZipCode}
                            onTextInput={() => checkZipValid()}
                            placeholder="Zip"
                            onSubmitEditing={() => getApprovalStatus(user_ID)}
                        />
                    </View>
                <Text >{'\n'}{'\n'}{'\n'}</Text>
                <TouchableOpacity 
                    disabled={!formComplete} //until everything is filled out, button is disabled.
                    style={styles.signUpButton}
                    onPress={() => getApprovalStatus(user_ID)}
                >
                    <Text style={styles.signUpText}>Save Changes</Text>
                </TouchableOpacity>                
            {/*testing stuff if all the fields are valid*/}
            {/*StateValid && <Text >state valid is true</Text>  }
            {/*CityValid && <Text >city valid is true</Text> /**/ }
            {/*StreetAddressValid && <Text > address valid is true</Text> /**/ }
            {/*ZipValid && <Text > zip valid is true</Text> /**/ }
            </View>
            
        </LinearGradient>
        </ScrollView>
    </>  
    </RootSiblingParent>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container2: {
        flex: 1,
        paddingBottom: 400
    },
    // title of page
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // header color
    header: {
        backgroundColor: '#942989',
        paddingTop: 30,
        paddingBottom: 20,
        alignItems: 'center'
    },
    // white appointment block
    appointBox: {
        backgroundColor: 'white',
        margin: 15,
        borderRadius: 20,
        //alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 3

    },
    // appointment text information 
    appointText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 10
        ///textAlign: 'center'
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
    // text alignment
    textAlignment: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    backButton: {
        width: 100,
        height: 65,
        paddingLeft: 20,
        paddingTop: 10,
        //paddingBottom: 10,
        //margin: 5,
        //marginBottom: 30,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginRight: 10,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    sectionTitle: {
    },
    sectionTitleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        padding: 5,
    },
    textFieldContainer: {
        alignItems: 'center',
        padding: 5,
        gap: 10
    },
    textField: {
        backgroundColor: '#D3D3D3',
        color: 'black',
        fontWeight: 'bold',
        width: '85%',
        height: 50,
        borderRadius: 15,
        padding: 10
    },
    textFieldState: {
        backgroundColor: '#D3D3D3',
        color: 'black',
        fontWeight: 'bold',
        width: '35%',
        height: 50,
        borderRadius: 15,
        padding: 10
    },
    textFieldZip: {
        backgroundColor: '#D3D3D3',
        color: 'black',
        fontWeight: 'bold',
        width: '50%',
        height: 50,
        borderRadius: 15,
        padding: 10
    },
    textFieldHeader:{
        textAlign: 'center'
       
    },
    signUpButton: {
        alignItems: 'center',
        width: 200,
        height: 50,
        paddingTop: 13,
        margin: 5,
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
    signUpText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20
    }
});