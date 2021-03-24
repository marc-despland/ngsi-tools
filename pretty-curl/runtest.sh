#!/bin/bash

cmd=test
case "$1" in
    debug)
        cmd=test-brk
        ;;
    one)
        export TEST=$2
        cmd=onetest
        ;;
    onedebug)
        export TEST=$2
        cmd=onetest-brk
        ;;
esac
export NGSIAGENT_NETWORK=envtest_default
export PROXY_API_URL=http://172.17.0.1:8082
export PROXY_ENDPOINT=http://172.17.0.1:8083
export ORCHESTRATOR_TOKEN_FILE=./secrets/dal.orchestrator.api.token
export PROXY_API_TOKEN_FILE=./secrets/dal.proxy.api.token 
npm run $cmd