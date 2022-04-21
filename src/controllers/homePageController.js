import DBConnection from "../configs/DBConnection";

let handleHelloWorld = async (req, res) => {
    DBConnection.query("SELECT * FROM userdetails WHERE id = ?", [req.user.id],
        (err, userRows) => {
            if (err) {
                console.log(err);
            }
            if (userRows.length > 0) {
                console.log("userdetails: ", userRows[0]);

                DBConnection.query(
                    "SELECT * FROM images WHERE id = ?", [req.user.id],
                    function (err, imgRows) {
                        if (imgRows.length > 0) {
                            console.log("images: ", imgRows[0])
                            return res.render("homepage.ejs", {
                                user: req.user,
                                userDetails: userRows[0],
                                images: imgRows[0]
                            });
                        }
                        else {
                            console.log("no image found")
                            return res.render("homepage.ejs", {
                                user: req.user,
                                userDetails: userRows[0],
                                images: ""
                            });
                        }
                    });
            }
            else {
                return res.render("homepage.ejs", {
                    user: req.user,
                    userDetails: {},
                    images: ""
                });
            }
        });
};



module.exports = {
    handleHelloWorld: handleHelloWorld,
};