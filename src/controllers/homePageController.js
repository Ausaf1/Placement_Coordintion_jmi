import DBConnection from "../configs/DBConnection";

let handleHelloWorld = async (req, res) => {
    DBConnection.query("SELECT * FROM userdetails WHERE id = ?", [req.user.id], (err, rows) => {
        if (err) {
            console.log(err);
        }
        if (rows.length > 0) {
            console.log(rows[0]);
            return res.render("homepage.ejs", {
                user: req.user,
                userDetails: rows[0]
            });
        }
        else {
            return res.render("homepage.ejs", {
                user: req.user,
                userDetails: {}
            });
        }
    });
};

module.exports = {
    handleHelloWorld: handleHelloWorld,
};