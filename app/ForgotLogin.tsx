import { StyleSheet, Text, View, TextInput, ImageBackground, TouchableOpacity, ScrollView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {funcObj, functionGetRetry, notify} from './Enums/Enums';
import { RootSiblingParent } from 'react-native-root-siblings';
import { router } from 'expo-router';

//Declaring Window as a global variable to be accessed
declare global {
    interface Window { // ⚠️ notice that "Window" is capitalized here
        RecaptchaVerifier: any;
    }
}

export default function ForgotLogin() {

    const auth = getAuth(firebase);
    auth.languageCode = 'en';

    const [rawNum, setNum] = useState('');
    // error msg if wrong login info is put in
    const [loginError, loginErrorMsg] = useState('');
    const onClickLogin = async () => {
        let email = rawNum;
        if(rawNum.length == 12){
            if(/(\d{3})-(\d{3})-(\d{4})/.test(rawNum)){
                const funcObj:funcObj = {
                    entireFunction: () => database.get('/findEmailByPhoneNumber', {
                        params: {
                            PhoneNumber : rawNum,
                        }
                    }),
                    type: 'get'
                };
                functionGetRetry(funcObj)
                .then(async (ret) => {
                    if(ret.data[0] != null){
                        email = ret.data[0].Email;
                        await sendPasswordResetEmail(auth, email);
                    }
                    loginErrorMsg('Password reset email send if phone number was valid. Please check your inbox.');
                    router.replace({pathname: "/", params: {returnMessage:'Password reset email send if phone number was valid. Please check your inbox.'}}); 
                })
                .catch((err) => notify(err));
            }
        }
        else if (rawNum.includes("@")) {
            email = rawNum;
            await sendPasswordResetEmail(auth, email);
            loginErrorMsg('Password reset email send if email was valid. Please check your inbox.');
            //navigation.navigate('HomeScreen');
            router.replace({pathname: "/", params: {returnMessage:'Password reset email send if phone number was valid. Please check your inbox.'}}); 
        }
        else {
            loginErrorMsg('Your email or phone number \n do not match any existing accounts \n please try again.');
            return;
        }
        //Send reset email todo here
    }

    // put user input into phone number format

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
        const formatPhoNum = formattingPhoneNumber(input);
        setNum(formatPhoNum);
    }

    return (
        <RootSiblingParent>
        <View style={styles.container}>
            <ScrollView>
            {/*added logo image*/}
            <ImageBackground
                style={styles.logo}
                source={require('./images/Hair_Done_Wright_LOGO.png')}
                imageStyle={styles.logo}
                resizeMode='cover'
            >
            </ImageBackground>

            <LinearGradient
              locations = {[0.7, 1]}
              colors = {['#DDA0DD', 'white']}
              style = {styles.background}
             >

                <Text style={styles.objectTitle}>Forgot Password?</Text>
                <Text style={styles.helpTitle}>Please enter email address or phone number associated with this account.</Text>
                <Text style={styles.helpTitle}>{loginError}</Text>

                {/*user input for email or phone# partly functional*/}
                <TextInput
                    placeholder=' Email or Phone '
                    placeholderTextColor={'gray'}
                    keyboardType='default'
                    style={styles.inputBox}
                    value={rawNum}
                    onChangeText={setPhoneNumFormat}
                />


                {/*button to submit request limited functionality*/}
                <View>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={onClickLogin}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>


            </LinearGradient>
            </ScrollView>
        </View>
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
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 25
    },
    // help text styling 
    helpTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 25,
    },
    // background under logo image
    background: {
        paddingBottom: 400,
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
    // Submit button style
    submitButton: {
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
    // Submit button text style
    submitButtonText: {
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
})