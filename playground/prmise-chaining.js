require('../src/db/mongoose');
const User = require('../src/models/user');

User.findOneAndUpdate({ _id: '61d2d718bde5702c988fe8a2' }, { age: 1 }).then((user) => {
    console.log(user);

    return User.countDocuments({ age: 1 });
}).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});

const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });

    return { count, user }
};

updateAgeAndCount('61d2eb978f25cd2538e44b33', 5).then((data) => {
    console.log(data);
}).catch((e) => {
    console.log(e);
})