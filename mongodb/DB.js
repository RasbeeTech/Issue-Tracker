var mongoose = require('mongoose');
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })

// DB Schemas.
const Schema = mongoose.Schema;

const issueSchema = new Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true },
    created_by: {type: String, required: true},
    assigned_to: {type: String},
    status_text: {type: String},
    created_on: {type: Date},
    updated_on: {type: Date},
    open: Boolean
});

const projectSchema = new Schema({
    project_name: {type: String, required: true},
    issues: {type: [String]}
});

// Create DB models.
let Issue = mongoose.model("Issues", issueSchema);
let Project = mongoose.model("Projects", projectSchema);

// Export DB models.
module.exports = {Issue: Issue, Project: Project};