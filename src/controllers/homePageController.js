import DBConnection from "../configs/DBConnection";
import homePageService from "../services/homePageService";

let handleHelloWorld = async (req, res) => {
    DBConnection.query("SELECT * FROM userdetails WHERE id = ?", [req.user.id], (err, rows) => {
        if (err) {
            console.log(err);
        }
        if (rows.length > 0) {
            console.log(rows[0]);
            return res.render("homepage.ejs", {
                user: req.user,
                userDetails: rows[0],
                message: "You have already uploaded your profile picture"
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

// let uploadImage = async (req, res) => {
//     let image = await homePageService.handleUpload(req);
//     let images = {
//         id: req.user.id,
//         image: image.filename
//     };
//     try {
//         await homePageService.addImage(images);
//         return res.redirect("/homepage");
//     } catch (err) {
//         req.flash("errors", err);
//         return res.redirect("/homepage");
//     }
// };




module.exports = {
    handleHelloWorld: handleHelloWorld,
    // uploadImage: uploadImage
};