import { StyleSheet, Text, View, Pressable, FlatList, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, } from 'react';
import { Link } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios'; //used to get data from the backend nodejs
import moment from 'moment-timezone';
import { TextInput } from 'react-native-gesture-handler';
import { text } from 'express';
        
export default function ClientHistory() {

    interface Appointment {
        name: string;
        service: string;
        date: string;
        stylist: string;
        realDate: Date;
    }
    /*I have genuinely no idea why this function is needed*/
    const handleDatesSelected = (selectedDates: string[]) => { };


    //new list that makes it work better with filtering and acts more like actual data from the database
    let clientAppointments: Appointment[] = [
        {
            name: "Will Smith",
            service: "Men's Haircut",
            date: "10/27/23, Fri, 1:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-10-27")
        },
        {
            name: "Bob Smith",
            service: "Men's Haircut",
            date: "11/27/23, Mon, 2:00pm",
            stylist: 'Melissa Wright',
            realDate: (new Date("2023-11-27"))
        },
        {
            name: "Jane Doe",
            service: "Women's Haircut",
            date: "11/18/23, Fri, 3:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-11-18")
        },
        {
            name: "Melinda Jackson",
            service: "Hair Extensions",
            date: "11/15/23, Sat, 2:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-11-15")
        }
    ]
    //setting the times like i did in the dummy data makes it a UTC date which will always be 1 day behind PST so i add one to the day
    //possibly need to get rid of this when the data base gets added
    clientAppointments.forEach(val => val.realDate.setDate(val.realDate.getDate() + 1));

    //filteredAps is used as an global array to hold the filtered appointments if there is any that need to be filtered by date
    let filteredAps: Appointment[] = [];

    const database = axios.create({
        baseURL: 'http://10.0.0.192:3000'
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.133:3000', //Adrian's local pc
    });
    const [upcomingClientAppointments, setUpcomingClientAppointments] = useState([]);
    const [pastClientAppointments, setPastClientAppointments] = useState([]);

    const [searchName, setSearchName] = useState('');

    //get today's date and convert it to PST
    const today = new Date();
    const pstDateString =  moment(today).tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss.SSS');
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

            //past appointments
            try {
                const response = await database.get('/allPastAppointmentsQuery', {
                    params: {
                        todaysDate: todaysDate
                    }             
                });
                setPastClientAppointments(response.data);
                //console.log('response', response.data); //for debugging
            } catch (error) {
                console.error('Error getting all past appointments: ', error);
            }

            //upcoming appointments
            try {
                const response = await database.get('/allUpcomingAppointmentsQuery', {
                    params: {
                        todaysDate: todaysDate
                    }
                });
                setUpcomingClientAppointments(response.data);
            } catch (error) {
                console.error('Error getting all upcoming appointments: ', error);
            }
        } else if (selected == 'Today') { //today's appointments  

            const endOfDay = todaysDate.slice(0, 10) + "T23:59:59.999Z";   //sql DateTime2 format
            //console.log('startOfDay: ', todaysDate); //for debugging
            //console.log('endOfDay: ', endOfDay); //for debugging

            //past and appointments
            try {
                const response = await database.get('/clientHistoryAppointmentsQuery', {
                    params: {
                        startDate: todaysDate,
                        endDate: endOfDay
                    }
                });
                //console.log(response.data); //for debugging   
                setPastClientAppointments(response.data); 
                setUpcomingClientAppointments(response.data);           
            } catch (error) {
                console.error("Error getting today's appointment", error);
            }
        } else if (selected == 'This Week') { //this week's appointments

            //need to fix later for compensating for start/end of month
            //going three days back for past and three days forward for upcoming
            const day = todaysDate.slice(8, 10);
            const pastDay = String(parseInt(day) - 3);
            const upcomingDay = String(parseInt(day) + 3);
            //console.log('day: ', day); //for debugging
            //console.log('pastDay: ', pastDay); //for debugging
            //console.log('upcomingDay: ', upcomingDay); //for debugging
            const firstDayOfWeek = todaysDate.slice(0, 8) + pastDay + "T00:00:00.000Z"; //sql DateTime2 format
            const lastDayOfWeek = todaysDate.slice(0, 8) + upcomingDay + "T23:59:59.999Z"; //sql DateTime2 format
            
            //past appointments
            try {
             const response = await database.get('/clientHistoryAppointmentsQuery', {
                params: {
                        startDate: firstDayOfWeek,
                        endDate: todaysDate
                    }
                });
                setPastClientAppointments(response.data);
            } catch (error) {
                console.error("Error getting this week's past appointments", error);
            }

            //upcoming appointments
            try {
                const response = await database.get('/clientHistoryAppointmentsQuery', {
                    params: {
                        startDate: todaysDate,
                        endDate: lastDayOfWeek
                    }
                });
                setUpcomingClientAppointments(response.data);
            } catch (error) {
                console.error("Error getting this week's upcoming appointments", error);
            }
        } else if (selected == "This Month") { //this month's appointments
            
            //need to fix later to compensate for days in month
            //choosing start day of 01 and end day of 28 for now

            const month = todaysDate.slice(5, 7); //will use later to get month from string
            const firstDay = '01';
            const lastDay = '28';
            //console.log('month: ', month); //for debugging
            //console.log('firstDay: ', firstDay); //for debugging
            //console.log('lastDay: ', lastDay); //for debugging
            const firstDayOfMonth = todaysDate.slice(0, 8) + firstDay + "T00:00:00.000Z"; //sql DateTime2 format
            const lastDayOfMonth = todaysDate.slice(0, 8) + lastDay + "T23:59:59.999Z"; //sql DateTime2 format
            //console.log('firstDayOfMonth: ', firstDayOfMonth); //for debugging
            //console.log('lastDayOfMonth: ', lastDayOfMonth); //for debugging

            //past appointments
            try {
                const response = await database.get('/clientHistoryAppointmentsQuery', {
                    params: {
                        startDate: firstDayOfMonth,
                        endDate: todaysDate
                    }
                });
                setPastClientAppointments(response.data);
            } catch (error) {
                console.error("Error getting this month's past appointments", error);
            }

            //upcoming appointments
            try {
                const response = await database.get('/clientHistoryAppointmentsQuery', {
                    params: {
                        startDate: todaysDate,
                        endDate: lastDayOfMonth
                    }
                });
                setUpcomingClientAppointments(response.data);
            } catch (error) {
                console.error("Error getting this month's upcoming appointments", error);
            }
        }
    }

    const handleNameSearch = async () => {

        console.log(pastClientAppointments);
        console.log(searchName);

        try {

            const filteredAppointments = pastClientAppointments.filter(appointment => {
                const clientName = `${appointment.FirstName} ${appointment.LastName}`.toLowerCase();
                //console.log("Client Name");
                //console.log(clientName);
                //console.log('clientname: ', clientName);
                return clientName.includes(searchName.toLowerCase());
            });

            setPastClientAppointments(filteredAppointments);
            console.log("Filtered Appointments");
            console.log(pastClientAppointments);
            console.log(filteredAppointments);

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

    useEffect(() => {
        console.log('pastClientAppointments: ', pastClientAppointments); //for debugging
        console.log('upcomingClientAppointments: ', upcomingClientAppointments); //for debugging
    }, [pastClientAppointments, upcomingClientAppointments]);

    return (
        <>
            <LinearGradient
                locations={[0.7, 1]}
                colors={['#DDA0DD', 'white']}
                style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Client History</Text>
                    </View>
                    <View style={styles.backButton}>
                        <Pressable
                            style={({ pressed }) => [{
                                backgroundColor: pressed ? '#D8BFD8' : '#C154C1'
                            },
                            styles.backButtonText
                            ]}>
                            {({ pressed }) => (
                                <Link href="/" asChild>
                                    <Text style={styles.backButtonText}>Back</Text>
                                </Link>
                            )}
                        </Pressable>
                    </View>

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
                            <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Customer:</Text>
                                    <Text style={styles.appointText}> {item.FirstName + ' ' + item.LastName}</Text>
                                </View>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Service:</Text>
                                    <Text style={styles.appointText}>{item.TypeOfAppointment}</Text>
                                </View>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Date:</Text>
                                    <Text style={styles.appointText}>{item.AppointmentDate.substring(0, 10)}</Text>
                                </View>
                                <View style = {styles.textAlignment}>
                                    <Text style={styles.appointText}>Time:</Text>
                                    <Text style={styles.appointText}>{item.AppointmentDate.substring(11, 16)}</Text>
                                </View>
                            </View>
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
                    <View>
                        <Text>Filtered Past Appointments:</Text>
                    </View>

                    {/*<FlatList
                        data = {pastClientAppointments}
                        renderItem = {({ item }) => (
                            <View>
                                <Text>Customer: {item.FirstName} {item.LastName}</Text>
                                <Text>Service: {item.TypeOfAppointment}</Text>
                                <Text>Date: {item.AppointmentDate.substring(0, 10)}</Text>
                                <Text>Time: {item.AppointmentDate.substring(11, 16)}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    /> */}
                    {/* flat list is replacing the hard coded list from before as this can work with database data and print out the entire list at once */}
                    <FlatList
                        data={pastClientAppointments}
                        horizontal={true}
                        renderItem={({ item }) => (
                            <View style={[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Customer:</Text>
                                    <Text style={styles.appointText}> {item.FirstName + ' ' + item.LastName}</Text>
                                </View>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Service:</Text>
                                    <Text style={styles.appointText}>{item.TypeOfAppointment}</Text>
                                </View>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Date:</Text>
                                    <Text style={styles.appointText}>{item.AppointmentDate.substring(0, 10)}</Text>
                                </View>
                                <View style={styles.textAlignment}>
                                    <Text style={styles.appointText}>Time:</Text>
                                    <Text style={styles.appointText}>{item.AppointmentDate.substring(11, 16)}</Text>
                                </View>
                            </View>
                        )}
                    />
                  
                </View>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
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
        //alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 3

    },
    // appointment text information 
    appointText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 10
        ///textAlign: 'center'
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

