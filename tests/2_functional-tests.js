const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
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
});
