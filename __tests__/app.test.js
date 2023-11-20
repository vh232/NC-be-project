const request = require('supertest')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe('GET /api/topics', () => {
    test('200: returns array of all topics', () => {
        return request(app)
        .get("/api/topics")
        .expect(400)
        .then(({ body }) => {
            const { topics } = body
            expect(Array.isArray(topics)).toBe(true)
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
    test('404: responds with "path not found" if typo passed in url', () => {
        return request(app)
        .get('/api/topic')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('path not found')
        })
    });
});

describe('GET /api/articles/:article_id', () => {
    test('200: returns an article object when passed a valid id', () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            expect(typeof body).toEqual(object)
        })
    });
});