const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const createApolloServer = require("../server");
const User = require("../models/user");

var url, server;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany({});

  ({ server, url } = await createApolloServer({
    listen: {
      port: 0,
    },
  }));
});

afterAll(async () => {
  await mongoose.connection.close();
  await server?.stop();
});

describe("Testing server", () => {
  const queryData = {
    query: `query {
          hello
          }`,
  };

  it("should return 200 and includes hello string", async () => {
    const response = await request(url).post("/").send(queryData);
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.hello).toMatch(/\hello\b/i);
  });
});

describe("Testing user creation", () => {
  const getCreateUserQuery = (email, password) => ({
    query: `mutation Mutation($input: CreateUserInput!) {
      createUser(input: $input) {
        user {
          id
          email
        }
        token
      }
    }
    `,
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  const email = "yyy@yyy12234.com";
  const password = "1212";

  it("should return 200 and includes user object and token string", async () => {
    const response = await request(url)
      .post("/")
      .send(getCreateUserQuery(email, password));

    const token = response.body.data?.createUser?.token;
    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.createUser).toMatchObject({
      user: {
        email,
      },
      token: expect.any(String),
    });

    expect(() => jwt.verify(token, process.env.JWT_SECRET)).not.toThrow();
  });

  it("should return error if email is already exist in DB", async () => {
    const response = await request(url)
      .post("/")
      .send(getCreateUserQuery(email, password));

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors?.[0]?.message).toMatch(/already/i);
  });

  it("should return error if email is not valid", async () => {
    const response = await request(url)
      .post("/")
      .send(getCreateUserQuery("asfasflkj", password));

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors?.[0]?.message).toMatch(/valid/i);
  });
});
