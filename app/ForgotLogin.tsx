import { StyleSheet, Text, View, TextInput, ImageBackground,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, {useState} from 'react';
import axios from 'axios';
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {funcObj, functionGetRetry} from './Enums/Enums'

//Declaring Window as a global variable to be accessed
declare global {
    interface Window { // ⚠️ notice that "Window" is capitalized here
      RecaptchaVerifier: any;
    }
  }
  
export default function ForgotLogin({ navigation }){

    const auth = getAuth(firebase);
    auth.languageCode = 'en';

    const database = axios.create({
        baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
        //baseURL: 'http://10.0.0.192:3000', //Andrew pc local
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.133:3000',
    })
    
    const [rawNum, setNum] = useState('');
    // error msg if wrong login info is put in
    const [loginError, loginErrorMsg] = useState('');
    const onClickLogin = async () => {
        let email = rawNum;
        if(rawNum.length == 12){
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
            })
            .catch((err) => alert(err));
        }
        else if(rawNum.includes("@")){
            email = rawNum;
            await sendPasswordResetEmail(auth, email);
            loginErrorMsg('Password reset email send if email was valid. Please check your inbox.');
            // For now goes to HomeScreen cause LoginPage doesnt exist yet in this branch
            navigation.navigate('HomeScreen');
        }
        else{
            loginErrorMsg('Your email or phone number \n do not match any existing accounts \n please try again.');
            return;
        }
        //Send reset email todo here
    }

    // put user input into phone number format
    
    const formattingPhoneNumber = (input) => {
        if (/^\d*$/.test(input)){
            if (input.length <=10){
                return input.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
        }else{
            return input
        }
    }
    const setPhoneNumFormat = (input) => { 
        const formatPhoNum = formattingPhoneNumber(input); 
        setNum(formatPhoNum); 
    } 

    return (
        <View style = {styles.container}>
            {/*added logo image*/}
            <ImageBackground
              style = {styles.logo}
              source={require('./images/Hair_Done_Wright_LOGO.png')}
             >
             </ImageBackground>

            <LinearGradient
              locations = {[0.7, 1]}
              colors = {['#DDA0DD', 'white']}
              style = {styles.background}
             >

                <Text style = {styles.objectTitle}>Forgot Password?</Text>
                <Text style = {styles.helpTitle}>Please enter email address or phone number associated with this account.</Text>
                <Text style = {styles.helpTitle}>{loginError}</Text>

                {/*user input for email or phone# partly functional*/}
                <TextInput 
                  placeholder = ' Email or Phone ' 
                  placeholderTextColor = {'gray'} 
                  keyboardType = 'default'
                  style = {styles.inputBox}
                  value = {rawNum}
                  onChangeText={setPhoneNumFormat}
                />


                  {/*button to submit request limited functionality*/}
                  <View>
                    <TouchableOpacity
                      style = {styles.submitButton}
                      onPress = {onClickLogin}
                    >
                    <Text style = {styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>


             </LinearGradient>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 90
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
        paddingBottom: 275,
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