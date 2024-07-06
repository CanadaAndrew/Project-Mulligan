import { StyleSheet, Text, View, Pressable, Image, ImageBackground, ScrollView, Button} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import MyCalendar from './MyCalendar';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { TouchableOpacity } from 'react-native-gesture-handler';

const aboutMeText = "HairDoneWright530 is a place for your entire family.  Passion for hair is something I have enjoyed my entire life.  I love color, cut and specialize in Blonding Services.  I believe every client is a masterpiece.  Message me.  Let’s work together to achieve your hair dreams. -Melissa";

export default function AboutMe() {
    return (

<>


<LinearGradient locations={[0.7, 1]} colors={['#DDA0DD', 'white']} style={styles.container}>
<ScrollView>

<View >

</View>

                   
                    <ImageBackground style = {styles.logo} source={require('./images/Melissa.jpg')} imageStyle = {styles.logo} resizeMode='cover'/>
                    <View>
                        <Text>{'\n'}</Text>
                    </View>
                    <Text style={{textAlign: 'center', color: 'white', fontSize: 24, fontWeight: 'bold'}}>Bio</Text>
                    <View>
                        <Text>{'\n'}</Text>
                    </View>
                    <Text style={{color: 'white', fontSize: 18, textAlign: 'center', fontWeight: 'bold'}}>{"\n"}{aboutMeText}</Text>

                    </ScrollView>
                    </LinearGradient>
</>  
)}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
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
        flex: 5,
        height: 100,
        paddingTop: 10,
        paddingBottom: 20,
        paddingLeft: 10,
        //marginTop: 30,
        //backgroundColor: 'grey'
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
        height: 50,
        flex: .2,
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    bottomButton: {
        width: 250
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
      picture:{
       
        resizeMode: 'contain'
      },
      logo: {
        width: 435,
        height: 250,
        alignSelf: 'center'
    }
})