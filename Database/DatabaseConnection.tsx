//For each query/function, a REST API needs to be created, a way for the frontend of our program to call methods to our backend.
//app.get means the front end will GET stuff from the backend
//app.post means the front end will POST stuff to the backend(read up on the Axion api for more information.)

const sql = require('mssql')
const express = require('express')
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); //middleware to parse JSON request bodies

//Wanted to have these through exports, but exports do not seem to be working, will fix later.
const monthsNum = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
}

const monthsWritten = {
    January: 'January',
    February: 'February',
    March: 'March',
    April: 'April',
    May: 'May',
    June: 'June',
    July: 'July',
    August: 'August',
    September: 'September',
    October: 'October',
    November: 'November',
    December: 'December'
}
/**
 * This is config, it creates an object that stores log information in order to connect to the server.
 * This will be passed on to connect, and if it is valid it will return an object.
 */
const config = {
    user: 'hdw530', // better stored in an app setting such as process.env.DB_USER
    password: '#Recyclingteam', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'hair-done-wright530-server.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'hair-done-wright530-database', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

/**
 * 
 * This function is a template function that shows the basics of connecting and running through the columns/rows.
 */
async function connectAndQuery() {
    try {
        console.log(config.user);
        var poolConnection = await sql.connect(config);
        console.log("Reading rows from the Table...");
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM Clients;`);

        console.log(`${resultSet.recordset.length} rows returned.`);

        // output column headers
        var columns = "";
        for (var column in resultSet.recordset.columns) {
            columns += column + ", ";
        }
        console.log("%s\t", columns.substring(0, columns.length - 2));
        let ret = [];
        let i = 0;
        // ouput row contents from default record set
        resultSet.recordset.forEach(client => {
            console.log("%s\t%s", client.PhoneNumberEmail, client.FirstName, client.LastName, client.PreferredWayOfContact);
            ret[i] = client.PhoneNumberEmail + ' ' + client.FirstName + ' ' + client.LastName + ' ' +client.PreferredWayOfContact +'\n' ;
            console.log(ret[i]);
            i += 1;
        });

        // close connection only when we're certain application is finished
        poolConnection.close();
        return ret;
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

/**
 * This function attempts to connect the database using config.
 * If successful,
 * @returns poolConnection, an object used to request actions to the dbs.
 */
async function connect(){
    try {
        var poolConnection = await sql.connect(config);
        console.log("Connected to the database.");
        return poolConnection;
    }catch(err){
        console.error(err.message);
        throw err;
    }
}

//connect();

/**
 * This takes in a result from the queried database, makes them into objects, and puts them in an array to create an array of those objects.
 * @param resultSet, the queried information not yet sorted into proper arrays. 
 * @returns ret, an array of objects created from the resultSet given.
 */
function sortingResults(resultSet){
    let ret = [];
    let i = 0;
    //For each goes through each row taking one row at a time.
    resultSet.recordset.forEach(object => {
        const arrayObject = {};
        for (var column in resultSet.recordset.columns) {
            arrayObject[column] = object[column];
        }
        ret[i] = arrayObject;
        i += 1;
    })
    return ret;
}

app.get('/queryUsers', (req, res) => queryUsers().then((ret) => res.send(ret)).catch(() => console.log('error')))

/**
 * The general querying for tables are all the same, so I'll comment this one 
 * @returns Array of Objects created from the querry
 */
async function queryUsers(){
    try {
        //First tries to connect to the dbs using the connect method, await is important
        var poolConnection = await connect();
        //Sends a request using the object given from connect, await is important, type in a query command that you would use in SQL
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM Users;`);
        //Closes the connection
        poolConnection.close();
        //Sorts the result into an object array using the method and returns it.
        return sortingResults(resultSet);
    } catch (err) {
        //If any error occurs, it'll throw it over here and print it in console
        console.error(err.message);
        throw err;
    }
}

