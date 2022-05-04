import { serve } from "https://deno.land/std@0.128.0/http/server.ts";
import { Status, STATUS_TEXT } from "https://deno.land/std@0.128.0/http/http_status.ts";

const hostname = Deno.env.get("SERVER_ADDRESS") || "127.0.0.1";
const port = Number(Deno.env.get("SERVER_PORT")) || 6781;
const serverToken = Deno.env.get("SERVER_TOKEN") || Math.random();

const runCommand = async (cmd: string[]) => {
  const p = Deno.run({
    stdin: "null",
    stdout: "piped",
    stderr: "piped",
    cmd,
  });

  type AwaitType = [Deno.ProcessStatus, Uint8Array, Uint8Array];
  const [status, stdoutBytes, stderrBytes]: AwaitType = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput(),
  ]);
  p.close();

  const [stdout, stderr] = [
    new TextDecoder().decode(stdoutBytes),
    new TextDecoder().decode(stderrBytes),
  ];
  if (stderr) {
    throw new Error("Error: " + stderr);
  }
  if (!status.success) {
    throw new Error("Error: " + status);
  }

  return stdout;
};

const reloadHandler = async (request: Request): Promise<Response> => {
  const authToken = request.headers.get("x-authorization");
  if (authToken !== serverToken) {
    return new Response(STATUS_TEXT.get(Status.Forbidden), { status: Status.Forbidden });
  }

  let output;
  try {
    output = await runCommand("echo abcd".split(' '));
  } catch (e) {
    return new Response(e.message, { status: Status.ServiceUnavailable });
  }

  return new Response(output, { status: Status.Accepted });
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
