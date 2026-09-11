#!/bin/sh
#
# Serves kosmos for local development.
#
# There is no backend here — kosmos is a design system. The two halves it does
# have are the library and the Storybook that renders it, so this script runs
# those: `tsup --watch` rebuilding `@aether-zone/kosmos` on every change, and
# Storybook on 6006.
#
# A full build has to happen first, and it is not optional. Storybook's
# `src/styles.css` imports `@kosmos/tokens/tokens.css` and the library's
# `dist/theme.css`, so with a missing or stale `dist` every story renders
# unstyled. `tsup --watch` alone does not cover it: the `build` script also
# runs Style Dictionary and the Tailwind CLI, and watch mode rebuilds only the
# JavaScript. A change to a *token* therefore needs this script restarted.
#
# Ctrl-C stops both. If either exits on its own the other is stopped too.
#
#   ./dev.sh                      Storybook on 6006
#   PORT=7006 ./dev.sh            move it
set -eu

cd "$(dirname "$0")"

STORYBOOK_PORT="${PORT:-6006}"

# `nc` and `lsof` are both common but neither is guaranteed. With neither, skip
# the check rather than refuse to start: it is a courtesy, not a gate.
port_in_use() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
    elif command -v nc >/dev/null 2>&1; then
        nc -z 127.0.0.1 "$1" >/dev/null 2>&1
    else
        return 1
    fi
}

if port_in_use "$STORYBOOK_PORT"; then
    echo "kosmos: port $STORYBOOK_PORT is already in use." >&2
    echo "  Stop whatever holds it, or set PORT." >&2
    exit 1
fi

echo "kosmos: building tokens and the library first, so stories are styled…"
pnpm build

# Job control, so each child leads its own process group. `pnpm` spawns the
# real process as a grandchild, and signalling only the wrapper leaves that
# holding the port.
set -m

lib_pid=''
sb_pid=''
stopping=''

stop_pid() {
    [ -n "$1" ] || return 0
    kill -TERM "-$1" 2>/dev/null || kill -TERM "$1" 2>/dev/null || true
}

stop_children() {
    stopping='yes'
    stop_pid "$lib_pid"
    stop_pid "$sb_pid"
}

trap 'stop_children' TERM INT

echo
echo "kosmos: storybook    http://localhost:${STORYBOOK_PORT}"
echo

pnpm --filter @aether-zone/kosmos dev &
lib_pid=$!

# `exec` rather than the workspace's own `storybook` script: that script pins
# `-p 6006`, and arguments passed through `pnpm run` arrive after it rather
# than replacing it, so the port could not be moved.
pnpm --filter @kosmos/storybook exec storybook dev -p "$STORYBOOK_PORT" &
sb_pid=$!

# Poll both children. `kill -0` asks whether a process is still there without
# signalling it; `wait -n` would be neater but needs bash 4.3+, and this has to
# run under whatever /bin/sh is.
while true; do
    if ! kill -0 "$lib_pid" 2>/dev/null; then
        wait "$lib_pid" 2>/dev/null && status=0 || status=$?
        [ -n "$stopping" ] || echo "kosmos: the library build exited ($status); stopping." >&2
        stop_children
        wait "$sb_pid" 2>/dev/null || true
        exit "$status"
    fi

    if ! kill -0 "$sb_pid" 2>/dev/null; then
        wait "$sb_pid" 2>/dev/null && status=0 || status=$?
        [ -n "$stopping" ] || echo "kosmos: storybook exited ($status); stopping." >&2
        stop_children
        wait "$lib_pid" 2>/dev/null || true
        exit "$status"
    fi

    sleep 1
done
