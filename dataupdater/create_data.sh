#!/bin/bash

curl -X POST http://orion:1026/v2/entities -H "Content-Type: application/json" -d @- <<EOF
{
    "id": "my%20test7",
    "type": "Test",
    "essai": {
        "value": 12,
        "type": "Number"
    },
    "essai2": {
        "value": 14,
        "type": "Number"
    }
}
EOF