const express = require('express')
const app = express()
const path = require('path')
const PORT = 3000
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

app.set('views', './views');
app.set('view engine', 'ejs');
let data = ""
let data2 = ""
// Set up static file serving
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/js", express.static(__dirname + "static/js"));
app.use("/css", express.static(__dirname + "static/css"));
app.use("/img", express.static(__dirname + "static/img"));

client.on("connect", () => {
  client.subscribe("/mc/2", (err) => { console.log(err)});
  client.subscribe("/mc/4", (err) => { console.log(err)});
  });
  client.subscribe("/mc/4", (err) => {
    if (!err) {
      client.publish("/mc/data", "Hello mqtt");
    }else{
      throw err;
    }
    
  });
  client.on("message", (topic, message) => {
    if (topic === "/mc/4") {
      data = message.toString();
  } else if (topic === "/mc/2") {
      data2 = message.toString();
  }
    console.log(data+topic)
    console.log(message.toString());
  });

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
}) 

app.get("/",(req,res)=>{
    if(data2===".-"){
      res.redirect("/home")
    }else{
      res.render("main",{data :data,data2:data2})  
    }
    
})

app.get("/home",(req,res)=>{
    res.render("home")  
})
