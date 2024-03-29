import { StyleSheet, Text, View, ScrollView, TextInput, ImageBackground,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, {useState} from 'react';
import axios from 'axios';
import firebase from './Firebase';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

//Declaring Window as a global variable to be accessed
declare global {
    interface Window { // ⚠️ notice that "Window" is capitalized here
      RecaptchaVerifier: any;
    }
  }
  
export default function newClientInfo_ClientView({ navigation }){

    //Variables to set customer info
    //I just kept the default text as the original dummy data, can be changed later
    const [editingContactInfo, setEditingContactInfo] = useState(false);
    const [custNumber, setCustNumber] = useState('(123) 456 7890');
    const [custEmail, setCustEmail] = useState('email@email.com');
    const [custAddress, setCustAddress] = useState('N/A');

    const [editingPreferences, setEditingPreferences] = useState(false);
    const [custServices, setCustServices] = useState('Woman’s Haircuts\nHair Coloring');
    const [custNotes, setCustNotes] = useState('Allergic to hair dyes with \nparaphenylenediamine (PPD) in them.');

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
    
      //Saves the information by setting the editing flag to false
      const saveChanges = () => {
        // Here you can implement logic to save changes to the database
        setEditingContactInfo(false); // After saving, switch back to view mode
        setEditingPreferences(false); // After saving, switch back to view mode
      };

    const database = axios.create({
        baseURL: 'http://10.0.0.192:3000', //Andrew pc local
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.133:3000',
    })

    return (
        <View >
          <ScrollView>
            
            <LinearGradient
              locations = {[0.7, 1]}
              colors = {['#EB73C9', 'white']}
              style = {styles.background}
             >

                <View>
                    <Text >{'\n'}</Text>
                </View>
                <View style = {styles.titleBox}>
                    <Text style = {styles.clientNameTitle}>Sam Smith</Text>
                </View>
                <View>
                    <Text >{'\n'}</Text>
                </View>

                {/*Edit button and title*/}
                <View style={styles.inlineLayout}>
                    <Text style={styles.objectTitle}>Contact Info</Text>
                    <TouchableOpacity
                    style={styles.editButton}
                    onPress={editingContactInfo ? saveChanges : toggleEditContactInfo}
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
                            value={custEmail}
                            onChangeText={setCustEmail}
                        />
                    ) : (
                    <Text style={styles.clientText}>{custEmail}</Text>
                    )}
                    <Text>{'\n'}</Text>
                    <Text style={styles.clientTilteText}>Phone Number</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={custNumber}
                            onChangeText={setCustNumber}
                        />
                    ) : (
                    <Text style={styles.clientText}>{custNumber}</Text>
                    )}
                        <Text>{'\n'}</Text>
                        <Text style={styles.clientTilteText}>Address</Text>
                    {editingContactInfo ? (
                        <TextInput
                            style={styles.clientTextInput}
                            value={custAddress}
                            onChangeText={setCustAddress}
                        />
                    ) : (
                    <Text style={styles.clientText}>{custAddress}</Text>
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
                onPress={toggleEditPreferences}
                >
                <Text style={styles.editButtonText}>{editingPreferences ? 'Save' : 'Edit'}</Text>
                </TouchableOpacity>
            </View>

                {/* Client Info Box for Preferences */}
            <View style={[styles.clientBox, styles.container]}>
                <Text style={styles.clientTilteText}>Preferred Services</Text>
                {editingPreferences ? (
                <TextInput
                    style={styles.clientTextInput}
                    value={custServices}
                    onChangeText={setCustServices}
                    multiline={true}
                />
                ) : (
                <Text style={styles.clientText}>{custServices}</Text>
                )}
                <Text>{'\n'}</Text>
                <Text style={styles.clientTilteText}>Notes</Text>
                {editingPreferences ? (
                <TextInput
                    style={styles.clientTextInput}
                    value={custNotes}
                    onChangeText={setCustNotes}
                    multiline={true}
                />
                ) : (
                <Text style={styles.clientText}>{custNotes}</Text>
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
        paddingBottom: 200,
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
})