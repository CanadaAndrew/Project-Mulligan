import axios from 'axios';

// Retrieve server URL from the .env file
const serverUrl = process.env.SERVER_URL;

// Create an instance of axios with the configured base URL
const database = axios.create({
    //baseURL: serverUrl,
    //baseURL: 'http://10.0.0.119:3000',  // Wilson local
    //baseURL: 'http://10.0.0.192:3000',
    //baseURL: 'http://192.168.1.150:3000', //Chris pc local
    //baseURL: 'http://10.0.0.14:3000', //Cameron Local
    baseURL: 'http://10.0.0.112:3000',
    //baseURL: 'http://127.0.0.1:5500' //dru pc local
});

export default database;