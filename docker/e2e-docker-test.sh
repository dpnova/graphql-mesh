#!/bin/bash

create_proxy_config_file_for_testing() {
  cat <<EOL > mesh.config.ts
import { defineConfig as defineServeConfig } from '@graphql-mesh/serve-cli'

export const serveConfig = defineServeConfig({
  proxy: {
    endpoint: 'https://countries.trevorblades.com'
  }
})
EOL
}

start_container() {
  docker run -d --name graphql-mesh-test --cap-drop=ALL --cap-add=CHOWN --security-opt no-new-privileges -p 4000:4000 \
    -v $(pwd)/mesh.config.ts:/app/mesh.config.ts:ro \
    theguild/graphql-mesh:test
}

wait_for_container() {
  echo "Waiting for the container to be ready..."
  sleep 10
}

check_health() {
  local endpoint=$1
  local response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000${endpoint})
  if [ "$response" -ne 200 ]; then
    echo "Health check failed for endpoint ${endpoint}"
    docker logs graphql-mesh-test
    clean_up
    exit 1
  fi
}

clean_up() {
  docker stop graphql-mesh-test
  docker rm graphql-mesh-test
}

# Run tests
create_proxy_config_file_for_testing

start_container
wait_for_container

echo "Checking liveliness..."
check_health "/healthcheck"

echo "Checking readiness..."
check_health "/readiness"

clean_up
echo "E2E tests passed successfully."
