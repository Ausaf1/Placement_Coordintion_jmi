import DBConnection from "../configs/DBConnection";
import newApplication from "../services/applyService";

let apply = async (req, res) => {
    let job_id = req.params.id;
    DBConnection.query("select * from applications where job_id = ? and applicant_id = ?", [job_id, req.user.id], (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if (!rows[0]) {
                // no applications found
                // apply page will open
                DBConnection.query("select * from jobs where job_id = ?", job_id, (err, jobDetails) => {
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                    }
                    else {
                        DBConnection.query("select * from companies where company_id = ?", jobDetails[0].company_id, (err, companyDetails) => {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            }
                            else {
                                DBConnection.query("select * from userdetails where id = ?", req.user.id, (err, userDetails) => {
                                    if (err) {
                                        console.log(err);
                                        res.sendStatus(500);
                                    } else {
                                        if (!userDetails) {
                                            console.log("no user details found");
                                            res.render("apply.ejs", {
                                                user: req.user,
                                                userdetails: "",
                                                job: jobDetails[0],
                                                company: companyDetails[0]
                                            });
                                        } else {
                                            // console.log("user details found");
                                            res.render("apply.ejs", {
                                                user: req.user,
                                                userdetails: userDetails[0],
                                                job: jobDetails[0],
                                                company: companyDetails[0]
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                // application found
                // apply page will not open, since already applied
                // rounds page will open
                console.log("applications founds", rows[0]);
                res.redirect("/rounds/" + rows[0].application_id);
            }
        }
    });
};

let applyJob = async (req, res) => {
    let job_id = req.params.id;
    let applicant_id = req.user.id;
    let application_id = req.applicant_id;
    let status = "Applied";
    let data = {
        job_id: job_id,
        applicant_id: applicant_id,
        application_id: application_id,
        status: status
    }
    try {
        await newApplication.newApply(data);
        res.redirect("/thanks");
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}



module.exports = {
    apply: apply,
    applyJob: applyJob
};