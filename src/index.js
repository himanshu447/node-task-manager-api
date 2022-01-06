const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

//initizaed Mongoose setup or connect mongo db 
require('./db/mongoose');

const app = express();
const port = process.env.PORT;


app.use(express.json());
//use router that is return by userRouter file exported
app.use(userRouter);
//use router that is return by taskRouter file exported
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server Star into ', port);
});


const Task = require('./models/task');
const User = require('./models/user');


//example of pupulate methods for reference
const main = async () => {

    //find user data based on ownder under Task
    const task = await Task.findById('61d6761119de323310734760');
    console.log(task.owner); // print only owner id only

    //but if what we have to display name of owner so we have to fire one more quey in User collection
    //so reduce that quey call we can set relation b/w users and task table using ref property of mogoose in schema

    await task.populate('owner').execPopulate(); // find entire user based on owner.id
    console.log(task.owner);



    //find Task data based on owner id
    const user = await User.findById('61d6701da27f670268975522');
    console.log(user.myTasks); // print Undefine bcz user collection does not have task data 

    ///for that we care virtual property b/w to entity(user and task)
    //this dones not effect any change in DB bcz is virtual property
    await user.populate('myTasks').execPopulate();
    console.log(user.myTasks);
}

//main();

///RUN MONGO SERVER INTO LOCAL
//....  /Users/HimanshuGandhi/mongoDB/bin/mongod.exe --dbpath=/Users/HimanshuGandhi/mongodb-data 