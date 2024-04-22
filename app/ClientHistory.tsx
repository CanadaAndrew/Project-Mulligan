import { StyleSheet, Text, View, Pressable, FlatList, Button, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, } from 'react';
import { Link } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import moment from 'moment-timezone';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { text } from 'express';
import Constants from 'expo-constants';
import { UTCtoPSTString, funcObj, functionGetRetry, notify} from './Enums/Enums';
import { RootSiblingParent } from 'react-native-root-siblings'
import { SERVICES } from './Enums/Enums'
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ClientHistory() {

    interface Appointment {
        userID: number;
        name: string;
        service: string;
        date: string;
        stylist: string;
        realDate: Date;
        appointmentNotes: string;
    }
    /*I have genuinely no idea why this function is needed*/
    const handleDatesSelected = (selectedDates: string[]) => { };


    //new list that makes it work better with filtering and acts more like actual data from the database
    let clientAppointments: Appointment[] = [
        {
            userID: 1,
            name: "Will Smith",
            service: "Men's Haircut",
            date: "10/27/23, Fri, 1:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-10-27"),
            appointmentNotes: "Will needs a haircut"
        },
        {
            userID: 2,
            name: "Bob Smith",
            service: "Men's Haircut",
            date: "11/27/23, Mon, 2:00pm",
            stylist: 'Melissa Wright',
            realDate: (new Date("2023-11-27")),
            appointmentNotes: "Bob needs a haircut"
        },
        {
            userID: 3,
            name: "Jane Doe",
            service: "Women's Haircut",
            date: "11/18/23, Fri, 3:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-11-18"),
            appointmentNotes: "Jane needs a haircut"
        },
        {
            userID: 4,
            name: "Melinda Jackson",
            service: "Hair Extensions",
            date: "11/15/23, Sat, 2:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-11-15"),
            appointmentNotes: "Melinda needs hair extensions"
        }
    ]
    //setting the times like i did in the dummy data makes it a UTC date which will always be 1 day behind PST so i add one to the day
    //possibly need to get rid of this when the data base gets added
    clientAppointments.forEach(val => val.realDate.setDate(val.realDate.getDate() + 1));

    //filteredAps is used as an global array to hold the filtered appointments if there is any that need to be filtered by date
    let filteredAps: Appointment[] = [];
    const [upcomingClientAppointments, setUpcomingClientAppointments] = useState([]);
    const [pastClientAppointments, setPastClientAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [selectedClientID, setSelectedClientID] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [oldAppointmentNotes, setOldAppointmentNotes] = useState('');
    const [newAppointmentNotes, setNewAppointmentNotes] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editingNotes, setEditingNotes] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    //get today's date and convert it to PST
    const today = new Date();
    const pstDateString =  UTCtoPSTString(today);
    const todaysDate = pstDateString.slice(0, 10) + "T00:00:00.000Z";
    //console.log('todaysDate: ', todaysDate); //for debugging
    //for the drop down list below
    const [selected, setSelected] = React.useState("");

    const filter = [
        { key: 'Today', value: 'Today' },
        { key: 'This Week', value: 'This Week' },
        { key: 'This Month', value: 'This Month' },
        { key: 'All', value: 'All' },
    ]

    //handleSelection is called whenever a change is made in the drop down menu. 
    //It passes it back to the flatlist down below
    async function handleSelection(selected) {
        if (selected == 'All') { //all appointments
            let funcObj:funcObj;
            //past appointments
            try {
                    funcObj = {
                    entireFunction: () => database.get('/allPastAppointmentsQuery', {
                        params: {
                            todaysDate: todaysDate
                        }
                    }),
                    type: 'get'
                };
                const response = await funcObj.entireFunction()

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setPastClientAppointments(appointmentArray);
                //console.log('response', response.data); //for debugging
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj)
                    setPastClientAppointments(response.data)
                }catch(err){
                    console.error('Error getting all past appointments: ', err);
                    notify('Error getting all past appointments: ' + err);
                }
            }

            //upcoming appointments
            try {
                funcObj = {
                    entireFunction: () => database.get('/allUpcomingAppointmentsQuery', {
                        params: {
                            todaysDate: todaysDate
                        }
                    }),
                    type: 'get'
                };
                const response = await funcObj.entireFunction();

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setUpcomingClientAppointments(appointmentArray);
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj);
                    setUpcomingClientAppointments(response.data)
                }catch(err){
                    console.error('Error getting all upcoming appointments: ', err);
                }
            }
        } else if (selected == 'Today') { //today's appointments  

            const endOfDay = todaysDate.slice(0, 10) + "T23:59:59.999Z";   //sql DateTime2 format
            //console.log('startOfDay: ', todaysDate); //for debugging
            //console.log('endOfDay: ', endOfDay); //for debugging
            let funcObj:funcObj;
            //past and appointments
            try {
                funcObj = {
                    entireFunction: () => database.get('/clientHistoryAppointmentsQuery', {
                        params: {
                            startDate: todaysDate,
                            endDate: endOfDay
                        }
                    }),
                    type: 'get'
                };
                const response = await funcObj.entireFunction()
                
                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setPastClientAppointments(appointmentArray);
                setUpcomingClientAppointments(appointmentArray);
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj);
                    setPastClientAppointments(response.data);
                    setUpcomingClientAppointments(response.data);
                }catch(err){
                    console.error("Error getting today's appointment", error);
                }
            }
        } else if (selected == 'This Week') { //this week's appointments

            //need to fix later for compensating for start/end of month
            //going three days back for past and three days forward for upcoming
            const day = todaysDate.slice(8, 10);
            const pastDay = String(parseInt(day) - 3);
            const upcomingDay = String(parseInt(day) + 3);
            const firstDayOfWeek = todaysDate.slice(0, 8) + pastDay + "T00:00:00.000Z"; //sql DateTime2 format
            const lastDayOfWeek = todaysDate.slice(0, 8) + upcomingDay + "T23:59:59.999Z"; //sql DateTime2 format
            let funcObj:funcObj;
            //past appointments
            try {
                funcObj = {
                    entireFunction: () => database.get('/clientHistoryAppointmentsQuery', {
                        params: {
                                startDate: firstDayOfWeek,
                                endDate: todaysDate
                            }
                        }),
                        type: 'get'
                };
                const response = await funcObj.entireFunction();

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setPastClientAppointments(appointmentArray);
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj);
                    setPastClientAppointments(response.data);
                }catch(err){
                    console.error("Error getting this week's past appointments", err);
                }
            }

            //upcoming appointments/
            try {
                funcObj ={
                    entireFunction: () =>database.get('/clientHistoryAppointmentsQuery', {
                        params: {
                            startDate: todaysDate,
                            endDate: lastDayOfWeek
                        }
                    }),
                    type: 'get'
                };
                const response = await funcObj.entireFunction();

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setUpcomingClientAppointments(appointmentArray);
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj);
                    setUpcomingClientAppointments(response.data);
                }catch(err){
                    console.error("Error getting this week's upcoming appointments", error);
                }
            }
        } else if (selected == "This Month") { //this month's appointments
            
            //need to fix later to compensate for days in month
            //choosing start day of 01 and end day of 28 for now

            const month = todaysDate.slice(5, 7); //will use later to get month from string
            const firstDay = '01';
            const lastDay = '28';
            const firstDayOfMonth = todaysDate.slice(0, 8) + firstDay + "T00:00:00.000Z"; //sql DateTime2 format
            const lastDayOfMonth = todaysDate.slice(0, 8) + lastDay + "T23:59:59.999Z"; //sql DateTime2 format

            //past appointments
            let funcObj:funcObj;
            try {
                funcObj = {
                    entireFunction : () => database.get('/clientHistoryAppointmentsQuery', {
                        params: {
                            startDate: firstDayOfMonth,
                            endDate: todaysDate
                        }
                    }),
                    type: 'get'
                };
                const response = await funcObj.entireFunction();

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString()
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });
                
                setPastClientAppointments(appointmentArray);
            } catch (error) {
                try{
                    const response = await functionGetRetry(funcObj);
                    setPastClientAppointments(response.data);
                }catch(err){
                    console.error("Error getting this month's past appointments", error);
                }
            }

            //upcoming appointments
            try {
                funcObj = {
                    entireFunction: () => database.get('/clientHistoryAppointmentsQuery', {
                        params: {
                            startDate: todaysDate,
                            endDate: lastDayOfMonth
                        }
                    }),
                    type: 'get'
                };
                const response = await functionGetRetry(funcObj);

                let appointmentArray = response.data;
                appointmentArray.forEach( (appointment) => {
                    let userID = appointment.UserID;
                    //console.log('userID: ', userID); //for debugging
                    let appointmentDate = appointment.AppointmentDate;
                    //console.log('appointmentDate: ', appointmentDate); //for debugging
                    let serviceArr = appointment.TypeOfAppointment.split(",");
                    let clientServices: string[] = [];
                    serviceArr.forEach((serviceEl) => {
                        let temp = serviceEl.trim();
                        clientServices.push(SERVICES[temp]['service'])
                    });
                    appointment.TypeOfAppointment = clientServices.join(", ").toString();
                    let appointmentNotes = appointment.AppointmentNotes;
                    //console.log('appointmentNotes: ', appointmentNotes); //for debugging
                });

                setUpcomingClientAppointments(appointmentArray);
            } catch (error) {
                console.error("Error getting this month's upcoming appointments", error);
            }
        }
    }

    const handleNameSearch = async () => {

        //console.log(pastClientAppointments);
        //console.log(searchName);

        try {

            const filteredAppointments = pastClientAppointments.filter(appointment => {
                const clientName = `${appointment.FirstName} ${appointment.LastName}`.toLowerCase();
                return clientName.includes(searchName.toLowerCase());
            });

            setPastClientAppointments(filteredAppointments);
            //console.log("Filtered Appointments");
            //console.log(pastClientAppointments);
            //console.log(filteredAppointments);

        } catch (error) {
            console.error("Error filtering past appointments by name", error);
        }

    };

    //Tester for checking appointment filter
    const renderAppointmentText = () => {
        return pastClientAppointments.map((appointment, index) => (
            <p key = {index}>{appointment}</p>
        ));
    };

    //called when a tile is pressed
    const handleTilePress = (item) => {
        setSelectedAppointment(item);
        setSelectedClientID(item.UserID);
        setOldAppointmentNotes(item.AppointmentNotes);
        setNewAppointmentNotes(item.AppointmentNotes);
        setSelectedDate(item.AppointmentDate);
        setIsModalVisible(true);
    };

    //called when save notes button is pressed
    const handleSaveNotes = () => {
        console.log('saving notes'); //for debugging
        const userID = selectedClientID;
        const appointmentDate = selectedDate;
        const newNotes = newAppointmentNotes;
        const oldNotes = oldAppointmentNotes;
        if (newNotes !== oldNotes) {
            try {
                let funcObj:funcObj = {
                    entireFunction: () => database.patch('/updateAppointmentNotes', {
                        userID: userID,
                        appointmentDate: appointmentDate,
                        appointmentNotes: newNotes
                    }),
                    type: 'patch'
                };
                functionGetRetry(funcObj);
                notify('Appointment notes updated');
                setIsModalVisible(false);
                setOldAppointmentNotes(newNotes);
                if (upcomingClientAppointments.includes(selectedAppointment)) {
                    const index = upcomingClientAppointments.indexOf(selectedAppointment);
                    upcomingClientAppointments[index].AppointmentNotes = newNotes;
                    setUpcomingClientAppointments(upcomingClientAppointments);
                } else if (pastClientAppointments.includes(selectedAppointment)) {
                    const index = pastClientAppointments.indexOf(selectedAppointment);
                    pastClientAppointments[index].AppointmentNotes = newNotes;
                    setPastClientAppointments(pastClientAppointments);
                }
            } catch (error) {
                console.error('Error updating appointment notes: ', error);
                notify('Error updating appointment notes: ' + error);
            }
        } else {
            notify('No changes made to appointment notes');
        }
    };

    //called when delete appointment button is confirmed yes
    const handleDeleteAppointment = () => {
        console.log('delete'); //for debugging
        const appointmentDate = selectedDate;
        try {
            let funcObj:funcObj = { //removes client appointment by reseting it to open appointment
                entireFunction: () => database.patch('/removeClientAppointment', {
                        appointmentDate: appointmentDate,
                        typeOfAppointment: null,
                        vacancyStatus: 0,
                        appointmentNotes: null,
                        userID: null
                }),
                type: 'patch'
            };
            functionGetRetry(funcObj);
            notify('Appointment deleted');
            setIsModalVisible(false);
            if (upcomingClientAppointments.includes(selectedAppointment)) {
                const index = upcomingClientAppointments.indexOf(selectedAppointment);
                upcomingClientAppointments.splice(index, 1);
                setUpcomingClientAppointments(upcomingClientAppointments);
            } else if (pastClientAppointments.includes(selectedAppointment)) {
                const index = pastClientAppointments.indexOf(selectedAppointment);
                pastClientAppointments.splice(index, 1);
                setPastClientAppointments(pastClientAppointments);
            }
            setSelectedAppointment(null);
        } catch (error) {
            console.error('Error deleting appointment: ', error);
            notify('Error deleting appointment: ' + error);
        }
    };

    useEffect(() => {
        //console.log('pastClientAppointments: ', pastClientAppointments); //for debugging
        //console.log('upcomingClientAppointments: ', upcomingClientAppointments); //for debugging
    }, [pastClientAppointments, upcomingClientAppointments]);

    return (
        <RootSiblingParent>
        <>
        <ScrollView>
            <LinearGradient
                locations={[0.7, 1]}
                colors={['#DDA0DD', 'white']}
                style={styles.container}>
                <View style={styles.container}>

                    {/*Upcoming Appointments*/}
                    <View style = {styles.sectionTitle}>
                        <Text style = {styles.sectionTitleText}>Upcoming Appointments:</Text>
                    </View>

                    {/*drop down list formatting and rendering */}
                    <View>
                        <SelectList
                            dropdownShown={false}
                            setSelected={(val) => setSelected(val)}
                            data={filter}
                            boxStyles={{ backgroundColor: 'white' }}
                            dropdownStyles={{ backgroundColor: 'white' }}
                            save='value'
                            search={false}
                            defaultOption={{ key: 'Today', value: 'Today' }}
                            onSelect={() => handleSelection(selected)}
                            
                        />
                    </View>

                    {/* flat list is replacing the hard coded list from before as this can work with database data and print out the entire list at once */}
                    <FlatList
                        data={upcomingClientAppointments}
                        horizontal={true}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => handleTilePress(item)}>
                                <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Customer:  </Text>
                                            <Text style={styles.clientInfo}> {item.FirstName + ' ' + item.LastName}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Service:  </Text>
                                            <Text style={styles.clientInfo}>{item.TypeOfAppointment}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Date:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentDate.substring(0, 10)}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Time:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentDate.substring(11, 16)}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Appointment Notes:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentNotes}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />

                    {/*Past Appointments*/}
                    <View style={styles.sectionTitle}>
                        <Text style={styles.sectionTitleText}>Past Appointments:</Text>
                    </View>

                    {/*drop down list formatting and rendering */}
                    <View>
                        <SelectList
                            setSelected={(val) => setSelected(val)}
                            data={filter}
                            boxStyles={{ backgroundColor: 'white' }}
                            dropdownStyles={{ backgroundColor: 'white' }}
                            save='value'
                            search={false}
                            defaultOption={{ key: 'Today', value: 'Today' }}
                            onSelect={() => handleSelection(selected)}
                        />
                    </View>
                    <View style = {styles.appointBox}>
                        <View style = {styles.textAlignment}>

                                <TextInput
                                    value={searchName}
                                    onChangeText={text => setSearchName(text)}
                                    placeholder="Enter Name"
                                    style = {styles.textInput}
                                />
                                <Button
                                    title = "Search"
                                    onPress={handleNameSearch}
                                    color = "#942989"
                                />

                        </View>
                    </View>

                    {/* flat list is replacing the hard coded list from before as this can work with database data and print out the entire list at once */}
                    <FlatList
                        data={pastClientAppointments}
                        horizontal={true}
                        renderItem={({ item }) => (
                            <Pressable onPress={() => handleTilePress(item)}>
                                <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Customer:  </Text>
                                            <Text style={styles.clientInfo}> {item.FirstName + ' ' + item.LastName}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Service:  </Text>
                                            <Text style={styles.clientInfo}>{item.TypeOfAppointment}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Date:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentDate.substring(0, 10)}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Time:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentDate.substring(11, 16)}</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.textAlignment}>
                                        <Text style={[styles.appointText, styles.clientContainer]}>
                                            <Text style={styles.clientLabel}>Appointment Notes:  </Text>
                                            <Text style={styles.clientInfo}>{item.AppointmentNotes}</Text>
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />
                </View>
            </LinearGradient>
            </ScrollView>

            {/*Modal for appointment notes*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerTitle}>Change Appointment</Text>
                             <TextInput
                                value={newAppointmentNotes}
                                onChangeText={setNewAppointmentNotes}
                                placeholder={newAppointmentNotes}
                                multiline={true}
                                style={styles.modalNotes}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSaveNotes}>
                                <Text style={styles.modalButtonText}>Save Notes</Text>
                            </TouchableOpacity>
                            <View style={styles.modalSpacer} />
                            <TouchableOpacity style={styles.modalButton} onPress={() => {setIsModalVisible(false); setIsDeleteModalVisible(true);}}>
                                <Text style={styles.modalButtonText}>Delete Appointment</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/*Modal for deleting appointment*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isDeleteModalVisible}
                onRequestClose={() => setIsDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Are you sure you want to delete this appointment? This cannot be undone.</Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => {handleDeleteAppointment(); setIsDeleteModalVisible(false);}}>
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                            <View style={styles.modalSpacer} />
                            <TouchableOpacity style={styles.modalButton} onPress={() => setIsDeleteModalVisible(false)}>
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
        </RootSiblingParent>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 300,
    },
    // title of page
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // header color
    header: {
        backgroundColor: '#942989',
        paddingTop: 30,
        paddingBottom: 20,
        alignItems: 'center'
    },
    // white appointment block
    appointBox: {
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: screenWidth * .95,
        flexDirection: 'column',
    },
    // appointment text information 
    appointText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
    },
    clientContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    clientLabel: {
        marginRight: 10,
        color: '#b469ac',
    },
    clientInfo: {
        flex: 1,
        marginLeft: 10,
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
    // text alignment
    textAlignment: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        paddingBottom: 20,
    },
    modalContent: {    
        alignItems: "center",
        backgroundColor: "rgba(211, 211, 250,0.979)",
        borderRadius: 36,
        elevation: 8,
        shadowOpacity: 0.55,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 6,
        padding: 20,
        width: '90%',
    },
    modalButton: {
        backgroundColor: '#BE42B2',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 2,
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    modalNotes: {
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalSpacer: {
        width: 20,
    },
    backButton: {
        width: 100,
        height: 65,
        paddingLeft: 20,
        paddingTop: 10,
        //paddingBottom: 10,
        //margin: 5,
        //marginBottom: 30,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    textInput: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginRight: 10,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
        paddingTop: 5,
        paddingBottom: 5
    },
    sectionTitle: {
    },
    sectionTitleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        padding: 5,
    }
});

