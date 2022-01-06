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

    //---------------------------------INSERT DOCUMENTS------------------------------------------------------------

    // db.collection('users')
    //     .insertOne({
    //         name: 'Himu',
    //         age: 25,
    //     }, (error, result) => {
    //         if (error) {
    //             return console.log('Unablew to insert user');
    //         }

    //         console.log(result.ops);
    //     });


    // db.collection('tasks')
    //     .insertMany(
    //         [
    //             {
    //                 description: 'Task One',
    //                 completed: false,
    //             },
    //             {
    //                 description: 'Task Two',
    //                 completed: true,
    //             }, {
    //                 description: 'Task Three',
    //                 completed: false,
    //             }, {
    //                 description: 'Task Four',
    //                 completed: true,
    //             }
    //         ], (error, result) => {
    //             if (error) {
    //                 return console.log('Unable to Insert Records');
    //             }

    //             console.log(result.ops);
    //         }
    //     )


    //-------------------------------READ DOCUMENTS------------------------------------------------------------

    // db.collection('tasks').findOne({ _id: ObjectID('61d291990570d818ec3932f5') }, (error, task) => {
    //     console.log(task);
    // });

    // db.collection('tasks').find({ completed: true }).toArray((error, task) => {
    //     console.log(task);
    // })

    // db.collection('tasks').find({ completed: true }).count((error, task) => {
    //     console.log(task);
    // })


});