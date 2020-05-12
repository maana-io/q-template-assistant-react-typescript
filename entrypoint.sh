#!/bin/sh

readonly CACHE_BREAKER=$(date +%s)

echo $NODE_ENV

[ -z "$PORT" ] && echo "Need to set PORT" && exit 1;

pushstate-server -p $PORT -d build
