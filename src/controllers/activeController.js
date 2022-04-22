import DBConnection from "../configs/DBConnection"

let activeSessions = async (req, res) => {
    DBConnection.query("SELECT * FROM companies", (err, rows) => {
        if (err) {
            console.log(err);
        }
        let companies = rows;
        console.log("companies: ", rows);
        return res.render("activeSessions.ejs", {
            companies: companies
        });
    });
};

module.exports = {
    activeSessions: activeSessions,
};