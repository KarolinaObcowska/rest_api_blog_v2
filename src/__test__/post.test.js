process.env.NODE_ENV='test'
import config from "../utils/config";
import mongoose from "mongoose";
import { Post } from "../models/post.model";
import { app } from "../server";
import request  from "supertest";

describe('Post API /api/post', () => {
    let token;
    let userId;
    let postId;
    let commentId;
    beforeAll(async () => {
         await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        const res = await request(app)
            .post('/api/auth/signin')
            .send({ email: "test2@test.pl", password: "testtest"})
        token = res.body.token
        userId = res.body.userId
    })


    it('should fetch all posts', async () => {
        const res = await request(app)
            .get('/api/post')
            .set({ "Authorization": "Bearer:", token })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('posts')
    })

    it('should create a new post', async () => {
        const res = await request(app)
            .post('/api/post')
            .auth(token, { type: 'bearer' })
            .send({
                title: "Test post number one",
                content: "Some content for first test. Some content for first test. Some content for first test. Some content for first test. ",
            })
            expect(res.statusCode).toEqual(201)
            expect(res.body.post).toHaveProperty('title')
            expect(res.body.post).toHaveProperty('content')

    })

    it('should not create a new post because of invalid data', async () => {
        const res = await request(app)
            .post('/api/post')
            .auth(token, { type: 'bearer' })
            .send({
                title: "Test",
                content: "Some content for first test. ",
            })
            expect(res.statusCode).toEqual(422)
    })
    
    it('should not create a new post due to lack of authorization', async () => {
        const res = await request(app)
            .post('/api/post')
            .send({
                title: "Test",
                content: "Some content for first test. ",
            })
            expect(res.statusCode).toEqual(401)
    })

    describe('Post API /api/post/:id', () => {

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/post')
                .auth(token, { type: 'bearer' })
                .send({
                title: "Test post number one",
                content: "Some content for first test. Some content for first test. Some content for first test. Some content for first test. ",
            })
            postId = res.body.post._id
            const com = await request(app)
                    .post(`/api/post/comment/${postId}`)
                    .auth(token, { type: 'bearer' })
                    .send({ text: "Test comment"})
                    commentId = com.body.comments[0]._id
            })

        it('should fetch one post by specific id', async () => {
            const res = await request(app)
                .get(`/api/post/${postId}`)
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('title');
                expect(res.body).toHaveProperty('content');
        })

        it('should update post with specific id', async () => {
            const res = await request(app)
                .put(`/api/post/${postId}`)
                .auth(token, { type: 'bearer' })
                .send({
                    title: "Updated post number one",
                    content: "Some content for first test. Some content for first test. Some content for first test. Some content for first test. ",
                })
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('title');
                expect(res.body).toHaveProperty('content');
        })

        it('should add comment to specific post', async () => {
            const res = await request(app)
                .post(`/api/post/comment/${postId}`)
                .auth(token, { type: 'bearer' })
                .send({ text: "Test comment"})
                expect(res.statusCode).toEqual(200)
                commentId = res.body.comments[0].text
        })

        it('should not add comment to specific post because post does not exist', async () => {
            const res = await request(app)
                .post(`/api/post/comment/123`)
                .auth(token, { type: 'bearer' })
                .send({ text: "Test comment"})
                expect(res.statusCode).toEqual(500)
        })
       
        it('should delete specific comment from specific post', async () => {
            const res = await request(app)
                .delete(`/api/post/comment/${postId}/${commentId}`)
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(200)
        })

        it('should not delete specific comment from specific post because post does not exist', async () => {
            const res = await request(app)
                .delete(`/api/post/comment/123/${commentId}`)
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(500)
        })

        it('should not delete specific comment from specific post because comment does not exist', async () => {
            const res = await request(app)
                .delete(`/api/post/comment/${postId}/123`)
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(404)
        })

        it('should delet post with specific id', async () => {
            const res = await request(app)
                .delete(`/api/post/${postId}`)
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(200)
        })

        it('should not delete specific post because post does not exist', async () => {
            const res = await request(app)
                .delete(`/api/post/comment/123`)
                .auth(token, { type: 'bearer' })
                .send({ text: "Test comment"})
                expect(res.statusCode).toEqual(404)
        })

    })
    afterAll(async() => {
        await Post.remove({})
    })
})