import DBConnection from "../configs/DBConnection";

let activeSessions = async(req, res) => {
    console.log('req.user: ', req.user);
    DBConnection.query("SELECT * FROM companies", (err, rows) => {
        if (err) {
            console.log(err);
        }
        if (rows.length > 0) {
            //console.log("companies: ", rows[0]);
            return res.render("activeSessions.ejs", {companies: rows});
        }
        else {
            console.log("no companies found")
            return res.render("activeSessions.ejs", {companies: ""});
        }           
    });
};

module.exports = {
    activeSessions: activeSessions,
};