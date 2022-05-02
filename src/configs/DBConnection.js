require("dotenv").config();
import mysql from "mysql2";
import bcrypt from "bcryptjs";

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Creating tables if not exist

connection.query(
  "CREATE TABLE IF NOT EXISTS users (`id` INT NOT NULL AUTO_INCREMENT, `fullname` VARCHAR(45) NULL, `studentid` VARCHAR(45) NULL, `email` VARCHAR(255) NULL, `password` VARCHAR(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table users created");
    }
  }
);

// insert admin details
let salt = bcrypt.genSaltSync(10);
let admin = {
  id: process.env.ADMIN_ID,
  fullname: "Admin",
  studentid: "000000",
  email: process.env.ADMIN_EMAIL,
  password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, salt),
};
connection.query("INSERT INTO users SET ?", admin, (err, result) => {
  if (err) {
    console.log("Admin already in database");
  } else {
    console.log("Admin created");
  }
});

connection.query(
  "CREATE TABLE IF NOT EXISTS userdetails (enrollmentNo VARCHAR(255) NOT NULL, branch VARCHAR(255) NOT NULL, yearOfGraduation VARCHAR(255) NOT NULL,gender varchar(45) NOT NULL, contact varchar(255) NOT NULL,address varchar(555) NOT NULL,avgGpa decimal(10,4) NOT NULL,resume varchar(555) NOT NULL,id int NOT NULL,PRIMARY KEY (`id`),CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `placement_coordination`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table userdetails created");
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS images (id int NOT NULL,imgsrc varchar(255) NOT NULL,PRIMARY KEY (`id`),CONSTRAINT `id1` FOREIGN KEY (`id`) REFERENCES `placement_coordination`.`users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table images created");
    }
  }
);

connection.query(
  " CREATE TABLE IF NOT EXISTS companies( company_id INT NOT NULL AUTO_INCREMENT, name VARCHAR(45), description VARCHAR(555), logo_link VARCHAR(255), web_link VARCHAR(255), PRIMARY KEY (company_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table companies created");
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS jobs(job_id INT NOT NULL AUTO_INCREMENT,title VARCHAR(45), job_description VARCHAR(555),location VARCHAR(45),package DOUBLE(10, 2),allowed_branches SET('CS','ECE','EE','ME','CE'),min_cpi DOUBLE(10, 2),allowed_gender SET('Male','Female','Other'),company_id INT,PRIMARY KEY (job_id),FOREIGN KEY (company_id) REFERENCES companies(company_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table jobs created");
    }
  }
);

connection.query(
  "CREATE TABLE IF NOT EXISTS applications(application_id INT NOT NULL AUTO_INCREMENT,applicant_id INT,job_id INT,status ENUM('Applied', 'Accepted', 'Rejected'),PRIMARY KEY (application_id),FOREIGN KEY (applicant_id) REFERENCES users(id),FOREIGN KEY (job_id) REFERENCES jobs(job_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table applications created");
    }
  }
);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database connected!");
});

module.exports = connection;
