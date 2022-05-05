const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);


describe('server', function () {
    describe('POST /login', function () {
        it('It should accept the user credentials', (done) => {
            chai.request("http://localhost:5000")
                .post("/login")
                .send({ email: "mads@mads.dk", password: 1234 })
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    done();
                })
        })

        it('It should reject the user credentials', (done) => {
            chai.request("http://localhost:5000")
                .post("/login")
                .send({ email: "wrongmail@gmail.com", password: "something" })
                .end((err, response) => {
                    response.should.have.status(401);
                    done();
                })
        })
    })
})