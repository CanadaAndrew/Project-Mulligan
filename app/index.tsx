import { StyleSheet, Text, View, TextInput, Pressable, Image, ImageBackground, ScrollView, Button, Touchable, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
//import { TouchableOpacity } from 'react-native-gesture-handler';
import {TouchableOpacity} from 'react-native';
//import { MaterialCommunityIcons as Icon} from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import firebase from './Firebase.js'  // import firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import database from './axiosConfig.js'; // Import axios from the axiosConfig.js file
import { funcObj, functionGetRetry, notify } from './Enums/Enums'
import {RootSiblingParent} from "react-native-root-siblings"
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-root-toast';
export default function Login() {

    const {returnMessage} = useLocalSearchParams<{returnMessage:string}>();
    function sendNotification(){
        if(returnMessage != null && returnMessage.length != 0){
          notify(returnMessage);
        }
      }
      
        useEffect(()=>{
          sendNotification();
        }, [returnMessage])
        
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
        approved: undefined
    };

    const onClickSignUp = () => {
        //navigation.navigate("SignUp", { userData });
        router.push({pathname: "SignUp", params: {returnMessage: null}});
    }

    const onClickForgotLogin = () => {
        //navigation.navigate("ForgotLogin", { userData });
        router.push({pathname: "ForgotLogin", params:{returnMessage: null}});
    }

    const onClickLogin = async () => {
        try {
            let actualEmail = email;
            if(email.length == 12){
                if(/(\d{3})-(\d{3})-(\d{4})/.test(email)){
                    const funcObj:funcObj = {
                        entireFunction: () => database.get('/findEmailByPhoneNumber', {
                            params: {
                                PhoneNumber : email,
                            }
                        }),
                        type: 'get'
                    };
                    await functionGetRetry(funcObj)
                    .then((ret) => {
                        if(ret.data[0] != null){
                            actualEmail = ret.data[0].Email;
                        }
                })
            }
        }
            await signInWithEmailAndPassword(auth, actualEmail, password);
            //loginErrorMsg('Login successful!');
            showToast('Login Sucessfull!', 'success');
            const user = auth.currentUser;
            if (user !== null) {
                console.log(actualEmail);
                await checkEmailExists(actualEmail);
                console.log('Right Before Navigation');
                //navigation.navigate("HomeScreen", { userData });
                if(userData.userID == 'guest'){
                    router.push({pathname:"HomeScreen", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved, returnMessage: "Unable to get your information from the Database. Logged in as guest. Please try logging in again for more access."}});
                }else{
                    router.push({pathname:"HomeScreen", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved, returnMessage: null}});
                }
                
            } else {
                // Handle the case where user is null
            }
        } catch (error) {
            //loginErrorMsg('Your email and password \n do not match. Please try again.');
            showToast('Your email and password do not match. Please try again.', 'error');
            console.log(error.message, error.code);
        }
    }

    const showToast = (message, type) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: type === 'success' ? 'green' : 'red',
            textColor: 'white',
        });
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
                return input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        } else {
            return input
        }
    }
    const setPhoneNumFormat = (input) => {
        const formatPhoNum = formattingPhoneNumber(input);
        setEmail(formatPhoNum);
    }


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
                    imageStyle = {styles.logo}
                    resizeMode='cover'
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
        backgroundColor: 'white',
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
        alignSelf: 'center'
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