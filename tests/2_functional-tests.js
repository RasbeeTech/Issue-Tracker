const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let projectId;
    suite('Post requests:', () => {
        test('1. Create an issue with every field', (done) => {
            chai.request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send({
                    issue_title: 'Api Tester',
                    issue_text: 'Api tester',
                    created_by: 'Mike',
                    assigned_to: 'John',
                    status_text: 'Okay',
                })
                .end((err, res) => {
                    projectId = res.body._id;
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.issue_title, 'Api Tester');
                    assert.equal(res.body.issue_text, 'Api tester');
                    assert.equal(res.body.created_by, 'Mike');
                    assert.equal(res.body.assigned_to, 'John');
                    assert.equal(res.body.status_text, 'Okay');
                    done();
                });
        });
        test('2. Create an issue with only required fields', (done) => {
            chai.request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send({
                    issue_title: 'test Tester',
                    issue_text: 'test tester',
                    created_by: 'Mike test',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.issue_title, 'test Tester');
                    assert.equal(res.body.issue_text, 'test tester');
                    assert.equal(res.body.created_by, 'Mike test');
                    done();
                });
        });
        test('3. Create an issue with missing required fields', (done) => {
            chai.request(server)
                .post('/api/issues/apitest')
                .type('form')
                .send({
                    issue_title: 'test Tester',
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.error, 'required field(s) missing');
                    done();
                });
        });
    });

    suite('Get requests:', () => {
        test('4. View issues on a project', (done) => {
            chai.request(server)
                .get('/api/issues/apitest')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.isArray(res.body);
                    done();
                });
        });
        test('5. View issues on a project with one filter', (done) => {
            chai.request(server)
                .get('/api/issues/apitest?issue_title=Api Tester')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.isArray(res.body);
                    // Test for issue title in each issue returned.
                    res.body.forEach((issue) => {
                        assert.equal(issue.issue_title, 'Api Tester');
                    });
                    done();
                });
        });
        test('6. View issues on a project with multiple filters', (done) => {
            chai.request(server)
                .get('/api/issues/apitest?status_text=Okay&created_by=Mike')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.isArray(res.body);
                    // Test for filters in all issues returned.
                    res.body.forEach((issue) => {
                        assert.equal(issue.created_by, 'Mike');
                        assert.equal(issue.status_text, 'Okay');
                    });
                    done();
                });
        });
    });
    suite('Put requests:', () => {
        test('7. Update one field on an issue', (done) => {
            chai.request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: projectId,
                    created_by: 'Jay'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body._id, projectId);
                    assert.equal(res.body.result, 'successfully updated')
                    done();
                }); 
        });
        test('8. Update multiple fields on an issue', (done) => {
            chai.request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: projectId,
                    issue_title: 'update test',
                    open: false
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body._id, projectId);
                    assert.equal(res.body.result, 'successfully updated')
                    done();
                }); 
        });
        test('9. Update an issue with missing', (done) => {
            chai.request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    issue_title: 'update test',
                    open: false
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.error, 'missing_id')
                    done();
                }); 
        });
        test('10. Update an issue with no fields to update', (done) => {
            chai.request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: projectId
                })
                .end((err, res) => {
                    console.log('come back');
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body._id, projectId);
                    done();
                }); 
        });
        test('11. Update an issue with an invalid _id', (done) => {
            chai.request(server)
                .put('/api/issues/apitest')
                .type('form')
                .send({
                    _id: 'invalid _id',
                    created_by: 'George',
                    open: false
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body._id, 'invalid _id');
                    assert.equal(res.body.error, 'could not update');
                    done();
                }); 
        });
    });
    suite('Delete requests:', () => {
        test('12. Delete an issue', (done) => {
            chai.request(server)
                .delete('/api/issues/apitest')
                .type('form')
                .send({
                    _id: projectId
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.result, 'successfully deleted');
                    assert.equal(res.body._id, projectId);
                    done();
                });
        });
        test('13. Delete an issue with an invalid _id', (done) => {
            chai.request(server)
                .delete('/api/issues/apitest')
                .type('form')
                .send({
                    _id: 'invalid _id'
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, 'invalid _id');
                    done();
                });
        });
        test('14. Delete an issue with missing _id', (done) => {
            chai.request(server)
                .delete('/api/issues/apitest')
                .type('form')
                .send({
                    id: null
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.type, 'application/json');
                    assert.equal(res.body.error, 'missing _id');
                    done();
                });
        });
    });
});
