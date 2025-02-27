import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Dimensions, SafeAreaView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, {useEffect} from 'react';
import database from './axiosConfig'; // Import axios from the axiosConfig.js file
import Constants from 'expo-constants';
import {funcObj, functionGetRetry, notify, SERVICES} from './Enums/Enums'
import { RootSiblingParent } from 'react-native-root-siblings'

export default function NewClientApproval() {
    const {width, height} = useWindowDimensions();
    const [first, setFirst] = React.useState(0);

    interface Client {
        name: string;
        email: string;
        phoneNumber: string;
        service: string;
        ID: number;
    }

    const [newClient, setNewClient] = React.useState([]); //set to dummyClients for testing
    //let defaultClient: Client[] = [];
    //const [newClient, setNewClient] = React.useState(defaultClient);
    useEffect(() => {
        updateClient();
    }, [])

    // function updateClient() {
    //     let data;
    //     let funcObj:funcObj = {
    //         entireFunction: () => database.get('/customQuery', {
    //             params: {
    //                 query: 'SELECT ServicesWanted.ServiceName, NewClientView.FirstName, NewClientView.LastName, NewClientView.Email, NewClientView.PhoneNumber, NewClientView.ApprovalStatus, NewClientView.UserID FROM ServicesWanted INNER JOIN NewClientView ON ServicesWanted.UserID = NewClientView.UserID WHERE ApprovalStatus = 1;'
    //             }
    //         }),
    //         type: 'get'
    //     };
    //     functionGetRetry(funcObj)
    //     .then((ret) => data = ret.data)
    //     .then(() => { updateClientDisplay(data) })
    //     .catch((error) => { notify(error); });
    // }

    async function updateClient() {
        try {
            const funcObj: funcObj = {
                entireFunction: () => database.get('/getNewClientInfo', {
                    params: {

                    }
                }),
                type: 'get'
            };
            const data = await functionGetRetry(funcObj);
            console.log(data);
            updateClientDisplay(data.data);
        } catch (error) {
            notify(error.toString())
        }
    }

    async function updateClientDisplay(data) {
        console.log(data);
        let clientList: Client[] = [];
        let i = 0;
        let promises = [];
        data.forEach(async (client) => {
            promises[i] = new Promise(async (resolve) =>{
                try{
                const funcObj: funcObj = {
                    entireFunction: () => database.get('/getNewClientInfoServices', {
                        params: {
                            userID: client.UserID
                        }
                    }),
                    type: 'get'
                };
                const data = await functionGetRetry(funcObj);
                let serviceArr = data.data;
                //alert(JSON.stringify(serviceArr));
                let clientServices: string[] = [];
                serviceArr.forEach(serviceEl => {
                    let temp = serviceEl.ServiceName.trim();
                    clientServices.push(SERVICES[temp]['service']);
                });
    
                let newClient: Client = {
                    name: getFullName(client.FirstName, client.LastName),
                    email: client.Email,
                    phoneNumber: client.PhoneNumber,
                    service: clientServices.join(", ").toString(),
                    ID: client.UserID
                }
                clientList[i] = newClient;
                i += 1;
                
            }catch(error){
                notify("Error getting the services of some clients.");
                let newClient: Client = {
                    name: getFullName(client.FirstName, client.LastName),
                    email: client.Email,
                    phoneNumber: client.PhoneNumber,
                    service: "Error",
                    ID: client.UserID
                }
                clientList[i] = newClient;
                i += 1;
            }finally{
                resolve('Done');
            }
        }
        )
        
        })
        await Promise.all(promises);
        setNewClient(clientList);
        //alert("Upcoming List: " + JSON.stringify(appointmentList));
    }

    function getFullName(firstName, lastName) {
        //alert("The name is: " + JSON.stringify(name.data[0].FirstName));
        return firstName + " " + lastName
    }

    //result when admin declines a new client
    const handleDeclineClient = async (client) => {
        console.log(client.name + " Declined"); //for testing purposes
        notify(`${client.name} is Declined`);
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
        notify(`${client.name} has been accepted`);
        const updatedClients = newClient.filter((person) => person.name !== client.name);
        setNewClient(updatedClients);
    }

    return (
        <RootSiblingParent>
        <SafeAreaView>
            <ScrollView>
                <LinearGradient
                    locations={[0.7, 1]}
                    colors={['#DDA0DD', 'white']}
                    //style={{ width: windowDimensions.width, height: windowDimensions.height - 85 }}
                    style={{ width: width, height: height - 85 }}
                >
                    <View style={styles.container}>
                        <FlatList
                            data={newClient}
                            horizontal={true}
                            renderItem={({ item }) => (
                                <View style={[{width: width, height: height}, styles.boxShadowIOS, styles.boxShadowAndroid]}>
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
        </RootSiblingParent>
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
