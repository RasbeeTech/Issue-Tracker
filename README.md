# Issue-Tracker
API service for tracking project issues.

### Purpose:
Practice implementing unit and integrated Mocha Chai-HTTP testing.
 
### Usage examples:
Get all issues for project:  
```
GET /api/issues/{project_name}
```
Create new issue:  
```
POST /api/issues/{project_name}
```
Update issue:  
```
PUT /api/issues/{project_name}
```
Delete Issue.  
```
DELETE /api/issues/{project_name}
```
### Example return:
```
[
{ 
"_id": "5871dda29faedc3491ff93bb",
"issue_title": "Fix error in posting data",
"issue_text": "When we post data it has an error.",
"created_on": "2017-01-08T06:35:14.240Z",
"updated_on": "2017-01-08T06:35:14.240Z",
"created_by": "Joe",
"assigned_to": "Joe",
"open": true,
"status_text": "In QA"
},
...
]
```
