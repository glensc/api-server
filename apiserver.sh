#!/bin/bash
: "${TRACE:=}"

# https://github.com/karelzak/util-linux/issues/325
switch_user() {
	local user=${SERVER_USER:-deno}
	local group=${SERVER_GROUP:-deno}
	local uid=$(id -u $user)
	local gid=$(id -g $group)

	exec setpriv --euid "$uid" --ruid "$uid" --clear-groups --egid "$gid" --rgid "$gid" -- "$@"
}

set -eu
test -n "$TRACE" && set -x

# do some common init, then switch user and execute original entrypoint
# this needs to be invoked as root
if [ "$(id -u)" = "0" ]; then
	switch_user "$@"
fi

exec "$@"
