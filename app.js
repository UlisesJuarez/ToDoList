const express=require("express");
const bodyParser=require("body-parser");

const app=express();

app.get("/",function(req,res){
    var today=new Date();
    var currentDay=today.getDay();
    if(currentDay===6 || currentDay===0){
        res.write("<h2>Yeat it's a weekend!</h2>")
        res.write("<p>Enjoy the day</p>")
        res.send();
    }else{
        res.send(__dirname+"/index.html");
        
    }
});

app.listen(3000,function(){
    console.log("Server started on port 3000");
});