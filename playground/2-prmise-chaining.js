require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndRemove('61d2cb5a7a32034b947e1495')
    .then((task) => {
        console.log(task);
        return Task.countDocuments({ completed: false });
    }).then((count) => {
        console.log(count);
    }).catch((e) => {
        console.log(e);
    });

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });

    return { task, count };
}


deleteTaskAndCount('61d2c9949dcd700238567fd1').then((data) => {

    console.log('------------------------------SUCCESS------------------------');
    console.log(data);
}).catch((e) => {
    console.log('ERROR-> ', e);
});