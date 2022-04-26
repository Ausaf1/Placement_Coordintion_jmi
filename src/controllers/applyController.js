let apply = async (req, res) => {
    return res.render("apply.ejs", {
        user: req.user
    });
}

module.exports = {
    apply: apply,
};