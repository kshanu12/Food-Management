const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
var axios = require('axios');
const User = require('./models/user');
const Menu = require('./models/menu');
const db = require('./config/database');

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.set("view-engine","ejs")

db.authenticate()
    .then(() => console.log('Database Connected...'))
    .catch(err => console.log('Error: '+ err))

app.use(express.static(path.join(__dirname,"public"))) 

app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.render("home.ejs")
})

app.get("/admin",(req,res)=>{
    res.render("admin.ejs",{message:""})
})

app.get("/user_login",(req,res)=>{
    res.render("user_login.ejs",{message:""})
})

app.get("/user_signup",(req,res)=>{
    res.render("user_signup.ejs")
})

app.get("/add",(req,res)=>{
    res.render("add.ejs")
})

app.get("/voting",(req,res)=>{
    res.render("voting.ejs")
})

app.get("/user_otp",(req,res)=>{
    res.render("user_otp.ejs",{message:""})
})

app.post("/user_signup",async (req,res)=>{
    try{
        User.create({
            u_name:req.body.name, 
            email:req.body.email,
            age:req.body.age,
            mobile:req.body.mobile,
        })
        res.redirect("/user_login")
    }
    catch{
        res.redirect("/user_signup")
    }
})

app.post("/admin_login",async function(req,res){
    var email="admin@gmail.com";
    var password="admin@123";
    if (email!=req.body.email||password!=req.body.password) {
        res.render("admin.ejs",{message:"*email/password not found"});
        console.log('Not found!');
    } else {
        res.render("add.ejs");
    }
})

const characters ='0123456789';
var uniqueotp="";
function generateString(length) {
    const charactersLength = characters.length;
    uniqueotp="";
    for ( let i = 0; i < length; i++ ) {
        uniqueotp += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log(uniqueotp);
}

app.post("/user_otp",async function(req,res){
    var mobi=req.body.mobile;
    const project = await User.findOne({ 
        where: {
            mobile:mobi,
    }});
    if(!(project))
    {
        res.render("user_login.ejs",{message:"*mobile number not found"});
    }
    else
    {
        generateString(6);
        // console.log("user_otp",uniqueotp);
        var data = JSON.stringify({
            "body": "Hi "+project.u_name+",\n\n Please find the below OTP "+uniqueotp+" \n-Kaleyra",
            "sender": "KALERA",
            "to": "91"+mobi,
            "type": "OTP",
            "template_id": "1107165959873165373"
        });
        
        var config = {
            method: 'post',
            url: 'https://api.in.kaleyra.io/v1/HXIN1740145135IN/messages?api-key=Ad4ad639409238e113e1e420950e9ad48&Content-Type=application/json',
            headers: { 
                'Content-Type': 'application/json'
            },
            data : data
        };
        
        axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
        res.render("user_otp.ejs",{message:""});
    }
})

app.post("/voting",async function(req,res){
    // console.log("voting",uniqueotp);

    if(req.body.otp==uniqueotp)
    {
        let query = `SELECT b_id,b_name FROM menus`; 
        const [results] = await db.query(query);
        console.log(results);
        res.render("voting.ejs",{project:results})
    }
    else
    {
        res.render("user_otp.ejs",{message:"*Wrong otp"})
    }
})

app.post("/add",async function(req,res){
    var query=`delete from menus`;
    const [results] = await db.query(query); 
    if(req.body.name1){
        Menu.create({
            b_name:req.body.name1,
            count:0
    })}
    if(req.body.name2){
        Menu.create({
            b_name:req.body.name2,
            count:0
    })}
    if(req.body.name3){
        Menu.create({
            b_name:req.body.name3,
            count:0
    })}
    if(req.body.name4){
        Menu.create({
            b_name:req.body.name4,
            count:0
    })}
    if(req.body.name5){
        Menu.create({
            b_name:req.body.name5,
            count:0
    })}
    res.render("add.ejs")
})

app.post("/voted",async function(req,res){
    console.log(req.body.opted);
    var query=`UPDATE menus SET count=count+1 WHERE b_id=${req.body.opted}`;
    const results = await db.query(query); 
    let que = `SELECT b_id,b_name FROM menus`;
    const result = await db.query(que);
    console.log(result);
    res.render("home.ejs")
})

app.listen(3000)