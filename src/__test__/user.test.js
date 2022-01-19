import config from "../utils/config";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { app } from "../server";
import request  from "supertest";

describe('User API', () => {
    let token;
    let userId;
    beforeAll(async () => {
         await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true, useUnifiedTopology: true
            
        });
    })
    describe('Authorization SignIn/SignUp /api/auth', () => {
        it('should sign up new user', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ 
                        firstname: "Test", 
                        lastname: "Test", 
                        email: "test9@test.pl", 
                        password: "testtest"
                    })
                expect(res.statusCode).toEqual(201)
                expect(res.body).toHaveProperty('token')
                expect(res.body).toHaveProperty('userId')
        })
        it('should not sign up new user because user already exists', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({ 
                        firstname: "Test", 
                        lastname: "Test", 
                        email: "test9@test.pl", 
                        password: "testtest"
                    })
                expect(res.statusCode).toEqual(409)
        })
        it('should sign in user', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({ 
                    email: "test9@test.pl", 
                    password: "testtest" 
                })
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('userId')
                expect(res.body).toHaveProperty('token')
                token = res.body.toekn;
                userId = res.body.userId
        });
        it('should not sign in user because user does not exist', async () => {
            const res = await request(app)
                .post('/api/auth/signin')
                .send({ 
                    email: "test15@test.pl", 
                    password: "testtest" 
                })
                expect(res.statusCode).toEqual(401)
        });
    })
    describe('User API /api/user', () => {
        it('should get user profile /api/user/me', async () => {
            const res = await request(app)
                .get('/api/user/me')
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('user')


        })
        it('should get user status /api/user', async () => {
            const res = await request(app)
                .get('/api/user')
                .auth(token, { type: 'bearer' })
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('status')
        })
        it('should update user status /api/user', async () => {
            const res = await request(app)
                .put('/api/user')
                .auth(token, { type: 'bearer' })
                .send({ status: "My new status" })
                expect(res.statusCode).toEqual(200)
                expect(res.body).toHaveProperty('status')
        })
    })
    afterAll(async () => {
        await User.deleteOne({ _id: userId})
    })
});