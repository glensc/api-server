FROM denoland/deno:centos-1.19.2 AS base

FROM base
WORKDIR /app
COPY webserver.ts .
# Put deno deps to /app/deno
ENV DENO_DIR=/app/deno
RUN deno cache webserver.ts
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-run", "webserver.ts"]

# Add entrypoint switching user
COPY --chmod=755 apiserver.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
