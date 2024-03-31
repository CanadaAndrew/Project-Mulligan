import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Dimensions, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, {useEffect} from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import {funcObj, functionGetRetry} from './Enums/Enums'

export default function NewClientApproval() {

    const windowDimensions = Dimensions.get('window')

    //server connection
    const database = axios.create({
        //baseURL: 'http://hair-done-wright530.azurewebsites.net', //Azure server
        //baseURL: 'http://192.168.1.150:3000', //Chris pc local
        baseURL: 'http://10.0.0.192:3000'
    });


    const [first, setFirst] = React.useState(0);

    interface Client {
        name: string;
        email: string;
        phoneNumber: string;
        service: string;
        ID: string;
    }

    //dummy data for testing
    /*const dummyClients: Client[] = [
        {
            name: 'John Doe',
            email: 'john@doe.com',
            phoneNumber: '123-456-7890',
            service: 'Haircut'
        },
        {
            name: 'Jane Doe',
            email: 'jane@doe.com',
            phoneNumber: '123-456-7890',
            service: 'Nails'
        }
    ];*/
    const [newClient, setNewClient] = React.useState([]); //set to dummyClients for testing
    //let defaultClient: Client[] = [];
    //const [newClient, setNewClient] = React.useState(defaultClient);
    useEffect(() => {
        updateClient();
    }, [])
     //old code replaced with useEffect Hook ^^^
    /*firstUpdate();
    async function firstUpdate() {
        if (first === 0) {
            setFirst(1);
            //let name = await getName(5);
            //updateClient(1, name); //Note that currently using ID 1 until the use of UserID transfer comes in
            updateClient(5);
        }
    }*/

    function updateClient() {
        let data;
        let funcObj:funcObj = {
            entireFunction: () => database.get('/customQuery', {
                params: {
                    query: 'SELECT ServicesWanted.ServiceName, NewClientView.FirstName, NewClientView.MiddleName, NewClientView.LastName, NewClientView.Email, NewClientView.PhoneNumber, NewClientView.ApprovalStatus, NewClientView.UserID FROM ServicesWanted INNER JOIN NewClientView ON ServicesWanted.UserID = NewClientView.UserID WHERE ApprovalStatus = 1;'
                }
            }),
            type: 'get'
        };
        functionGetRetry(funcObj)
        .then((ret) => data = ret.data)
        .then(() => { updateClientDisplay(data) })
        .catch(() => { alert("error"); });
    }

    function updateClientDisplay(data) {
        alert("Here is the data: " + JSON.stringify(data));
        let clientList: Client[] = [];
        let i = 0;
        data.forEach((client) => {
            let newClient: Client = {
                name: getFullName(client.FirstName, client.MiddleName, client.LastName),
                email: client.Email,
                phoneNumber: client.PhoneNumber,
                service: client.ServiceName,
                ID: client.UserID
            }
            clientList[i] = newClient;
            i += 1;
        })
        setNewClient(clientList);
        //alert("Upcoming List: " + JSON.stringify(appointmentList));
    }

    function getFullName(firstName, middleName, lastName) {
        //alert("The name is: " + JSON.stringify(name.data[0].FirstName));
        if (middleName == null) {
            return firstName + " " + lastName
        } else {
            return firstName + " " + middleName + " " + lastName
        }
    }

    //result when admin declines a new client
    const handleDeclineClient = async (client) => {
        console.log(client.name + " Declined"); //for testing purposes
        alert(`${client.name} is Declined`);
        const updatedClients = newClient.filter((person) => person.name !== client.name);  //remove declined client from list
        setNewClient(updatedClients);
    }
    
    const handleAcceptClient = async (client) => {
        let funcObj:funcObj = {
            entireFunction: () => database.put('/updateClientApproval', null, {
                params: {
                    userID: client.ID
                }
            }),
            type: 'put'
        };
        functionGetRetry(funcObj)
        alert(`${client.name} has been accepted`);
        const updatedClients = newClient.filter((person) => person.name !== client.name);
        setNewClient(updatedClients);
    }

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
                        <FlatList
                            data={newClient}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <View style={[styles.clientBox, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                    <View style={styles.nameContainer}>
                                        <View style={styles.nameButton}>
                                            <Text style={styles.nameText}>{item.name}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.infoContainer, styles.boxShadowIOS, styles.boxShadowAndroid]}>
                                        <View>
                                            <Text style={styles.sectionText}>Email</Text>
                                            <Text style={styles.appointText}>{item.email}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.sectionText}>Phone Number</Text>
                                            <Text style={styles.appointText}>{item.phoneNumber}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.sectionText}>Preferred Services</Text>
                                            <Text style={styles.appointText}>{item.service}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.buttonStyling}
                                            onPress={() => handleAcceptClient(item)}>
                                            <Text style={styles.buttonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.buttonStyling}
                                            onPress={() => handleDeclineClient(item)}>
                                            <Text style={styles.buttonText}>Decline</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />


                    </View>
                </LinearGradient>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        rowGap: 20,
        paddingVertical: 30,
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
    // every box per client
    clientBox: {
        width: useWindowDimensions().width,
        height: useWindowDimensions().height,
        //margin: 20,
        //borderRadius: 20,
        //alignItems: 'center',
        //paddingVertical: 15,
        //paddingHorizontal: 3,
    },
    // white information block
    infoContainer: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 3,
        rowGap: 10
    },
    // appointment text information 
    appointText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    // pink colored section text
    sectionText: {
        color: '#BE42B2',
        fontWeight: 'bold',
        fontSize: 18,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
    // name container
    nameContainer: {
        alignItems: 'center'
    },
    nameButton: {
        width: 300,
        height: 60,
        paddingTop: 14,
        margin: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: '#BE42B2',
        borderRadius: 20,
    },
    nameText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        borderRadius: 20
    },
    // button container
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonStyling: {
        width: 150,
        height: 50,
        paddingTop: 12,
        margin: 5,
        shadowColor: 'black',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: '#BE42B2',
        borderRadius: 20,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        borderRadius: 20
    }
})
