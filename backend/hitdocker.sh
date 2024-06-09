#!/bin/bash
 curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"resource": "/", "path": "/api/tags", "httpMethod": "GET", "requestContext": {}, "multiValueQueryStringParameters": null}'

