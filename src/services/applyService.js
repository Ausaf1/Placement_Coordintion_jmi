import DBConnection from "../configs/DBConnection";

let newApply = (data) => {
  return new Promise((resolve, reject) => {
    let application = {
      job_id: data.job_id,
      application_id: data.application_id,
      applicant_id: data.applicant_id,
      status: data.status
    };
    DBConnection.query(
      "INSERT INTO applications SET ?",
      application,
      (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = {
  newApply: newApply,
};
