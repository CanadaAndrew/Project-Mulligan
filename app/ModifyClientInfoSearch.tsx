import { StyleSheet, Text, TextInput, View, ScrollView, FlatList, TouchableOpacity, Dimensions, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import axios from 'axios';
import { SearchBar } from 'react-native-screens';
import { SelectList } from 'react-native-dropdown-select-list';

const windowDimensions = Dimensions.get('window')

export default function ModifyClientInfoSearch({navigation, route}) {

    //const navigation = useNavigation<any>(); //Initialize navigation hook

    const windowDimensions = Dimensions.get('window')
    const database = axios.create({
        //baseURL: 'http://10.0.0.119:3000',  // Wilson local
        //baseURL: 'http://10.0.0.192:3000',
        baseURL: 'http://192.168.1.150:3000', //Chris pc local
        //baseURL: 'http://10.0.0.14:3000', //Cameron Local
        //baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
    })

    const handleNamePress = async (item) => {
        let id; //Temporary variable to send to next page

        //Loops and compares objects queried to find user id
        let i = 0;
        while (i < clientList.length) {
            if (clientList[i].FirstName + ' ' + clientList[i].MiddleName + ' ' + clientList[i].LastName == item) {
                id = clientList[i].UserID;
                console.log(id); //Test to confirm correct ID
                break;
            }
            i++;
        }

       try {
            //Navigate to the next page, passing client id as a parameter. Right now set to navigate to home
            navigation.navigate("NaviagateHome", { id });
        } catch (error) {
            console.error('Error fetching client information:', error);
        }
    };


    const [nameInput, newNameInput] = React.useState('');
    const [clientList, setClientList] = React.useState([]);
    const [firstLetterArr, setFirstLetterArr] = React.useState([]);
    const [clientList2, setClientList2] = React.useState([[]]);

    const handleNameSearch = () => {

        const filteredClients = clientList2.map(clientArray =>
           clientArray.filter(clientName => clientName.toLowerCase().includes(nameInput.toLowerCase())) 
        );
        setClientList2(filteredClients);
    };

    async function displayClientList(selectedOption)
    {
        let clientNames: string[] = [];
        let tempFirstLetterArr: string[] = [];
        let tempNameArr: string[][] = [];
        let response = await database.get('/queryClients');

        let clientData = response.data;
        let client1;

        console.log(selectedOption);
        //sorts clientData based on the dropdown menu. Ascending(A-Z) is the default option.
       if(selectedOption == 'Ascending') 
        clientData.sort((a, b) => a.FirstName.localeCompare(b.FirstName));
        else if(selectedOption == 'Descending')
        clientData.sort((a, b) => a.FirstName.localeCompare(b.FirstName)).reverse(); // reverse flips the array to Z-A
      
        //this loop makes the array of all the first letters in first names to be used to sort the list later.
        for(client1 in clientData)
        {
            let firstLetter = clientData[client1].FirstName[0];
            if(tempFirstLetterArr.find(o => o === firstLetter) == null)
            {
                tempFirstLetterArr.push(firstLetter);
            }
        }

        //loop that makes a string array with only the names of the clients and nothing else.
        let iterable;
        for(iterable in clientData)
        {
            let name = clientData[iterable].FirstName + " " + clientData[iterable].MiddleName + " " + clientData[iterable].LastName;
            clientNames.push(name);
        }

        //set two variables to use in the loop down below
        let temp: string[] = [];
        let currentLetter = '';
        //this loop splits clientData up into multiple seperate arrays that have first names all beginning with the same letter.
        for(let client of clientNames)
        {
            //a first letter var that holds the first letter of the clients first name
            const firstLetter = client.charAt(0);
            
            //if first letter != current letter then check to see if temp has anything in it. if it does then push whatever is in temp
            //to the temp array of arrays then set the current letter to the first letter and temp to the name of client to use
            //in the next loop
            if(firstLetter != currentLetter)
            {
                if(temp.length > 0)
                {
                    tempNameArr.push(temp);
                }
                currentLetter = firstLetter;
                temp = [client];
            }
            //else if they are equal just push the clients name to temp.
            else if(firstLetter == currentLetter)
            {
                temp.push(client)
            }
        }

        //after loop finishes if temp has anything in it make sure to push whatever is in it to the temp array of arrays
        if(temp.length > 0)
        {
            tempNameArr.push(temp);
        }

        //setting all the lists that are needed for displaying
        setClientList2(tempNameArr);
        setFirstLetterArr(tempFirstLetterArr);
        setClientList(clientData);

    }

    useEffect(() => {
        displayClientList('firstNameAscending');
    }, []);
    
     //for the drop down list below
     const [selected, setSelected] = React.useState(" ");

     const dropdownList = [
         {key:  'Ascending', value:'Ascending'},
         {key: 'Descending', value: 'Descending'},
        
     ]

     
    return (
        <SafeAreaView>
            <ScrollView> 
            
            <LinearGradient
                locations={[0.7, 1]}
                colors={['#DDA0DD', 'white']}
                //style={{ width: windowDimensions.width, height: windowDimensions.height - 85 }}
                style={{ width: useWindowDimensions().width, height: useWindowDimensions().height - 85 }}
            >
                <View style={styles.container}>
                    <View style={[styles.searchBarContainer, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                        <TextInput
                            style={styles.textField}
                            value={nameInput}
                            onChangeText={newNameInput}
                            onTextInput={() => handleNameSearch()}
                            placeholder="Search"
                        />
                    </View>

                    <View style = {styles.dropdowncont}>
                <SelectList
                    setSelected = {(val) => setSelected(val)}
                    data={dropdownList}
                    boxStyles = {{backgroundColor:'white'}}
                    dropdownStyles = {{backgroundColor:'white'}}
                    save = 'value'
                    search = {false}
                    defaultOption = {{key: 'Ascending', value: 'Ascending'}}
                    onSelect = {() => displayClientList(selected)  } //rebuild the list in ascending/descending order
                    
                />
            </View>

                    <View>
                        <FlatList
                            data={firstLetterArr}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <View>
                                    <View style={styles.availableLetterContainer}>
                                        <Text style={styles.availableLetterText}>{item}</Text>
                                    </View>
                                    <View style={styles.availableNameContainer}>
                                        <FlatList
                                            data = {clientList2[index]}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({item}) => (
                                                <View style={[styles.nameContainer, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                                    <TouchableOpacity
                                                        style={styles.nameButton}
                                                        onPress={() => handleNamePress(item)}
                                                        
                                                        >

                                                        <Text style={styles.nameText}>{item}</Text>  

                                                    </TouchableOpacity>

                                                </View>
                                            )}
                                        />
                                    </View>
                                </View>
                            )}
                                style={{height: useWindowDimensions().height*.78}}
                        />
                    </View>
                </View>
            </LinearGradient>
            </ScrollView>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        rowGap: 10,
        paddingVertical: 30
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
        elevation: 5
    },

    // search bar
    searchBarContainer: {
        alignItems: 'center'
    },
    textField: {
        backgroundColor: '#D3D3D3',
        color: 'black',
        fontWeight: 'bold',
        width: '90%',
        height: 50,
        borderRadius: 15,
        padding: 10,
        fontSize: 20
    },

    // names
    nameContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        rowGap: 10,
    },
    nameButton: {
        padding: 10,
    },
    nameText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    nameLine: {
        borderTopColor: 'black',
        borderTopWidth: 1
    },
    availableLetterContainer: {
        paddingLeft: 12,
    },
    availableLetterText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    availableNameContainer: {
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    dropdowncont: {
        padding: 16
    },

})
