import DBConnection from "../configs/DBConnection";

let authenticate = async (req, res, next) => {
  if(!req.user){
    console.log("not logged in");
    res.redirect("/admin-login");
  }else if (req.user.id != -1){ // 4 is database id of admin
    console.log("not admin");
    res.redirect("/admin-login");
  }else{
    console.log("logged in");
    next();
  }
};

let getPage = async (req, res) => {
  //console.log("Rendering Admin page, the user id is: ", req.user.id);
  var render = {
    users: "",
    companies: "",
    jobs: "",
    applications: "",
  };
  DBConnection.query("select * from users", (err, users) => {
    if (err) {
      console.log(err);
    }
    render.users = users;
  });
  DBConnection.query("select * from companies", (err, companies) => {
    if (err) {
      console.log(err);
    }
    render.companies = companies;
  });
  DBConnection.query(
    "select job_id, title, name company, package, location, allowed_branches, allowed_gender, min_cpi from jobs natural join companies order by package desc;",
    (err, jobs) => {
      if (err) {
        console.log(err);
      }
      render.jobs = jobs;
      // console.log(jobs);
    }
  );
  DBConnection.query(
    "select application_id, fullname, job_id, name, title, package, status from applications natural join users natural join jobs natural join companies where applicant_id=id order by fullname;",
    (err, applications) => {
      if (err) {
        console.log(err);
      }
      render.applications = applications;
    }
  );
  setTimeout(() => {
    res.render("admin/adminPage.ejs", render);
  }, 1000);
};

let getPageAdminLogin = async (req, res) => {
  res.render("admin/adminSignIn.ejs");
};

let getEditUser = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "select * from users where id = ?",
    req.params.id,
    (err, user) => {
      if (err) {
        console.log(err);
      }
      if (!user) {
        console.log("no user found");
        return res.redirect("/admin");
      } else {
        DBConnection.query(
          "SELECT * FROM userdetails WHERE id = ?",
          [req.params.id],
          (err, userRows) => {
            if (err) {
              console.log(err);
            }
            if (userRows.length > 0) {
              console.log("userdetails: ", userRows[0]);

              DBConnection.query(
                "SELECT * FROM images WHERE id = ?",
                [req.params.id],
                function (err, imgRows) {
                  if (imgRows.length > 0) {
                    console.log("images: ", imgRows[0]);
                    return res.render("editProfile.ejs", {
                      user: user[0],
                      userDetails: userRows[0],
                      images: imgRows[0],
                    });
                  } else {
                    console.log("no image found");
                    return res.render("editProfile.ejs", {
                      user: user[0],
                      userDetails: userRows[0],
                      images: "",
                    });
                  }
                }
              );
            } else {
              return res.render("editProfile.ejs", {
                user: user[0],
                userDetails: {},
                images: "",
              });
            }
          }
        );
      }
    }
  );
};

let deleteUser = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query("delete from users where id = ?", req.params.id, (err) => {
    if (err) {
      console.log(err);
    }
  });
  DBConnection.query(
    "delete from userdetails where id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  DBConnection.query(
    "delete from images where id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  DBConnection.query(
    "delete from applications where applicant_id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 1000);
};

let getEditCompany = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  if (req.params.id != -1) {
    DBConnection.query(
      "select * from companies where company_id = ?",
      req.params.id,
      (err, company) => {
        if (err) {
          console.log(err);
        }
        if (!company) {
          console.log("no company found");
          res.redirect("/admin");
        } else {
          res.render("admin/editCompany.ejs", { company: company[0] });
        }
      }
    );
  } else {
    res.render("admin/editCompany.ejs", {
      company: {
        company_id: -1,
        name: "",
        web_link: "",
        logo_link: "",
        description: "",
      },
    });
  }
};

