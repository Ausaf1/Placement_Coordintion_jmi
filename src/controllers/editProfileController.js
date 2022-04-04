import editProfileService from "../services/editProfileService";
import DBConnection from "../configs/DBConnection";

let editProfile = async (req, res) => {
    DBConnection.query(
        "SELECT * FROM userdetails WHERE id = ?", [req.user.id],
        function (err, rows) {
            if (err) {
                console.log(err);
            }
            // console.log("Rows");
            // console.log(rows[0]);
            if (rows.length > 0) {
                return res.render("editProfile.ejs", {
                    user: req.user,
                    userDetails: rows[0]
                });
            }
            else {
                return res.render("editProfile.ejs", {
                    user: req.user,
                    userDetails: {}
                });
            }
        });
};


let editProfileUser = async (req, res) => {
    // console.log("jggdfd");
    console.log(req.body);
    let userDetails = {
        id: req.user.id,
        enrollmentNo: req.body.enrollmentNo,
        branch: req.body.branch,
        yearOfGraduation: req.body.yearOfGraduation,
        gender: req.body.gender,
        contact: req.body.contact,
        address: req.body.address,
        avgGpa: req.body.avgGpa,
        resume: req.body.resume
    };
    try {
        await editProfileService.addDetails(userDetails);
        return res.redirect("/editProfile");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/editProfile");
    }
};


module.exports = {
    editProfile: editProfile,
    editProfileUser: editProfileUser
};