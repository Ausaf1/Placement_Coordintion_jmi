import DBConnection from "../configs/DBConnection";
import multer from "multer";

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

let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        console.log("file in destination", file);
        // console.log(file);
        callBack(null, '/public/images');
    },
    filename: (req, file, callBack) => {
        console.log("file");
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({ storage: storage });

let uploadImage = async (req, res) => {
    console.log("file in uploadImage", req.file);
    upload.single('image'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
        } else {
            console.log(req.file.filename)
            var imgsrc = 'http://127.0.0.1:8080/images/' + req.file.filename
            console.log(imgsrc);
            DBConnection.query("UPDATE images SET image = ? WHERE id = ?", [imgsrc, req.user.id], (err, rows) => {
                if (err) {
                    console.log(err);
                }
                console.log("Rows");
                console.log(rows);
                return res.redirect("/homepage");
            }
            );
        }
    }
};





module.exports = {
    handleHelloWorld: handleHelloWorld,
    uploadImage: uploadImage
    // handleMulterError: handleMulterError
};