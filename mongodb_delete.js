const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {

    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    //-------------------------------DELETE SINGLE DOCUMENTS------------------------------------------------------------
    // db.collection('users')
    //     .deleteOne({
    //         age: 25,
    //     })
    //     .then((result) => console.log(result))
    //     .catch((e) => console.log(e));

    db.collection('tasks')
        .deleteMany({
            completed: false
        })
        .then((result) => console.log(result))
        .catch((e) => console.log(e));

});