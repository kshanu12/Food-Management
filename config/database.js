const Sequelize=require("sequelize")
module.exports=new Sequelize("breakfast","root","",{
    host:"localhost",
    dialect:"mysql",
})