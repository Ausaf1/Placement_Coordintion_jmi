import DBConnection from "../configs/DBConnection";

let round = async (req, res) => {
    // get the job id
    let job_id = req.params.id;
    // console.log("jobid", job_id);
    DBConnection.query("SELECT * FROM placement_procedure WHERE job_id = ?", job_id, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        if (!rows) {
            console.log("no rounds found");
            res.render("round.ejs", {
                user: req.user,
                rounds: "",
                rounds_length: 0
            });
        } else {
            console.log("rounds found", rows);
            res.render("round.ejs", {
                user: req.user,
                rounds: rows,
                rounds_length: rows.length
            });
        }
    });
}

module.exports = {
    round: round,
};