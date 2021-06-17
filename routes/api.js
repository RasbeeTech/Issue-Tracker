'use strict';
const { createIssue } = require('../mongodb/DBMethods.js');
const { getIssues } = require('../mongodb/DBMethods.js');
const { updateIssue } = require('../mongodb/DBMethods.js');
const { deleteIssue } = require('../mongodb/DBMethods.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get((req, res) => {
      let filter = req.query;
      let project = req.params.project;

      console.log("filter: ", filter);

      getIssues(project, filter, (err, issues) => {
        if(err){
          res.json({error: err});
          return;
        }
        res.json(issues);
      });
    })
    
    .post((req, res) => {
      let project = req.params.project;
      let issue = {
        title: req.body.issue_title,
        text: req.body.issue_text,
        createdBy: req.body.created_by,
        assignedTo: req.body.assigned_to,
        statusText: req.body.status_text
      };
      if(!issue.title || !issue.text || !issue.createdBy){
        console.log('required field(s) missing')
        res.json({error: 'required field(s) missing'});
        return;
      }
      createIssue(project, issue, (err, data) => {
        if(err) console.error(err);
        res.json({
          _id: data._id,
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_on: data.created_on,
          updated_on: data.updated_on,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          open: data.open,
          status_text: data.status_text
        });
      });
    })
    
    .put((req, res) => {
      let project = req.params.project;
      
    })
    
    .delete((req, res) => {
      let project = req.params.project;
      
    });
    
};
