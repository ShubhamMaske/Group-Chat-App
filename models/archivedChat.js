const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const ArchivedChat = sequelize.define('archivedChat', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

module.exports = ArchivedChat;