/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
import request from 'supertest';
import config from '../utils/config';
import { User } from '../models/user.model';
import { app } from '../server';

describe('User API', () => {
  let token;
let userId;

  beforeAll(async () => {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  describe('Authorization SignIn/SignUp /api/auth', () => {
    it('should sign up new user', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Test',
          lastname: 'Test',
          email: 'test9@test.pl',
          password: 'testtest',
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
    });
    it('should not sign up new user because user already exists', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          firstname: 'Test',
          lastname: 'Test',
          email: 'test9@test.pl',
          password: 'testtest',
        });
      expect(res.statusCode).toEqual(409);
    });
    it('should sign in user', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test9@test.pl',
          password: 'testtest',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('userId');
      expect(res.body).toHaveProperty('token');
      token = res.body.toekn;
      userId = res.body.userId;
    });
    it('should not sign in user because user does not exist', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test15@test.pl',
          password: 'testtest',
        });
      expect(res.statusCode).toEqual(401);
    });
  });
  afterAll(async() => {
    await User.deleteOne({ _id: userId });
  });
});
