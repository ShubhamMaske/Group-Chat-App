const sequelize = require('./database');
const Message = require('../models/messages');
const ArchivedChat = require('../models/archivedChat');

exports.moveChatsToArchivedChats = async() => {
    try{
        const chats = await Message.findAll({
            attributes: ['message', 'userId', 'groupId']
        });
        const stringifiedChats = JSON.stringify(chats);

        await ArchivedChat.bulkCreate(JSON.parse(stringifiedChats));
        await Message.destroy({ truncate: true});

    }catch(err){
        console.log(err);
    }

} 