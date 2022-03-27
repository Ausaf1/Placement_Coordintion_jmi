import DBConnection from "./../configs/DBConnection";

let addDetails = (data) => {
    return new Promise((resolve, reject) => {
        let userDetails = {
            id: data.id,
            enrollmentNo: data.enrollmentNo,
            branch: data.branch,
            yearOfGraduation: data.yearOfGraduation,
            gender: data.gender,
            contact: data.contact,
            address: data.address,
            avgGpa: data.avgGpa,
            resume: data.resume
        };
        if (data.enrollmentNo != null) {
            DBConnection.query("UPDATE userdetails SET enrollmentNo = ? WHERE id = ?", [userDetails.enrollmentNo, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.branch != null) {
            DBConnection.query("UPDATE userdetails SET branch = ? WHERE id = ?", [userDetails.branch, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.yearOfGraduation != null) {
            DBConnection.query("UPDATE userdetails SET yearOfGraduation = ? WHERE id = ?", [userDetails.yearOfGraduation, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.gender != null) {
            DBConnection.query("UPDATE userdetails SET gender = ? WHERE id = ?", [userDetails.gender, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.contact != null) {
            DBConnection.query("UPDATE userdetails SET contact = ? WHERE id = ?", [userDetails.contact, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.address != null) {
            DBConnection.query("UPDATE userdetails SET address = ? WHERE id = ?", [userDetails.address, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.avgGpa != null) {
            DBConnection.query("UPDATE userdetails SET avgGpa = ? WHERE id = ?", [userDetails.avgGpa, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        if (data.resume != null) {
            DBConnection.query("UPDATE userdetails SET resume = ? WHERE id = ?", [userDetails.resume, userDetails.id], (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        }
        else {

            DBConnection.query(
                "INSERT INTO userdetails set ?",
                userDetails,
                function (err, rows) {
                    if (err) {
                        console.log(err);
                        reject(false);
                    }
                    resolve("Details added successfully");
                }
            );
        }
    });
}

module.exports = {
    addDetails: addDetails
}