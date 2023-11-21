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
        });
      });
    });
  });

  describe("GET /api/articles/:article_id", () => {
    test("200: returns an article object when passed a valid id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
    test('400: responds with error message of bad request if entered id is not valid type', () => {
      return request(app)
      .get('/api/articles/cheese')
      .expect(400)
      .then(( { body }) => {
        expect(body.msg).toBe('bad request')
      })
    });
    test('404: responds with error message of "not found" if entered id does not exist', () => {
      return request(app)
      .get('/api/articles/1000')
      .expect(404)
      .then(( { body }) => {
        expect(body.msg).toBe('not found')
      })
    });
  });

  describe("app.all error handler for none-existent paths", () => {
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

  describe('GET /api/articles/:article_id/comments', () => {
    test('200: returns array of comments for given article_id', () => {
      return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        expect(comments.length).toBeGreaterThan(1)
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number)
          })
        })
        })
      })
      test('200: returns array of comments ordered by most recent', () => {
        return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        expect(comments).toBeSortedBy('created_at', { descending: true})
      });
    });
    test('400: returns with "bad request" as error message when invalid input of id type', () => {
      return request(app)
      .get("/api/articles/cheese/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request')
      })
    });
    test('404: returns with "not found" as error message when passed non-existent id', () => {
      return request(app)
      .get("/api/articles/1045/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('not found')
      })
    });
    test('200: returns an empty array if article exists but has no comments', () => {
      return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([])
      })
    });
  });

describe("GET /api/articles", () => {
  test('200: returns an array of article objects with added comment count', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body
      expect(articles.length).toBe(13)
      articles.forEach((article) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String)
        });
      })
    })
  });
  test('200: returns array of article objects arranged by date in ascending order', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(( { body }) => {
      const { articles } = body
      expect(articles).toBeSortedBy('created_at', { descending: false})
    })
  });
  test('200: returns array of article objects without a "body" property', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(( { body }) => {
      const { articles } = body
      expect(articles.length).toBe(13)
      articles.forEach((article) => {
        expect(article).not.toHaveProperty('body')
      })
    })
  });
})