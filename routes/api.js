
const express = require('express');
const router = express.Router();
const db = require('diskdb');

//DB Connect
db.connect('./database', ['notice']);
db.connect('./database', ['news']);

//API Hearbeat 
router.get('/',(req,res)=>{
    res.status(200).json({message:"Working Fine..!"})
})

//News Get Route 
router.get('/news/:pageNo',(req,res)=>{
    var pageNo  = parseInt(req.params.pageNo)
    var count = 10;
    var data = db.news.find().reverse();
    var response = ''
    if( !pageNo || pageNo == 1) {
        if(data.length >= count){
            response = {data:data.slice(0,count),nextpage:2}
        }
        else{
            response = {data:data,nextpage:false}
        }
    }
    var pageStart = (((pageNo-1)*count)) 
    var pageEnd = (pageStart+count)
        if(data.length > pageStart && data.length > pageEnd){
            response = {data:data.slice(pageStart,pageEnd),nextpage:(pageNo+1)}
        }
        if(data.length > pageStart && data.length < pageEnd){
            response = {data:data.slice(pageStart,data.length),nextpage:false}
        }
        if(data.length > pageStart && data.length == pageEnd){
            response = {data:data.slice(pageStart,data.length),nextpage:false}
        }
        if(pageStart>data.length){
            response = {data:`Invalid PageNO : ${pageNo}`}
        }
        res.status(200).json(response)
    
})

//News Details Get Route 
router.get('/news/detail/:id',(req,res)=>{
    var postid = req.params.id;
    if(postid){
        var data = db.news.news({_id:postid})
        if(data.length>0){
            res.status(200).json({data:data})
        }
        else{
            res.status(200).json({data:(db.news.find()).reverse()[0]})
        }
    }
    else{
        res.status(200).json({data:(db.news.find()).reverse()[0]})
    }
   
})

//Notice Get Route
router.get('/notices/:pageNo',(req,res)=>{
    var pageNo  = parseInt(req.params.pageNo)
    var count = 10;
    var data = db.notice.find().reverse();
    var response = ''
    if( !pageNo || pageNo == 1) {
        if(data.length >= count){
            response = {data:data.slice(0,count),nextpage:2}
        }
        else{
            response = {data:data,nextpage:false}
        }
    }
    var pageStart = (((pageNo-1)*count)) 
    var pageEnd = (pageStart+count)
        if(data.length > pageStart && data.length > pageEnd){
            response = {data:data.slice(pageStart,pageEnd),nextpage:(pageNo+1)}
        }
        if(data.length > pageStart && data.length < pageEnd){
            response = {data:data.slice(pageStart,data.length),nextpage:false}
        }
        if(data.length > pageStart && data.length == pageEnd){
            response = {data:data.slice(pageStart,data.length),nextpage:false}
        }
        if(pageStart>data.length){
            response = {data:`Invalid PageNO : ${pageNo}`}
        }
        res.status(200).json(response)
    
})

//Notice Details Get Route
router.get('/notice/detail/:id',(req,res)=>{
    var postid = req.params.id;
    if(postid){
        var data = db.news.find({_id:postid})
        if(data.length>0){
            res.status(200).json({data:data})
        }
        else{
            res.status(200).json({data:(db.news.find()).reverse()[0]})
        }
    }
    else{
        res.status(200).json({data:(db.news.find()).reverse()[0]})
    }
   
})

module.exports = router;