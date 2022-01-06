const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User' //same name as define on user model     
    }
},{
    timestamps : true,
});


taskSchema.pre('save', async function (next) {
    console.log('Task save middleware Run');
    next();
});

const Task = mongoose.model('Task', taskSchema);


module.exports = Task;