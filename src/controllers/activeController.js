import db from "../configs/DBConnection";

// select j.job_id, c.name 'company', c.logo_link, j.title, j.location from jobs j natural join companies c order by j.package desc;

let activeSessions = async (req, res) => {
  // sql queries
    var detailsQuery = "select * from userdetails where id = ?";
    var jobDisplayQuery =
    "select * from jobs j natural join companies c order by j.package desc";
    var appliedQuery = "select * from applications where applicant_id = ?";

    db.query(detailsQuery, req.user.id, (err, details) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            if (!details) {
            console.log("user has not added his profile details.");
            res.render("activeSessions.ejs", { jobs: "" });
            } else {
                // user details available
                // getting all the jobs that can be displayed
                var details = details[0];
                console.log("details: ", details);
                db.query(jobDisplayQuery, (err, jobs) => {
                    if (err) {
                        console.log(err);
                        res.redirect("/");
                    } else {
                        if (!jobs) {
                        console.log("no jobs available.");
                        res.render("activeSessions.ejs", { jobs: "" });
                        } else {
                            // jobs available
                            // getting all the applications that have been made
                            db.query(appliedQuery, req.user.id, (err, applications) => {
                                if (err) {
                                console.log(err);
                                res.redirect("/");
                                } else {
                                    if (!applications[0]) {
                                        // we have no applications, hence check through all not applied for eligibility
                                        var eligibleJobs = [];
                                        console.log("no applications made.");
                                        jobs.forEach((job) => {
                                        job.applied = false;
                                        // check branch
                                        var c1 = job.allowed_branches.split(",").includes(details.branch);
                                        // check gender
                                        var c2 = job.allowed_gender.split(",").includes(details.gender);
                                        // check cpi
                                        var c3 = job.min_cpi <= details.avgGpa;
                                        // no need to check 1.5x rule since no applications yet

                                        (c1 && c2 && c3) ? eligibleJobs.push(job) : null; // push eligible jobs
                                        });
                                        res.render("activeSessions.ejs", { jobs: eligibleJobs });
                                    } else {
                                        // we have applications, hence check through all not applied for eligibility

                                        let jobMap = new Map();
                                        jobs.forEach((job) => {
                                        jobMap.set(job.job_id, job);
                                        }); // job map for easy access

                                        var acceptedJobs = [];
                                        var appliedJobs = [];
                                        var notAppliedJobs = [];
                                        var rejectedJobs = [];

                                        applications.forEach((application) => {
                                            var job = jobMap.get(application.job_id);
                                            job.applied = true;
                                            job.status = application.status;
                                            if (application.status === "Accepted") {
                                                acceptedJobs.push(job);
                                            } else if (application.status === "Applied") {
                                                appliedJobs.push(job);
                                            } else if (application.status === "Rejected") {
                                                rejectedJobs.push(job);
                                            }
                                            jobMap.delete(application.job_id);
                                        });
                                        // we deleted all the job keys from jobMap for which already applied
                                        // now we have to check for the remaining jobs in jobMap for eligibility

                                        // find max package acheieved by user
                                        var maxPackage = 0;
                                        acceptedJobs.forEach((job) => {
                                            if (job.package > maxPackage) {
                                                maxPackage = job.package;
                                            }
                                        });

                                        jobMap.forEach((job) => {
                                            job.applied = false;

                                            // check branch
                                            var c1 = job.allowed_branches.split(",").includes(details.branch);
                                            // check gender
                                            var c2 = job.allowed_gender.split(",").includes(details.gender);
                                            // check cpi
                                            var c3 = job.min_cpi <= details.avgGpa;
                                            // check 1.5 x rule
                                            var c4 = job.package >= maxPackage * 1.5;

                                            (c1 && c2 && c3 && c4) ? notAppliedJobs.push(job) : null; // push eligible jobs  
                                        });

                                        var jobDisplay = acceptedJobs.concat(appliedJobs, notAppliedJobs, rejectedJobs);
                                        res.render("activeSessions.ejs", { jobs: jobDisplay });
                                    }
                                }
                            });
                        }
                    }
                });    
            }
        }
    });
};

//   db.query(
//     "select j.job_id, c.name 'company', c.logo_link, j.title, j.location from jobs j natural join companies c order by j.package desc;",
//     (err, rows) => {
//       if (err) {
//         console.log(err);
//       }
//       if (!rows) {
//         // jobs dont exist
//         console.log("no jobs found");
//         return res.render("activeSessions.ejs", { jobs: "" });
//       } else {
//         // jobs exist
//         let rowDisplay = [];
//         db.query(
//           "select * from applications where applicant_id = ?;",
//           req.user.id,
//           (err, rows) => {
//             if (err) {
//               console.log(err);
//             }
//             if (!rows) {
//               console.log("no applications found");
//               return res.render("activeSessions.ejs", { jobs: "" });
//             } else {
//               //console.log('rows: ', rows);
//               for (let i = 0; i < rows.length; i++) {
//                 let job = rows[i].job_id;
//                 db.query(
//                   "select * from jobs where job_id = ?;",
//                   job,
//                   (err, rows) => {
//                     if (err) {
//                       console.log(err);
//                     }
//                     if (!rows) {
//                       console.log("no jobs found");
//                       return res.render("activeSessions.ejs", { jobs: "" });
//                     } else {
//                       //console.log('rows: ', rows);
//                       rowDisplay.push(rows[0]);
//                       //console.log('rowDisplay: ', rowDisplay);
//                       if (rowDisplay.length === rows.length) {
//                         //console.log('rowDisplay: ', rowDisplay);
//                         return res.render("activeSessions.ejs", {
//                           jobs: rowDisplay,
//                         });
//                       }
//                     }
//                   }
//                 );
//               }
//             }
//           }
//         );
//       }
//     }
//   );
// };

let checkApplied = async (req, res) => {
  //console.log('req.user: ', req.user);

  console.log("checking applied response: ", req.body.appliedStatus);
  if (req.body.appliedStatus === "applied") {
    console.log("redirecting for id: ", req.body.job);
    return res.redirect("/rounds");
  } else {
    console.log("going to apply page");
    return res.redirect("/apply");
  }
};

module.exports = {
  activeSessions: activeSessions,
  checkApplied: checkApplied,
};
