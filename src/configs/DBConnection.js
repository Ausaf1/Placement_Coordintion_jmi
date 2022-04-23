require("dotenv").config();
import mysql from "mysql2";

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Creating tables if not exist

connection.query("CREATE TABLE IF NOT EXISTS users (`id` INT NOT NULL AUTO_INCREMENT, `fullname` VARCHAR(45) NULL, `studentid` VARCHAR(45) NULL, `email` VARCHAR(255) NULL, `password` VARCHAR(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Table users created");
    }
});

connection.query("CREATE TABLE IF NOT EXISTS userdetails (enrollmentNo VARCHAR(255) NOT NULL, branch VARCHAR(255) NOT NULL, yearOfGraduation VARCHAR(255) NOT NULL,gender varchar(45) NOT NULL, contact varchar(255) NOT NULL,address varchar(555) NOT NULL,avgGpa decimal(10,4) NOT NULL,resume varchar(555) NOT NULL,id int NOT NULL,PRIMARY KEY (`id`),CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `placement_coordination`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Table userdetails created");    
    }
});

connection.query("CREATE TABLE IF NOT EXISTS images (id int NOT NULL,imgsrc varchar(255) NOT NULL,PRIMARY KEY (`id`),CONSTRAINT `id1` FOREIGN KEY (`id`) REFERENCES `placement_coordination`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Table images created");    
    }
});

connection.query("CREATE TABLE IF NOT EXISTS companies (`companyId` INT NOT NULL AUTO_INCREMENT,`companyName` VARCHAR(255) NOT NULL,`applicationStatus` VARCHAR(45) NOT NULL,`time` TIME NOT NULL,PRIMARY KEY (`companyId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;", (err, result) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Table companies created");    
    }
});





connection.connect(function (err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = connection;