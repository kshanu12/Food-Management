const { Sequelize, DataTypes } = require('sequelize');

const db = require('../config/database');

const Menu = db.define('menu', {
        b_id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        b_name:{
            type: DataTypes.STRING,
        },
        count:{
            type:DataTypes.INTEGER,
        },
        display:{
            type:DataTypes.BOOLEAN,
        },
    },
    {
        timestamps: false
    }
)


module.exports = Menu;
