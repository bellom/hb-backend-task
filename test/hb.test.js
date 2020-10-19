import request from "supertest";
import { expect } from "chai";
import app from "../src/index";
import logger from "../src/utils/logger";
import asyncHandler from "../src/utils/asyncHandler";
import auth from "../src/middlewares/auth";

describe("HB Test Container", () => {
  let token;

  afterEach("close connection", done => {
    app.close();
    done();
  });

  describe("Login /login", () => {
    it("should login the user", done => {
      const details = { username: "admin", password: "password" };
      request(app)
        .post("/api/v1/login")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .send(details)
        .end((err, res) => {
          if (err) done(err);

          expect(res.body).to.have.a.property("status");
          expect(res.body).to.have.a.property("data");
          done();
        });
    });

    it("should have a token", done => {
      const details = { username: "admin", password: "password" };
      request(app)
        .post("/api/v1/login")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .send(details)
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Success");
          expect(res.body.data).to.have.a.property("token");
          token = res.body.data.token;
          done();
        });
    });

    it("should return status code 400 if username or password is missing", done => {
      request(app)
        .post("/api/v1/login")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .send({ username: "", password: "" })
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Error");
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("Auth Middleware", () => {
    it("should be a function", () => {
      expect(auth).to.be.a("function");
    });
  });

  describe("JSON Patch /json", () => {
    const document = { food: "rice", game: "tennis" };
    const patch = [{ op: "replace", path: "/food", value: "seafood" }];

    it("should format a json object and patch accurately", done => {
      request(app)
        .patch("/api/v1/json")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .set("Authorization", `bearer ${token}`)
        .send({ document, patch })
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Success");
          expect(res.body.data).to.be.an("object");
          expect(res.body.data).to.include({ food: "seafood" });
          expect(res.body.data).to.include({ food: "seafood", game: "tennis" });
          done();
        });
    });

    it("should return status code 400 if missing document key in the res.body", done => {
      request(app)
        .patch("/api/v1/json")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .set("Authorization", `bearer ${token}`)
        .send({ patch })
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Error");
          expect(res.status).to.equal(400);
          done();
        });
    });

    it("should return status code 400 if missing patch key in the res.body", done => {
      request(app)
        .patch("/api/v1/json")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .set("Authorization", `bearer ${token}`)
        .send({ document })
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Error");
          expect(res.status).to.equal(400);
          done();
        });
    });

    it("should return status code 400 when providing invalid patch or document", done => {
      request(app)
        .patch("/api/v1/json")
        .set("Connection", "keep alive")
        .set("Content-Type", "application/json")
        .set("Authorization", `bearer ${token}`)
        .send({
          document,
          patch: { op: "replace", path: "/food", value: "seafood" }
        })
        .end((err, res) => {
          if (err) done(err);

          expect(res.body.status).to.equal("Error");
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("Thumbnail Generator /thumbnail", function des() {
    // Increased the timeout due to slow networks
    this.timeout(120000);

    it("should return thumbnail image", done => {
      const url =
        "https://s.gravatar.com/avatar/4911939d541264c8ea392618ff56a862?size=100&default=retro";

      request(app)
        .get(`/api/v1/thumbnail?url=${url}`)
        .set("Connection", "keep alive")
        .set("Authorization", `bearer ${token}`)
        .buffer(true)
        .end((err, res) => {
          if (err) done(err);

          expect(res.headers["content-type"]).to.equal("image/jpeg");
          expect(res.status).to.equal(201);
          done();
        });
    });

    it("should return status code 400 if image url is not provided", done => {
      request(app)
        .get(`/api/v1/thumbnail`)
        .set("Connection", "keep alive")
        .set("Authorization", `bearer ${token}`)
        .buffer(true)
        .end((err, res) => {
          if (err) done(err);

          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("Logging Utility", () => {
    it("should return logger object", () => {
      expect(logger).to.be.an("object");
    });
  });

  describe("Async Handler Utility", () => {
    it("should return a function", () => {
      expect(asyncHandler()).to.be.a("function");
    });
  });
});
