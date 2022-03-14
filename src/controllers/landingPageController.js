let landingPage = async(req, res) => {
    return res.render("landingPage.ejs", {
        // errors: req.flash("errors"),
    });
};

module.exports = {
    landingPage: landingPage,
};