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

    //---------------------------------INSERT SINGLE DOCUMENTS------------------------------------------------------------

    db.collection('users')
        .insertOne({
            name: 'Himu',
            age: 25,
        }, (error, result) => {
            if (error) {
                return console.log('Unablew to insert user');
            }

            console.log(result.ops);
        });


    //---------------------------------INSERT MULTIPLE DOCUMENTS------------------------------------------------------------

    db.collection('tasks')
        .insertMany(
            [
                {
                    description: 'Task One',
                    completed: false,
                },
                {
                    description: 'Task Two',
                    completed: true,
                }, {
                    description: 'Task Three',
                    completed: false,
                }, {
                    description: 'Task Four',
                    completed: true,
                }
            ], (error, result) => {
                if (error) {
                    return console.log('Unable to Insert Records');
                }

                console.log(result.ops);
            }
        )
});