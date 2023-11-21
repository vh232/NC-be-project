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
  test("400: responds with error message of bad request if entered id is not valid type", () => {
    return request(app)
      .get("/api/articles/cheese")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('404: responds with error message of "not found" if entered id does not exist', () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
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
        const { endpoints } = body;
        expect(typeof endpoints).toBe("object");
        const keys = Object.keys(endpoints);
        keys.forEach((key) => {
          expect(endpoints[key]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            format: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns array of comments for given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBeGreaterThan(1);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: returns array of comments ordered by most recent", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test('400: returns with "bad request" as error message when invalid input of id type', () => {
    return request(app)
      .get("/api/articles/cheese/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('404: returns with "not found" as error message when passed non-existent id', () => {
    return request(app)
      .get("/api/articles/1045/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("200: returns an empty array if article exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns an array of article objects with added comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: returns array of article objects arranged by date in ascending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test('200: returns array of article objects without a "body" property', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with success code when comment is created, returns object of posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "best article ever",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toEqual({
          article_id: 2,
          author: "butter_bridge",
          body: "best article ever",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  test("404: responds error message of 'not found' if article doesn't exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "best article ever",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds error message of 'bad request' if article_id is wrong type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "best article ever",
    };
    return request(app)
      .post("/api/articles/cheese/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds error message of 'user does not exist' if user doesn't exist", () => {
    const newComment = {
      username: "vh232",
      body: "best article ever",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
  test("400: responds error message of 'incorrect format' if input comment has incorrect key", () => {
    const newComment = {
      usernames: "butter_bridge",
      body: "best article ever",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect format");
      });
  });
  test("400: responds error message of 'incorrect format' if input comment doesn't contain all keys needed", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("incorrect format");
      });
  });
  test("201: responds with success code and posts new comment as long as username and body keys are present. Returns posted comment, ignoring any extra keys.", () => {
    const newComment = {
      username: "butter_bridge",
      body: "best article ever",
      extraKey: "whoops",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toEqual({
          article_id: 2,
          author: "butter_bridge",
          body: "best article ever",
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: returns no content upon successful deletion of comment", () => {
    return request(app)
    .delete("/api/comments/2")
    .expect(204);
  });
  test('404: returns "not found" when non-existent comment_id entered', () => {
    return request(app)
    .delete("/api/comments/100")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('not found')
    })
  });
  test('400: returns "bad request" when invalid type of comment_id entered', () => {
    return request(app)
    .delete("/api/comments/cheese")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('bad request')
    })
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: returns updated article with correct new votes if upvoting", () => {
    const updatedArticle = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 200,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("200: returns updated article with correct new votes if downvoting", () => {
    const updatedArticle = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toEqual(90);
      });
  });
  test("200: returns updated article with correct new votes when passed more than just inc_votes key", () => {
    const updatedArticle = {
      inc_votes: -60,
      extraKey: "whoops"
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toEqual(40);
      });
  });
  test('404: returns error code and message "not found" if article_id does not exist', () => {
    const updatedArticle = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/articles/1100")
      .send(updatedArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns error code and message "bad request" if article_id is invalid type', () => {
    const updatedArticle = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/articles/cheese")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns error code and message "bad request" if invalid type of inc_votes is passed', () => {
    const updatedArticle = {
      inc_votes: "orange",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns error code and message "bad request" if no inc_votes key is passed', () => {
    const updatedArticle = {
      inc_vote: 5,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
