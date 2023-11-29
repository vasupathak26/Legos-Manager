/********************************************************************************
*  WEB322 – Assignment 04
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Vasu Shaun Pathak Student ID: 117488221 Date: 2023-11-29
*
*  Published URL: https://hilarious-sweater-eel.cyclic.app
*
********************************************************************************/


const legoData = require("./modules/legoSets");
const express = require('express');
const path = require("path");
const app=express();
const HTTP_PORT = process.env.PORT || 8080; 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
legoData.initialize().then(()=>{
  app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
})
app.get("/",(req, res)=> {
  res.render("home");
});
app.get("/about", function (req, res) {
  res.render("about");
});
app.get("/404", function (req, res) {
  res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
});
  app.get('/lego/sets', (req, res) => {
    const theme=req.query.theme;
    if(theme){
      legoData.getSetsByTheme(theme).then((data)=>{
        if(data.length===0){
          res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
        }else{
          res.render("sets",{
            data: data
          })
        }
    }).catch((error)=>{
      res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
    })
    }else{
      legoData.getAllSets().then((data)=>{
        res.render("sets",{
          data: data
        })
      }).catch((error)=>{
        res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
      })   
    }
  });
  app.get('/lego/sets/:setNum', (req, res) => {
    const setNum = req.params.setNum;
    legoData.getSetByNum(setNum)
        .then((data) => {
            if (data) {
                res.render("set",{
                  set: data
                });
            } else {
              res.render("404")
            }
        })
        .catch((error) => {
          res.status(404).render("404", {message: "I'm sorry, we're unable to find what you're looking for"});
        });
});
app.get('/lego/addSet', (req, res) => {
  legoData .getAllThemes()
    .then((themeData) => {
      res.render("addSet", { themes: themeData });
    })
    .catch((error) => {
      res.send('Internal Server Error in addSet');
    });
});
app.post('/lego/addSet', (req, res) => {
  legoData.addSet(req.body)
    .then(() => {
      res.redirect('/lego/sets');
    })
    .catch((error) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error.message}` });
    });
  })
  app.get('/lego/editSet/:num',(req,res)=>{
    const num=req.params.num
    Promise.all([
      legoData.getSetByNum(num),
      legoData.getAllThemes(),
    ])
      .then(([set, themes]) => {
        res.render('editSet', { themes: themes, set: set });
      })
      .catch((error) => {
        res.status(404).render('404', { message: error.message });
      });
  })
  app.post('/lego/editSet',(req,res)=>{ 
  legoData.editSet(req.body.set_num,req.body)
    .then(() => {
      res.redirect('/lego/sets');
    })
    .catch((error) => {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
    });
  })

  app.get('/lego/deleteSet/:num', (req, res) => {
    legoData.deleteSet(req.params.num)
      .then(() => {
        res.redirect('/lego/sets');
      })
      .catch((error) => {
        res.render('500', { message: `I'm sorry, but we have encountered the following error: ${error}` });
      });
  });
 