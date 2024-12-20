let jobsFile = document.getElementById("fileUpload");
let jobList = document.getElementById("jobList");
let filterButton = document.getElementById("filter")
let sortButton = document.getElementById("Sort");
let filterStatus = [document.getElementById("filByLevel"),document.getElementById("filByType"),document.getElementById("filBySkill")];
let sortStatus = document.getElementById("Sort by");
let jobs = [];

jobsFile.addEventListener("change", parseJson);
filterButton.addEventListener("click", listJobs);
sortButton.addEventListener("click", sortJobs);

// parses a json file
function parseJson(event) {
    // collect file
    let files = event.target.files;

    let filereader = new FileReader();

    // parse JSON file content 
    filereader.onload = function() {
        let content = filereader.result;
        try {
            jobs = JSON.parse(content);
            sortJobs();
            listJobs();
        } catch (e) {
            alert("Invalid JSON file.");
        }
    }

    filereader.readAsText(files[0]);
}

// check if a job fits all of the filters
function filterCheck(job) {
    levelFilter = false;
    typeFilter = false;
    skillFilter = false;
    if (job.Level == filterStatus[0].value || filterStatus[0].value == "all") {
        levelFilter = true;
    }
    if (job.Type == filterStatus[1].value || filterStatus[1].value == "all") {
        typeFilter = true;
    }
    if (job.Skill == filterStatus[2].value || filterStatus[2].value == "all") {
        skillFilter = true;
    }
    fitsFilters = levelFilter && typeFilter && skillFilter;
    return fitsFilters;
}

// displays list of jobs
function listJobs() {
    // clear previous items
    jobList.innerHTML = '';

    // create list element for each job
    jobs.forEach(job => {
        if (filterCheck(job)) {
            // create element
            let jobItem = document.createElement('div');
            jobItem.classList.add('job-item');
            jobItem.classList.add('collapsed');

            // display job info
            jobItem.innerHTML = `
                <h4>
                    <span class="job-title">${job['Title']}</span> - 
                    <span class="job-type">${job['Type']}</span> 
                    (<span class="job-level">${job['Level']}</span>)
                </h4>
            `;

            // event listener for when users click a job
            jobItem.addEventListener('click', () => toggleDetails(jobItem, job));

            // add job to list to display it
            jobList.appendChild(jobItem);
        }
    });

    // if list is empty, tell user no jobs were found
    if (jobList.innerHTML == '') {
        jobList.innerHTML = 'No jobs found.'
    }
}

function toggleDetails(jobItem, job) {
    // toggle visibility of job details
    if (jobItem.classList.contains('collapsed')) {
        // expand job item and show details
        jobItem.innerHTML = `
            <h4>
                <a href="${job['Job Page Link']}" target="_blank">${job['Title']}</a> - 
                <span class="job-type">${job['Type']}</span> 
                (<span class="job-level">${job['Level']}</span>)
            </h4>
            <p><strong>Job No:</strong> ${job['Job No']}</p>
            <p><strong>Posted:</strong> ${job['Posted']}</p>
            <p><strong>Estimated Time:</strong> ${job['Estimated Time']}</p>
            <p><strong>Skill:</strong> ${job['Skill']}</p>
            <p><strong>Details:</strong> ${job['Detail']}</p>
        `;
        jobItem.classList.remove('collapsed');
    } else {
        // collapse job item and show summary again
        jobItem.innerHTML = `
            <h4>
                <span class="job-title">${job['Title']}</span> - 
                <span class="job-type">${job['Type']}</span> 
                (<span class="job-level">${job['Level']}</span>)
            </h4>
        `;
        jobItem.classList.add('collapsed');
    }
}

// calls a function to sort jobs depending on user selection
function sortJobs() {
    if (sortStatus.value == "Title") {
        sortByTitle();
    } else if (sortStatus.value == "Newest") {
        sortNewest();
    } else {
        sortOldest();
    }

    listJobs();
}

// bubble sort jobs by name
function sortByTitle() {
    let n = jobs.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            if (jobs[j].Title > jobs[j + 1].Title) {
                let temp = jobs[j];
                jobs[j] = jobs[j + 1];
                jobs[j + 1] = temp;

                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }
}

// bubble sort jobs by post date in ascending order
function sortNewest() {
    let n = jobs.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            // collect post time
            let job1PostTime = jobs[j].Posted;
            let job2PostTime = jobs[j+1].Posted;
            job1PostTime = job1PostTime.split(" ");
            job2PostTime = job2PostTime.split(" ");
            let a = Number (job1PostTime[0]);
            let b = Number (job2PostTime[0]);

            // account for unit discrepancies
            if (job1PostTime[1] == 'hours' || job1PostTime[1] == 'hour') {
                a *= 60;
            }
            if (job2PostTime[1] == 'hours' || job2PostTime[1] == 'hour') {
                b *= 60;
            }


            if (a > b) {
                let temp = jobs[j];
                jobs[j] = jobs[j + 1];
                jobs[j + 1] = temp;

                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }
}

// bubble sort jobs by post date in descending order
function sortOldest() {
    let n = jobs.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            // collect post time
            let job1PostTime = jobs[j].Posted;
            let job2PostTime = jobs[j+1].Posted;
            job1PostTime = job1PostTime.split(" ");
            job2PostTime = job2PostTime.split(" ");
            let a = Number (job1PostTime[0]);
            let b = Number (job2PostTime[0]);

            // account for unit discrepancies
            if (job1PostTime[1] == 'hours' || job1PostTime[1] == 'hour') {
                a *= 60;
            }
            if (job2PostTime[1] == 'hours' || job2PostTime[1] == 'hour') {
                b *= 60;
            }

            
            if (a < b) {
                let temp = jobs[j];
                jobs[j] = jobs[j + 1];
                jobs[j + 1] = temp;

                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }
    }
}