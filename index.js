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
// Set up static file serving
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use("/js", express.static(__dirname + "static/js"));
app.use("/css", express.static(__dirname + "static/css"));
app.use("/img", express.static(__dirname + "static/img"));

client.on("connect", () => {
    client.subscribe("/mc/2", (err) => {
      if (!err) {
        client.publish("/mc/data", "Hello mqtt");
      }else{
        throw err;
      }
      
    });
  });
  
  client.on("message", (topic, message) => {
    data = message.toString()
    console.log(data)
    console.log(message.toString());
    
  });

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
}) 

app.get("/",(req,res)=>{
    
    res.render("main",{data :data})  
})

app.get("/home",(req,res)=>{
    res.render("home")  
})
