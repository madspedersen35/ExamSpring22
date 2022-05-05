const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../Users')

chai.use(chaiHttp);


describe('server', () => {
    describe('POST /register', () => {
        it('should push req.body to an array', (done) => {
            chai
            .request(app)
            .post('/register')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res.status).to.equal(200);
                done();
            })
            
        })
    })
})