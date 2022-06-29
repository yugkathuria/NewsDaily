//jshint esversion:6
require('dotenv').config();
const express = require("express");
const https=require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const helper=require(__dirname+"/helper.js");
const { write } = require("fs");
const { post } = require("request");
const { response } = require("express");
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get("/", function(req, res){
  const country="in";
  const key=process.env.API_KEY;
  const userAgent = req.get('user-agent');
  const options = {
     host: 'newsapi.org',
      path: '/v2/top-headlines?country='+country+'&apiKey='+key+"",
      headers: {
            'User-Agent': userAgent
      }
  }
  https.get(options, function (response) {
     let data;
      response.on('data', function (chunk) {
      if (!data) {
          data = chunk;
      }
      else {
          data += chunk;
      }
      });
      response.on('end', function () {
        const newsData = JSON.parse(data);
        console.log(newsData);
       res.render("home",{newsData:newsData,helper:helper})
      });
  });
  
  });


  









  app.get("/register",function(req,res){
    res.render("register");
   });
   
   app.post("/register",function(req,res){
     
      const firstName=req.body.fname; //fetching data from form in our HTML page
       const lastname=req.body.lname;
       const email=req.body.email;
       const data= { // this is the data which will be strigified would be converted into the format acceptable by our api
           members:[
               {
               email_address: email,
               status:"subscribed",
               merge_fields:{
                   FNAME: firstName,
                   LNAME: lastname
               }
           }
           ]
       };
       const jsondata=JSON.stringify(data);// stringify JSON data
   
       


   

   
      
       const url="https://us14.api.mailchimp.com/3.0/lists/"+process.env.AUDIENCE;
       const options={//http request allows us to define what type of request it is (method i.e. get or post), also it allows us authetiction
           method:"POST",
           auth:process.env.AUTH
       }
       const request=https.request(url,options,function(response){
           if(response.statusCode===200){//status code 200 of http requuest means success
               res.render("success");
           }
           else{
               res.render("failure");
           }
           response.on("data",function(data){
               console.log(JSON.parse(data));
           });
       });
       request.write(jsondata);//http request allows us to send data back by storing request in constant and using write to it
       request.end();// this is mandatory to end request after writing
   
   
   
   
   });
   
   
   app.post("/failure",function(request,response){
    response.redirect("/register");
   });
   












app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000.");
});