app.get('/queryClients', (req, res) => queryClients().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryClients(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM ClientView;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryAdmins', (req, res) => queryAdmins().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryAdmins(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM AdminView;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryCurrentClient', (req, res) => queryCurrentClients().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryCurrentClients(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM CurrentClientView;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryNewClient', (req, res) => queryNewClients().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryNewClients(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM NewClientView;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryServicesWanted', (req, res) => queryServicesWanted().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryServicesWanted(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM ServicesWanted;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryAppointments', (req, res) => queryAppointments().then((ret) => res.send(ret)).catch(() => console.log('error')))

async function queryAppointments(){
    try {
        var poolConnection = await connect();
        var resultSet = await poolConnection.request().query(`
        SELECT *
        FROM Appointments;`);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

/**
 * This breaks down the params, getting the string and storing it before calling the query method.
 */
app.get('/customQuery', (req, res) => {
    const query = req.query.query;
    console.log(query);
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(() => err => {
        console.error('Error querying user:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    })
})

//Custom Query is the same as the general queries except that a custom queryString is given.
async function customQuery(queryString){
    try {
        const poolConnection = await connect();
        const resultSet = await poolConnection.request().query(queryString);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

//Formats the date and time before sending it to the method to update the appointments.
//In the future might just format this in the front end and then send it over, might be a lot easier.
app.put('/confirmAppointment', (req, res) => {
    //Gets the date, time, and userID through parameters.
    let date = req.query.date;
    let time = req.query.time;
    let userID = req.query.userID;
    let type = req.query.type

    updateAppointment(date, time, userID, type)
    .then(res.send("Booked."))
    .catch((err) => {
        console.error('Error updating appointments:', err.message);
        res.status(500).send('Internal Server Error');
    });
})

//Takes the formatted date, time, and userID and updates the appointment so it is taken.
async function updateAppointment(date, time, userID, type){
    try {
        var poolConnection = await connect();//
        let query = 'UPDATE Appointments SET VacancyStatus = 1, UserID = \''+ userID + '\', TypeOfAppointment = \''+ type + '\' WHERE AppointmentDate = '+'\''+date+' '+time+'\'';
        console.log(query);
        await poolConnection.request().query(query);
        //await poolConnection.request().query('SELECT * FROM Appointments');
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err;
    }
    
}

app.patch('/updateCurrentClientsAddress', async (req, res) => {
    try {
        const { userID, street, addressLine2, city, stateAbbreviation, zip } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await currentClientsAddressUpdate(userID, street, addressLine2, city, stateAbbreviation, zip);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//updates CurrentClients table with street, city, state, and zip
async function currentClientsAddressUpdate(userID, street, addressLine2, city, stateAbbreviation, zip) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE CurrentClients
            SET Street = '${street}', AddressLine2 = '${addressLine2}', City = '${city}', StateAbbreviation = '${stateAbbreviation}', Zip = '${zip}'
            WHERE UserID = ${userID};`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.patch('/updateUsersEmail', async (req, res) => {
    try {
        const { userID, email } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await usersEmailUpdate(userID, email);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});


//updates Users table with email and phone number
async function usersEmailUpdate(userID, email) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE Users
            SET Email = '${email}'
            WHERE UserID = ${userID};`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.patch('/updateUsersPhone', async (req, res) => {
    try {
        const { userID, phoneNumber } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await usersPhoneUpdate(userID, phoneNumber);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    };
});


//updates Users table with phone number
async function usersPhoneUpdate(userID, phoneNumber) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE Users
            SET PhoneNumber = '${phoneNumber}'
            WHERE UserID = ${userID};`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.patch('/updateCurrentClientsNotes', async (req, res) => {
    try {
        const { userID, clientNotes } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await currentClientsNotesUpdate(userID, clientNotes);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//updates CurrentClients table with client notes
async function currentClientsNotesUpdate(userID, clientNotes) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE CurrentClients
            SET ClientNotes = '${clientNotes}'
            WHERE UserID = ${userID};`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.patch('/updateAppointmentNotes', async (req, res) => {
    try {
        const { userID, appointmentDate, appointmentNotes } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await appointmentNotesUpdate(userID, appointmentDate, appointmentNotes);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//updates Appointments table with appointment notes
async function appointmentNotesUpdate(userID, appointmentDate, appointmentNotes) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE Appointments
            SET AppointmentNotes = '${appointmentNotes}'
            WHERE UserID = ${userID} AND AppointmentDate = '${appointmentDate}';`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.patch('/removeClientAppointment', async (req, res) => {
    try {
        const { appointmentDate, typeOfAppointment, vacancyStatus, appointmentNotes, userID } = req.body;
        if (!appointmentDate) {
            throw new Error('Invalid request body. Missing "apppointmentDate"');
        }
        await removeClientAppointment(appointmentDate, typeOfAppointment, vacancyStatus, appointmentNotes, userID);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//removes client appointment by setting values to original
async function removeClientAppointment(appointmentDate, typeOfAppointment, vacancyStatus, appointmentNotes, userID) {
    try {
        const poolConnection = await connect();
        const query = `UPDATE Appointments
            SET UserID = ${userID}, TypeOfAppointment = ${typeOfAppointment}, VacancyStatus = ${vacancyStatus}, AppointmentNotes = ${appointmentNotes}
            WHERE AppointmentDate = '${appointmentDate}';`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.delete('/deleteServicesWanted', async (req, res) => {
    try {
        const { userID, serviceName } = req.body;
        console.log('userID: ' + userID + ', serviceName: ' + serviceName);
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        await servicesWantedDelete(userID, serviceName);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//updates ServicesWanted table with service name
async function servicesWantedDelete(userID, serviceName) {
    try {
        const poolConnection = await connect();
        const query = `DELETE FROM ServicesWanted 
            WHERE UserID = ${userID} AND ServiceName = '${serviceName}';`;
            console.log(query);
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
};

app.post('/newUserPost', async (req, res) => {
    try {
        const { email, phoneNumber, adminPriv } = req.body;
        if (!email || !phoneNumber || adminPriv === undefined || adminPriv === null) {
            throw new Error('Invalid request body. Missing "email", "phoneNumber", or "adminPriv".');
        }

        //create new user
        const newUser = await newUserPost(email, phoneNumber, adminPriv);
        //send userID in response
        res.status(201).json({ userID: newUser.userID, message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//adds new user to database
async function newUserPost(email, phoneNumber, adminPriv) {
    try {
        const poolConnection = await connect();
        const query = 
            `INSERT INTO Users (Email, PhoneNumber, AdminPriv)
            OUTPUT INSERTED.UserID
            VALUES ('${email}', '${phoneNumber}', ${adminPriv});`;
        const result = await poolConnection.request().query(query);
        poolConnection.close();

        //extract new user ID from result
        const userID = result.recordset[0].UserID;
        return { userID };
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.post('/newClientPost', async (req, res) => {
    try {
        const { userID, firstName, lastName, preferredWayOfContact } = req.body;
        console.log(userID)
        console.log(firstName)
        console.log(lastName)
        console.log(preferredWayOfContact)
        if (!userID || !firstName || !lastName || !preferredWayOfContact) {
            throw new Error('Invalid request body. Missing "userID", "firstName", "lastName", or "preferredWayOfContact".');
        }
        await newClientPost(userID, firstName, lastName, preferredWayOfContact);
        res.status(201).send('Client created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//adds client to database
async function newClientPost(userID, firstName, lastName, preferredWayOfContact) {
    try {
        const poolConnection = await connect();
        const query = 
            `INSERT INTO Clients (UserID, FirstName, LastName, PreferredWayOfContact)
            VALUES (${userID}, '${firstName}', '${lastName}', '${preferredWayOfContact}');`;
            console.log(query);
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.post('/new_newClientPost', async (req, res) => {
    try {
        const { userID, approvalStatus } = req.body;
        if (!userID || approvalStatus === undefined || approvalStatus === null) {
            throw new Error('Invalid request body. Missing "userID" or "approvalStatus".');
        }
        await new_newClientPost(userID, approvalStatus);
        res.status(201).send('New client created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//adds new client to database
async function new_newClientPost(userID, approvalStatus) {
    try {
        const poolConnection = await connect();
        const query = 
            `INSERT INTO NewClients (UserID, ApprovalStatus)
            VALUES (${userID}, ${approvalStatus});`;
            console.log(query);
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.post('/servicesWantedPost', async (req, res) => {
    try {
        const { userID, serviceName } = req.body;
        if (!userID || !serviceName) {
            throw new Error('Invalid request body. Missing "userID" or "serviceName".');
        }
        await servicesWantedPost(userID, serviceName);
        res.status(201).send('Service wanted created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//adds services wanted to database
async function servicesWantedPost(userID, serviceName) {
    try {
        const poolConnection = await connect();
        const query = 
            `INSERT INTO ServicesWanted (UserID, ServiceName)
            VALUES (${userID}, '${serviceName}');`;
            console.log(query);
        await poolConnection.request().query(query);
        poolConnection.close();
    }
    catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.get('/appointmentQuery', async (req, res) => {
    try {
        const { startDate, endDate, vacancyStatus } = req.query;
        if (!startDate) {
            throw new Error('Invalid request. Missing "startTime"');
        }
        if (!endDate) {
            throw new Error('Invalid request. Missing "endTime"');
        }
        if (!vacancyStatus) {
            throw new Error('Invalid request. Missing "vacancyStatus"');
        }
        const result = await appointmentQuery(startDate, endDate, vacancyStatus);
        res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

async function appointmentQuery(startDate, endDate, vacancyStatus){
    try {
        const poolConnection = await connect();
        const query = `SELECT * FROM Appointments 
            WHERE AppointmentDate>='${startDate}' AND AppointmentDate<='${endDate}' 
                AND VacancyStatus=${vacancyStatus};`;
        const resultSet = await poolConnection.request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.post('/addAvailability', async (req, res) => {
    try {
        const { addDateTimeString, vacancyStatus } = req.body;
        if (!addDateTimeString) {
            throw new Error('Invalid request body. Missing "addDateTimeString".');
        }
        if (vacancyStatus === undefined || vacancyStatus === null) {
            throw new Error('Invalid request body. Missing "vacancyStatus".');
        }
        await addAvailability(addDateTimeString, vacancyStatus);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//adds an admin availability date/time to the database
async function addAvailability(addDateTimeString, vacancyStatus) {
    try {
        const poolConnection = await connect();
        poolConnection.setMaxListeners(24);
        const query = `INSERT INTO Appointments (AppointmentDate, VacancyStatus) 
            VALUES ('${addDateTimeString}', ${vacancyStatus});`;
        await poolConnection.request()
            .query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
}

app.post('/currentClientPost', async (req, res) => {
    try {
        const { userID, street, addressLine2, city, state, zip } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        if (!street) {
            throw new Error('Invalid request body. Missing "street"');
        }
        if (!addressLine2) {
            throw new Error('Invalid request body. Missing "addressLine2"');
        }
        if (!city) {
            throw new Error('Invalid request body. Missing "city"');
        }
        if (!state) {
            throw new Error('Invalid request body. Missing "state"');
        }
        if (!zip) {
            throw new Error('Invalid request body. Missing "zip"');
        }
        await currentClientPost(userID, street, addressLine2, city, state, zip);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//add client to CurrentClients
async function currentClientPost(userID, street, addressLine2, city, state, zip) {
    try {
        const poolConnection = await connect();
        const query = `INSERT INTO CurrentClients (UserID, Street, AddressLine2, City, StateAbbreviation, Zip)
            VALUES (${userID}, '${street}', '${addressLine2}', '${city}', '${state}', '${zip}');`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
};

app.post('/currentClientPostNo2', async (req, res) => {
    try {
        const { userID, street, city, state, zip } = req.body;
        if (!userID) {
            throw new Error('Invalid request body. Missing "userID"');
        }
        if (!street) {
            throw new Error('Invalid request body. Missing "street"');
        }
        if (!city) {
            throw new Error('Invalid request body. Missing "city"');
        }
        if (!state) {
            throw new Error('Invalid request body. Missing "state"');
        }
        if (!zip) {
            throw new Error('Invalid request body. Missing "zip"');
        }
        await currentClientPostNo2(userID, street, city, state, zip);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//add client to CurrentClients with no addressLine2
async function currentClientPostNo2(userID, street, city, state, zip) {
    try {
        const poolConnection = await connect();
        const query = `INSERT INTO CurrentClients (UserID, Street, City, StateAbbreviation, Zip)
            VALUES (${userID}, '${street}', '${city}', '${state}', '${zip}');`;
        await poolConnection.request().query(query);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err; // rethrow error so it can be caught in calling code
    }
};


app.delete('/removeAvailability', async (req, res) => {
    try {
        const { removeDateTimeString } = req.body;
        if (!removeDateTimeString) {
            throw new Error('Invalid request body. Missing "removeDateTimeString".');
        }
        await removeAvailability(removeDateTimeString);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//remove availability time slot
async function removeAvailability(removeDateTimeString){
    try {
        const poolConnection = await connect();
        poolConnection.setMaxListeners(24);
        const query = `DELETE FROM Appointments WHERE AppointmentDate='${removeDateTimeString}';`;
        await poolConnection.request()
            .query(query);
        poolConnection.close();   
    } catch (err) {
        console.error(err.message);
        throw err; //rethrow error so it can be caught in calling code
    } 
}

app.post('/appointmentPost', async (req, res) => {
    console.log('received request body: ');
    try {
        const { queryString, values } = req.body;
        if (!queryString || !values) {
            throw new Error('Invalid request body. Missing "queryString" or "values".');
        }
        const result = await appointmentPost(queryString, values);
        res.send(result);
    } catch (error) {
        console.error(error.response.data);
        res.status(400).send('Bad Request');
    }
});

async function appointmentPost(queryString, values){
    try {
        const poolConnection = await connect();
        const resultSet = await poolConnection
            .request()
            .input('AppointmentDate', sql.DateTime2, values.AppointmentDate)
            .input('VacancyStatus', sql.Int, values.VacancyStatus)
            .query(queryString);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err; //rethrow error so that frontend can catch it
    }
}

app.get('/clientHistoryAppointmentsQuery', async (req, res) => {
    try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        if (!startDate) {
            throw new Error('Invalid request. Missing "startDate"');
        }
        if (!endDate) {
            throw new Error('Invalid request. Missing "endDate"');
        }
    //const result = await someAppointmentsQuery(startDate, endDate)
    const result = await clientHistoryAppointmentsQuery(startDate, endDate);
    res.send(result);   
    } catch {
        res.status(400).send('Bad Request');
    }
});

app.get('/selectAppointmentsByTime', async (req, res) => {
    try {
        const beginDay = req.query.beginDay;
        const endDay = req.query.endDay;
        console.log('Begin Day: ', beginDay);
        console.log("endDay: ", endDay);
        if (!beginDay) {
            throw new Error('Invalid requestt. Missing "beginDay"');
        }
        if (!endDay) {
            throw new Error('Invalid request. Missing "endDay"');
        }
    const result = await selectAppointmentsByTime(beginDay, endDay);
    res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

//async function upcomingAppointmentsQuery(startDate, endDate){   
async function clientHistoryAppointmentsQuery(startDate, endDate){
    try {
        const poolConnection = await connect();
        const query = `SELECT FirstName, LastName, AppointmentDate, TypeOfAppointment, Clients.UserID, AppointmentNotes 
            FROM Appointments JOIN Clients ON Appointments.UserID = Clients.UserID 
            WHERE AppointmentDate BETWEEN '${startDate}' AND '${endDate}'`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err; //rethrow error so that frontend can catch it
    }
}

app.get('/queryCurrentUserFromEmail', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error('Invalid request. Missing "email"');
        }
    const result = await queryCurrentUserFromEmail(email);
    res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

app.get('/getNewClientInfo', async (req, res) => {
    try {
        const result = await getNewClientInfo();
        res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

async function getNewClientInfo() {
    try {
        const poolConnection = await connect();
        const query = 'SELECT NewClientView.FirstName, NewClientView.LastName, NewClientView.Email, NewClientView.PhoneNumber, NewClientView.ApprovalStatus, NewClientView.UserID FROM NewClientView WHERE ApprovalStatus = 1;';
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

app.get('/getNewClientInfoServices', async (req, res) => {
    try {
        const userID = req.query.userID;
        console.log(`User ID: ${userID}`);
        let query = `SELECT ServiceName FROM ServicesWanted WHERE UserID = ${userID};`
        console.log(query);
        const result = await customQuery(query);
        res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

async function queryCurrentUserFromEmail(email) {

    try {
        const poolConnection = await connect();
        const query = `SELECT * FROM CurrentClientView WHERE Email = '${email}';`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}

async function selectAppointmentsByTime(beginDay, endDay) {

    try {
        const poolConnection = await connect();
        const query = `SELECT * FROM Appointments WHERE AppointmentDate >= '${beginDay}' AND AppointmentDate <= '${endDay}' AND VacancyStatus = 0;`;
        console.log(query);
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}


async function queryUsersFromEmail(email) {
    try {
        const poolConnection = await connect();
        const query = `SELECT * FROM Users WHERE Email = '${email}';`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

async function queryNewUserFromUserID(userId) {

    try {

        const poolConnection = await connect();
        const query = `SELECT UserID, ApprovalStatus FROM NewClientView WHERE UserID = '${userId}';`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}

app.get('/queryNewUserFromUserID', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            throw new Error('Invalid request. Missing "userId"');
        }
    const result = await queryNewUserFromUserID(userId);
    res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

app.get('/queryUsersFromEmail', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error('Invalid request. Missing "email"');
        }
    const result = await queryUsersFromEmail(email);
    res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});


app.get('/queryNewUserFromEmail', async (req, res) => {
    try {
        const email = req.query.email;
        if (!email) {
            throw new Error('Invalid request. Missing "email"');
        }
    const result = await queryNewUserFromEmail(email);
    res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

async function queryNewUserFromEmail(email) {

    try {
        const poolConnection = await connect();
        const query = `SELECT UserID, ApprovalStatus FROM NewClientView WHERE Email = '${email}';`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err;
    }

}

app.get('/allPastAppointmentsQuery', async (req, res) => {
    try {
        const todaysDate = req.query.todaysDate;
        if (!todaysDate) {
            throw new Error('Invalid request. Missing "todaysDate"');
        }
        const result = await allPastAppointmentsQuery(todaysDate);
        res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

//gets all past appointments
async function allPastAppointmentsQuery(todaysDate){
    try {
        const poolConnection = await connect();
        const query = `SELECT Appointments.UserID, FirstName, LastName, AppointmentDate, TypeOfAppointment, AppointmentNotes 
            FROM Appointments JOIN Clients ON Appointments.UserID = Clients.UserID 
            WHERE AppointmentDate < '${todaysDate}'`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err; //rethrow error so that frontend can catch it
    }
}

app.get('/allUpcomingAppointmentsQuery', async (req, res) => {
    try {
        const todaysDate = req.query.todaysDate;
        if (!todaysDate) {
            throw new Error('Invalid request. Missing "todaysDate"');
        }
        const result = await allUpcomingAppointmentsQuery(todaysDate);
        res.send(result);
    } catch {
        res.status(400).send('Bad Request');
    }
});

//gets all upcoming appointments
async function allUpcomingAppointmentsQuery(todaysDate){
    try {
        const poolConnection = await connect();
        const query = `SELECT Appointments.UserID, FirstName, LastName, AppointmentDate, TypeOfAppointment, AppointmentNotes
            FROM Appointments JOIN Clients ON Appointments.UserID = Clients.UserID 
            WHERE AppointmentDate >= '${todaysDate}';`;
        const resultSet = await poolConnection
            .request()
            .query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    } catch (err) {
        console.error(err.message);
        throw err; //rethrow error so that frontend can catch it
    }
}

app.delete('/customDelete', async (req, res) => { // Provide explicit types for the 'req' and 'res' parameters
    try {
        const { queryString } = req.body;
        if (!queryString) {
            throw new Error('Invalid request body. Missing "queryString".');
        }
        await customDelete(queryString);
        res.status(204).send(); // 204 means success with no content
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

async function customDelete(queryString) {
    try {
      const poolConnection = await connect();
      const resultSet = await poolConnection
        .request()
        .query(queryString);
      poolConnection.close();
      return sortingResults(resultSet);
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

async function checkEmailExists(email) {

    try {

        var poolConnection = await connect();
        var resultSet = await poolConnection.request()
            .input('email', email)
            .query(`
                SELECT TOP 1 *
                FROM CurrentClient
                WHERE Email = @email
            `);
        poolConnection.close();
        return resultSet.rowsAffected > 0;

    } catch (err) {

        console.error(err.message);
        return false;

    }

}

app.get('/getUserIDByEmail', (req, res) => {
    const email = req.query.email;
    getUserIDByEmail(email)
        .then(UserID => {
            if (UserID !== null) {
                res.json({ UserID });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error('Error querying user:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        });
});

async function getUserIDByEmail(email) {

    try {

        var poolConnection = await connect();
        var resultSet = await poolConnection.request()
            .input('email', email)
            .query(`
                SELECT UserID
                FROM CurrentClient
                Where Email = @email
            `);
        poolConnection.close();
        if (resultSet.rowsAffected > 0) {
            return resultSet.recordSet[0].UserID;
        } else {
            return null; //AKA no user user found with provided email
        }
    } catch (err) {
        console.error(err.message);
        return null;
    }

}

app.get('/queryAppointmentByDaySelectedAndVacancy', async (req, res) =>{
    try
    {
        const beginDay = req.query.beginDay;
        const endDay = req.query.endDay;
        if(!beginDay)
        {
            throw new Error("Invalid request. Missing 'beginDay'")
        }
        if(!endDay)
        {
            throw new Error("Invalid request. Missing 'endDay'")
        }
        const result = await QueryAppointmentByDaySelectedAndVacancy(beginDay, endDay);
        res.send(result);
    }
    catch
    {
        res.status(400).send('Bad Request');
    }
});

async function QueryAppointmentByDaySelectedAndVacancy(beginDay, endDay)
{
    try
    {
        const poolConnection = await connect();
        const query = "SELECT * FROM Appointments WHERE AppointmentDate >= '" + beginDay + "' AND AppointmentDate <= '" + endDay + "' AND VacancyStatus = 0;";
        const resultSet = await poolConnection.request().query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
}

app.put('/updateClientApproval', async (req, res) =>{
    try
    {
        const userID = req.query.userID;
        if(!userID)
        {
            throw new Error("Invalid request. Missing 'UserID'")
        }
        await UpdateClientApproval(userID);
        res.send("Completed");
    }
    catch
    {
        res.status(400).send('Bad Request');
    }
    
});

async function UpdateClientApproval(userID)
{
    try
    {
        const poolConnection = await connect();
        const query = "UPDATE NewClients SET ApprovalStatus = 0 WHERE UserID = " + userID + ";"
        await poolConnection.request().query(query);
        poolConnection.close();
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryClientViewWithID', async (req, res) => {
    try
    {
        const userID = req.query.UserID;
        if(!userID)
        {
            throw new Error("Invalid request. Missing 'UserID'")
        }
        const result = await QueryClientViewWithID(userID);
        res.send(result);
    }
    catch
    {
        res.status(400).send('Bad Request');
    }
});

async function QueryClientViewWithID(userID)
{
    try
    {
        const poolConnection = await connect();
        const query = `SELECT * FROM ClientView WHERE UserID = '${userID}';`;
        const resultSet = await poolConnection.request().query(query);
        poolConnection.close();//
        return sortingResults(resultSet);
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryCurrentClientViewWithID', async (req, res) => {
    try
    {
        const userID = req.query.UserID;
        if(!userID)
        {
            throw new Error("Invalid request. Missing 'UserID'")
        }
        const result = await QueryCurrentClientViewWithID(userID);
        res.send(result);
    }
    catch
    {
        res.status(400).send('Bad Request');
    }
});

async function QueryCurrentClientViewWithID(userID)
{
    try
    {
        const poolConnection = await connect();
        const query = `SELECT * FROM CurrentClientView WHERE UserID = '${userID}';`;
        const resultSet = await poolConnection.request().query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
}

app.get('/queryServicesWantedWithID', async (req, res) => {
    try
    {
        const userID = req.query.UserID;
        if(!userID)
        {
            throw new Error("Invalid request. Missing 'UserID'")
        }
        const result = await QueryServicesWantedWithID(userID);
        res.send(result);
    }
    catch
    {
        res.status(400).send('Bad Request');
    }
});

async function QueryServicesWantedWithID(userID){
    try
    {
        const poolConnection = await connect();
        const query = `SELECT * FROM ServicesWanted WHERE UserID = '${userID}';`;
        const resultSet = await poolConnection.request().query(query);
        poolConnection.close();
        return sortingResults(resultSet);
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
}


/**
 * This breaks down the params, getting the string and storing it before calling the query method.
 */
app.get('/queryUpcomingAppointments', (req, res) => {
    const date = req.query.queryDate;
    console.log(date);
    let queryString = "SELECT * FROM Appointments WHERE AppointmentDate >= '" + date + "' AND VacancyStatus = 1";
    customQuery(queryString)
    .then((ret) => res.send(ret))
    .catch(() => res.status(500).json({ error: 'Internal server error' }));
})

app.get('/findEmailByPhoneNumber', (req, res) =>{
    const queryPhoneNumber = req.query.PhoneNumber;
    const query = "SELECT Email FROM Users WHERE PhoneNumber = '" + queryPhoneNumber + "';";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error finding email:', err.message);
        res.status(500).send('Internal Server Error');
    });
})

app.get('/findUserByID', (req, res) =>{
    const queryId = req.query.Id;
    const query = "SELECT * FROM Users WHERE UserID = " + queryId + ";";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying user:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/findUserId', (req, res) =>{
    const emailOrPhoneNum = req.query.EmailOrPhoneNum;
    const query = "SELECT UserID FROM Users WHERE Email = '" + emailOrPhoneNum + "' OR PhoneNumber = '" + emailOrPhoneNum + "';";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying user:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/findCurrentClientByID', (req, res) =>{
    const queryId = req.query.Id;
    const query = "SELECT * FROM CurrentClientView WHERE UserID = " + queryId + ";";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying current client:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/findCurrentClientFullNameByID', (req, res) =>{
    const queryId = req.query.queryId;
    const query = "SELECT FirstName, LastName FROM CurrentClientView WHERE UserID = " + queryId + ";";
    console.log(query);
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying current client:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/findNewClientViewByID', (req, res) =>{
    const queryId = req.query.Id;
    const query = "SELECT * FROM NewClientView WHERE UserID = " + queryId + ";";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying new client:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/findAvailableTimesGivenDate', (req, res) => {
    const date = req.query.date;
    const query =  "SELECT * FROM Appointments WHERE AppointmentDate >= '" + date + "' AND AppointmentDate <= '" + date + " 23:59:59' AND VacancyStatus = 0;";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying available times:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/queryUpcomingAppointmentsByUserIDAndDate', (req, res) =>{
    const date = req.query.date;
    const userID = req.query.userID;
    const query = "SELECT * FROM Appointments WHERE AppointmentDate >= '" + date + "' AND UserID = " + userID +";";
    console.log(query);
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying appointments by user:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/queryPastAppointmentsByUserIDAndDate', (req, res) =>{
    const date = req.query.date;
    const userID = req.query.userID;
    const query = "SELECT * FROM Appointments WHERE AppointmentDate <= '" + date + "' AND UserID = " + userID +";";
    console.log(query);
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying past appointments by user:', err.message);
        res.status(500).send('Internal Server Error');
    })
})

app.get('/queryAllAppointmentsByUserID', (req, res) =>{
    const userID = req.query.userID;
    const query = "SELECT * FROM Appointments WHERE UserID = " + userID +";";
    customQuery(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error querying all appointments:', err.message);
        res.status(500).send('Internal Server Error');
    })
});

app.delete('/deleteNewClientsByUserID', (req, res) =>{
    const userID = req.query.userID;
    const query = `DELETE FROM NewClients WHERE UserID = ${userID}`;
    customQueryNoReturn(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error deleting a new client:', err.message);
        res.status(500).send('Internal Server Error');
    })
});

app.delete('/deleteUsersByUserID', (req, res) =>{
    const userID = req.query.userID;
    const query = `DELETE FROM Users WHERE UserID = ${userID}`;
    customQueryNoReturn(query)
    .then((ret) => res.send(ret))
    .catch(err => {
        console.error('Error deleting a new client:', err.message);
        res.status(500).send('Internal Server Error');
    })
});

async function customQueryNoReturn(queryString){
    try {
        const poolConnection = await connect();
        await poolConnection.request().query(queryString);
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
        throw err;
    }
}

//This opens the server, printing to console 'up' when it is up.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is up and listening on port ${PORT}`);
});