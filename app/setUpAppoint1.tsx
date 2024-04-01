import { StyleSheet, Text, View, Pressable, Image, ImageBackground, ScrollView, Button} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import MyCalendar from './MyCalendar';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRef } from 'react';

//made this available for all pages in the app
export let hairStyleSelected: string[] = [];

//Variable is interchangeable in terms of function with the calendar
const calendarContainerRef = useRef(null);

//I made this function to try and render the dates separately from the component. Didn't seem to work
//but is worth leaving for now
const renderSelectedDates = () => {
    const markedDates = calendarContainerRef.current?.markedDates;

    if (!markedDates) {
      return null;
    }
}

export default function setUpAppoint1({navigation, route}) { // add navigation to default function for data transfer between pages

    const { userData } = route.params;
    //{ route }, { navigation }
    //useState for drop down menu
    const [selected, setSelected] = React.useState("");

    //options for drop down menu
    const hairOptions = [
        {key: 'MENS_HAIRCUT', value: 'Mens Haircut'},
        {key: 'WOMANS_HAIRCUT', value: 'Womens Haircut'},
        {key: 'KIDS_HAIRCUT', value: 'Kids Haircut'},
        {key: 'PARTIAL_HIGHLIGHT', value: 'Partial Highlight'},
        {key: 'FULL_HIGHLIGHT', value: 'Full Highlight'},
        {key: 'ROOT_TOUCH_UP', value: 'Root Touch Up'},
        {key: 'FULL_COLOR', value: 'Full Color'},
        {key: 'EXTENSION_CONSULTATION', value: 'Extension Consultation'},
        {key: 'EXTENSION_INSTALLATION', value: 'Extension Installation'},
        {key: 'EXTENSION_MOVE_UP', value: 'Extension Move-Up'},
        {key: 'MAKEUP', value: 'Make-Up'},
        {key: 'SPECIAL_OCCASION_HAIRSTYLE', value: 'Special Occasion Hairstyle'},
        {key: 'PERM', value: 'Perm'},
        {key: 'DEEP_CONDITIONING_TREATMENT', value: 'Deep Conditioning Treatment'},
        {key: 'BLOW_DRY_AND_STYLE', value: 'Blow Dry and Style'},
        {key: 'WAXING', value: 'Waxing'}
    ];
        
    /*I have genuinely no idea why this function is needed*/
    const handleDatesSelected = (selectedDates: string[]) => {};

    

    //the hairStyleSelected string array that is able to be given to different pages
    //let hairStyleSelected: string[] = [];

    //function that handles the selection of the drop down menu
    //converts selected items to a string so it is 100% a string, splits selected based on "," and stores
    //them in the global hairStyleSelected array
    function handleHairSelection(selected)
    {
        let temparr: string[] = [];

        var temp = selected.toString();
        temparr = temp.split(",");
        hairStyleSelected = temparr;
    }

    return(
        <>
        <ScrollView>
          <View style = {styles.container}>

            {/*added logo image use imagebackground in order for back button to overlap image*/}
            <ImageBackground
              style = {styles.logo}
              source={require('./images/Hair_Done_Wright_LOGO.png')}
            >
            </ImageBackground>


            {/*linear gradient for background */}
            <LinearGradient
              locations = {[0.7, 1]}
              colors = {['#DDA0DD', 'white']}
              style = {styles.background}
              >
            <View style = {styles.background}>

                <Text style = {styles.objectTitle}> Schedule an Appointment</Text>

                {/*
                -----multiple select drop down list-----
                this is kinda cool because it concatinates every selection onto the next as a CSV-like object and it takes them off
                in order automatically if you deselect the item. handles the selection up above
                */}
                <View>
                    <MultipleSelectList
                        setSelected = {(val) => setSelected(val)}
                        data={hairOptions}
                        boxStyles = {styles.dropDown}
                        dropdownStyles = {{backgroundColor:'white'}}
                        badgeStyles = {styles.badgeStyle}
                        maxHeight = {270}
                        save = 'key'
                        search = {false}
                        label = "Hair Options"
                        placeholder = "Hair Options"
                        onSelect = {() => handleHairSelection(selected) }
                    />
                </View>

                <Text style = {styles.objectTitle}>Select Preferred Days:</Text>

                {/*Basic calendar implementation. Currently logs selected dates to the console and highlights them.*/
                /*Setting disabled to true will disable the higlighting feature.*/}
                <View style = {[styles.dummyCalendar, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                    <MyCalendar pageName='setUpAppoint1' onDatesSelected={handleDatesSelected} disabled={false} ref={calendarContainerRef}/>
                </View>

                {/*appointment button no functionality yet*/}
                {/*<View style = {styles.appointmentButton}>
                  <Pressable
                    style = {({ pressed }) => [{ backgroundColor: pressed ? '#C154C1' : '#BE42B2'}, styles.appointButtonText ]}>
                        {({ pressed }) => (
                        <Link href = "/ClientAp">
                            <Text style = {styles.appointButtonText}>Schedule Appointment</Text>  
                        </Link>)}
                  </Pressable>
                        </View> */}

                {/*appointment button can send data over to setupAppointemnt2 currently
                only sending data for hairstyles, data for dates is placeholder data for now*/}
                <View>
                    <TouchableOpacity
                        style={styles.appointmentButton}
                        onPress={() => {
                            const selectedDates = calendarContainerRef.current?.markedDates;
                            navigation.navigate('setupAppointment2', { 
                            userData,
                            hairStyleData: hairStyleSelected.join(', '),
                            dateData: selectedDates.join(', '),
                            });
                            }}>
                        <Text style={styles.appointButtonText}>Schedule Appointment</Text>
                    </TouchableOpacity>

                </View>

            </View>
            </LinearGradient>

          </View>
        </ScrollView>
        </>
    );
}


const styles = StyleSheet.create({
    container:{
        borderRadius: 90
    },
    // title styling for dropdown menu and calendar 
    objectTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white'
    },
    // temporary dummy drop down
    dropDown: {
        backgroundColor: 'white',
        margin: 15,
        paddingTop: 10,
        //paddingBottom: 10,
        //paddingRight: 150,
        //paddingLeft: 100,
        padding: 100
    },
    // temporary dummy calendar
    dummyCalendar: {
        backgroundColor: 'white',
        margin: 15,
        paddingTop: 5,
        paddingBottom: 50,
        paddingLeft: 50,
        paddingRight: 50,
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
    // schedule appointment button style
    appointmentButton: {
        width: 350, //
        height: 50, //
        paddingTop: 15,
        margin: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        //alignItems: 'center',
        //backgroundColor: '#C154C1',
        backgroundColor: '#BE42B2',
        borderRadius: 20,
    },
    // schedule appointment button text style
    appointButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20,
        //paddingTop: 5,
        //paddingBottom: 5,
        //alignItems: 'center'
        

    },
    badgeStyle: {
        textAlign: 'center',
        backgroundColor: '#C154C1',
    }
})