let activeSessions = async(req, res) => {
    // let sessions = await sessionService.getActiveSessions();
    return res.render("activeSessions.ejs", {
        // sessions: sessions,
    });
};

module.exports = {
    activeSessions: activeSessions,
};