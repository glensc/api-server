import { serve } from "https://deno.land/std@0.128.0/http/server.ts";

const port = 8080;

const handler = (request: Request): Response => {
  let body = "Your user-agent is:\n\n";
  body += request.headers.get("user-agent") || "Unknown";

  return new Response(body, { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });