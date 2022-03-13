let editProfile = async(req, res) => {
    return res.render("editProfile", {
        title: "Edit Profile",
        user: req.user,
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

module.exports = {
    editProfile: editProfile,
};