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
      let { _id } = req.body;

      // Ensure required fields are filled out.
      if(!_id) return res.json({ error: 'missing _id' });
      if(
        req.body.issue_title == '' && req.body.issue_text == '' &&
        req.body.created_by == '' && req.body.assigned_to == '' &&
        req.body.status_text == '' && !req.body.open
      ){
        return res.json({error: 'no update field(s) sent', _id: _id })
      }
      // Update issue.
      updateIssue(req.body, (err, updatedIssue) => {
        if(err) return res.json({ error: 'could not update', _id: _id });
        res.json({
          result: 'successfully updated',
          _id: updatedIssue._id
        });
      });
    })
    
    .delete((req, res) => {
      let project = req.params.project;
      let { _id } = req.body;
      if(!_id) return res.json({ error: 'missing _id' });
      deleteIssue(_id, (err, removed) => {
        if(err) return res.json({ error: 'could not delete', '_id': _id });
        res.json({
          result: 'successfully deleted',
          _id: removed._id
        });
      });
    });
    
};
