#!/bin/bash

LOCAL_URL=http://localhost:3000

ab -n 1000 -c 10 -T 'application/json' -p ./test/stress/create_data.json $LOCAL_URL/api/v1/products > test/stress/create-report.txt &
ab -n 1000 -c 10 $LOCAL_URL/api/v1/products > test/stress/get-paginated-report.txt &
echo "Waiting for stress tests to finish..."
sleep 10
echo "Stress tests finished! Check the reports in test/stress folder."
