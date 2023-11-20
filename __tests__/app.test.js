const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: returns array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        })
    })
});
        test('404: responds with "path not found" if typo passed in url', () => {
          return request(app)
            .get("/api/topic")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("path not found");
            });
        });
      });

  describe("GET /api", () => {
    test("200: returns object of all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            const { endpoints } = body
          expect(typeof endpoints).toBe("object");
          const keys = Object.keys(endpoints)
          keys.forEach((key) => {
            expect(endpoints[key]).toMatchObject({
                description: expect.any(String),
                queries: expect.any(Array),
                format: expect.any(String),
                exampleResponse: expect.any(Object)
            })
          })
        });
    });
  });
