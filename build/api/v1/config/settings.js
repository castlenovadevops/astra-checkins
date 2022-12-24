const Sequelize = require('sequelize');
// const sqlite3 = require('sqlite3') 
// configure this with your own parameters
const path = require('path');
// configure this with your own parameters


const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
}

const database = new Sequelize({
    database: 'astrapos',
    username: '',
    password: '',
    host: 'localhost',
    dialect: 'sqlite',
    storage: path.join(__dirname, "../../../../../DB/astrapos.sqlite")
});

console.log("DBPATH:::::", path.join(__dirname, "../../../../../DB/astrapos.sqlite"))
// const database = new Sequelize('astrapos','','',{
//     host: "0.0.0.0",
//     dialect: "sqlite", 
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000
//     },
//     // Data is stored in the file `database.sqlite` in the folder `db`.
//     // Note that if you leave your app public, this database file will be copied if
//     // someone forks your app. So don't use it to store sensitive information.
//     storage: "../../DB/astrapos.sqlite"
//   });

  database
  .authenticate()
  .then(function (err) {
    // console.log("Connection established."); 
  })
  .catch(function (err) {
    // console.log("Unable to connect to database: ", err);
  });

const smtp = {
    SMTPHost:process.env.SMTPHOST,
    SMTPUsername: process.env.SMTPUSERNAME,
    SMTPPassword:process.env.SMTPPASSWORD
} 
module.exports = {dbConfig: dbConfig, database: database, smtp: smtp};