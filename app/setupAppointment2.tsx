import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
    FlatList,
    Image,
    ScrollView
} from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';
import { SERVICES, militaryHours, displayHours, funcObj, functionGetRetry} from './Enums/Enums';
import Constants from 'expo-constants';
import { UTCtoPST } from './Enums/Enums';

export default function SetupAppointment2({route}) { // added route for page navigation
    
    //server connection
    const database = axios.create({
        baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [appointmentTimes, setAppointmentTimes] = useState([[]]); //list of selected times to push to db upon confirmation
    const [selectedTime, setSelectedTime] = useState([]);       //updates the selected time state
    const [alteredListOfTimes, setAlteredTimes] = useState([[]]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // for data transfer between appointment pages
    const {hairStyleData} = route.params;
    const {dateData} = route.params;
    const { userData } = route.params;

    //Doesn't work anymore, this is getting replaced by the function directly below this one.
    /*function updateTimeList(appointmentData){
        //creates a new date object based on the dateChosen variable. getter/setter isn't working properly for it yet so it is still
        //using dummy data
        var appointmentDateChosen = new Date(dateChosen).toISOString().slice(0, 10);

        let appointment;
        let Times = [];
        
        for loop that searches the appointments in the database. If it matches the appointments that are of the same date chosen
        and the vacancy status is 0 meaning that there is no appointment scheduled for that time slot then it formats the time from
        the database and puts it into the Times array
        
        for(appointment in appointmentData)
        {
            let databaseDate = appointmentData[appointment].AppointmentDate.slice(0, 10);

            if(databaseDate == appointmentDateChosen && appointmentData[appointment].VacancyStatus == 0)
            {
                //lots of formatting to be done
                let aptdate = new Date(appointmentData[appointment].AppointmentDate);
                const hours = aptdate.getUTCHours().toString().padStart(2, '0');
                const minutes = aptdate.getUTCMinutes().toString().padStart(2, '0');
                const seconds = aptdate.getUTCSeconds().toString().padStart(2, '0');
                const formattedTime = `${hours}:${minutes}:${seconds}`;

                const[hours1, minutes1] = formattedTime.split(':');
                let period = 'am';
                let hours12 = parseInt(hours, 10);
                if(hours12 >= 12)
                {
                    period = 'pm';
                    if(hours12 > 12)
                    {
                        hours12 -= 12;
                    }
                }

                const formatted12HourTime = `${hours12.toString()}:${minutes}${period}`;
                //at the end it pushes the formatted time to the Times array
                Times.push(formatted12HourTime);


            }
        }
        //useState that keeps track of the alteredListOfTimes array. Setting the alteredListOfTimes array to the correctly
        //formatted and ordered Times array so it can be used outside of this function.
        setAlteredTimes(Times);
    }*/


    const displayDateTimes = async() =>
    {
        //the temporary array of arrays that holds the time strings for each date
        var temp: string[][] = [];

        //since dateData acts as a giant string from how it is passed in here by setUpAppointment1 I have to split each
        //string up into their own array
        let dateDataQ = dateData.split(/[\s,]+/);

        let date;
        //for loop that formats each date selected and gets the vacant times for each. It stores the found times into an array
        //then pushes that array to an array of arrays.
        for(date in dateDataQ)
        {
            //formats the day passed into this function to include the information needed to query it
            const beginDay = dateDataQ[date] + 'T00:00:00.000Z';
            const endDay = dateDataQ[date] + 'T23:59:59.000Z';

            let appointmentData;
            //Queries the database for appointments with the beginning and end of the day selected and a vacant time
            const funcObj:funcObj = {
                entireFunction: () => database.get('/queryAppointmentByDaySelectedAndVacancy', {
                    params: {
                        beginDay: beginDay,
                        endDay: endDay
                    }
                }),
                type: 'get'
            };
            let response = await functionGetRetry(funcObj);
            appointmentData = response.data;
            //appointmentData then gets the data from the responding query
            let apptData;
            var temptimelist: string[] = [];
            var realTimeList: string [] =[];
            //for loop that formats the time so it is more readable to normies, then pushes them each to an array
            for(apptData in appointmentData)
            {
                let apptTime = appointmentData[apptData].AppointmentDate.slice(11,19);
                realTimeList.push(apptTime);
                let formattedTime = displayHours[apptTime];
                temptimelist.push(formattedTime);
            }

            //takes said array above and pushes that array into another array that holds arrays(confusing? I know...)
            temp.push(temptimelist);
            
        }
        
        //updates the main time array of arrays with the one that we have constructed as shown above.
        setAlteredTimes(temp);
    }
    

    const month = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    const [services, setServices] = React.useState('');

    const dates = [];
    const dummyDates = dateData.split(', ')

    const legendWords = ['Available:', 'Selected:'];

    useEffect(() => {
        displayDateTimes();
        calculateHours();
        formatServices()
    }, []);

    const [hours, setHours] = React.useState(0);

    function calculateHours(){
            let hairStyleArray = hairStyleData.split(', ');
            let totalHours = 0;
            hairStyleArray.forEach((hairStyle) => {
                //alert(JSON.stringify(SERVICES[hairStyle]));
                try{
                    totalHours += SERVICES[hairStyle]['time'];
                }catch(e){
                    totalHours += 0;
                }
            })
            //alert(totalHours);
            setHours(totalHours);
    }
    function formatServices(){
        let hairStyleArray = hairStyleData.split(', ');
        let services = [];
        hairStyleArray.forEach((hairStyle) => {
            try{
                services.push(SERVICES[hairStyle]['service']);
            }catch(e){

            }
        })
        setServices(services.join(', '));
    }

    const handleAppointmentPress = (time, date, index) => {
        let currentTime; 
        currentTime = selectedTime;
        setSelectedTime((prevTime) => {
                if(!(prevTime.length === 0) && prevTime.includes(time)){
                    currentTime = [];
                    return currentTime;
                }else{
                    currentTime = [];
                    currentTime[0] = time;
                    let startingTimeNum = militaryHours[time].split(':')[0];
                    for(let i = 1; i < hours; i++){
                        let newTime;
                        newTime = parseInt(startingTimeNum) + i;
                        if(newTime < 10){
                            newTime = '0' + newTime;
                        }
                        if(!alteredListOfTimes[index].includes(displayHours[newTime + ":00:00"]) || parseInt(startingTimeNum) + i > 23 ){
                            alert("Error, not enough available time");
                            return [];
                        }else{
                            currentTime[i] = displayHours[newTime +":00:00"];
                        }
                    }
                    alert(JSON.stringify(currentTime));
                    return currentTime;
                }
        }
        );
        setSelectedDate((prevDate) => {
            const newDate = currentTime === null ? null : date;
            alert('selected date: ' + newDate); //for testing purposes
            return UTCtoPST(newDate);
        });

        setSelectedIndex(index)
        alert('index: '+selectedIndex)
    };


    return (
        <>
            <StatusBar backgroundColor={'black'} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.backButton}>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image source={require('./images/logo.png')} style={styles.logo} />
                    </View>
                </View>

                <LinearGradient locations={[0.8, 1]} colors={['#DDA0DD', 'white']} style={styles.linearGradientStyle}>
                    <View style={styles.body}>
                        <View style={styles.appointmentInfoContainer}>
                            <View style={styles.appointmentHeader}>
                                <Text style={styles.appointmentText}>Schedule an Appointment</Text>
                            </View>
                            <View style={styles.appointmentServicesSelected}>
                                <Text style={styles.appointmentText}>Services Selected:</Text>
                                <FlatList
                                    data={services}
                                    renderItem={({ item }) => (
                                        <Text style={styles.appointmentText}>
                                            {item}
                                        </Text>
                                    )}
                                    horizontal={true}
                                />
                            </View>
                            <View style={styles.appointmentDateChosen}>
                                <Text style={styles.appointmentText}>Dates Chosen:</Text>
                                <Text style={styles.appointmentText}>{dateData}</Text>
                                <FlatList
                                    data={dates}
                                    renderItem={({ item }) => (
                                        <Text style={styles.appointmentText}>
                                            {item}
                                        </Text>
                                    )}
                                    horizontal={true}
                                />
                            </View>
                        </View>
                        <View style={styles.availableContainer}>
                            <View style={styles.availableTimesHeader}>
                                <Text style={styles.appointmentText}>Available Times:</Text>
                            </View>
                            <View>
                                <FlatList
                                    data={dummyDates}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <View style={styles.availableViewInFlatList}>
                                            <View style={styles.availableDateContainer}>
                                                <Text style={styles.availableDateText}>{item}</Text>
                                            </View>
                                            <View style={styles.availableTimeContainer}>
                                                <FlatList
                                                    data={alteredListOfTimes[index]}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={({ item }) => (
                                                        <View style={styles.availableTimeCell}>
                                                            <TouchableOpacity
                                                                style={[styles.availableTimeCellButton, { backgroundColor: 'white' }]}
                                                                onPress={() => handleAppointmentPress(item, dummyDates[index], index)}
                                                            >
                                                                <Text style={[styles.availableTimeCellText, { color: !(selectedTime.length === 0) && selectedTime.includes(item) && selectedDate === dummyDates[index] ? 'green' : 'black' }]}>
                                                                    {item}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                    numColumns={4}
                                                    contentContainerStyle={styles.availableTimeContainer}
                                                />
                                            </View>
                                        </View>
                                    )}
                                    contentContainerStyle={styles.availableIterable}
                                />
                            </View>
                            <View style={styles.availableLegendContainer}>
                                <Text style={styles.availableLegendText}>{legendWords[0]}</Text>
                                <View style={styles.availableLegendDotCell}>
                                    <Image source={require('./images/black_dot.png')} style={styles.availableLegendDot} />
                                </View>
                                <Text style={styles.availableLegendText}>{legendWords[1]}</Text>
                                <View style={styles.availableLegendDotCell}>
                                    <Image source={require('./images/green_dot.png')} style={styles.availableLegendDot} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.confirmButtonContainer}>
                            <Pressable
                                style={({ pressed }) => [{
                                    backgroundColor: pressed ? '#D8BFD8' : '#C154C1'
                                },
                                styles.confirmButton
                                ]}
                                onPress = {() => {
                                    let startingTimeNum
                                    try{
                                        startingTimeNum = militaryHours[selectedTime[0]].split(':')[0];
                                    }catch(e){
                                        alert("Error: Invalid time/Date");
                                        return;
                                    }
                                    for(let i = 1; i < hours; i++){
                                        let newTime;
                                        newTime = parseInt(startingTimeNum) + i;
                                        if(newTime < 10){
                                            newTime = '0' + newTime;
                                        }
                                        if(!alteredListOfTimes[selectedIndex].includes(displayHours[newTime + ":00:00"]) || parseInt(startingTimeNum) + i > 23 ){
                                            alert(newTime);
                                            alert("Error, not enough available time");
                                            return;
                                        }
                                    }
                                    for(let j = 0; j < hours; j++){
                                        let newTime;
                                        newTime = parseInt(startingTimeNum) + j;
                                        if(newTime < 10){
                                            newTime = '0' + newTime;
                                        }
                                        const funcObj:funcObj = {
                                            entireFunction: () => database.put('/confirmAppointment', null, {
                                                params:{
                                                    date:selectedDate,
                                                    time:(newTime + ':00:00'),
                                                    userID: userData.userID,
                                                    type: services.split('\'').join('')
                                                }
                                            }),
                                            type: 'put'
                                        };
                                        functionGetRetry(funcObj).then(()=>{alert('success')}).catch(() => alert('error'));
                                    }
                                    }
                                }
                                >
                                {({ pressed }) => (
                                    <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    body: {
    },
    linearGradientStyle:{
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderColor: 'black',
        borderWidth: 1
    },
    header: {
        //alignItems: 'center',
        //height: 220,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // logo styling
    logo: {
        width: 170,
        height: 150,
    },
    logoContainer: {
        //height: 60,
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 10,
        paddingLeft: 30
        //resizeMode: 'contain'
    },
    // back button styling
    backButton: {
        width: 100,
        height: 65,
        paddingLeft: 20,
        paddingTop: 25
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
        alignItems: 'center'
    },
    // Schedule an Appointment styling
    appointmentInfoContainer: {
        alignItems: 'center',
        minHeight: 170,
        justifyContent: 'space-evenly',
        rowGap: 5
    },
    appointmentHeader: {
        paddingTop: 5,
        paddingBottom: 5,
    },
    appointmentText:{
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },
    appointmentServicesSelected: {
        backgroundColor: '#880085',
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    appointmentDateChosen: {
        backgroundColor: '#880085',
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    // Available Times styling
    availableContainer: {
       //paddingTop: 5,
        //paddingBottom: 5
    },
    availableTimesHeader: {
    },
    availableIterable:{
    },
    availableViewInFlatList: {
    },
    availableDateContainer: {
        paddingLeft: 12,
    },
    availableDateText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    availableTimeContainer: {
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    availableTimeCell: {
        width: 80,             //Adjust width to 25% for four buttons per row
        justifyContent: 'center', //center content vertically
        alignItems: 'center',     //center content horizontally
        paddingTop: 5,
        paddingBottom: 5,
    },
    availableTimeCellButton: {
        padding: 5,
        borderRadius: 15,
        alignItems: 'center',
    },
    availableTimeCellText: {
        fontSize: 14
    },
    // legend styling
    availableLegendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: 'space-evenly',
        justifyContent: 'center',
        paddingLeft: 5,
        paddingBottom: 5
    },
    availableLegendText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    },
    availableLegendDotCell: {
        paddingTop: 5,
        paddingLeft: 5,
        paddingRight: 12
    },
    availableLegendDot: {
        width: 10,
        height: 10,
        //paddingTop: 20
    },
    // confirm button styling
    confirmButtonContainer: {
        alignItems: 'center',
        paddingBottom: 10
    },
    confirmButton: {
        //backgroundColor: '#C154C1',
        width: 250,
        justifyContent: 'center',
        borderRadius: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    confirmButtonText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
        //backgroundColor: '#C154C1',
        textAlign: 'center',
        justifyContent: 'center',
        //paddingTop: 5,
        //paddingBottom: 5
    }
});