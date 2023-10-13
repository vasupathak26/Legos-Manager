/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Vasu Shaun Pathak Student ID: 117488221 Date: 2023-10-13
*
*  Published URL: 
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
const path = require("path");
const app=express();
const HTTP_PORT = process.env.PORT || 8080; 
app.use(express.static('public'));
legoData.initialize()
app.get("/",(req, res)=> {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});
app.get("/404", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/404.html"));
});
  app.get('/lego/sets', (req, res) => {
    const theme=req.query.theme;
    if(theme){
      legoData.getSetsByTheme(theme).then((data)=>{
        if(data.length===0){
          res.status(404).json({error:"404"});
        }else{
          res.json(data);
        }
    }).catch((error)=>{
      res.status(404).json({error:"404"});;
    })
    }else{
      legoData.getAllSets().then((data)=>{
        res.json(data);
      }).catch((error)=>{
        res.status(404).json({error:"404"});
      })   
    }
  });
  app.get('/lego/sets/:setNum', (req, res) => {
    const setNum = req.params.setNum;
    legoData.getSetByNum(setNum)
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ error: '404' });
            }
        })
        .catch((error) => {
            res.status(404).json({ error: '404' });
        });
});
  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));