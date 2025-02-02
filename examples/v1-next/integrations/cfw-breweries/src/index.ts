import CFWorkerKVCache from '@graphql-mesh/cache-cfw-kv';
import useResponseCache from '@graphql-mesh/plugin-response-cache';
import { createServeRuntime } from '@graphql-mesh/serve-runtime';
import * as rest from '@omnigraph/json-schema';
import supergraph from './supergraph.graphql';

const meshHttp = createServeRuntime({
  supergraph,
  transports: {
    rest,
  },
  cache: new CFWorkerKVCache({
    namespace: 'MESH',
  }),
  plugins: ctx => [
    useResponseCache({
      ...ctx,
      ttlPerCoordinate: [
        {
          coordinate: 'Query.breweries',
          ttl: 24 * 60 * 60 * 1000,
        },
      ],
    }),
  ],
});

self.addEventListener('fetch', meshHttp);
