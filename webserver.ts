import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { Status, STATUS_TEXT } from "https://deno.land/std@0.128.0/http/http_status.ts";

const hostname = Deno.env.get("SERVER_ADDRESS") || "127.0.0.1";
const port = Number(Deno.env.get("SERVER_PORT")) || 6781;

const reloadHandler = async (request: Request): Promise<Response> => {
  return new Response("Restarted", { status: Status.Accepted });
};

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (request.method === "POST" && url.pathname === "/reload") {
    return reloadHandler(request);
  }

  return new Response(STATUS_TEXT.get(Status.NotFound), { status: Status.NotFound });
};

console.log(`HTTP webserver running. Access it at: http://${hostname}:${port}`);
await serve(handler, { hostname, port });
