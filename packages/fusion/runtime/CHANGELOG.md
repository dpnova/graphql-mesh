# @graphql-mesh/fusion-runtime

## 0.4.1

### Patch Changes

- [#7183](https://github.com/ardatan/graphql-mesh/pull/7183)
  [`8a04cf7`](https://github.com/ardatan/graphql-mesh/commit/8a04cf7abff41122d5268c57acfb26e97712730b)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:

  - Updated dependency
    [`graphql-yoga@^5.6.0` ↗︎](https://www.npmjs.com/package/graphql-yoga/v/5.6.0) (from `^5.3.0`,
    in `dependencies`)

- [#7185](https://github.com/ardatan/graphql-mesh/pull/7185)
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/delegate@^10.0.12` ↗︎](https://www.npmjs.com/package/@graphql-tools/delegate/v/10.0.12)
    (from `^10.0.11`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/executor@^1.2.8` ↗︎](https://www.npmjs.com/package/@graphql-tools/executor/v/1.2.8)
    (from `^1.2.6`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/federation@^2.1.1` ↗︎](https://www.npmjs.com/package/@graphql-tools/federation/v/2.1.1)
    (from `^2.0.0`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/stitch@^9.2.10` ↗︎](https://www.npmjs.com/package/@graphql-tools/stitch/v/9.2.10)
    (from `^9.2.9`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/utils@^10.2.3` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.2.3)
    (from `^10.2.1`, in `dependencies`)
- Updated dependencies
  [[`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`8a04cf7`](https://github.com/ardatan/graphql-mesh/commit/8a04cf7abff41122d5268c57acfb26e97712730b)]:
  - @graphql-mesh/runtime@0.99.12
  - @graphql-mesh/transport-common@0.3.1
  - @graphql-mesh/types@0.98.10
  - @graphql-mesh/utils@0.98.10

## 0.4.0

### Patch Changes

- [#7145](https://github.com/ardatan/graphql-mesh/pull/7145)
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae)
  Thanks [@Author](https://github.com/Author), [@User](https://github.com/User)! - New Federation
  Composition Approach for the new Mesh v1 alpha; (If you are using Mesh v0 legacy, ignore this
  changelog)

  Now Mesh Compose produces a superset of Federated Supergraph.

  - Drop any options and implementation related to the old `fusiongraph`
  - - The output is a valid supergraph that can be consumed by any Federation router. But if it is
      not Mesh Serve, the subgraph should still be served via Mesh Serve then consumed by that
      Federation router. If it is Mesh Serve, no additional server is needed because Mesh Serve
      already knows the additional directives etc of the transports
  - Compose the subgraphs using `@theguild/federation-composition` package
  - - So benefit from the validation rules of Federation in Mesh Compose
  - Ability to consume existing federated subgraphs
  - - Since the composition is now Federation, we can accept any federated subgraph
  - Implement Federation transform to transform any subgraph to a federated subgraph by adding
    Federation directives (v2 only) . This is on user's own because they add the directives
    manually. And for `__resolveReference`, we use `@merge` directive to mark a root field as an
    entity resolver for Federation
  - Use additional `@source` directive to consume transforms on the subgraph execution (field
    renames etc)
  - Use additional `@resolveTo` directive to consume additional stitched resolvers
  - Use additional `@transport` directive to choose and configure a specific transport for subgraphs
  - Handle unsupported additional directives with another set of additional directives on `Query`
    for example directives on unions, schema definitions, enum values etc and then
    `@extraUnionDirective` added with missing directives for unions then on the runtime these
    directives are added back to the union for the subgraph execution of the transports.

  Basically Mesh Compose uses Federation spec for composition, validation and runtime BUT the output
  is a superset with these additional directives imported via `@composeDirective`;

  - `@merge` (Taken from Stitching Directives) If a custom entity resolver is defined for a root
    field like below, the gateway will pick it up as an entity resolver;

  ```graphql
  type Query {
     fooById(id: ID!): Foo @merge(keyField: 'id', keyArg: 'id', subgraph: Foo)
  }
  ```

  - `@resolveTo` (Taken from v0) This allows to delegate to a field in any subgraph just like Schema
    Extensions in old Schema Stitching approach;

  ```graphql
      extend type Book {

          @resolveTo(
            sourceName: "authors"
            sourceTypeName: "Query"
            sourceFieldName: "authors"
            keyField: "authorId"
            keysArg: "ids"
          )
      }
  ```

  - `@source` Taken from Fusion This allows us to know how the original definition is in the
    subgraph. If this directive exists, the runtime applies the transforms from Schema Stitching
    during the subgraph execution. This directive can exist in arguments, fields, types etc.

  ```graphql
  type Query {
   @source(type: "MyUser") # This means `User` is actually `MyUser` in the actual subgraph
  }

  type User @source(name: "MyUser") {
    id: ID
    name: String
  }
  ```

  - `@transport` Taken from Fusion This allows us to choose a specific transport (rest, mysql,
    graphql-ws, graphql-http etc) for the subgraph execution with some configuration. In the
    runtime, the gateway loads the transports and passes the subgraph schema with annotations if
    needed to get an executor to execute queries against that subgraph.

  ```graphql
  schema @transport(subgraph: "API", kind: "rest", location: "http://0.0.0.0:<api_port>") {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
  ```

  - `@extraSchemaDefinitionDirective` By default, it is not possible to add directives from subgraph
    to the supergraph but it is possible to do the same thing on types or fields. So we add this
    directive to `Query` for the directives we want to add to the schema. Then the runtime picks
    those per `subgraph` to put the directives back to their original places;

  ```graphql
  type Query @extraSchemaDefinitionDirective(
    directives: {transport: [{subgraph: "petstore", kind: "rest", location: "http://0.0.0.0:<petstore_port>/api/v3"}]}
  )  {
  ```

  - `@extraEnumValueDirective` and `@extraTypeDirective` Same for enum values and unions etc that
    are not supported by the composition library

  > Thanks to these directives, subgraphs can be published individually to Hive for example then the
  > supergraph stored there can be handled by Mesh Gateway since the composition is the same. All
  > the additions etc are done on the subgraph level. For the Fed gateways except Mesh Serve,
  > subgraphs can be served individually by Mesh Serve again while they are consumed by any gw like
  > Apollo Router Shareable is enabled by default for non-federated subgraphs

  Documentation PR has details for users; https://github.com/ardatan/graphql-mesh/pull/7109

- Updated dependencies
  [[`f985978`](https://github.com/ardatan/graphql-mesh/commit/f9859784ad854207e4d32bda11c904b5301610ee),
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae),
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae)]:
  - @graphql-mesh/utils@0.98.9
  - @graphql-mesh/transport-common@0.3.0
  - @graphql-mesh/runtime@0.99.11
  - @graphql-mesh/types@0.98.9

## 0.3.10

### Patch Changes

- Updated dependencies
  [[`6a99c52`](https://github.com/ardatan/graphql-mesh/commit/6a99c52644a399f9992487faa549907e36c73b9a)]:
  - @graphql-mesh/runtime@0.99.10

## 0.3.9

### Patch Changes

- [#7009](https://github.com/ardatan/graphql-mesh/pull/7009)
  [`b5bf97c`](https://github.com/ardatan/graphql-mesh/commit/b5bf97c6fd92dbfa9ed88e03003910a1247149a0)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:

  - Added dependency
    [`@envelop/core@^5.0.1` ↗︎](https://www.npmjs.com/package/@envelop/core/v/5.0.1) (to
    `dependencies`)
  - Added dependency
    [`@graphql-tools/executor@^1.2.6` ↗︎](https://www.npmjs.com/package/@graphql-tools/executor/v/1.2.6)
    (to `dependencies`)
  - Added dependency
    [`@graphql-tools/federation@^1.1.36` ↗︎](https://www.npmjs.com/package/@graphql-tools/federation/v/1.1.36)
    (to `dependencies`)

- [#7054](https://github.com/ardatan/graphql-mesh/pull/7054)
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:

  - Added dependency
    [`@graphql-tools/federation@^2.0.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/federation/v/2.0.0)
    (to `dependencies`)
  - Added dependency
    [`disposablestack@^1.1.6` ↗︎](https://www.npmjs.com/package/disposablestack/v/1.1.6) (to
    `dependencies`)

- [#7009](https://github.com/ardatan/graphql-mesh/pull/7009)
  [`b5bf97c`](https://github.com/ardatan/graphql-mesh/commit/b5bf97c6fd92dbfa9ed88e03003910a1247149a0)
  Thanks [@ardatan](https://github.com/ardatan)! - Implement declarative transforms

- [#7054](https://github.com/ardatan/graphql-mesh/pull/7054)
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207)
  Thanks [@ardatan](https://github.com/ardatan)! - Use `Disposable` pattern for plugins and
  transports

- Updated dependencies
  [[`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207),
  [`b5bf97c`](https://github.com/ardatan/graphql-mesh/commit/b5bf97c6fd92dbfa9ed88e03003910a1247149a0),
  [`4c75671`](https://github.com/ardatan/graphql-mesh/commit/4c756717247eb0a8f3431e31e6c86fc97297bd32),
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207),
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207)]:
  - @graphql-mesh/utils@0.98.8
  - @graphql-mesh/types@0.98.8
  - @graphql-mesh/transport-common@0.2.8
  - @graphql-mesh/runtime@0.99.9

## 0.3.8

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/types@0.98.7
  - @graphql-mesh/runtime@0.99.8
  - @graphql-mesh/utils@0.98.7
  - @graphql-mesh/transport-common@0.2.7

## 0.3.7

### Patch Changes

- [#7030](https://github.com/ardatan/graphql-mesh/pull/7030)
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/delegate@^10.0.11` ↗︎](https://www.npmjs.com/package/@graphql-tools/delegate/v/10.0.11)
    (from `^10.0.10`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/stitch@^9.2.9` ↗︎](https://www.npmjs.com/package/@graphql-tools/stitch/v/9.2.9)
    (from `^9.2.8`, in `dependencies`)
  - Updated dependency
    [`@graphql-tools/utils@^10.2.1` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.2.1)
    (from `^10.2.0`, in `dependencies`)
- Updated dependencies
  [[`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c)]:
  - @graphql-mesh/runtime@0.99.7
  - @graphql-mesh/transport-common@0.2.6
  - @graphql-mesh/types@0.98.6
  - @graphql-mesh/utils@0.98.6

## 0.3.6

### Patch Changes

- Updated dependencies
  [[`c4d2249`](https://github.com/ardatan/graphql-mesh/commit/c4d22497b4249f9a0969e1d01efbe0721774ce73)]:
  - @graphql-mesh/utils@0.98.5
  - @graphql-mesh/runtime@0.99.6
  - @graphql-mesh/types@0.98.5
  - @graphql-mesh/transport-common@0.2.5

## 0.3.5

### Patch Changes

- [`fb59244`](https://github.com/ardatan/graphql-mesh/commit/fb592447c12950582881b24c0ca035a34d2ca48c)
  Thanks [@ardatan](https://github.com/ardatan)! - Update GraphQL Tools packages

- Updated dependencies
  [[`fb59244`](https://github.com/ardatan/graphql-mesh/commit/fb592447c12950582881b24c0ca035a34d2ca48c)]:
  - @graphql-mesh/transport-common@0.2.4
  - @graphql-mesh/runtime@0.99.5
  - @graphql-mesh/types@0.98.4
  - @graphql-mesh/utils@0.98.4

## 0.3.4

### Patch Changes

- Updated dependencies
  [[`d9b5137`](https://github.com/ardatan/graphql-mesh/commit/d9b513704f7083d523f03d1dbb379a5fb27580c4)]:
  - @graphql-mesh/runtime@0.99.4

## 0.3.3

### Patch Changes

- [`c47b2aa`](https://github.com/ardatan/graphql-mesh/commit/c47b2aa8c225f04157c1391c638f866bb01edffa)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump GraphQL Tools versions

- Updated dependencies
  [[`c47b2aa`](https://github.com/ardatan/graphql-mesh/commit/c47b2aa8c225f04157c1391c638f866bb01edffa)]:
  - @graphql-mesh/transport-common@0.2.3
  - @graphql-mesh/runtime@0.99.3
  - @graphql-mesh/types@0.98.3
  - @graphql-mesh/utils@0.98.3

## 0.3.2

### Patch Changes

- [`96dd11d`](https://github.com/ardatan/graphql-mesh/commit/96dd11d3c5b70a4971e56d47c8b200d4dc980f38)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump GraphQL Tools versions

- Updated dependencies
  [[`96dd11d`](https://github.com/ardatan/graphql-mesh/commit/96dd11d3c5b70a4971e56d47c8b200d4dc980f38)]:
  - @graphql-mesh/transport-common@0.2.2
  - @graphql-mesh/runtime@0.99.2
  - @graphql-mesh/types@0.98.2
  - @graphql-mesh/utils@0.98.2

## 0.3.1

### Patch Changes

- Updated dependencies
  [[`6044b7f`](https://github.com/ardatan/graphql-mesh/commit/6044b7f8bd72ee3d4460d9f09f303ea6fc4e007b)]:
  - @graphql-mesh/types@0.98.1
  - @graphql-mesh/runtime@0.99.1
  - @graphql-mesh/utils@0.98.1
  - @graphql-mesh/transport-common@0.2.1

## 0.3.0

### Patch Changes

- [#6779](https://github.com/ardatan/graphql-mesh/pull/6779)
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - dependencies updates:

  - Updated dependency
    [`@graphql-tools/utils@^10.1.3` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.1.3)
    (from `^10.1.0`, in `dependencies`)

- [#6872](https://github.com/ardatan/graphql-mesh/pull/6872)
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:

  - Updated dependency
    [`@graphql-tools/stitch@^9.2.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/stitch/v/9.2.0)
    (from `^9.2.3`, in `dependencies`)
  - Updated dependency
    [`graphql-yoga@^5.3.0` ↗︎](https://www.npmjs.com/package/graphql-yoga/v/5.3.0) (from `^5.1.1`,
    in `dependencies`)
  - Added dependency
    [`@graphql-mesh/types@^0.97.5` ↗︎](https://www.npmjs.com/package/@graphql-mesh/types/v/0.97.5)
    (to `dependencies`)
  - Added dependency
    [`@graphql-tools/delegate@^10.0.6` ↗︎](https://www.npmjs.com/package/@graphql-tools/delegate/v/10.0.6)
    (to `dependencies`)
  - Added dependency
    [`@graphql-tools/stitching-directives@^3.0.2` ↗︎](https://www.npmjs.com/package/@graphql-tools/stitching-directives/v/3.0.2)
    (to `dependencies`)
  - Added dependency
    [`@graphql-tools/wrap@^10.0.5` ↗︎](https://www.npmjs.com/package/@graphql-tools/wrap/v/10.0.5)
    (to `dependencies`)
  - Removed dependency
    [`@graphql-mesh/fusion-execution@^0.0.2` ↗︎](https://www.npmjs.com/package/@graphql-mesh/fusion-execution/v/0.0.2)
    (from `dependencies`)

- [`7881346`](https://github.com/ardatan/graphql-mesh/commit/78813467cf0e2c988a55cdf1225ff60c4690ede8)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump @graphql-tools/stitch package

- Updated dependencies
  [[`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84),
  [`666b79c`](https://github.com/ardatan/graphql-mesh/commit/666b79c5bd03f86da29b479b5902741b5ad506e8),
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84)]:
  - @graphql-mesh/runtime@0.99.0
  - @graphql-mesh/transport-common@0.2.0
  - @graphql-mesh/types@0.98.0
  - @graphql-mesh/utils@0.98.0

## 0.2.12

### Patch Changes

- Updated dependencies
  [[`afe0cc5`](https://github.com/ardatan/graphql-mesh/commit/afe0cc5ddfc7a1291dc878c61793b58850ae848b)]:
  - @graphql-mesh/runtime@0.98.8

## 0.2.11

### Patch Changes

- Updated dependencies
  [[`c008dda`](https://github.com/ardatan/graphql-mesh/commit/c008ddae4bd617497a2a9bd70e8c90667c2b1ddc)]:
  - @graphql-mesh/runtime@0.98.7

## 0.2.10

### Patch Changes

- [#6747](https://github.com/ardatan/graphql-mesh/pull/6747)
  [`8924438`](https://github.com/ardatan/graphql-mesh/commit/8924438131a7320ef160573539bddfb024bbe343)
  Thanks [@ardatan](https://github.com/ardatan)! - Readiness and healthcheck endpoints

## 0.2.9

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/runtime@0.98.6
  - @graphql-mesh/utils@0.97.5
  - @graphql-mesh/transport-common@0.1.5

## 0.2.8

### Patch Changes

- [`f293329`](https://github.com/ardatan/graphql-mesh/commit/f2933295532d0760bb731e055dd2bd6e9cb2a63b)
  Thanks [@ardatan](https://github.com/ardatan)! - Improve proxy execution

## 0.2.7

### Patch Changes

- [`1639001`](https://github.com/ardatan/graphql-mesh/commit/16390018bd54946fbfbd2bfb8eb3ba7682966a12)
  Thanks [@ardatan](https://github.com/ardatan)! - Modularization

## 0.2.6

### Patch Changes

- Updated dependencies
  [[`18e0d49`](https://github.com/ardatan/graphql-mesh/commit/18e0d495053f0b67fd1ba488270318e5d11309f8)]:
  - @graphql-mesh/runtime@0.98.5

## 0.2.5

### Patch Changes

- Updated dependencies
  [[`e2fb7ed`](https://github.com/ardatan/graphql-mesh/commit/e2fb7edb8b02a53fa6f1b1f1fba629ea7c84488f),
  [`e2fb7ed`](https://github.com/ardatan/graphql-mesh/commit/e2fb7edb8b02a53fa6f1b1f1fba629ea7c84488f)]:
  - @graphql-mesh/utils@0.97.4
  - @graphql-mesh/runtime@0.98.4
  - @graphql-mesh/transport-common@0.1.4

## 0.2.4

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/runtime@0.98.3
  - @graphql-mesh/utils@0.97.3
  - @graphql-mesh/transport-common@0.1.3

## 0.2.3

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/runtime@0.98.2
  - @graphql-mesh/utils@0.97.2
  - @graphql-mesh/transport-common@0.1.2

## 0.2.2

### Patch Changes

- Updated dependencies
  [[`ccb80d8`](https://github.com/ardatan/graphql-mesh/commit/ccb80d829602662f22eca32d3141d47c6855b8f6)]:
  - @graphql-mesh/fusion-execution@0.0.2

## 0.2.1

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/runtime@0.98.1
  - @graphql-mesh/utils@0.97.1
  - @graphql-mesh/transport-common@0.1.1

## 0.2.0

### Minor Changes

- [#6605](https://github.com/ardatan/graphql-mesh/pull/6605)
  [`662a36a`](https://github.com/ardatan/graphql-mesh/commit/662a36ac5135cc8153f62ab1c18497032f21cb6f)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Change executionRequest in onSubgraphExecute
  hook and use one transportKind argument instead of spreading it

### Patch Changes

- [#6598](https://github.com/ardatan/graphql-mesh/pull/6598)
  [`35b9cab`](https://github.com/ardatan/graphql-mesh/commit/35b9cab1d6c50fd6165879dc6cc8e5cb03dd2eef)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - onSubgraphExecute hook can return nothing

- Updated dependencies
  [[`92dce67`](https://github.com/ardatan/graphql-mesh/commit/92dce67df35d70001ca9c818870a85256175279a),
  [`70b05a2`](https://github.com/ardatan/graphql-mesh/commit/70b05a20a948b5ebed5306c14710c8839225cdad)]:
  - @graphql-mesh/utils@0.97.0
  - @graphql-mesh/runtime@0.98.0
  - @graphql-mesh/transport-common@0.1.0

## 0.1.1

### Patch Changes

- [#6583](https://github.com/ardatan/graphql-mesh/pull/6583)
  [`b7c3631`](https://github.com/ardatan/graphql-mesh/commit/b7c3631bd58779c1910705fd7f2b39545bc071dd)
  Thanks [@EmrysMyrddin](https://github.com/EmrysMyrddin)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/utils@^10.1.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.1.0)
    (from `^10.0.8`, in `dependencies`)
- Updated dependencies
  [[`0f274ef`](https://github.com/ardatan/graphql-mesh/commit/0f274ef8177068da65e50e08607998d0ed63e8b9)]:
  - @graphql-mesh/utils@0.96.6
  - @graphql-mesh/runtime@0.97.7
  - @graphql-mesh/transport-common@0.0.3

## 0.1.0

### Minor Changes

- [`7b494d9`](https://github.com/ardatan/graphql-mesh/commit/7b494d981862034f256225e2c9a5c43a403ff79d)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Improve typings and other accompanying
  improvements

### Patch Changes

- [#6568](https://github.com/ardatan/graphql-mesh/pull/6568)
  [`44d40ff`](https://github.com/ardatan/graphql-mesh/commit/44d40fff17877a52e63c6f644635ea53eb9deadb)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - dependencies updates:
  - Added dependency
    [`@graphql-mesh/runtime@^0.97.6` ↗︎](https://www.npmjs.com/package/@graphql-mesh/runtime/v/0.97.6)
    (to `dependencies`)
  - Added dependency
    [`@graphql-mesh/utils@^0.96.5` ↗︎](https://www.npmjs.com/package/@graphql-mesh/utils/v/0.96.5)
    (to `dependencies`)

## 0.0.2

### Patch Changes

- [#6551](https://github.com/ardatan/graphql-mesh/pull/6551)
  [`7c18a3f`](https://github.com/ardatan/graphql-mesh/commit/7c18a3f9163f5156758b8cdf0292b28a3bb6046b)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - No omnigraph transports and recommend
  graphql-mesh transports

- Updated dependencies []:
  - @graphql-mesh/transport-common@0.0.2

## 0.0.1

### Patch Changes

- [#6541](https://github.com/ardatan/graphql-mesh/pull/6541)
  [`a7984e5`](https://github.com/ardatan/graphql-mesh/commit/a7984e5ab214ddd7f75dca0f03b2e7e8ad768211)
  Thanks [@ardatan](https://github.com/ardatan)! - New Fusion packages

- Updated dependencies
  [[`a7984e5`](https://github.com/ardatan/graphql-mesh/commit/a7984e5ab214ddd7f75dca0f03b2e7e8ad768211)]:
  - @graphql-mesh/fusion-execution@0.0.1
  - @graphql-mesh/transport-common@0.0.1
