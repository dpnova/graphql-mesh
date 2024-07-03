import { defineConfig } from '@graphql-mesh/serve-cli';
import { HTTPTransportOptions } from '@graphql-mesh/transport-http';

export const serveConfig = defineConfig({
  transports: {
    http: {
      subscriptions: {
        ws: {
          subgraphs: {
            '*': {
              path: '/subscriptions',
            },
          },
        },
      },
    } satisfies HTTPTransportOptions,
  },
});
