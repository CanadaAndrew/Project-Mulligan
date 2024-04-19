import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SetUpAppoint1 from './setUpAppoint1';
import ModifyAv from './ModifyAv';
import SetupAppointment2 from './setupAppointment2';
import ServicesOffered from './ServicesOffered';
import HomeScreen from './HomeScreen';
import AppointmentsClientView from './appointmentsClientView';
import ClientHistory from './ClientHistory';
import AboutMe from './AboutMe';
import NewClientInfo from './newClientInfo';
import NewClientApproval from './NewClientApproval';
import ModifyClientInfoSearch from './ModifyClientInfoSearch';
import ForgotLogin from './ForgotLogin';
import SignUp from './SignUp';
import Login from './Login';
import NewClientInfo_AdminView from './newClientInfo_AdminView';

const Stack = createNativeStackNavigator()

export default function index() {

  return (
   <NavigationContainer independent={true}>
    {/*streamline custom header*/}
     <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
        headerTintColor:'white',
        headerBackTitle: 'Back',
        headerStyle: {
            backgroundColor: '#942989'
        }
        }}
     >
         <Stack.Screen name = "SetUpAppoint1" component={SetUpAppoint1}
           options = {{
            title: "Set Appointment"
           }}
         />
         <Stack.Screen name = "SetupAppointment2" component={SetupAppointment2}
           options = {{
            title: "Set Appointment"
           }}
         />
         <Stack.Screen name = "ModifyAv" component={ModifyAv}
           options = {{
            title: "Modify Availability"

           }}
         />
         <Stack.Screen name = "HomeScreen" component={HomeScreen}
           options = {{
            title: "Home"
           }}
         />
         <Stack.Screen name = "AppointmentsClientView" component={AppointmentsClientView}
           options = {{
            title: "Your Appointments"
           }}
         />
         <Stack.Screen name = "NewClientInfo" component={NewClientInfo}
            options={{
             title: "New Client Info"
           }}
         />
        <Stack.Screen name="NewClientApproval" component={NewClientApproval}
            options={{
                title: "Client Approval"
            }}
        />
         <Stack.Screen name = "ServicesOffered" component={ServicesOffered} 
          options = {{
            title: "Services Offered"
          }}
         />
         <Stack.Screen name = "ClientHistory" component={ClientHistory} 
          options = {{
            title: "Client Appointments"
          }}
         />
         <Stack.Screen name = "AboutMe" component={AboutMe}
          options = {{
            title: "About Me"
          }}
         />
        <Stack.Screen name="ForgotLogin" component={ForgotLogin}
            options={{
                title: "Forgot Login"
            }}
        />
        <Stack.Screen name="SignUp" component={SignUp}
            options={{
                title: "Sign Up"
            }}
        />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ModifyClientInfoSearch" component={ModifyClientInfoSearch}
            options={{
                title: "Search"
            }}
        />
         <Stack.Screen name = "NewClientInfo_AdminView" component={NewClientInfo_AdminView}
           options={{
              title: "New Client Info Admin View"
           }}
         />
      </Stack.Navigator>
   </NavigationContainer>
  );
}
