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
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
//firebase imports VVV
import firebase from './Firebase.js'
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import {funcObj, functionGetRetry} from './Enums/Enums'
import { router } from 'expo-router';
import { notify } from './Enums/Enums';
import {RootSiblingParent} from "react-native-root-siblings"

//made this available for all pages in the app
export let hairStyleSelected: string[] = [];
export let contactSelected: string[] = [];


export default function SignUp() { // added route for page navigation

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
    
    // two functions below should format phone number for IOS
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
                newPhoneNumber(formatPhoNum);
            }else{
                const newPhone = input.replace(/\D/g, ''); 
                newPhoneNumber(newPhone);
            }
        }
    }

    function checkpasswordValid() {
        //if the password contains numbers and letters and is 8 chars or more in length...
        if (password.match(/^[A-Za-z0-9]*$/))
            setpasswordValid(password.length > 7 ? true : false);
    }
    function checkconfirmPasswordValid() {
        console.log('setconfirmPasswordValid:', password == confirmPassword ? true : false); //for testing
        console.log('password:', password); //for testing
        console.log('confirmPassword:', confirmPassword); //for testing
        setconfirmPasswordValid(password == confirmPassword ? true : false)
    }

    //options for drop down menu
    //changed the key values to be the format of what is going to be going in the database
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

    const contactPref = [
        {key: ' Phone number ', value: ' Phone Number'},
        {key: ' email ', value: ' Email '}
    ];

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
                    lastName:  lastName,
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
            
            //this changes the format of the hairstyle selected array and puts the new values in their own array 
            //The new dbFormattedServices is the array that the function below will be pulling from so that way the DB
            //will have the newly formatted services ("Mens Haircut" => "MENS_HAIRCUT" in the db)
            let dbFormattedServices: string[] = [];
            hairStyleSelected.forEach(service => {
                let tempserv = hairOptions.find(key => key.value === service);
                dbFormattedServices.push(tempserv.key);
            });

            //post to ServicesWanted
            //changed hairStyleSelected to the dbFormattedServices array instead
            const servicePromises = dbFormattedServices.map(async (service) => {
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
        } catch (error) {
            console.error('Error posting new user data:', error);
            notify('Problem with creating new account.');
        }
    };

    async function newUserSignUp() {
        //password conditionals if these are both false move onto setting the 
        if (password != confirmPassword) {
            notify("Passwords did not match. Please try again.")
        }
        else if (password == "" || confirmPassword == "") {
            notify("No password was entered. Please enter in a password.")
        }
        else {
            try{
                await createUserWithEmailAndPassword(auth, email, password)
                return 0;
            }catch(error){
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                notify("Something went wrong. Please enter account information and try again. If you already signed up with the email used, please log in with that email.")
                return 1; //returns 1 on sign up fail so that way it doesn't post this user to the database
            }           
            //}
        }
        //returns 1 if something along the way messed up so it doesn't post the new user to the database
        notify("Something went wrong. Please enter account information and try again. If you already signed up with the email used, please log in with that email.")
        return 1;
    }

    useEffect(() => {
        checkconfirmPasswordValid();
        checkpasswordValid()
    }, [password, confirmPassword]);

    useEffect(() => {
        checkphoneNumberValid()
    }, [phoneNumber])

    async function handleSignUpPress() {
        //registers the user with Firebase first then if the function returns 0 meaning a successful user creation
        //it will post the user to the database and route them back to the login page
        console.log('formComplete:', formComplete); //for testing
        console.log('firstNameValid:', firstNameValid); //for testing
        console.log('lastNameValid:', lastNameValid); //for testing
        console.log('emailValid:', emailValid); //for testing
        console.log('phoneNumberValid:', phoneNumberValid); //for testing
        console.log('passwordValid:', passwordValid); //for testing
        console.log('confirmPasswordValid:', confirmPasswordValid); //for testing
        console.log('selected.length:', selected.length); //for testing
        console.log('selectedCont.length:', selectedCont.length); //for testing
        console.log('password:', password); //for testing
        console.log('confirmPassword', confirmPassword); //for testing
        let verify = await newUserSignUp();

        if (verify == 0) {
            await postNewUser();
            //navigation.navigate("Login")
            router.replace({pathname:"/", params: {returnMessage:"Account created successfully!"}});
        }
    }
    return (
        <>
        <RootSiblingParent>
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
                                onChangeText={setPhoneNumFormat}
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

                                maxHeight={500}
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
            </RootSiblingParent>
        </>
    );
}

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