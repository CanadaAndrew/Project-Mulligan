import { StyleSheet, Text, View, TextInput, Pressable, Image, ImageBackground, ScrollView, Button, Touchable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
//import { MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import React, { useState } from 'react';
import firebase from './Firebase.js'  // import firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import { funcObj, functionGetRetry } from './Enums/Enums'
import {RootSiblingParent} from "react-native-root-siblings"
export default function Login({ route, navigation }) {

    //test@fakemail.com
    const auth = getAuth(firebase);
    //sets the default language to the systems language
    auth.languageCode = 'en';

    //Variables to use for login info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // error msg if wrong login info is put in
    const [loginError, loginErrorMsg] = useState('');

    const userData = {
        userID: undefined, // You can omit this line, it will default to undefined
        adminPriv: undefined, // You can omit this line, it will default to undefined
        newClient: undefined, // You can omit this line, it will default to undefined
        approved: true
    };

    const onClickSignUp = () => {
        navigation.navigate("SignUp", { userData });
    }

    const onClickForgotLogin = () => {
        navigation.navigate("ForgotLogin", { userData });
    }

    const onClickLogin = async () => {

        //console.log(email);

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                loginErrorMsg('Login successful!');
                // Has no effect as far as I can tell, but good to leave it in the code anyway just in case
                const user = userCredential.user;
            })
            .catch((error) => {
                loginErrorMsg('Your email and password \n do not match. Please try again.');
                console.log(error.message, error.code);
            });

        //Since the previously declared user only exists in the scope of its function,
        //redeclare the variable and set the auth to the current user
        const user = auth.currentUser;
        if (user !== null) {
            console.log(email);
            await checkEmailExists(email);
            console.log('Right Before Navigation');
            navigation.navigate("HomeScreen", { userData });
        } else {
            //Once branches are merged change this to route to the signup page
        }
    }

    // to show and hide password
    const [showPassword, setShowPassword] = useState(true);
    const [textS, textH] = useState(true)
    const buttonClick = textS ? "show" : "hide";
    const onClickPW = () => {
        setShowPassword(previousState => !previousState)
        textH(!textS);
    }

    //put user input into phone number format
    //const [rawNum, setNum] = useState('');
    const formattingPhoneNumber = (input) => {
        if (/^\d*$/.test(input)) {
            if (input.length <= 10) {
                return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
        } else {
            return input
        }
        //return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
    const setPhoneNumFormat = (input) => {
        const formatPhoNum = formattingPhoneNumber(input);
        setEmail(formatPhoNum);
    }

    // async function checkEmailExists(email) {

    //     try {
    //         const funcObj: funcObj = {
    //             entireFunction: () => database.get('/queryCurrentUserFromEmail', {
    //                 params: {
    //                     email: email
    //                 }
    //             }),
    //             type: 'get'
    //         };
    //         const response = await functionGetRetry(funcObj);
    //         //userData.userID = response.data.UserID;
    //         //setUser(response.data);
    //         console.log('Look here dumbass');
    //         console.log('This is a current User');
    //         console.log('response', response.data); // For debugging
    //         userData.userID = response.data[0].UserID;
    //         //console.log('Index 3', response.data[3].AdminPriv);
    //         if (response.data[0].AdminPriv == 1) {
    //             userData.adminPriv = false;
    //         } else {
    //             userData.adminPriv = true;
    //         }
    //         userData.newClient = false;

    //     } catch (error) {
    //         //console.error('Error finding User from email: ', error);
    //         userData.adminPriv = false;
    //         userData.newClient = true;
    //         //console.log(userData);
    //         try {
    //             const funcObj: funcObj = {
    //                 entireFunction: () => database.get('/queryNewUserFromEmail', {
    //                     params: {
    //                         email: email
    //                     }
    //                 }),
    //                 type: 'get'
    //             };
    //             const response = await functionGetRetry(funcObj);
    //             alert(JSON.stringify(response.data[0]));
    //             userData.userID = response.data[0].UserID;
    //             if (response.data[0].ApprovalStatus == 1) {
    //                 userData.approved = false;
    //             } else {
    //                 userData.approved = true;
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }

    //     }

    // }

    async function checkEmailExists(email) {
        console.log('Test email: ' ,email);
         await queryFromUsers(email);

    }

    // Queries from the Users table based on email and returns an array with an object that contains the row with that email
    async function queryFromUsers(email) {
        try {

            const funcObj: funcObj = {

                entireFunction: () => database.get('/queryUsersFromEmail', {
                    params: {
                        email: email
                    }
                }),
                type: 'get'
            };
            const response = await functionGetRetry(funcObj);
            userData.userID = response.data[0].UserID;
            
            if (response.data[0].AdminPriv == 1) {
                userData.adminPriv = false;
                await queryFromNewClients(email);
            } else {
                userData.adminPriv = true;
                userData.newClient = false;
            }

        } catch (error) {
            //console.log(error);
            // Somehow you have a firebase account but are not in the database
            // Treat as a new user
            userData.adminPriv = false;
            userData.approved = false;
            userData.newClient = true;
            userData.userID = 'guest';
        }
    }

    async function queryFromNewClients(email) {
        
        try {

            const funcObj: funcObj = {

                entireFunction: () => database.get('/queryNewUserFromEmail', {
                    params: {
                        email: email
                    }
                }),
                type: 'get'
            };
            const response = await functionGetRetry(funcObj);
            
            if (response.data[0].ApprovalStatus == 1) {
                userData.approved = false;
            } else {
                userData.approved = true;
            }

            userData.newClient = true;

        } catch (error) {

            userData.approved = true;
            userData.newClient = false;

        }

    }

    return (
      <RootSiblingParent>
        <ScrollView>
            <View style={styles.container}>

                {/*added logo image*/}
                <ImageBackground
                    style={styles.logo}
                    source={require('./images/Hair_Done_Wright_LOGO.png')}
                >
                </ImageBackground>

                <LinearGradient
                    locations={[0.7, 1]}
                    colors={['#DDA0DD', 'white']}
                    style={styles.background}
                >


                    {/*Login error loginError in brackets*/}
                    <Text style={styles.errorTitle}>{loginError}</Text>
                    <Text style={styles.objectTitle}>Login</Text>

                    {/*user input for email or phone# partly functional //setEmail*/}
                    <TextInput
                        placeholder=' Email or Phone '
                        placeholderTextColor={'gray'}
                        keyboardType='default'
                        style={styles.inputBox}
                        value={email}
                        onChangeText={setPhoneNumFormat}
                    />

                    <View>
                        {/*user input for password partly functional*/}
                        <TextInput
                            placeholder=' Password '
                            placeholderTextColor={'gray'}
                            keyboardType='default'
                            secureTextEntry={showPassword}
                            style={styles.inputBox}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View>
                        {/*button to show password is functional*/}
                        <TouchableOpacity
                            style={styles.showButton}
                            onPress={onClickPW}
                        >
                            <Text style={styles.showButtonText}>{buttonClick}</Text>
                        </TouchableOpacity>

                        {/*button for forgot password no functionality yet WIP*/}
                        <TouchableOpacity
                            onPress={onClickForgotLogin}
                        >
                            <Text style={styles.forgotPWButtonText}>Forgot Password?</Text>
                        </TouchableOpacity>

                    </View>


                    {/*button to login limited functionality
                   Note from dru: to succesfully login, login button must be pressed twice. Not sure why*/}
                    <View>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={onClickLogin}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.showButtonText}>Don't have an account?  </Text>
                        <TouchableOpacity
                            onPress={onClickSignUp}
                        >
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </LinearGradient>

            </View>
        </ScrollView>
        </RootSiblingParent>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 90,
        paddingBottom: 0
    },
    // title styling 
    objectTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    // error text styling 
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 10
    },
    // background under logo image
    background: {
        paddingBottom: 300,
        alignItems: 'center',
    },
    // logo image
    logo: {
        width: 440,
        height: 275,
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
    // login button style
    loginButton: {
        width: 350, //
        height: 50, //
        paddingTop: 15,
        margin: 25,
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
    // Login button text style
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
    },
    // input box styling
    inputBox: {
        fontSize: 18,
        padding: 8,
        margin: 25,
        width: 350,
        height: 50,
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        flexDirection: "row"
    },
    // show button style
    showButton: {
        width: 90,
        height: 40,
        paddingTop: 12,
        marginLeft: 25,
        marginBottom: 30,
        //margin: 25,
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
    // show button text style
    showButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        //borderRadius: 20,
    },
    // show button style
    forgotPWButton: {
        width: 90,
        height: 40,
        paddingTop: 12,
        marginLeft: 25,
        marginBottom: 50,
        //margin: 25,
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
    // show button text style
    forgotPWButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
    // view for sign up
    signUpContainer: {
        flexDirection: 'row',
        alignContent: 'center'
    },
    // sign up text
    signUpText: {
        color: '#BE42B2',
        fontWeight: 'bold',
        fontSize: 15,
    }
})