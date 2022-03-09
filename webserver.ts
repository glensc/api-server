import { serve } from "https://deno.land/std@0.128.0/http/server.ts";

const hostname = Deno.env.get("SERVER_ADDRESS") || "127.0.0.1";
const port = Number(Deno.env.get("SERVER_PORT")) || 6781;

const handler = (request: Request): Response => {
  let body = "Your user-agent is:\n\n";
  body += request.headers.get("user-agent") || "Unknown";

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://${hostname}:${port}`);
await serve(handler, { hostname, port });
