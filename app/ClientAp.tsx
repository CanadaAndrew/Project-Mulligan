import { StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {SafeAreaView} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Link } from 'expo-router';
import { SelectList } from 'react-native-dropdown-select-list';
import MyCalendar from './MyCalendar';
import axios from 'axios';  //Used to get data from the backend nodejs
import { ScrollView } from 'react-native-gesture-handler';


export default function ClientAp({ route }){ 

    const { userData } = route.params;

    //Creates a gateway to the server, make sure to replace with local IP of the computer hosting the backend,
    //in addition remember to turn on backend with node DatabaseConnection.tsx after going into the Database file section in a seperate terminal.
    const database = axios.create({
        //baseURL: 'http://10.0.0.192:3000', //Andrew pc local
        baseURL: 'http://192.168.1.150:3000', //Chris pc local
    })

    interface Appointment {
        name: string;
        service: string;
        date: string;
        stylist: string;
        realDate: Date;
    }
    /*I have genuinely no idea why this function is needed*/
    const handleDatesSelected = (selectedDates: string[]) => {};

    //new list that makes it work better with filtering and acts more like actual data from the database
    let clientAppointmentsDefault: Appointment[] = [
        {
            name: "Will Smith",
            service: "Mens Haircut",
            date: "10/27/23, Fri, 1:00pm",
            stylist: 'Melissa Wright',
            realDate: new Date("2023-10-27")
        },
        {
            name: "Bob Smith",
            service: "Mens Haircut",
            date: "11/27/23, Mon, 2:00pm",
            stylist: 'Melissa Wright',
            realDate: (new Date("2023-11-27"))
        },
        {
            name: "Jane Doe",
            service: "Womens Haircut",
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

    //updateAppointments("2023-12-01")

    /*
    //setting the times like i did in the dummy data makes it a UTC date which will always be 1 day behind PST so i add one to the day
    //possibly need to get rid of this when the data base gets added
    clientAppointments.forEach(val => val.realDate.setDate(val.realDate.getDate() + 1));
    */

    //filteredAps is used as an global array to hold the filtered appointments if there is any that need to be filtered by date
    let filteredApsDef: Appointment[] = [];
    const [filteredAps, setFilteredAps] = React.useState(filteredApsDef);

    const [clientAppointments, setClientAppointments] = React.useState(clientAppointmentsDefault);

    //for the drop down list below
    const [selected, setSelected] = React.useState("All");

    const filter = [
        {key: 'All', value: 'All'},
        {key: 'Today', value: 'Today'},
        {key: 'This Week', value: 'This Week'},
        {key: 'This Month', value: 'This Month'}
    ]


    //will probably remove this when the database is added and just work with the date objects it has in it
    const dateFormat = (date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(2);
        return `${mm}/${dd}/${yy}`;
    }


    const [first, setFirst] = React.useState(0);
    firstUpdate();
    function firstUpdate(){
        if(first === 0 ){
            setFirst(1);
            let date = new Date;
            let dateString = date.toISOString(); //NOTE THAT THE DATE IS CURRENTLY OFF, NEED TO FIX IN ANOTHER SPRINT
            updateAppointments(dateString.split("T")[0]);
        }
    }
    //Updates the upcoming appointments given a date.
    function updateAppointments(date){
        let data;
        database.get('/queryUpcomingAppointments', {
            params: {
                queryDate : date 
            }
        })
        .then((ret) => data = ret.data)
        .then(() => {updateAppointmentsDisplay(data)})
        .catch(() => {alert("error");});
    }

    async function updateAppointmentsDisplay(data){
        let appointmentList : Appointment[] = [];
        let i = 0;
        const promises = [];
        let names = [];
        data.forEach(async (appointment) => {
            let dateTimeArray = appointment.AppointmentDate.split("T");
            let newDate = dateTimeArray[0];
            let newTime = dateTimeArray[1].split("Z")[0];
            if(names[appointment.UserID] == null){
                let name = getName(appointment.UserID);
                promises.push(name);
                names[appointment.UserID] = name;
            }
            let completeName = await names[appointment.UserID]; 
            let newAppointment : Appointment = {
                name: completeName,
                service: appointment.TypeOfAppointment,
                date: newDate + ", " + newTime,
                stylist: 'Melissa Wright',
                realDate: new Date(newDate)
            }
            appointmentList[i] = newAppointment;
            i++;
        }
        )
        await Promise.all(promises);
        setClientAppointments(appointmentList);
        handleSelection(selected, appointmentList);
    }

    //Work on another sprint. Query for name instead of having userID as name.
    async function getName(userID){
        let name = await database.get('/findCurrentClientFullNameByID', {
            params: {
                queryId : userID 
            }
        })
        if(name.data[0].MiddleName == null){
            return name.data[0].FirstName + " " + name.data[0].LastName;
        }else{
            return name.data[0].FirstName + " " + name.data[0].MiddleName + " " + name.data[0].LastName
        }
    }
    //handleSelection is called whenever a change is made in the drop down menu. It is passed the key value from the filter array above
    //it then decides which filtering option to use on the data based upon the key that it is passed in this function
    //it modifies the filteredAps global array and passes it back to the flatlist down below and the flatlist displays what was filtered
    function handleSelection(selected, clientAppointments) {
        let temp: Appointment[] = [];
        if(selected == 'All')
        {
            //this just grabs all appointments available in the database
            clientAppointments.forEach(val => temp.push(Object.assign({}, val)));
            setFilteredAps(temp);
            //alert(filteredAps[0].realDate.toLocaleDateString());
            //const curDay = new Date();
            //alert(curDay.toLocaleDateString())
        }
        else if(selected == 'Today')
        {
            //this filters out the appointments that are not today

            //making a new date object with the systems current time
            const curDay = new Date();

            //filters the appointments by adding the appointments that have the date in the date string, to the filteredAps array
            //with a temp array as a mediator because javascript is stupid and won't let me copy directly over between the two
            //this line converts both dates to strings(mm/dd/yyy) and compares them storing the ones that are the same in temp
            temp = clientAppointments.filter((item) => item.realDate.toLocaleDateString() === curDay.toLocaleDateString());
            //temp.forEach(val => filteredAps.push(Object.assign({}, val)));
            setFilteredAps(temp);

        }
        else if(selected == 'This Week')
        { 
            //kinda the same thing as filtering by today but a little more in depth getting todays date from the system and
            //calculating the first and last days of the week for comparison down below
            const today = new Date();
            const firstDayOfWeek = new Date(today);
            const lastDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay());
            lastDayOfWeek.setDate(today.getDate() + (6 - today.getDay()));

            //making another temp array
            
            
            //this filters the client appointments using the Date Objects instead of strings similar to what was done for 
            //filter by today
            temp = clientAppointments.filter((item) => {
                return item.realDate >= firstDayOfWeek && item.realDate <= lastDayOfWeek;
            })

            //copies each value of temp into the global filteredAps array
            //temp.forEach(val => filteredAps.push(Object.assign({}, val)));
            setFilteredAps(temp);
        }
        else if(selected == "This Month")
        {
            //very similar to filter by week except you are getting the first and last day of the month instead of the week
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);


            //filtering out appointments that aren't in this month
            temp = clientAppointments.filter((item) => {
                return item.realDate >= firstDayOfMonth && item.realDate <= lastDayOfMonth;
            });

            //copies each value of temp into the global filteredAps array
            temp.forEach(val => filteredAps.push(Object.assign({}, val)));
            setFilteredAps(temp);
        }
    }

    return(
      <ScrollView>
        <LinearGradient
        locations = {[0.7, 1]}
        colors = {['#EB73C9','white']}
        style = {styles.container}>
            <View style = {styles.container}>
                <View style = {styles.backButton}></View>
            </View>
            
            <View>

                <SafeAreaView style={styles.calendar}>

                <MyCalendar pageName='ClientAp' onDatesSelected={handleDatesSelected} disabled={true}/>
                
                </SafeAreaView>

            </View>

            <View>
                <Text >{'\n'}</Text>
            </View>

            {/*drop down list formatting and rendering */}
            <View style = {styles.dropdowncont}>
                <SelectList
                    setSelected = {(val) => setSelected(val)}
                    data={filter}
                    boxStyles = {{backgroundColor:'white'}}
                    dropdownStyles = {{backgroundColor:'white'}}
                    save = 'value'
                    search = {false}
                    defaultOption = {{key: 'All', value: 'All'}}
                    onSelect = {() => handleSelection(selected, clientAppointments) }
                    
                />
            </View>
        

            {/* flat list is replacing the hard coded list from before as this can work with database data and print out the entire
            list at once */}
            <FlatList
                data = {filteredAps}
                horizontal = {true}
                renderItem = {({item}) => (
                    <View style = {[styles.appointBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                    <View style = {styles.textAlignment}>
                        <Text style = {styles.appointText}>Customer:</Text>
                        <Text style = {styles.appointText}> {item.name}</Text>
                    </View>
                    <View style = {styles.textAlignment}>
                        <Text style = {styles.appointText}>Service:</Text>
                        <Text style = {styles.appointText}>{item.service}</Text>
                    </View>
                    <View style = {styles.textAlignment}>
                        <Text style = {styles.appointText}>Date:</Text>
                        <Text style = {styles.appointText}>{item.date}</Text>
                    </View>
                    <View style = {styles.textAlignment}>
                        <Text style = {styles.appointText}>Stylist:</Text>
                        <Text style = {styles.appointText}>{item.stylist}</Text>
                    </View>
                </View>
                )}
            />
            <View style = {styles.container}>
                <View style = {styles.bottomBackGround}></View>
            </View>
        </LinearGradient>
      </ScrollView> 
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
    calendar: {
        flex: 0,
        height: 200,
        backgroundColor: 'white',
        marginBottom: 80,

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
        margin: 20,
        borderRadius: 20,
        //alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 3,

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
        paddingBottom: 10,
        margin: 5,
        marginBottom: 30,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 0.5,
        shadowRadius: 3
    },
    // fix grey space under dropdown menu
    bottomBackGround: {
        height: 350
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
    //dropdown menu styles
    dropdowncont: {
        padding: 16
    },
})

