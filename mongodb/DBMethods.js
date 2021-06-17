const { Issue } = require('./DB.js');
const { Project } = require('./DB.js');

// DB methods.

const createIssue = (projectName, issue, done) => {
    Project.findOne({project_name: projectName}, (err, foundProject) => {
        if(err) console.log(err);
        let newIssue = new Issue({
            issue_title: issue.title,
            issue_text: issue.text,
            created_by: issue.createdBy,
            assigned_to: issue.assignedTo ? issue.assignedTo : "",
            status_text: issue.statusText ? issue.statusText : "",
            created_on: new Date(),
            updated_on: new Date(),
            open: true
        });
        if(!foundProject){
            newIssue.save((err, data) => {
                if(err) console.error(err);
                let newProject = new Project({
                    project_name: projectName,
                    issues: [data._id]
                });
                newProject.save((err) => {
                    if(err) console.error(err);
                    done(null, newIssue);
                });
            });
        } else {
            newIssue.save((err, data) => {
                foundProject.issues.push(data._id);
                foundProject.save((err) => {
                    if(err) console.error(err);
                    done(null, newIssue);
                });
            });
        }
    });
};

const getIssues = (projectName, filter, done) => {
    Project.findOne({project_name: projectName}, (err, projectFound) => {
        if(err) console.error(err);
        if(!projectFound){
            done("No project found by the name: " + projectName);
        } else {
            let findIssues = Issue.find({_id: {$in: projectFound.issues}});
            // filter issues if filters are provided.
            if(Object.keys(filter).length > 0){
                findIssues.find(filter);
            }
            findIssues.select('-__v');

            findIssues.exec((err, foundIssues) => {
                if(err) return console.error(err);
                done(null, foundIssues);
            });
        }
    })
};
const updateIssue = () => {

};
const deleteIssue = () => {

};

module.exports = {
    createIssue: createIssue,
    getIssues: getIssues,
    updateIssue: updateIssue,
    deleteIssue: deleteIssue
};