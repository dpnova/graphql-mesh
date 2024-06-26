import { GraphQLID, GraphQLNonNull } from 'graphql';
import { Args } from '@e2e/args';
import {
  createFederationTransform,
  createTypeReplaceTransform,
  defineConfig as defineComposeConfig,
  loadGraphQLHTTPSubgraph,
} from '@graphql-mesh/compose-cli';
import { loadOpenAPISubgraph } from '@omnigraph/openapi';

const args = Args(process.argv);

export const composeConfig = defineComposeConfig({
  subgraphs: [
    {
      sourceHandler: loadOpenAPISubgraph('accounts', {
        source: `http://0.0.0.0:${args.getServicePort('accounts')}/openapi.json`,
        endpoint: `http://0.0.0.0:${args.getServicePort('accounts')}`,
      }),
      transforms: [
        createTypeReplaceTransform((typeName, fieldName) =>
          typeName === 'User' && fieldName === 'id' ? new GraphQLNonNull(GraphQLID) : undefined,
        ),
        createFederationTransform({
          User: {
            key: {
              fields: 'id',
              resolveReference: {
                keyArg: 'id',
                fieldName: 'user',
              },
            },
          },
        }),
      ],
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph('products', {
        endpoint: `http://0.0.0.0:${args.getServicePort('products')}/graphql`,
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph('inventory', {
        endpoint: `http://0.0.0.0:${args.getServicePort('inventory')}/graphql`,
      }),
    },
    {
      sourceHandler: loadGraphQLHTTPSubgraph('reviews', {
        endpoint: `http://0.0.0.0:${args.getServicePort('reviews')}/graphql`,
      }),
    },
  ],
});
