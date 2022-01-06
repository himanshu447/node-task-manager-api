//----------------------------------initailized mogodb(one way)-----------------------------------------

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID;

//----------------------------------initailized mogodb(second way)-(using advance javaScript deStructuring way)-------------------------------------
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const id = new ObjectID();

MongoClient.connect(connectionURL, { useNewUrlParser: true, }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    //-------------------------------READ SINGLE DOCUMENTS------------------------------------------------------------

    db.collection('tasks').findOne({ _id: ObjectID('61d291990570d818ec3932f5') }, (error, task) => {
        console.log(task);
    });

    //-------------------------------READ MULTIPLE DOCUMENTS------------------------------------------------------------

    db.collection('tasks').find({ completed: true }).toArray((error, task) => {
        console.log(task);
    })

    db.collection('tasks').find({ completed: true }).count((error, task) => {
        console.log(task);
    })


});