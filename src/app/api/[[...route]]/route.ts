import { Hono } from "hono";
import { handle } from "hono/vercel";

// import auth from "@/features/auth/server/route";

const app = new Hono().basePath("/api");

// app.get("/hello", (c) => {
//   return c.text("Hello World");
// });

// app.get("/hello/:name", (c) => {
//   const { name } = c.req.param();

//   return c.text(`Hello ${name}`);
// });

// const routes = app.route("/auth", auth);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
// export type AppType = typeof routes;
