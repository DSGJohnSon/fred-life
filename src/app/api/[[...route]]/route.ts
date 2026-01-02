import { Hono } from "hono";
import { handle } from "hono/vercel";

import workspaces from "@/features/workspaces/server/route";
import history from "@/features/history/server/route";

const app = new Hono().basePath("/api");

// app.get("/hello", (c) => {
//   return c.text("Hello World");
// });

// app.get("/hello/:name", (c) => {
//   const { name } = c.req.param();

//   return c.text(`Hello ${name}`);
// });

const routes = app.route("/workspaces", workspaces).route("/history", history);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
