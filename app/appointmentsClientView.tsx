import { StyleSheet, Text, View, ScrollView, FlatList, Dimensions, useWindowDimensions} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import Constants from 'expo-constants';
import {UTCtoPSTString, displayHours, funcObj, functionGetRetry, notify} from './Enums/Enums';
import {RootSiblingParent} from 'react-native-root-siblings'
import { SERVICES } from './Enums/Enums'
import { useLocalSearchParams } from 'expo-router';
export default function AppointmentsClientView(){

    const {userID} = useLocalSearchParams<{userID:string}>();
    const {adminPriv} = useLocalSearchParams<{adminPriv:string}>();
    const {newClient} = useLocalSearchParams<{newClient:string}>();
    const {approved} = useLocalSearchParams<{approved:string}>();
    const userData = {
        userID: parseInt(userID),
        adminPriv: adminPriv,
        newClient: newClient,
        approved: approved
      }

    const windowDimensions = Dimensions.get('window')
    interface Appointment {
        name: string;
        service: string;
        date: string;
        stylist: string;
        realDate: Date;
    }

    let defaultAppointment : Appointment[] = [];
    const [upcomingClientAppointments, setUpcomingClientAppointments] = React.useState(defaultAppointment);
    const [pastClientAppointments, setPastClientAppointments] = React.useState(defaultAppointment);
    const [first, setFirst] = React.useState(0);
    firstUpdate();
    async function firstUpdate(){
        if(first === 0 ){
            setFirst(1);
            let date = new Date();
            let dateString = UTCtoPSTString(date); //NOTE THAT THE DATE IS CURRENTLY OFF, NEED TO FIX IN ANOTHER SPRINT //UTCtoPSTString should fix this -Tai
            let name;
            name = await getName(userData.userID);
            updateUpcomingAppointments(dateString.split("T")[0], userData.userID, name); //Note that currently using ID 1 until the use of UserID transfer comes in
            updatePastAppointments(dateString.split("T")[0], userData.userID, name);
        }
    }
    //Updates the upcoming appointments given a date.
    function updateUpcomingAppointments(date, userID, name){
        let data;
        let funcObj:funcObj ={
            entireFunction: () => database.get('/queryUpcomingAppointmentsByUserIDAndDate', {
                params: {
                    date : date,
                    userID: userID 
                }
            }),
            type:'get'
        };
        functionGetRetry(funcObj)
            .then((ret) => data = ret.data)
            .then(() => {updateUpcomingAppointmentsDisplay(data, name)})
            .catch((error) => notify(error.toString()))
    }

    function updatePastAppointments(date, userID, name){
        let data;
        let funcObj:funcObj = {
            entireFunction: () => database.get('/queryPastAppointmentsByUserIDAndDate', {
                params: {
                    date : date,
                    userID: userID 
                }
            }),
            type:'get'
        };
            functionGetRetry(funcObj)
            .then((ret) => data = ret.data)
            .then(() => {updatePastAppointmentsDisplay(data, name)})
            .catch((error) => notify(error.toString()));
    }

    function updateUpcomingAppointmentsDisplay(data, name){
        //alert(JSON.stringify(data));
        //alert(JSON.stringify(data[0]));
        let appointmentList : Appointment[] = [];
        let i = 0;
        data.forEach((appointment) => {
            let dateTimeArray = appointment.AppointmentDate.split("T");
            let newDate = dateTimeArray[0];
            let newTime = dateTimeArray[1].split("Z")[0];
            newTime = displayHours[newTime.split(".")[0]];
            
            let serviceArr = appointment.TypeOfAppointment.split(",");
            let clientServices: string[] = [];
            serviceArr.forEach(serviceEl => {
                let temp = serviceEl.trim();
                clientServices.push(SERVICES[temp]['service']);
            });

            let newAppointment : Appointment = {
                name: name,
                service: clientServices.join(", ").toString(),
                date: newDate + ", " + newTime,
                stylist: 'Melissa Wright',
                realDate: newDate
            }
            appointmentList[i] = newAppointment;
            i += 1;
        }
        )
        setUpcomingClientAppointments(appointmentList);
        //alert("Upcoming List: " + JSON.stringify(appointmentList));
    }

    function updatePastAppointmentsDisplay(data, name){
        let appointmentList : Appointment[] = [];
        let i = 0;
        data.forEach((appointment) => {
            let dateTimeArray = appointment.AppointmentDate.split("T");
            let newDate = dateTimeArray[0];
            let newTime = dateTimeArray[1].split("Z")[0];
            newTime = displayHours[newTime.split(".")[0]];

            let serviceArr = appointment.TypeOfAppointment.split(",");
            let clientServices: string[] = [];
            serviceArr.forEach(serviceEl => {
                let temp = serviceEl.trim();
                clientServices.push(SERVICES[temp]['service']);
            });

            let newAppointment : Appointment = {
                name: name,
                service: clientServices.join(", ").toString(),
                date: newDate + ", " + newTime,
                stylist: 'Melissa Wright',
                realDate: newDate
            }
            appointmentList[i] = newAppointment;
            i += 1;
        }
        )
        setPastClientAppointments(appointmentList);
    }
    async function getName(userID){
        let funcObj:funcObj = {
            entireFunction: () => database.get('/findCurrentClientFullNameByID', {
                params: {
                    queryId : userID
                }
            }),
            type: 'get'
        };
        let name
        try{
            name = await functionGetRetry(funcObj)
        }catch(error){
            notify(error.toString())
            return 'NA'
        }
        return name.data[0].FirstName + " " + name.data[0].LastName;
    }

    return(
        <RootSiblingParent>

        
        <ScrollView>
            <View style = {styles.container}>
                <LinearGradient
                  locations = {[0.7, 1]}
                  colors = {['#DDA0DD', 'white']}
                  style = {{width: windowDimensions.width, height: windowDimensions.height - 85}}
                >
                    <View style = {styles.background}>
                        {/*Upcoming Appointments List*/}
                        <Text style = {styles.objectTitle}>Upcoming Appointments:</Text>
                        <FlatList
                            data={upcomingClientAppointments}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Customer:</Text>
                                        <Text style={styles.appointText}> {item.name}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Service:</Text>
                                        <Text style={styles.appointText}>{item.service}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Date:</Text>
                                        <Text style={styles.appointText}>{item.date}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Stylist:</Text>
                                        <Text style={styles.appointText}>{item.stylist}</Text>
                                    </View>
                                </View>
                            )}
                        />

                        {/*Past Appointments List*/}
                        <Text style = {styles.objectTitle}>Past Appointments:</Text>
                        <FlatList
                            data={pastClientAppointments}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Customer:</Text>
                                        <Text style={styles.appointText}> {item.name}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Service:</Text>
                                        <Text style={styles.appointText}>{item.service}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Date:</Text>
                                        <Text style={styles.appointText}>{item.date}</Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={styles.appointText}>Stylist:</Text>
                                        <Text style={styles.appointText}>{item.stylist}</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </LinearGradient>

            </View>
        </ScrollView>
        </RootSiblingParent>

    );
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 90,
        //color: '#DDA0DD'
    },
    // title styling 
    objectTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white',
        paddingTop: 20,
        paddingLeft: 20
        //paddingBottom: 30
    },
    // background
    background: {
        //paddingTop: 20,
        //paddingBottom: 775,
        //alignItems: 'center',
        borderRadius: 30,
        //color: '#DDA0DD'
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
    // white appointment block
    appointBox: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        //alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 3,

    },
    // text alignment
    textAlignment: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    // appointment text information 
    appointText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 10
       ///textAlign: 'center'
    },

})

