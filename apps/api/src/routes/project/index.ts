import { Hono } from "hono";

export const projectRouter = new Hono();

projectRouter
  .get("/", (c) => {
    return Promise.resolve(c.json({ message: "Hello, world!" }));
  })
  .post("/", (c) => {
    return Promise.resolve(c.json({ message: "Hello, world!" }));
  })
  .patch("/:id", (_c) => {})
  .delete("/:id", (_c) => {});
