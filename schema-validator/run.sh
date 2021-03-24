#!/bin/bash

case "$1" in
    start)
        docker-compose -p orchestrator -f docker-compose.yaml up -d
        ;;
    stop)
        docker-compose -p orchestrator -f docker-compose.yaml stop
        ;;
    clean)
        docker-compose -p orchestrator -f docker-compose.yaml stop
        docker-compose -p orchestrator -f docker-compose.yaml rm -f
        docker volume prune -f
        docker network prune -f
        ;;
    build)
        docker-compose -p orchestrator -f docker-compose.yaml build
        ;;
    *)
        echo "run.sh start|stop|clean|build"
esac