import { Hono } from "hono";

const apiKeyRouter = new Hono();

apiKeyRouter
	.get("/", (c) => {
		return Promise.resolve(c.json({ message: "Hello, world!" }));
	})
	.post("/", (c) => {
		return Promise.resolve(c.json({ message: "Hello, world!" }));
	})
	.patch("/:id", (c) => {})
	.delete("/:id", (c) => {});
