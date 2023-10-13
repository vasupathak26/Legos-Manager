const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];  
function initialize() {
    return new Promise((resolve,reject)=>{
        setData.forEach((setElement) => {
            const found = themeData.find((themeElement) =>
              themeElement.id === setElement.theme_id
            );
            if (found) {
              setElement.theme = found.name;
              sets.push(setElement);
              resolve();
            }
            
          });
    })  
  }
  function getAllSets(){
    return new Promise((resolve,reject)=>{
        resolve(sets);
    })
  }
  
  function getSetByNum(setNum){
    return new Promise((resolve,reject)=>{
        const foundNum = sets.find((set) => set.set_num === setNum);
        if(foundNum){
            resolve(foundNum);
        }
        else{
            reject(new Error('unable to find requested set'))
        }
    })
    
  }

  function getSetsByTheme(theme){
    return new Promise((resolve,reject)=>{
        const themeLower=theme.toLowerCase();
        const foundTheme=sets.filter((sets)=>sets.theme.toLowerCase().includes(themeLower));
        if(foundTheme.length>0){
            resolve(foundTheme);
        }
        else{
            reject(new Error('unable to find requested sets'));
        }
    })
  }
  module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme }