import { Hono } from "hono";
import { handle } from "hono/vercel";

import workspaces from "@/features/workspaces/server/route";
import projects from "@/features/projects/server/route";

const app = new Hono().basePath("/api");

const routes = app
	.route("/workspaces", workspaces)
	.route("/workspaces/:workspaceId/projects", projects);

export const GET = handle(routes);
export const POST = handle(routes);
export const PUT = handle(routes);
export const PATCH = handle(routes);
export const DELETE = handle(routes);

export type AppType = typeof routes;
