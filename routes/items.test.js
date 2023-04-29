process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");
let fakeItem1 = { name: "popsicle", price: 1.45 };
let fakeItem2 = { name: "cheerios", price: 3.4 };

beforeEach(function () {
  items.push(fakeItem1, fakeItem2);
});

afterEach(function () {
  items.length = 0;
  console.log(items);
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/store/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [fakeItem1, fakeItem2] });
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/store/items/${fakeItem1.name}`);
    console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: fakeItem1 });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/store/items/icecube`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app)
      .post("/store/items")
      .send({ name: "donut", price: 11.45 });
    console.log(res);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "donut", price: 11.45 } });
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/store/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /store/items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app)
      .patch(`/store/items/${fakeItem2.name}`)
      .send({ name: "Monster", price: 2.09 });
    console.log(res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Monster", price: 2.09 } });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app)
      .patch(`/store/items/Piggles`)
      .send({ name: "Monster", price: 2.09 });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/store/items/${fakeItem1.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid cat", async () => {
    const res = await request(app).delete(`/store/items/fake`);
    expect(res.statusCode).toBe(404);
  });
});
