import { defineConfig as defineComposeConfig } from '@graphql-mesh/compose-cli';
import { loadNeo4JSubgraph } from '@omnigraph/neo4j';

export const composeConfig = defineComposeConfig({
  subgraphs: [
    {
      sourceHandler: loadNeo4JSubgraph('Movies', {
        endpoint: 'neo4j+s://demo.neo4jlabs.com',
        auth: {
          type: 'basic',
          username: 'movies',
          password: 'movies',
        },
        database: 'movies',
      }),
    },
  ],
});
