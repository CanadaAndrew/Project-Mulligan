import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
        screenOptions={{
        headerTintColor:'white',
        headerBackTitle: 'Back',
        headerStyle: {
            backgroundColor: '#942989'
        }
        }}
        >
    <Stack.Screen name = "index" options= {{title: "Login"}}/>
    <Stack.Screen name = "SetUpAppoint1"
           options = {{
            title: "Set Appointment"
           }}
         />
         <Stack.Screen name = "SetupAppointment2"
           options = {{
            title: "Set Appointment"
           }}
         />
         <Stack.Screen name = "ModifyAv"
           options = {{
            title: "Modify Availability"

           }}
         />
         <Stack.Screen name = "HomeScreen"
           options = {{
            title: "Home"
           }}
         />
         <Stack.Screen name = "AppointmentsClientView"
           options = {{
            title: "Your Appointments"
           }}
         />
         <Stack.Screen name = "NewClientInfo"
            options={{
             title: "New Client Info"
           }}
         />
        <Stack.Screen name="NewClientApproval"
            options={{
                title: "Client Approval"
            }}
        />
         <Stack.Screen name = "ServicesOffered"
          options = {{
            title: "Services Offered"
          }}
         />
         <Stack.Screen name = "ClientHistory"
          options = {{
            title: "Client Appointments"
          }}
         />
         <Stack.Screen name = "AboutMe"
          options = {{
            title: "About Me"
          }}
         />
        <Stack.Screen name="ForgotLogin"
            options={{
                title: "Forgot Login"
            }}
        />
        <Stack.Screen name="SignUp" 
            options={{
                title: "Sign Up"
            }}
        />
        <Stack.Screen name="ModifyClientInfoSearch" 
            options={{
                title: "Search"
            }}
        />
         <Stack.Screen name = "NewClientInfo_AdminView"
           options={{
              title: "New Client Info Admin View"
           }}
         />
    </Stack>
  );
}

export const unstable_settings = {
    initialRouteName: 'index',
  };