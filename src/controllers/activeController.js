import DBConnection from "../configs/DBConnection";


    

let activeSessions = async(req, res) => {
    console.log('req.user: ', req.user);
    DBConnection.query("select j.job_id, c.name 'company', c.logo_link, j.title, j.location from jobs j, companies c where j.company_id = c.company_id order by j.package desc", (err, rows) => {
        if (err) {
            console.log(err);
        }
        if (!rows) { // jobs dont exist
            console.log("no companies found");
            return res.render("activeSessions.ejs", {jobs: ""});
        }
        else { // jobs exist
            DBConnection.query("select j.job_id from jobs j, applications a where a.job_id = j.job_id and a.applicant_id = ?", req.user.id,
                (err, jidRows) => {
                    if (err) {
                        console.log(err);
                    }
                    if (!jidRows) { // no applications
                        rows.forEach((row) =>{
                            row.applied = false;
                            console.log(row);
                        });
                        return res.render("activeSessions.ejs", {jobs: rows});
                    }
                    else { // applications exist   
                        console.log("rows: ", rows);
                        console.log("jidRows: ", jidRows);
                        var j_ids = []; 
                        jidRows.forEach((id) => {
                            j_ids.push(id.job_id);
                        })
                        console.log('j_ids = ', j_ids);
                        var rowDisplay = [];
                        rows.forEach((row) =>{
                            if (j_ids.includes(row.job_id)) {
                                row.applied = true;
                                console.log(row)
                                rowDisplay.unshift(row);
                            }else{
                                row.applied = false;
                                rowDisplay.push(row);
                            }
                        });
                        return res.render("activeSessions.ejs", {jobs: rowDisplay});
                    }
                });
        }          
    });
};



module.exports = {
    activeSessions: activeSessions,
};