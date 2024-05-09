
import { StyleSheet, Text, View, Pressable, Image, ImageBackground, ScrollView, Button, Touchable, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { functionGetRetry, notify, funcObj } from './Enums/Enums';
import {RootSiblingParent} from "react-native-root-siblings"
import { deleteUser, getAuth } from 'firebase/auth';
import database from './axiosConfig';

// button viewablility based on workflow in google drive green = new clients, blue = existing clients, and red = Admin with some 
// overlap. comments have been added above each button for clarification.

export default function HomeScreen(){
  /*
    Creates a const of data to be sent to the other pages in the app
    You can add other consts or just add another variable to the existing userData const
  */
    const {userID} = useLocalSearchParams<{userID:string}>();
    const {adminPriv} = useLocalSearchParams<{adminPriv:string}>();
    const {newClient} = useLocalSearchParams<{newClient:string}>();
    const {approved} = useLocalSearchParams<{approved:string}>();
    const {returnMessage} = useLocalSearchParams<{returnMessage:string}>();

    const userData = {
      userID: parseInt(userID),
      adminPriv: adminPriv,
      newClient: newClient,
      approved: approved
    }
    
    console.log('You are in the Home Screen Now!');
    //alert('Proof' + JSON.stringify(userData));
     //The buttons array that stores all individual buttons on a page load/reload
  let buttons = [];
  let [buttonDisplay, setButtonDisplay] = React.useState([]);
  
  /*
  This might be a little confusing. I did these if statements like they are because it will only load the correct buttons that
  need to be viewed by the user depending on their role. It won't load any other buttons beside the ones that they are supposed to be 
  shown. If you need to delete a button you need to wipe it from any of the if/elseif blocks that it appears in. Similarly if you
  need to add a button, you add it to the corresponding if/elsif block that I have labeled as "Admin" "Old Client" or "New Client"
  depending on who is supposed to see the button.
  */

//This block constructs buttons that the Admin can see
function filterButtons(){
    var deleteButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => deleteAccount()}
      >
      <Text style = {styles.homeButtonText}>Delete your account</Text>
      </TouchableOpacity>
    if(userData.adminPriv == 'true')
  {
    //Modifies Calendar Availability
    var modifyAvButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push({pathname:"ModifyAv", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
      >  
      <Text style = {styles.homeButtonText}>Modify Calendar</Text>
    </TouchableOpacity>
    //Views Client History 
    var clientHistoryButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push({pathname:"ClientHistory", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
      >  
      <Text style = {styles.homeButtonText}>Client Appointments</Text>
    </TouchableOpacity>
    //Views Client Search screen
    var ModifyClientInfoSearch = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("ModifyClientInfoSearch")}
      >  
      <Text style = {styles.homeButtonText}>Modify Client Search</Text>
    </TouchableOpacity>
    //Takes you to the New Client Approval page !WIP! no functionality
    var newClientApprovalButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push({pathname:"NewClientApproval", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
      >
      <Text style = {styles.homeButtonText}>New Client Approval</Text>
    </TouchableOpacity>
    //takes you to the Services Offered Page
    var servicesOfferedButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("ServicesOffered")}
      >
      <Text style = {styles.homeButtonText}>Services Offered</Text>
    </TouchableOpacity>
    //Takes you to the About Me Page
    var aboutMeButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("AboutMe")}
      >
      <Text style = {styles.homeButtonText}>About Me</Text>
    </TouchableOpacity>
    //Takes you to the FAQ page !WIP! no functionality
    //var FAQButton = <TouchableOpacity
    //  style = {styles.homeButton}
    //  onPress = {() => navigation.navigate("FAQ")}
    //  >
    //  <Text style = {styles.homeButtonText}>FAQ</Text>
    //</TouchableOpacity>
    buttons.push(modifyAvButton);
    buttons.push(clientHistoryButton);
    buttons.push(newClientApprovalButton);
    buttons.push(ModifyClientInfoSearch);
    buttons.push(servicesOfferedButton);
    buttons.push(aboutMeButton);
    buttons.push(deleteButton)
    //buttons.push(FAQButton);
    setButtonDisplay(buttons);
  }
  //This block constructs buttons that only old clients can see
  else if(userData.newClient == 'false')
  {
    //Takes you to the Set Up Appointment Page
    var scheduleAppointmentButton2 = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push({pathname:"setUpAppoint1", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
      >
      <Text style = {styles.homeButtonText}>Schedule Appointments</Text>
    </TouchableOpacity>
    //Takes you to the Your Appointments page
    var yourAppointmentsButton = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push({pathname:"appointmentsClientView", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
      >
      <Text style = {styles.homeButtonText}>Your Appointments</Text>
    </TouchableOpacity>
    //Takes you to the Services offered page
    var servicesOfferedButton2 = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("ServicesOffered")}
      >
      <Text style = {styles.homeButtonText}>Services Offered</Text>
    </TouchableOpacity>
    //Takes you to the About Me page
    var aboutMeButton2 = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("AboutMe")}
      >
      <Text style = {styles.homeButtonText}>About Me</Text>
    </TouchableOpacity>
    //takes you to the FAQ page !WIP! no functionality
    //var FAQButton2 = <TouchableOpacity
    //  style = {styles.homeButton}
    //  onPress = {() => navigation.navigate("FAQ")}
    //  >
    //  <Text style = {styles.homeButtonText}>FAQ</Text>
    //</TouchableOpacity>
    buttons.push(scheduleAppointmentButton2);
    buttons.push(yourAppointmentsButton);
    buttons.push(servicesOfferedButton2);
    buttons.push(aboutMeButton2);
    buttons.push(deleteButton)
    //buttons.push(FAQButton2);
    setButtonDisplay(buttons);
  }
  //This block constructs buttons that the new clients can see
  else if(userData.newClient == 'true')
  {
    //Takes you to the services offerd page
    var servicesOfferedButton3 = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("ServicesOffered")}
      >
      <Text style = {styles.homeButtonText}>Services Offered</Text>
    </TouchableOpacity>
    //Takes you to the About Me page
    var aboutMeButton3 = <TouchableOpacity
      style = {styles.homeButton}
      onPress = {() => router.push("AboutMe")}
      >
      <Text style = {styles.homeButtonText}>About Me</Text>
    </TouchableOpacity>
    //Takes you to the FAQ page !WIP! no functionality
    //var FAQButton3 = <TouchableOpacity
    //  style = {styles.homeButton}
    //  onPress = {() => navigation.navigate("FAQ")}
    //  >
    //  <Text style = {styles.homeButtonText}>FAQ</Text>
    //</TouchableOpacity>
    // Once Approved new client can view and fill out this page
    var newClientInfoButton = <TouchableOpacity
    style = {styles.homeButton}
    onPress = {() => router.push({pathname:"newClientInfo", params: {userID:userData.userID, adminPriv : userData.adminPriv, newClient : userData.newClient, approved : userData.approved}})}
    >
    <Text style = {styles.homeButtonText}>Complete Sign-Up</Text>
    </TouchableOpacity>
    if(userData.approved == 'true')
      buttons.push(newClientInfoButton);
    buttons.push(servicesOfferedButton3);
    buttons.push(aboutMeButton3);
    //buttons.push(FAQButton3);
    buttons.push(deleteButton)
    setButtonDisplay(buttons);
  }
}

async function deleteAccount(){
  const auth = getAuth();
  const user = auth.currentUser;
  try{
    await deleteUser(user)
    const funcObj:funcObj = {
      entireFunction: () => database.delete('/deleteUsersByUserID',{
          params:{
              userID: userData.userID
          }
      }),
      type: 'delete'
  };
  await functionGetRetry(funcObj);
  }catch(error){
    notify(error.toString())
  }
  router.replace({pathname:"/", params: {returnMessage:"Account has been deleted"}});
}

function sendNotification(){
  if(returnMessage != null && returnMessage.length != 0){
    notify(returnMessage);
    router.setParams({returnMessage:null});
  }
}

  useEffect(()=>{
    sendNotification();
  }, [returnMessage])

  useEffect(()=>{
    filterButtons();
  }, [])
  return(
          <RootSiblingParent>
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
              <View style = {styles.background}>

                {/*add title for homepage*/}
                <Text style = {styles.objectTitle}> Home </Text>

                {/*
                This flatlist displays each of the buttons when the page is loaded depending on the role of the user
                as determined above.
                */}
                <View style = {styles.listView}>
                <FlatList
                  data = {buttonDisplay}
                  renderItem={({item}) => (
                    <View>
                      {item}
                    </View>
                  )}
                  contentContainerStyle = {{flexGrow: 1}}
                />
                </View>


              </View>
             </LinearGradient>
            </View>
            </RootSiblingParent>
    );
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 90
    },
    listView:{
        height: 475
    },
    // title styling 
    objectTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // background under logo image
    background: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        borderRadius: 30
    },
    // logo image
    logo: {
        width: 435,
        height: 250,
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

    // backButton style
    backButton: {
        width: 100,
        height: 65,
        paddingLeft: 20,
        paddingTop: 10,
        margin: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    // backButton text style
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    // home button style
    homeButton: {
        width: 300, //
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
    // home button text style
    homeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
    },
    badgeStyle: {
        textAlign: 'center',
        backgroundColor: '#C154C1',
    }
})