const { Issue } = require('./DB.js');
const { Project } = require('./DB.js');

// DB methods.

const createIssue = (projectName, issue, done) => {
    Project.findOne({project_name: projectName}, (err, foundProject) => {
        if(err) return console.error(err);
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
                if(err) return console.error(err);
                let newProject = new Project({
                    project_name: projectName,
                    issues: [data._id]
                });
                newProject.save((err) => {
                    if(err) return console.error(err);
                    done(null, newIssue);
                });
            });
        } else {
            newIssue.save((err, data) => {
                foundProject.issues.push(data._id);
                foundProject.save((err) => {
                    if(err) return console.error(err);
                    done(null, newIssue);
                });
            });
        }
    });
};

const getIssues = (projectName, filter, done) => {
    Project.findOne({project_name: projectName}, (err, projectFound) => {
        if(err) return console.error(err);
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

const updateIssue = (updates, done) => {
    let findIssue = Issue.findOne({_id: updates._id});
    findIssue.select('-__v');
    findIssue.exec((err, issueFound) => {
        if(err) return done("error");
        if(!issueFound) done('No matching _id');
        else {
            if(updates.issue_title) issueFound.issue_title = updates.issue_title;
            if(updates.issue_text) issueFound.issue_text = updates.issue_text;
            if(updates.created_by) issueFound.created_by = updates.created_by;
            if(updates.assigned_to) issueFound.assigned_to = updates.assigned_to;
            if(updates.status_text) issueFound.status_text = updates.status_text;
            if(updates.open) issueFound.open = updates.open;
            issueFound.updated_on = new Date();
            issueFound.save((err, updatedData) => {
                if(err) return console.error(err);
                done(null, updatedData);
            });
        }
    });
};
const deleteIssue = (issueId, done) => {
    Issue.findOneAndDelete({_id: issueId}, (err, deletedIssue) => {
        if(err) return done("error");
        if(!deletedIssue) return done('error');
        done(null, deletedIssue);
    })
};

module.exports = {
    createIssue: createIssue,
    getIssues: getIssues,
    updateIssue: updateIssue,
    deleteIssue: deleteIssue
};