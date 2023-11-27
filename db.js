const mysql = require('mariadb');
require('dotenv').config();

const config = {
    host: process.env.DB_HOST,
    port:  process.env.DB_PORT, 
    database:  process.env.DB_DATABASE, 
    user:  process.env.DB_USER, 
    password:  process.env.DB_PASSWORD, 
    connectionlimit:  process.env.DB_CONNECTION_LIMIT
    
};

const pool = mysql.createPool(config);


module.exports = pool;
/*
    connection.connect((err) => {
        if (err) {
            console.log("Error connecting to MySQL database", err);
        }
        else{
            console.log("Connected to MySQL database successfully");
        }
    })
    connection.end();*/

    //npm install mysql2