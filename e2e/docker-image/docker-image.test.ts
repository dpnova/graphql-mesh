import fs from 'fs/promises';
import path from 'path';
import { createTenv, type Container } from '@e2e/tenv';

const { container } = createTenv(__dirname);

let graphqlMesh!: Container;
beforeAll(async () => {
  // create proxy config file
  const proxyConfig = `
    import { defineConfig as defineServeConfig } from '@graphql-mesh/serve-cli';

    export const serveConfig = defineServeConfig({
      proxy: {
        endpoint: 'https://countries.trevorblades.com'
      }
    });
  `;
  await fs.writeFile(path.join(__dirname, '../../docker/mesh.config.ts'), proxyConfig, 'utf8');

  const isCI = !!process.env.CI;
  const image = isCI ? 'ghcr.io/ardatan/graphql-mesh:test' : 'graphql-mesh-gateway';

  graphqlMesh = await container({
    name: 'graphql-mesh-test',
    image,
    containerPort: 4000,
    healthcheck: ['CMD-SHELL', 'curl -f http://0.0.0.0:4000/healthcheck || exit 1'],
    volumes: [
      {
        hostPath: path.join(__dirname, 'mesh.config.ts'),
        containerPath: '/app/mesh.config.ts',
        readOnly: true,
      },
    ],
  });

  console.log('here...');
  await new Promise(resolve => setTimeout(resolve, 10000)); // wait for container to be ready
});

afterAll(async () => {
  if (graphqlMesh) {
    await graphqlMesh.stop();
    await graphqlMesh.remove();
  }
});

it('should pass health checks', async () => {
  const healthcheckResponse = await fetch(`http://0.0.0.0:4000/healthcheck`);
  expect(healthcheckResponse.status).toBe(200);

  const readinessResponse = await fetch(`http://0.0.0.0:4000/readiness`);
  expect(readinessResponse.status).toBe(200);
});
