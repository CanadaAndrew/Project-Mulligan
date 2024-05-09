import axios from 'axios';
import config from './config'; 

// Create an instance of axios with the configured base URL
const database = axios.create({
    //baseURL: config.apiUrl,
    //baseURL: 'http://10.0.0.119:3000',  // Wilson local
    baseURL: 'http://10.0.0.192:3000',
    //baseURL: 'http://192.168.1.150:3000', //Chris pc local
    //baseURL: 'http://10.0.0.14:3000', //Cameron Local
    //baseURL: 'http://10.0.0.112:3000',
    //baseURL: 'http://192.168.1.33:3000' //dru pc local
    //baseURL: 'http://hair-done-wright530.azurewebsites.net'
    //baseURL: 'http://192.168.68.131:3000' // tai laptop
    //baseURL: 'http://10.0.0.135:3000',

});

export default database;