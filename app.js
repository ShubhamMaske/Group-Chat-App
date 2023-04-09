const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');



const User = require('./models/users');
const Message = require('./models/messages');
const Group = require('./models/groups');
const userGroup = require('./models/usergroups');


const db = require('./util/database');
require('dotenv').config();
const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use('/user', userRoutes);
app.use('/message',messageRoutes);
app.use('/group',groupRoutes);


/*   DataBase Relationships     */
User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Group.belongsToMany(User,{through:userGroup})
User.belongsToMany(Group,{through:userGroup})

/*   -----------------------     */

db.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })