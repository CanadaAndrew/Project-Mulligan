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
    TextInput
} from 'react-native';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { Link } from 'expo-router';
import axios from 'axios';
//firebase imports VVV
import firebase from './Firebase.js'
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import {funcObj, functionGetRetry} from './Enums/Enums'

//made this available for all pages in the app
export let hairStyleSelected: string[] = [];
export let contactSelected: string[] = [];


export default function SignUp({ navigation, route }) { // added route for page navigation

    const database = axios.create({
        //baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
        //baseURL: 'http://10.0.0.192:3000'
        //baseURL: 'http://10.0.0.199:3000',
        //baseURL: 'http://10.0.0.14:3000', // Cameron's IP address for testing
        baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.112:3000',
    })

    //initializes the Authentication and gets a reference to the service
    const auth = getAuth(firebase);
    //sets the default language to the systems language
    auth.languageCode = 'it';

    //useState for drop down menu
    const [selected, setSelected] = React.useState("");
    const [selectedCont, setSelectedCont] = React.useState("");

    // hair selection
    function handleHairSelection(selected) {
        let temparr: string[] = [];

        var temp = selected.toString();
        temparr = temp.split(",");
        hairStyleSelected = temparr;
    }

    // contact selection
    function contactSelection(selectedCont) {
        let temparr: string[] = [];

        var temp = selectedCont.toString();
        temparr = temp.split(",");
        contactSelected = temparr;
    }

    /*useEffect(() => { //for testing purposes -> prints to console whenever lists are updated
        console.log('hairStyleSelected', hairStyleSelected); //for testing purposes
    }, [hairStyleSelected]);*/

    //using this dummy data because the dateData variable isn't working currently ^^^ keeps spitting out Monday, December 4th, 2023
    let dateChosen = 'Mon, 04 December 2023';

    // for text input fields
    const [firstName, newFirstName] = React.useState('');
    const [lastName, newLastName] = React.useState('');
    const [email, newEmail] = React.useState('');
    const [phoneNumber, newPhoneNumber] = React.useState('');
    const [password, newPassword] = React.useState('');
    const [confirmPassword, newConfirmPassword] = React.useState('');

    //set length and character checks for text input fields
    const [count, setCount] = useState(0);

    
    const [firstNameValid, setfirstNameValid] =  React.useState(false);
    const [lastNameValid, setlastNameValid] =  React.useState(false);
    const [emailValid, setemailValid] =  React.useState(false);
    const [phoneNumberValid, setphoneNumberValid] =  React.useState(false);
    const [passwordValid, setpasswordValid] =  React.useState(false);
    const [confirmPasswordValid, setconfirmPasswordValid] =  React.useState(false);

    //is everything filled out? if so, unlock the sign up button
    const formComplete =  !(firstNameValid && lastNameValid && emailValid && phoneNumberValid && passwordValid && confirmPasswordValid && selected.length != 0 && selectedCont.length != 0); 

    /*useEffect(() => { //for testing purposes -> prints to console whenever lists are updated
        console.log('firstNameValid', firstNameValid); //for testing purposes
        console.log('lastNameValid', lastNameValid); //for testing purposes
        console.log('emailValid', emailValid); //for testing purposes
        console.log('phoneNumberValid', phoneNumberValid); //for testing purposes
        console.log('passwordValid', passwordValid); //for testing purposes
        console.log('confirmPasswordValid', confirmPasswordValid); //for testing purposes
        console.log('selected.length', selected.length); //for testing purposes
    }, [firstNameValid, lastNameValid, emailValid, phoneNumberValid, passwordValid, confirmPasswordValid, selected.length]);*/

    //check() functions set the letter/number/length requirement of each text field
    //TODO: determine each requirement for each field 
    function checkfirstNameValid() {
        setfirstNameValid(firstName.length > 0 ? true : false);
    }

    function checklastNameValid()
    {
        setlastNameValid(lastName.length>0 ? true : false);
    }

    function checkemailValid() {
        //reg expression checks for ---@---.--- format
        setemailValid(/\S+@\S+\.\S+/.test(email));
    }

    function checkphoneNumberValid() {
        //add dashes to maintain ###-###-#### format
        if (phoneNumber.length == 3 || phoneNumber.length == 7) {
            newPhoneNumber(phoneNumber + '-');
        }

        //13 to account for international phones
        setphoneNumberValid(phoneNumber.length == 12 || phoneNumber.length == 13 ? true : false);

    }
    function checkpasswordValid() {
        //if the password contains numbers and letters and is 8 chars or more in length...
        if (password.match(/^[A-Za-z0-9]*$/))
            setpasswordValid(password.length > 7 ? true : false);
    }
    function checkconfirmPasswordValid() {
        setconfirmPasswordValid(password == confirmPassword ? true : false)
    }

    //options for drop down menu
    const hairOptions = [
        { key: ' Mens Haircut', value: ' Mens Haircut' },
        { key: ' Women\'s Haircut', value: ' Women\'s Haircut' },
        { key: ' Kids Haircut', value: ' Kids Haircut' },
        { key: ' Partial Highlight', value: ' Partial Highlight' },
        { key: ' Full Highlight', value: ' Full Highlight' },
        { key: ' Root Touch Up', value: ' Root Touch Up' },
        { key: ' Full Color', value: ' Full Color' },
        { key: ' Extension Consultation', value: ' Extension Consultation' },
        { key: ' Extension Installation', value: ' Extension Installation' },
        { key: ' Extension Move-Up', value: ' Extension Move-Up' },
        { key: ' Make-Up', value: ' Make-Up' },
        { key: ' Special Occasion Hairstyle', value: ' Special Occasion Hairstyle' },
        { key: ' Perm', value: ' Perm' },
        { key: ' Deep Conditioning Treatment', value: ' Deep Conditioning Treatment' },
        { key: ' Blow Dry and Style', value: 'Blow Dry and Style' }
    ];

    const contactPref = [
        {key: ' Phone number ', value: ' Phone Number'},
        {key: ' email ', value: ' Email '}
    ];

    //demo data for postNewUser function until Firebase authentication is set up
    /*const e_mail = 'joeshmoe@anywhere.com';
    const phone_number = '5555555555';
    const pass_word = 'JoesPassword';
    const admin_priv = 0; //no admin privileges
    const first_name = 'Joe';
    const middle_name = 'Sh';
    const last_name = 'Moe';
    const preferred_way_of_contact = 'email';
    const approval_status = 1; //not sure what 1 represents - Chris*/

    //posts new user to the database, assumes user is verified by firebase
    const postNewUser = async () => {
        try {
            //post data for new user
            let funcObj:funcObj = {
                entireFunction:() => database.post('/newUserPost', {
                    /*email: e_mail, //uses demo data
                    phoneNumber: phone_number,
                    pass: pass_word,
                    adminPrive: admin_priv*/
                    email: email,
                    phoneNumber: phoneNumber,
                    adminPriv: 1
                }),
                type: 'post'
            };
            const userResponse = await functionGetRetry(funcObj);
                
            //get the userID from response
            const userID = userResponse.data.userID;
            //console.log('userID', userID); //for testing
            //post to Clients -> must post to Clients before NewClients because of foreign key constraint
            
            funcObj = {
                entireFunction: () => database.post('/newClientPost', {
                    /*userID: userID, //uses demo data
                    firstName: first_name,
                    middleName: middle_name,
                    lastName: last_name,
                    preferredWayOfContact: preferred_way_of_contact*/
                    userID: userID,
                    firstName: firstName,
                    lastName: lastName,
                    preferredWayOfContact:contactSelected.join(", "), //form info?
                }),
                type: 'post'
            };
            await functionGetRetry(funcObj);

            funcObj = {
                entireFunction: () => database.post('/new_newClientPost', {
                    /*userID: userID, //uses demo data
                    approvalStatus: approval_status*/
                    userID: userID,
                    approvalStatus: 1 //not sure what 1 represents - Chris
                }),
                type: 'post'
            };
            //post to NewClients
            await functionGetRetry(funcObj);

            //post to ServicesWanted
            const servicePromises = hairStyleSelected.map(async (service) => {
                try {
                    let funcObj:funcObj = {
                        entireFunction: () => database.post('/servicesWantedPost', {
                            userID: userID,
                            serviceName: service
                        }),
                        type: 'post'
                    }
                    const serviceResponse = await functionGetRetry(funcObj);
                } catch (error) {
                    console.error('Error posting services wanted:', error.serviceResponse.data);
                }
            });
            await Promise.all(servicePromises); //wait for all services to be posted

            console.log('New user and related data posted successfully.');
            alert('new account created successfully');
        } catch (error) {
            console.error('Error posting new user data:', error);
            alert('problem with creating new account');
        }
    };

    function newUserSignUp() {
        //password conditionals if these are both false move onto setting the 
        if (password != confirmPassword) {
            alert("Passwords did not match. Please try again.")
        }
        else if (password == "" || confirmPassword == "") {
            alert("No password was entered. Please enter in a password.")
        }
        else {
            /*
            IMPORTANT

            We are going to talk with Melissa about using emails instead of Phone numbers for authentication
            For some reason the phone number verification doesn't want to work and we've been trying but have only had
            success with the email verification. We may implement this at a later date.
            */
            //if(phoneNumber != "")
            //{
            //not able to get the phone number verification to work. 
            /*window.RecaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
                'size': 'invisible',
                'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });*/
            //}
            //else
            //{
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                    return 1; //returns 1 on sign up fail so that way it doesn't post this user to the database
                });
            //}
            return 0;
        }
        //returns 1 if something along the way messed up so it doesn't post the new user to the database
        alert("Something went wrong. Please enter account information and try again2.")
        return 1;
    }

    function handleSignUpPress() {
        //registers the user with Firebase first then if the function returns 0 meaning a successful user creation
        //it will post the user to the database and route them back to the login page
        let verify = newUserSignUp();

        if (verify == 0) {
            postNewUser();
            navigation.navigate("Login")
        }
    }
    return (
        <>
            <StatusBar backgroundColor={'black'} />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('./images/logo.png')} style={styles.logo} />
                </View>
                <LinearGradient locations={[0.8, 1]} colors={['#DDA0DD', 'white']} style={styles.linearGradientStyle}>
                    <View style={styles.body}>
                        <View style={styles.createAccountContainer}>
                            <Text style={styles.createAccountText}>Create an Account</Text>
                        </View>
                        <View style={styles.textFieldContainer}>
                            <TextInput
                                style={styles.textField}
                                value={firstName}
                                onChangeText={newFirstName}
                                onTextInput={() => checkfirstNameValid()}
                                placeholder="First Name"
                            />
                            <TextInput
                                style={styles.textField}
                                value={lastName}
                                onChangeText={newLastName}
                                onTextInput={() => checklastNameValid()}
                                placeholder="Last Name"
                            />
                            <TextInput
                                style={styles.textField}
                                value={email}
                                onChangeText={newEmail}
                                onTextInput={() => checkemailValid()}
                                placeholder="Email"
                            />
                            <TextInput
                                style={styles.textField}
                                value={phoneNumber}
                                onChangeText={newPhoneNumber}
                                onTextInput={() => checkphoneNumberValid()}
                                placeholder="Phone Number"
                                keyboardType="numeric"
                                maxLength={14}  // putting 14 for now if international number + added dashes , originally 11
                            />
                            <TextInput
                                style={styles.textField}
                                secureTextEntry={true}
                                value={password}
                                onChangeText={newPassword}
                                onTextInput={() => { checkpasswordValid(); checkconfirmPasswordValid() }} /*extra measure if user changes password*/
                                placeholder="Password"
                            />
                            <TextInput
                                style={styles.textField}
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={newConfirmPassword}
                                onTextInput={() => checkconfirmPasswordValid()}
                                placeholder="Confirm Password"
                            />
                        </View>
                        <View style={styles.serviceContainer}>
                            <MultipleSelectList
                                setSelected={(val) => setSelected(val)}
                                data={hairOptions}

                                // styles
                                boxStyles={styles.dropDown}
                                inputStyles={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                                labelStyles={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                                dropdownStyles={{
                                    backgroundColor: 'white',
                                    width: '85%'
                                }}
                                badgeStyles={styles.badgeStyle}

                                maxHeight={1500}
                                save='value'
                                search={false}
                                label="Preferred Services"
                                placeholder="Preferred Services"
                                onSelect={() => handleHairSelection(selected)}
                            />
                        </View>

                        <View style={styles.serviceContainer}>
                            <MultipleSelectList
                                setSelected={(val) => setSelectedCont(val)}
                                data={contactPref}

                                // styles
                                boxStyles={styles.dropDown}
                                inputStyles={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                                labelStyles={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}
                                dropdownStyles={{
                                    backgroundColor: 'white',
                                    width: '85%'
                                }}
                                badgeStyles={styles.badgeStyle}

                                maxHeight={1500}
                                save='value'
                                search={false}
                                label="Preferred Contact"
                                placeholder="Preferred Contact"
                                onSelect={() => contactSelection(selectedCont)}
                            />
                        </View>
                        <View style={styles.signUpContainer}>
                            <TouchableOpacity
                                disabled={formComplete}
                                style={styles.signUpButton}
                                onPress={handleSignUpPress}>
                                <Text style={styles.signUpText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>
        </>
    );
}

//a bunch of checks to see if the text fields are being filled correctly.

//{ firstNameValid && <Text> firstName is valid</Text> /*debugging*/ } 
//{ lastNameValid && <Text> lastName is valid</Text> /*debugging*/ } 
//{ emailValid && <Text> email is valid</Text> /*debugging*/ } 
//{ phoneNumberValid && <Text> phone is valid</Text> /*debugging*/ } 
//{ passwordValid && <Text> password is valid</Text> /*debugging*/ } 
//{confirmPasswordValid && <Text>confirm password is valid</Text> /*debugging*/ }
//{phoneNumber.length != 0 && <Text> phoneNumber length is: {phoneNumber.length} </Text>}
//{selected.length != 0 && <Text> service/services selected </Text>}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white' 
    },
    body: {
        justifyContent: 'center',
        padding: 10,
        paddingBottom: 300
    },
    linearGradientStyle: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderColor: 'black',
        borderWidth: 1
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // logo styling
    logo: {
        width: 170,
        height: 150
    },
    // create account
    createAccountContainer: {
        padding: 10
    },
    createAccountText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    // text fields
    textFieldContainer: {
        alignItems: 'center',
        padding: 5,
        gap: 10
    },
    textField: {
        backgroundColor: '#D3D3D3',
        color: 'black',
        fontWeight: 'bold',
        width: '75%',
        height: 40,
        borderRadius: 15,
        padding: 10
    },
    // preferred services
    serviceContainer: {
        alignItems: 'center',
        padding: 10
    },
    badgeStyle: {
        textAlign: 'center',
        backgroundColor: '#C154C1',
    },
    dropDown: {
        backgroundColor: '#880085',
        width: '85%',
        maxWidth: '85%',
        //margin: 15,
        paddingTop: 10,
        padding: 100,
    },

    // sign up button
    signUpContainer: {
        alignItems: 'center',
    },
    signUpButton: {
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