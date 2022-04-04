// import multer from "multer";
// import DBConnection from "../configs/DBConnection";
// import path from "path";

// let storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         console.log(file);
//         callBack(null, '/public/images');
//     },
//     filename: (req, file, callBack) => {
//         console.log("file");
//         callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// let upload = multer({ storage: storage });

// let handleUpload = (data) => {
//     return new Promise((resolve, reject) => {
//         upload.single('image')(data, (err, file) => {
//             if (err) {
//                 console.log(err);
//                 reject(err);
//             }
//             resolve(file);
//         })
//     })
// };

// let addImage = async (req, res) => {
//     let image = await handleUpload(req);
//     let images = {
//         id: req.user.id,
//         image: image.filename
//     };
//     try {
//         await DBConnection.query("INSERT INTO images SET ?", [images]);
//         return res.redirect("/homepage");
//     } catch (err) {
//         req.flash("errors", err);
//         return res.redirect("/homepage");
//     }
// };



// module.exports = {
//     handleUpload: handleUpload,
//     addImage: addImage
// }
