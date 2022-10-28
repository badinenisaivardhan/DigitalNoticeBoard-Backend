const express = require('express');  
const bcrypt = require('bcrypt');
const db = require('diskdb');
require('dotenv').config();
const router = express.Router();
const { SendNotification} = require('../services/onesignal');
const { directoryname } = require('../app');
const multer  = require('multer')
const baseURL = process.env.URL
require('dotenv').config();

//DB
db.connect('./database', ['admin']);
db.connect('./database', ['notice']);
db.connect('./database', ['news']);


//Session Check MIDDLEWARE
const sessioncheck = function(req, res, next) {
    if (req.session && req.session.user)
      return next();
    else
      return res.redirect('/');
};

//MULTER
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directoryname+"/public/uploads"); 
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "__" + file.originalname.replaceAll(' ', '_'));
    },
  });

const upload = multer({ storage: fileStorageEngine });

//Routes

//Main Get Route
router.get('/',(req,res)=>{
    if(req.session && req.session.user){
        res.redirect('/dashboard');
    }
    else{
        res.render('login');
    }
})

//Main Post Route
router.post('/',(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    if(email.length && password.length){
        var admin = db.admin.find({ email: email });
        if(admin.length){
            bcrypt.compare(password, admin[0].password, function(err, result) {
                if(result==true){
                    req.session.user = admin[0].username;
                    res.redirect('/dashboard')
                }else{
                    res.render('login')
                }
            });
        }
        else{
            res.status(200).send({status:403,message:`No Admin With Email : ${email} Found`})
        }
    }else{
        res.status(200).send({status:403,message:`Some Of Your Inputs Have Null Values`})
    }
})

//CREATE ADMIN POST ROUTE -- For Security Comment This Route In PRODUCTION
// router.post('/createadmin', (req,res)=>{
//     var email = req.body.email;
//     var password = req.body.password;
//     var cpassword = req.body.cpassword;
//     if(password != cpassword){
//         res.status(200).send({status:403,message:"Password is Mismatched, Failed To Create User"})
//     }
//     else if((email == null||'') || (password ==null||'') || (cpassword == null||'')){
//         res.status(200).send({status:403,message:"Some Of Your Inputs Have Null Values"})
//     }
//     else if((db.admin.find({ email: email })).length){
//         res.status(200).send({status:403,message:"Email Already Exist"})
//     }
//     else{
//         bcrypt.genSalt(10, function(err, salt) {
//             bcrypt.hash(password, salt, function(err, hash) {
//                 var data = { email : email, password: hash };
//                 db.admin.save(data);
//                 res.status(200).send({status:200,message:`Admin Created Sucessfully for email ${email}`})
//             });
//         });
//     }
// })

//Dashboard Get Route
router.get('/dashboard', sessioncheck ,(req,res)=>{
    const noticecount = db.notice.find().length;
    const newscount = db.news.find().length;
    res.render('dashboard',{noticecount,newscount})
})

//New Notice Get Route
router.get('/newnotice', sessioncheck ,(req,res)=>{
    res.render('newnotice')
})

//New Notice Post Route
router.post('/newnotice', sessioncheck, upload.array("files") ,async (req,res)=>{
    var title = req.body.title;
    var description = req.body.description;
    var department = req.body.department;
    if(req.files.length==0){
        var data = {
                    department:department,
                    title:title,
                    description:description,
                    date: Date.now(),
                }
        await db.notice.save(data);
    }else{
        var uploads = {};
        for(var i=0;i<req.files.length;i++){
            uploads[i]= baseURL+"/uploads/"+req.files[i].filename
        }
        var data = {
                    department:department,
                    title:title,
                    description:description,
                    date: Date.now(),
                    uploads:uploads
        }
        await db.notice.save(data);
    }
     // // Sending One Signal Notification
    var result = await SendNotification(department,title);
    console.log(result)
    res.render('newnotice')
})

//All Notices GET Route
router.get('/allnotices',sessioncheck,(req,res)=>{
    const notices = db.notice.find().reverse();
    res.render('allnotices',{notices})
})

//New News Get Route
router.get('/newnews', sessioncheck ,(req,res)=>{
    res.render('newnews')
})

//New News Post Route
router.post('/newnews', sessioncheck , async (req,res)=>{
    var title = req.body.title;
    var department = req.body.department
    var description = req.body.description;
    var data = {
        department:department,
        title:title,
        description:description,
        date: Date.now(),
    }
    await db.news.save(data);
    var result = await SendNotification(department,title);
    console.log(result)
    res.render('newnews')
})

//All News Get Route
router.get('/allnews',sessioncheck,(req,res)=>{
    const news = db.news.find().reverse();
    res.render('allnews',{news})
})

//Logout Route 
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;