let updateCompany = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  console.log("req.body: ", req.body);
  if (req.params.id != -1) {
    DBConnection.query(
      "update companies set company_id = ?,name = ?, web_link = ?, logo_link = ?, description = ? where company_id = ?",
      [
        req.body.company_id,
        req.body.name,
        req.body.web_link,
        req.body.logo_link,
        req.body.description,
        req.params.id,
      ],
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } else {
    if (req.body.comapny_id != null && req.body.company_id > 0) {
      DBConnection.query(
        "insert into companies (company_id, name, web_link, logo_link, description) values (?,?,?,?,?)",
        [
          req.body.company_id,
          req.body.name,
          req.body.web_link,
          req.body.logo_link,
          req.body.description,
        ],
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    } else {
      DBConnection.query(
        "insert into companies (name, web_link, logo_link, description) values (?,?,?,?)",
        [
          req.body.name,
          req.body.web_link,
          req.body.logo_link,
          req.body.description,
        ],
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
  setTimeout(() => {
    res.redirect("/admin");
  }, 1000);
};

let deleteCompany = async (req, res) => {
  console.log("req.params.id: ", req.params.id);

  var jobs = [];
  DBConnection.query(
    "select job_id from jobs where company_id = ?",
    req.params.id,
    (err, ids) => {
      if (err) {
        console.log(err);
      } else {
        ids.forEach((element) => {
          jobs.push(element.job_id);
        });
        jobs.forEach((element) => {
          DBConnection.query(
            "delete from applications where job_id = ?",
            element,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        });
        DBConnection.query(
          "delete from jobs where company_id = ?",
          req.params.id,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        DBConnection.query(
          "delete from companies where company_id = ?",
          req.params.id,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  );

  setTimeout(() => {
    res.redirect("/admin");
  }, 1000);
};

let getEditJob = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  if (req.params.id != -1) {
    DBConnection.query(
      "select * from jobs where job_id = ?",
      req.params.id,
      (err, job) => {
        if (err) {
          console.log(err);
        }
        if (!job) {
          console.log("no job found");
          res.redirect("/admin");
        } else {
          res.render("admin/editJob.ejs", { job: job[0] });
        }
      }
    );
  } else {
    res.render("admin/editJob.ejs", { job: { job_id: -1 } });
  }
};

let updateJob = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  console.log("req.body: ", req.body);
  var branches = "";
  if (
    req.body.allowed_branches != null &&
    Array.isArray(req.body.allowed_branches)
  ) {
    req.body.allowed_branches.forEach((element) => {
      branches = branches + element + ",";
    });
    req.body.allowed_branches = branches.slice(0, -1);
  }
  var genders = "";
  if (
    req.body.allowed_gender != null &&
    Array.isArray(req.body.allowed_gender)
  ) {
    req.body.allowed_gender.forEach((element) => {
      genders = genders + element + ",";
    });
    req.body.allowed_gender = genders.slice(0, -1);
  }

  DBConnection.query(
    "select * from companies where company_id = ?",
    req.body.company_id,
    (err, company) => {
      if (err) {
        console.log(err);
      }
      if (company == null) {
        console.log(
          "no company found with the given id, hence job cant be added"
        );
        res.redirect("/admin");
      } else {
        if (req.params.id != -1) {
          DBConnection.query(
            "update jobs set job_id = ?, title = ?, job_description = ?, package = ?, location = ?, company_id = ?, allowed_branches = ?, allowed_gender = ?, min_cpi = ? where job_id = ?",
            [
              req.body.job_id,
              req.body.title,
              req.body.job_description,
              req.body.package,
              req.body.location,
              req.body.company_id,
              req.body.allowed_branches,
              req.body.allowed_gender,
              req.body.min_cpi,
              req.params.id,
            ],
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } else {
          if (req.body.job_id != null && req.body.job_id > 0) {
            DBConnection.query(
              "insert into jobs (job_id, title, job_description, package, location, company_id, allowed_branches, allowed_gender, min_cpi) values (?,?,?,?,?,?,?,?,?)",
              [
                req.body.job_id,
                req.body.title,
                req.body.job_description,
                req.body.package,
                req.body.location,
                req.body.company_id,
                req.body.allowed_branches,
                req.body.allowed_gender,
                req.body.min_cpi,
              ],
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          } else {
            DBConnection.query(
              "insert into jobs (title, job_description, package, location, company_id, allowed_branches, allowed_gender, min_cpi) values (?,?,?,?,?,?,?,?)",
              [
                req.body.title,
                req.body.job_description,
                req.body.package,
                req.body.location,
                req.body.company_id,
                req.body.allowed_branches,
                req.body.allowed_gender,
                req.body.min_cpi,
              ],
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          }
        }
      }
    }
  );

  setTimeout(() => {
    res.redirect("/admin");
  }, 1000);
};

let deleteJob = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "delete from applications where job_id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  DBConnection.query(
    "delete from jobs where job_id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 1000);
};

let acceptApplication = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "update applications set status = ? where application_id = ?",
    ["Accepted", req.params.id],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 100);
};

let rejectApplication = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "update applications set status = ? where application_id = ?",
    ["Rejected", req.params.id],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 100);
};

let resetApplication = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "update applications set status = ? where application_id = ?",
    ["Applied", req.params.id],
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 100);
};

let deleteApplication = async (req, res) => {
  console.log("req.params.id: ", req.params.id);
  DBConnection.query(
    "delete from applications where application_id = ?",
    req.params.id,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  setTimeout(() => {
    res.redirect("/admin");
  }, 100);
};

module.exports = {
  authenticate: authenticate,
  getPage: getPage,
  getPageAdminLogin: getPageAdminLogin,
  getEditUser: getEditUser,
  deleteUser: deleteUser,
  getEditCompany: getEditCompany,
  updateCompany: updateCompany,
  deleteCompany: deleteCompany,
  getEditJob: getEditJob,
  updateJob: updateJob,
  deleteJob: deleteJob,
  acceptApplication: acceptApplication,
  rejectApplication: rejectApplication,
  resetApplication: resetApplication,
  deleteApplication: deleteApplication,
};
