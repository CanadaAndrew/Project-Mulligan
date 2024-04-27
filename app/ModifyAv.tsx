import React, { useEffect, useState, } from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View, Pressable,
    FlatList, ScrollView, Modal, Dimensions, useWindowDimensions, 
    SectionList} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; //used to format dates and times
import MyCalendar from './MyCalendar';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import { displayHours, militaryHours } from './Enums/Enums';
import { validateLocaleAndSetLanguage } from 'typescript';
import Constants from 'expo-constants';
import { UTCtoPSTString, funcObj, functionGetRetry, notify} from './Enums/Enums';
import { RootSiblingParent } from 'react-native-root-siblings'
//add route as a param to the function of every page that requires data from the const established in HomeScreen
//You can also make another const here and transfer data as well here up to you
export default function ModifyAv() {

    //make a local const this way using route.params
    //const { userData } = route.params;

    const [timeChanged, settimeChanged] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [appointmentTimes, setAppointmentTimes] = useState([]); //holds selected appointment times
    const [deletedTimes, setDeletedTimes] = useState([]); //holds deleted appointment times
    const [bookedAppointmentTimes, setBookedAppointmentTimes] = useState([]); //holds booked appointment times
    const [buttonColors, setButtonColors] = useState([]); //holds button colors
    const [filteredTimes, setFilteredTimes] = useState([]); //holds filtered appointment times
    const [displayedDate, setDisplayedDate] = useState(null);
    const [listOfTimes, setListOfTimes] = useState([]); //holds available appointment times
    const [modalVisible, setModalVisible] = useState(false); //popup for set schedule
    const [databaseTimes, setDatabaseTimes] = useState([]); //holds database times
    const listOfTimesDefault = [
        "12:00AM", "01:00AM", "02:00AM", "03:00AM", "04:00AM", "05:00AM", "06:00AM", "07:00AM", "08:00AM", "09:00AM",
        "10:00AM", "11:00AM", "12:00PM", "01:00PM","02:00PM","03:00PM","04:00PM","05:00PM","06:00PM","07:00PM","08:00PM",
        "09:00PM","10:00PM","11:00PM"
    ]; 

    //converts to 12 hour time
    const convertTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour12 = (parseInt(hours) % 12 || 12).toString().padStart(2, '0');
        return hour12 + ':' + minutes + (parseInt(hours) < 12 ? 'AM' : 'PM');
    };

    //function that is called by onDayPress built in function that in turn calls the setSelctedDate function
    const handleDayPress = async (day) => { 
        //console.log(day.dateString); //for testing purposes

        //default times for selected date
        setListOfTimes([...listOfTimesDefault])
    
        //get today's date and convert it to PST
        const pstDateString =  UTCtoPSTString(day.dateString);
        //console.log('pstDateString: ', pstDateString); //for debugging
        setSelectedDate(pstDateString);
        setDisplayedDate(moment(pstDateString).format('ddd, MMMM Do'));

        //Makes an iterable and Times array when the calendar is pressed
        let iterable;
        let Times = [];
        try {
            //formats the day passed into this function to include the information needed to query it
            const beginDay = pstDateString.slice(0, 10) + 'T00:00:00.000Z';
            const endDay = pstDateString.slice(0, 10) + 'T23:59:59.000Z';
            //console.log('beginDay: ', beginDay); //for debugging
            //console.log('endDay: ', endDay); //for debugging

            //Queries the database with the beginning and end of the day selected 
            try {


                const funcObj: funcObj = {
                    entireFunction: () => database.get('/selectAppointmentsByTime', {
                        params: {
                            beginDay: beginDay,
                            endDay: endDay
                        }
                    }),
                    type: 'get'
                };
                const responseToQ = await functionGetRetry(funcObj);
                console.log(responseToQ);
                            //appointmentData then gets the data from the responding query
                let appointmentData = responseToQ.data;
                //console.log('response', responseToQ.data); //for testing purposes

                //For each that loops through the appointmentData dates and slices it up to get just the time slot
                //converts time using the Enums and pushes it to the Times array
                for(iterable in appointmentData) {
                    let apptTime = appointmentData[iterable].AppointmentDate.slice(11,19)
                    let formattedTime = displayHours[apptTime];
                    Times.push(formattedTime)
                }

                //get booked times from database
                funcObj.entireFunction = () => database.get('/appointmentQuery', {
                    params: {
                        startDate: beginDay,
                        endDate: endDay,
                        vacancyStatus: 1
                    },
                });
                const bookedResponse = await funcObj.entireFunction();

                //sets the AppointmentTimes to the times array so it is updated to reflect that in the app.
                setAppointmentTimes(Times);
                setDatabaseTimes(Times); //initial times pulled from database
                const booked = bookedResponse.data.map(innerArray => innerArray.AppointmentDate.slice(11, 19));
                const booked12 = booked.map(time => convertTo12Hour(time));
                //console.log('booked12', booked12); //for testing purposes
                setBookedAppointmentTimes(booked12); //initial booked times pulled from database
                //console.log('bookedAppointmentTimes', bookedAppointmentTimes); //for testing purposes

            } catch {

            }
        } catch(error) {
            console.error(error);
            notify(error)
        }
        return null;
    };

    //updates deletedTimes and appointmentTimes with time button pushes
    const handleAppointmentPress = (time) => {
        //console.log('appointmentTimes', appointmentTimes); //for testing purposes
        //console.log('time', time); //for testing purposes
        //update appointmentTimes and deletedTimes
        setAppointmentTimes((prevAppointments) => {
            //console.log('prevAppointments', prevAppointments); //for testing purposes
            const updatedAppointments = [...prevAppointments];
            //console.log('updatedAppointments', updatedAppointments); //for testing purposes
            const addIndex = updatedAppointments.indexOf(time);     
            const deleteIndex = deletedTimes.indexOf(time);    
            const bookedIndex = bookedAppointmentTimes.indexOf(time);
            if (bookedIndex !== -1) { //time chosen was in bookedAppointmentTimes
                notify('Cannot update booked appointment times');
                return updatedAppointments;
            } else if (addIndex !== -1) { //time chosen was in appointmentTimes
                updatedAppointments.splice(addIndex, 1); //remove time from appointmentTimes
                if (deleteIndex === -1) { //time not in deletedTimes
                    const newDelete = [...deletedTimes, time]; //add time to deletedTimes
                    setDeletedTimes(newDelete);
                }
            } else { 
                updatedAppointments.push(time); //add time to appointmentTimes
                if (deleteIndex !== -1) { //time in deletedTimes
                    deletedTimes.splice(deleteIndex, 1); //remove time from deletedTimes
                    setDeletedTimes(deletedTimes);
                }
            }
            return updatedAppointments;
        });
    };

    //filter schedule times available -> does nothing with times outside of filter range
    const handleFilterSchedule = () => {       
        setModalVisible(!modalVisible); //toggle popup to select time range  
    };

    //note: Date is in UNIX format, including milliseconds, using a converter is recommended
    //used for default times in filter schedule modal
    const timestamp = 1700326800000; //UNIX timestamp in milliseconds
    const timestampMidnight = new Date(timestamp).setHours(0, 0, 0, 0); //set to midnight for now to prompt user to change -> doesn't update appointmentTimes until new times are selected -> change in future?
    const [date1, setDate1] = useState(new Date(timestampMidnight));
    const [date2, setDate2] = useState(new Date(timestampMidnight));
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    
    //changes time with time picker to set opening time
    const onChange1 = (event, selectedDate) => {
       
        const currentDate = selectedDate;
        setShow1(false);
        setDate1(currentDate);

        //setDate doesn't update immediately, which is why currentDate and Time1 are still different
        //getTime1 changes when function ends.
        var tempArray = []
        for(let i = currentDate.getHours(); i < date2.getHours(); i++) {
            if (i < 12) {
                tempArray.push(i.toString().padStart(2, '0') + ":00AM");
            } else if (i === 12) {
                tempArray.push(i.toString().padStart(2, '0') + ":00PM");
            } else {
                tempArray.push((i - 12).toString().padStart(2, '0') + ":00PM");
            }           
        }

        //resets lists of times to be the times between the opening and closing times
        //console.log('tempArray', tempArray); //for debugging
        setFilteredTimes(tempArray);
        tempArray = [];

        //Time functions will run when user closes the modal
        settimeChanged(true);
    };

    //changes time with time picker to set closing time
    const onChange2 = (event, selectedDate) => {
       
        const currentDate = selectedDate;
        setShow2(false);
        setDate2(currentDate);
        var tempArray = []
        for(let i = date1.getHours(); i < currentDate.getHours() + 1; i++) {
            if (i < 12) {
                tempArray.push(i.toString().padStart(2, '0') + ":00AM");
            } else if (i === 12) {
                tempArray.push(i.toString().padStart(2, '0') + ":00PM");
            } else {
                tempArray.push((i - 12).toString().padStart(2, '0') + ":00PM");
            }            
        }

        //resets lists of times to be the times between the opening and closing times
        //console.log('tempArray', tempArray); //for debugging
        setFilteredTimes(tempArray);
        tempArray = [];
        if(date1.getHours() <= currentDate.getHours()) {
            //not sure what this is for??? -> anyone know?
        }

         //Time functions will run when user closes the modal
        settimeChanged(true);
    };
  
    const showTimePicker1 = () => {setShow1(true); };
    const showTimePicker2 = () => {setShow2(true); };

    //return times in hhmm am/pm format
    const getTime1 = () => {
        if(date1.getHours() <= 12) {
            if( date1.getMinutes() < 10) {
                return (date1.getHours() + ":" +  "0" + date1.getMinutes() + "AM");
            } else {
                return (date1.getHours() + ":" + date1.getMinutes() + "AM");
            }
        } else {
            if( date1.getMinutes() < 10) {
                return (date1.getHours() - 12 + ":" +  "0" + date1.getMinutes() + "PM");
            } else {
                return (date1.getHours() - 12 + ":" + date1.getMinutes() + "PM");
            }
        }
    }
    const getTime2 = () => {
        if(date2.getHours() <= 12) {
            if(date2.getMinutes() < 10) {
                return (date2.getHours() + ":" +  "0" + date2.getMinutes() + "AM");
            } else {
                return (date2.getHours() + ":" + date2.getMinutes() + "AM");
            }
        } else {
            if(date2.getMinutes() < 10) {
                return (date2.getHours() - 12 + ":" +  "0" + date2.getMinutes() + "PM");
            } else {
                return (date2.getHours() - 12 + ":" + date2.getMinutes() + "PM");
            }
        }
    }

    //converts time to 24 hour format and removes am/pm
    const convertTo24Hour = (time) => {
        const [hours, minutes] = time.replace(/[^\d:]/g, '').split(':');
        return (parseInt(hours) + (time.includes('pm') ? 12 : 0)).toString().padStart(2, '0') + ':' + minutes;
    };
    //console.log(convertTo24Hour('12:00pm')); //for testing purposes

    //maps appointmentTimes to datetime2 format -> currently not used but maybe later or in date/time file
    const convertToDateTime2 = (time24) => {
        return `${selectedDate}T${convertTo24Hour(time24)}:00.000Z`; //sql DateTime2 format
    };

    //updates appointment schedule in database
    const handleSetSchedule = async (day) => {  

        const insertions = appointmentTimes.filter(time => !databaseTimes.includes(time)); //times to insert into database
        const deletions = deletedTimes.filter(time => !bookedAppointmentTimes.includes(time)); //times to delete from database
        const timesToInsert = insertions.map((x) => {return militaryHours[x].slice(0, 5)});
        let timesToDelete = deletions.map((y) => {return militaryHours[y].slice(0, 5)});

        //check if there are times to delete that are booked
        if (deletions.filter(time => bookedAppointmentTimes.includes(time)).length > 0) { //might not need
            notify('Cannot delete booked appointment times');
        } else {
            try {
                //check if there are times to insert
                if (timesToInsert.length > 0) {

                    //create new row for each time to insert
                    const addPromises = timesToInsert.map(async (time) => {
                        const addDateTimeString = `${selectedDate.slice(0, 10)}T${time}:00.000Z`; //sql DateTime2 format
                        //console.log('addDateTimeString', addDateTimeString); //for testing purposes
                        
                        //post available appointment times to database
                        try {
                            let funcObj:funcObj = {
                                entireFunction: () => database.post('/addAvailability', {
                                    addDateTimeString: addDateTimeString,
                                    vacancyStatus: 0
                                }),
                                type: 'post'
                            }
                            const response = await functionGetRetry(funcObj);
                            //console.log(response); //for testing purposes
                        } catch (error) {
                            console.error('Error adding appointment time slot:', error.response.data);
                            notify('Error adding appointment time slot:' + error.response.data);
                        }
                    });  

                    //wait for all create operations to complete
                    await Promise.all(addPromises);
                }

                //check if there are times to delete
                if (timesToDelete.length > 0) {
                    //delete rows for times in database but not in current list
                    const removePromises = timesToDelete.map(async (time) => {
                        const removeDateTimeString = `${selectedDate.slice(0, 10)}T${time}:00.000Z`; //sql DateTime2 format
                        //console.log('removeDateTimeString', removeDateTimeString); //for testing purposes

                        //remove available appointment times from database
                        try {
                            let funcObj:funcObj = {
                                entireFunction: () => database.delete('/removeAvailability', { 
                                    data:{
                                            removeDateTimeString: removeDateTimeString
                                        }
                                }),
                                type: 'delete'
                            };
                            const response = await functionGetRetry(funcObj);
                            //console.log(response); //for testing purposes
                        } catch (error) {
                            console.error('Error deleting appointment time slot:', error);
                            notify('Error deleting appointment time slot: ' + error);
                        }
                    });
    
                    //wait for all delete operations to complete
                    await Promise.all(removePromises);
                    setDeletedTimes([]); //clear deleted times
                }
    
                //log success or handle it as needed
                console.log('Schedule updated successfully');
                notify('Schedule updated successfully!');
                setDatabaseTimes(appointmentTimes); //update database times
            } catch (error) {
                console.error('Error updating schedule:', error);
                notify('Error updating schedule: ' + error);
            }
        }
    };

    useEffect(() => { //update button colors based on appointment status
        const updatedColors = listOfTimes.map(time => {
            if (bookedAppointmentTimes.includes(time)) {
                return 'black'; //booked times
            } else if (appointmentTimes.includes(time)) {
                return 'green'; //available times
            }
            return 'red'; //default color
        });

        //update button colors
        setButtonColors(updatedColors);
    }, [listOfTimes, appointmentTimes, bookedAppointmentTimes]);

    const printTimes = () => {
        var result = [];
        for (let i = 0; i < listOfTimes.length; i++) {
            result.push(
                <View style={styles.timeRow} key = {i} >
                    <View style={styles.timeCell}>
                        <TouchableOpacity
                            style={[styles.timeButton, { backgroundColor: 'white' }]}
                            onPress={() => handleAppointmentPress(listOfTimes[i])}
                        >
                            <Text style={[styles.buttonText, { color: buttonColors[i] }]}>
                                {listOfTimes[i]}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return result
    }

    const showPageContent = () => {
        let allParts = []
        allParts.push(
            <>
                <StatusBar backgroundColor={'black'} />
                <LinearGradient locations={[0.7, 1]} colors={['#DDA0DD', 'white']} style={styles.container}>

                    <View style={styles.container}>
                        <View style={styles.backButton}></View>
                        <Calendar onDayPress={handleDayPress} />
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{displayedDate}</Text>
                        </View>
                        <View style={styles.listView}>
                            <Text>{printTimes()}</Text>
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <View style={styles.bottomButton}>
                                <Pressable
                                    style={({ pressed }) => [{
                                        backgroundColor: pressed ? '#D8BFD8' : '#C154C1'
                                    },
                                    styles.bottomButtonText
                                    ]}
                                    onPress={handleFilterSchedule}
                                >
                                    {({ pressed }) => (
                                        <Text style={styles.bottomButtonText}>Filter Schedule</Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                        <View style={styles.bottomButtonContainer}>
                            <View style={styles.bottomButton}>
                                <Pressable
                                    style={({ pressed }) => [{
                                        backgroundColor: pressed ? '#D8BFD8' : '#C154C1'
                                    },
                                    styles.bottomButtonText
                                    ]}
                                    onPress={handleSetSchedule}
                                >
                                    {({ pressed }) => (
                                        <Text style={styles.bottomButtonText}>Set Schedule</Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                        {/* Tester text that shows the userData Const from HomeScreen to see if it works. */}
                        {/* <Text>
                        UserId: {userData.UserId}, AdminPriv: {userData.AdminPriv.toString()}, NewClient: {userData.NewClient.toString()}
                    </Text> */}
                        {/*popup that displays the two times to input*/}
                        <Modal visible={modalVisible} animationType="fade" transparent={true}>
                            <View style={styles.modal}>
                                <Text style={{ fontSize: 24 }}>{"\n"}Filter Schedule</Text>
                                <Text>{"\n"}</Text>
                                <View style={{ flexDirection: "row", flex: 0, columnGap: 10 }}>
                                    <Text>Opening Time</Text>
                                    <Text>                   Closing Time</Text>
                                    <Text>{"\n"}</Text>
                                </View>
                                <View style={{ flexDirection: "row", flex: .2, columnGap: 85 }}>
                                    <TouchableOpacity style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 4 }}>
                                        <Text style={{ fontWeight: "bold" }}>{getTime1()}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 4 }}>
                                        <Text style={{ fontWeight: "bold" }}>{getTime2()}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text>{"\n"}</Text>
                                <View style={{ flexDirection: "row", flex: .23, columnGap: 30 }}>
                                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#D8BFD8' : '#C154C1' },
                                    styles.backButtonText, styles.shadow]} onPress={showTimePicker1}  >
                                        <Text style={styles.backButtonText}>{" Change Opening  "}</Text>
                                    </Pressable>
                                    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#D8BFD8' : '#C154C1' },
                                    styles.backButtonText, styles.shadow]} onPress={showTimePicker2}  >
                                        <Text style={styles.backButtonText}>{" Change Closing   "}</Text>
                                    </Pressable>
                                </View>
                                {show1 && (
                                    <DateTimePicker
                                        value={date1}
                                        mode={'time'}
                                        is24Hour={false}
                                        onChange={onChange1}
                                        
                                    />
                                )}
                                {show2 && (
                                    <DateTimePicker
                                        value={date2}
                                        mode={'time'}
                                        is24Hour={false}
                                        onChange={onChange2} 
                                            
                                    />
                                )}
                                <Text>{"\n\n"}</Text>
                                <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#D8BFD8' : '#C154C1' }, //hide the popup window
                                styles.backButtonText, styles.shadow]} onPress={() => {
                                    setModalVisible(false); //close modal
                                    //if the user opens/closes Filter Schedule and makes no changes don't run these
                                    if(timeChanged)
                                        {
                                            setListOfTimes(filteredTimes); //update available times
                                            //setFilteredTimes([]); //clear filtered times
                                            setFilteredTimes([]); //clear filtered times
                                            settimeChanged(false);
                                        } 
                                       

                                   
                                }}
                                >
                                    <Text style={styles.backButtonText} > Close    </Text>
                                </Pressable>
                            </View>
                        </Modal>
                    </View>

                </LinearGradient>
            </>
        )
        return (
            <FlatList
                data={allParts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View>{item}</View>
                )}
            />
        )
    }

    useEffect(() => {showPageContent()}, []);

    return (
        <RootSiblingParent>
            <>{showPageContent()}</>
        </RootSiblingParent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 10
        //backgroundColor: '#DDA0DD'
    },
    // header
    header: {
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 20,
        backgroundColor: '#880085'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // back button
    backButton: {
        width: 100,
        height: 65,
        paddingLeft: 20,
        paddingTop: 10
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        //backgroundColor: '#C154C1',
        borderRadius: 20,
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        //elevation: 10,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        alignItems: 'center',  
    },
    // calendar.  calendarText is placeholder
    calendar: {
        flex: 0,
        height: 200,
        //backgroundColor: 'white',
        marginTop: 30,
        marginBottom: 50,
        padding: 0,
        alignItems: 'center',
    },
    calendarText: {
        color: 'black'
    },
    // date
    dateContainer: {
        //backgroundColor: 'lightblue',
        height: 35
    },
    dateText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 5,
        paddingLeft: 20
    },
    // for the time slots
    timeContainer: {
        flexGrow: 1,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 15
    },
    timeCell: {
        //width: 80,
        paddingRight: 10,
        width: '20%',             //Adjust width to 20% for five buttons per row
        justifyContent: 'center', //center content vertically
        alignItems: 'center',     //center content horizontally
        marginBottom: 10,         //add marginBottom for spacing
        height: 40,               //add uniform height to buttons
    },
    // bottom three buttons
    bottomButtonContainer: {
        //backgroundColor: 'lightgreen',
        height: 55,
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    bottomButton: {
        width: 250,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    bottomButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
        //backgroundColor: '#C154C1',
        textAlign: 'center',
        borderRadius: 15,
        paddingTop: 5,
        paddingBottom: 5,
        //elevation: 10,
        shadowColor: 'black',
        shadowOpacity: 0.1
    },
    timeButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modal: {    
        flex: 0.5,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "rgba(211, 211, 250,0.979)",
        marginTop: 140,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: -280,
        borderRadius: 36,
        elevation: 8,
        shadowOpacity: 0.55,
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 6  
    },
    shadow: {   
        elevation: 15, 
    },
    listView: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 20,
        paddingLeft: 10,
        alignItems: 'center'
    }
});