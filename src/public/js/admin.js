const userDiv = document.getElementById("user-table");
const userBtn = document.getElementById("toggle-user");
userBtn.onclick = function () {
console.log("calling onclick")
  if (userDiv.style.display !== "none") {
    userDiv.style.display = "none";
  } else {
    userDiv.style.display = "block";
  }
};

const companyDiv = document.getElementById("company-table");
const companyBtn = document.getElementById("toggle-company");
companyBtn.onclick = function () {
    console.log(companyBtn)
    if (companyDiv.style.display !== "none") {
        companyDiv.style.display = "none";
    } else {
        companyDiv.style.display = "block";
    }
};

const jobDiv = document.getElementById("job-table");
const jobBtn = document.getElementById("toggle-job");
jobBtn.onclick = function () {
    console.log(jobBtn)
    if (jobDiv.style.display !== "none") {
        jobDiv.style.display = "none";
    } else {
        jobDiv.style.display = "block";
    }
};

const applicationDiv = document.getElementById("application-table");
const applicationBtn = document.getElementById("toggle-application");
applicationBtn.onclick = function () {
    console.log(applicationBtn)
    if (applicationDiv.style.display !== "none") {
        applicationDiv.style.display = "none";
    } else {
        applicationDiv.style.display = "block";
    }
};


