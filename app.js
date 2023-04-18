const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer  = require('multer')
const cron = require('node-cron');
const upload = multer({ dest: 'uploads/' })

const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/groupRoutes');
const imageUploadRoute = require('./routes/imageupload');
const forgotpasswordRoute = require('./routes/forgotpasswordRoutes');



const User = require('./models/users');
const Message = require('./models/messages');
const Group = require('./models/groups');
const userGroup = require('./models/usergroups');
const ArchivedChat = require('./models/archivedChat');


const db = require('./util/database');
const scheduler =require('./util/schedule');

const { Socket } = require('socket.io');
require('dotenv').config();
const app = express();
app.use(cors());

app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


const io = require('socket.io')(8000,{
    cors: {
        origin: ["http://127.0.0.1:5501"]
    }
})

io.on('connection',socket => {
    socket.on("join",groupid => {
        socket.join(groupid)
    })
    socket.on('send-message', (message, groupid) => {
        console.log("send-message calls== ",message);
        socket.broadcast.in(groupid).emit('receivedMsg',message);
    })

        
})


app.use('/user', userRoutes);
app.use('/message',messageRoutes);
app.use('/group',groupRoutes);
app.use('/upload',upload.single("imagefile"),imageUploadRoute);
app.use('/password',forgotpasswordRoute);




app.use((req,res) => {
    console.log("url -> ",req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`));
})


/*   DataBase Relationships     */
User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

Group.belongsToMany(User,{through:userGroup})
User.belongsToMany(Group,{through:userGroup})

User.hasMany(ArchivedChat);
ArchivedChat.belongsTo(User);

Group.hasMany(ArchivedChat);
ArchivedChat.belongsTo(Group);

/*   -----------------------     */

db.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })

cron.schedule('59 59 23 * * *', scheduler.moveChatsToArchivedChats);