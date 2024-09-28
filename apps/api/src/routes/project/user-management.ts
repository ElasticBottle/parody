import { Hono } from "hono";

export const userManagementRouter = new Hono();

userManagementRouter
	.get("/", (c) => {
		return Promise.resolve(c.json({ message: "Hello, world!" }));
	})
	.post("/", (c) => {
		return Promise.resolve(c.json({ message: "Hello, world!" }));
	})
	.patch("/:id", (c) => {})
	.delete("/:id", (c) => {});
