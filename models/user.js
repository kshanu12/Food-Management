const Sequelize=require("sequelize");
const db=require("../config/database")

const User=db.define("user",{
    u_id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    u_name:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING
    },
    age:{
        type:Sequelize.INTEGER
    },
    mobile:{
        type:Sequelize.STRING
    },
},{
    timestamps:false
});

module.exports=User;