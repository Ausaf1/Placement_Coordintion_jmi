import editProfileService from "../services/editProfileService";
import DBConnection from "../configs/DBConnection";
import path from "path";

let editProfile = async (req, res) => {
    var id;
    try {
        id = req.user.id;
    } catch (err) {
        console.log("catchhh")
        id = req.params.id;
    }
    DBConnection.query("SELECT * FROM userdetails WHERE id = ?", [id],
        (err, userRows) => {
            if (err) {
                console.log(err);
            }
            if (userRows.length > 0) {
                console.log("userdetails: ", userRows[0]);

                DBConnection.query(
                    "SELECT * FROM images WHERE id = ?", [id],
                    function (err, imgRows) {
                        if (imgRows.length > 0) {
                            console.log("images: ", imgRows[0])
                            return res.render("editProfile.ejs", {
                                user: req.user,
                                userDetails: userRows[0],
                                images: imgRows[0]
                            });
                        }
                        else {
                            console.log("no image found")
                            return res.render("editProfile.ejs", {
                                user: req.user,
                                userDetails: userRows[0],
                                images: ""
                            });
                        }
                    });
            }
            else {
                return res.render("editProfile.ejs", {
                    user: req.user,
                    userDetails: {},
                    images: ""
                });
            }
        });
};


let editProfileUser = async (req, res) => {
    // console.log("jggdfd");
    // console.log(req.body);
    var id;
    try {
        id = req.user.id;
    } catch (err) {
        console.log("catchhh")
        id = req.params.id;
    }
    let userDetails = {
        id: id,
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

let uploadImage = async (req, res) => {
    let imgsrc;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // name of the input is imgsrc
    imgsrc = req.files.imgsrc;
    // uploadPath = __dirname + '/upload/' + imgsrc.name;
    uploadPath = path.join(__dirname, '../public/images/' + imgsrc.name);

    var id;
    try {
        id = req.user.id;
    } catch (err) {
        console.log("catchhh")
        id = req.params.id;
    }


    console.log(imgsrc);
    let images = {
        id: id,
        imgsrc: imgsrc.name
    }
   
    
    // Use mv() to place file on the server
    imgsrc.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);

        DBConnection.query(
            "SELECT * FROM images WHERE id = ?", [id],
            function (err, rows) {
                if (err) {
                    console.log(err);
                }
                console.log("Rows");
                console.log(rows[0]);
                if (rows.length > 0) {
                    DBConnection.query("UPDATE images SET imgsrc = ? WHERE id = ?", [imgsrc.name, id], (err, result) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.redirect('/editProfile');
                        }
                    })
                }
                else {
                    DBConnection.query("INSERT INTO images SET ?", images, (err, rows) => {
                        if (!err) {
                            res.redirect('/editProfile');
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
    });
};


module.exports = {
    editProfile: editProfile,
    editProfileUser: editProfileUser,
    uploadImage: uploadImage
};