#!/bin/bash
curl -X POST -H "Content-Type: application/json" http://127.0.0.1:1026/v2/subscriptions -d @- <<EOF
{
  "description": "Subscription for cygnus",
  "subject": {
    "entities": [
      {
        "idPattern": ".*",
        "typePattern": ".*"
      }
    ],
    "condition": {
      "attrs": [
      ]
    }
  },
  "notification": {
    "http": {
      "url": "http://cygnus:5051/notify"
    },
    "attrs": []
  },
  "expires": "2040-01-01T14:00:00.00Z"
}
EOF