const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const userGroup = sequelize.define('usergroup',{
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    isadmin: Sequelize.BOOLEAN
  })

  module.exports = userGroup;