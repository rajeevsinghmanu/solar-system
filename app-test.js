let mongoose = require("mongoose");
let server = require("./app");
let chai = require("chai");
let chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

// ✅ Use existing model instead of redefining
const Planet = mongoose.models.planets;

// ✅ Seed DB before tests
before(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    await Planet.deleteMany({});

    await Planet.insertMany([
        { id: 1, name: "Mercury" },
        { id: 2, name: "Venus" },
        { id: 3, name: "Earth" },
        { id: 4, name: "Mars" },
        { id: 5, name: "Jupiter" },
        { id: 6, name: "Saturn" },
        { id: 7, name: "Uranus" },
        { id: 8, name: "Neptune" }
    ]);
});

// ✅ Cleanup
after(async () => {
    await mongoose.connection.close();
});

describe('Planets API Suite', () => {

    const planets = [
        { id: 1, name: "Mercury" },
        { id: 2, name: "Venus" },
        { id: 3, name: "Earth" },
        { id: 4, name: "Mars" },
        { id: 5, name: "Jupiter" },
        { id: 6, name: "Saturn" },
        { id: 7, name: "Uranus" },
        { id: 8, name: "Neptune" }
    ];

    planets.forEach(p => {
        it(`should fetch planet ${p.name}`, (done) => {
            chai.request(server)
                .post('/planet')
                .send({ id: p.id })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(p.id);
                    res.body.should.have.property('name').eql(p.name);
                    done();
                });
        });
    });
});

// Other endpoints
describe('Testing Other Endpoints', () => {

    it('should fetch OS details', (done) => {
        chai.request(server)
            .get('/os')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('should check liveness', (done) => {
        chai.request(server)
            .get('/live')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('live');
                done();
            });
    });

    it('should check readiness', (done) => {
        chai.request(server)
            .get('/ready')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('ready');
                done();
            });
    });

});