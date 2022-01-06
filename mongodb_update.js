const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    //-------------------------------UPDATE SINGLE DOCUMENTS------------------------------------------------------------

    db.collection('tasks')
        .updateOne(
            { _id: ObjectID('61d291990570d818ec3932f5') },
            { $set: { completed: false } }
        )
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        });

    //-------------------------------UPDATE MULTIPLE DOCUMENTS------------------------------------------------------------

    // db.collection('tasks')
    //     .updateMany(
    //         { completed: false },
    //         {
    //             $set: { completed: true }
    //         }
    //     ).then((result) => {
    //         console.log(result.modifiedCount);
    //     })
    //     .catch((e) => {
    //         console.log(e);
    //     })
});