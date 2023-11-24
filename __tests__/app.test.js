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
  test("200: returns array of article objects arranged by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
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
        expect(body.msg).toBe("not found");
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
    return request(app).delete("/api/comments/2").expect(204);
  });
  test('404: returns "not found" when non-existent comment_id entered', () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns "bad request" when invalid type of comment_id entered', () => {
    return request(app)
      .delete("/api/comments/cheese")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: returns array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBeGreaterThan(1);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
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
      extraKey: "whoops",
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

describe("GET /api/articles (topic query)", () => {
  test("200: returns array of articles in specified topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test('404: returns "not found" when passed invalid topic', () => {
    return request(app)
      .get("/api/articles?topic=cheese")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("200: returns article object with added property of comment_count", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("comment_count", "1");
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("200: returns array of articles sorted by input column in default descending order", () => {
    return request(app)
      .get("/api/articles/?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test('200: returns array of articles by input order using default "created_at" for sort_by', () => {
    return request(app)
      .get("/api/articles/?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test('400: returns "bad request" when invalid sort_by is entered', () => {
    return request(app)
      .get("/api/articles/?sort_by=cheese")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns "bad request" when invalid order is entered', () => {
    return request(app)
      .get("/api/articles/?order=up")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users/username", () => {
  test("200: returns individual user object for specified username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test('404: returns "not found" if username does not exist', () => {
    return request(app)
      .get("/api/users/nonexistentuser")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: returns updated comment with correct new votes when upvoting", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.votes).toBe(26);
      });
  });
  test("200: returns updated comment with correct new votes when downvoting", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: -10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.votes).toBe(6);
      });
  });
  test("200: returns updated comment with correct new votes when passed more than just the inc_votes key", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        inc_votes: -10,
        extraKey: 50,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedComment.votes).toBe(6);
      });
  });
  test('400: returns "bad request" when no inc_votes property is entered', () => {
    return request(app)
      .patch("/api/comments/1")
      .send({
        extraKey: 50,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('404: returns "not found" if no comment matches comment_id', () => {
    return request(app)
      .patch("/api/comments/100")
      .send({
        extraKey: 50,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns error code and message "bad request" if comment_id is invalid type', () => {
    const updatedComment = {
      inc_votes: 100,
    };
    return request(app)
      .patch("/api/comments/cheese")
      .send(updatedComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns error code and message "bad request" if invalid type of inc_votes is passed', () => {
    const updatedComment = {
      inc_votes: "orange",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(updatedComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: returns successful response with posted article", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Here's my new article",
      body: "This is an article about cats",
      topic: "cats",
      article_img_url: "cat-pic-url",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Here's my new article",
          body: "This is an article about cats",
          topic: "cats",
          article_img_url: "cat-pic-url",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test("201: returns successful response with posted article using default article_img_url if none-provided", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Here's my new article",
      body: "This is an article about cats",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Here's my new article",
          body: "This is an article about cats",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test("201: returns successful response with posted article even when extra keys are provided", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Here's my new article",
      body: "This is an article about cats",
      topic: "cats",
      extraKey: "whoops",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedArticle).toMatchObject({
          author: "butter_bridge",
          title: "Here's my new article",
          body: "This is an article about cats",
          topic: "cats",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          article_id: expect.any(Number),
          votes: 0,
          created_at: expect.any(String),
          comment_count: "0",
        });
      });
  });
  test('404: returns "not found" when nonexistent user is entered as author', () => {
    const newArticle = {
      author: "non-existent user",
      title: "Here's my new article",
      body: "This is an article about cats",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('404: returns "not found" when nonexistent topic is entered as topic', () => {
    const newArticle = {
      author: "butter_bridge",
      title: "Here's my new article",
      body: "This is an article not about cats",
      topic: "notcats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns "bad request" if missing properties', () => {
    const newArticle = {
      title: "Here's my new article",
      body: "This is an article not about cats",
      topic: "notcats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/topics", () => {
  test("201: returns newly posted topic when request is successful", () => {
    const newTopic = {
      slug: "dogs",
      description: "not cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.newTopic).toEqual({
          slug: "dogs",
          description: "not cats",
        });
      });
  });
  test("201: returns newly posted topic when request is successful even if extra keys are input", () => {
    const newTopic = {
      slug: "dogs",
      description: "not cats",
      extraKey: "whoops",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.newTopic).toEqual({
          slug: "dogs",
          description: "not cats",
        });
      });
  });
  test("201: successfully posts new topic when pre-existing description is used", () => {
    const newTopic = {
      slug: "cats2",
      description: "duplicating the cats topic",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.newTopic).toEqual(newTopic);
      });
  });
  test("400: returns 'bad request' when pre-existing topic is passed", () => {
    const newTopic = {
      slug: "cats",
      description: "duplicating the cats topic",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns 'bad request' when required key is missing", () => {
    const newTopic = {
      description: "not cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns 'bad request' when empty string entered for topic", () => {
    const newTopic = {
      topic: "",
      description: "not cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns 'bad request' when empty string entered for description", () => {
    const newTopic = {
      topic: "",
      description: "not cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns 'bad request' when no letter or number characters are entered for topic", () => {
    const newTopic = {
      topic: "      ",
      description: "not cats",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: returns 'bad request' when no letter or number characters are entered for description", () => {
    const newTopic = {
      topic: "empty space descp",
      description: "     ",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: returns empty body when article is successfully deleted alongside its comments", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("204: returns empty body when article is successfully deleted even if it has no comments", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test('404: returns "not found" when article_id is non-existent', () => {
    return request(app)
      .delete("/api/articles/1100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns "bad request" when article_id is invalid type', () => {
    return request(app)
      .delete("/api/articles/wrongtype")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles (pagination)", () => {
  test("200: returns articles paginated according to input", () => {
    return request(app)
      .get("/api/articles?limit=5&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(5);
      });
  });
  test("200: returns articles paginated with a limit of 10 as default", () => {
    return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("200: returns articles limited to 10 on page 1 as default", () => {
    return request(app)
      .get("/api/articles?limit=10")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
      });
  });
  test("200: returns articles with limit and by page when using sort_by query", () => {
    return request(app)
      .get("/api/articles?limit=10&p=1&sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("200: returns articles with limit and by page when using order query", () => {
    return request(app)
      .get("/api/articles?limit=10&p=1&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(10);
        expect(body.articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("200: returns articles with limit and by page when filtering by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats&limit=10&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
      });
  });
  test('400: returns "bad request" when invalid limit entered', () => {
    return request(app)
      .get("/api/articles?limit=invalid&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns "bad request" when invalid page type entered', () => {
    return request(app)
      .get("/api/articles?limit=10&p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles/article_id/comments (pagination)", () => {
  test("200: returns array of comments paginated according to input", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
      });
  });
  test("200: returns array of comments paginated with a default limit of 10", () => {
    return request(app)
      .get("/api/articles/1/comments?p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(10);
      });
  });
  test("200: returns array of comments limited to input on page 1 by default", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(5);
      });
  });
  test('404: returns "not found" if no article with that id', () => {
    return request(app)
      .get("/api/articles/1000/comments?limit=5&p=1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test('400: returns "bad request" if no article with that id', () => {
    return request(app)
      .get("/api/articles/invalidid/comments?limit=5&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns "bad request" when invalid limit entered', () => {
    return request(app)
      .get("/api/articles/1/comments?limit=invalid&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test('400: returns "bad request" when invalid page type entered', () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&p=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
