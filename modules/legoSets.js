const setData = require("../data/setData");
const themeData = require("../data/themeData");
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
const Theme = sequelize.define('Theme',
 {
  id: {
    type:  Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true, 
  },
  name: Sequelize.STRING,
},
  {
    createdAt: false,
    updatedAt: false, 
  }
);
const Set = sequelize.define('Set', 
{
  set_num: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  year: Sequelize.INTEGER,
  num_parts: Sequelize.INTEGER,
  theme_id: Sequelize.INTEGER, // Ensure this matches the data type in Theme model
  img_url: Sequelize.STRING,
}, {
  createdAt: false,
  updatedAt: false, 
});

 Set.belongsTo(Theme, {foreignKey: 'theme_id'})
 
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
  sequelize
  .sync()
  .then( async () => {
    try{
      await Theme.bulkCreate(themeData);
      await Set.bulkCreate(setData); 
      console.log("-----");
      console.log("data inserted successfully");
    }catch(err){
      console.log("-----");
      console.log(err.message);

      // NOTE: If you receive the error:

      // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

      // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

      // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
    }

    process.exit();
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });