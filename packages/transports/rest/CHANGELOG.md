# @graphql-mesh/transport-rest

## 0.3.2

### Patch Changes

- [#7191](https://github.com/ardatan/graphql-mesh/pull/7191)
  [`a387451`](https://github.com/ardatan/graphql-mesh/commit/a38745126d8f7f58247afad9d4c16213c6dc4a65)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`qs@6.12.2` ↗︎](https://www.npmjs.com/package/qs/v/6.12.2) (from `6.12.1`,
    in `dependencies`)

## 0.3.1

### Patch Changes

- [#7185](https://github.com/ardatan/graphql-mesh/pull/7185)
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/utils@^10.2.3` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.2.3)
    (from `^10.2.1`, in `peerDependencies`)
- Updated dependencies
  [[`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`0d916a4`](https://github.com/ardatan/graphql-mesh/commit/0d916a4b4603ca57a383337f42c51ef8d5f4ae3d),
  [`8a04cf7`](https://github.com/ardatan/graphql-mesh/commit/8a04cf7abff41122d5268c57acfb26e97712730b)]:
  - @graphql-mesh/cross-helpers@0.4.4
  - @graphql-mesh/transport-common@0.3.1
  - @graphql-mesh/types@0.98.10
  - @graphql-mesh/utils@0.98.10

## 0.3.0

### Minor Changes

- [#7145](https://github.com/ardatan/graphql-mesh/pull/7145)
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae)
  Thanks [@ardatan](https://github.com/ardatan)! - POTENTIAL BREAKING CHANGE:

  Now `@httpOperation` and `@transport` directive serializes headers as `[string, string][]` instead
  of stringified JSON.

  ```diff
  @httpOperation(
  -  operationSpecificHeaders: [["Authorization", "Bearer 123"], ["X-Api-Key", "123"]]
  +  operationSpecificHeaders: "{\"Authorization\": \"Bearer 123\", \"X-Api-Key\": \"123\"}"
  )
  ```

  ```diff
  @transport(
  -  headers: [["Authorization, "Bearer 123"], ["X-Api-Key", "123"]]
  +  headers: "{\"Authorization, \"Bearer 123\", \"X-Api-Key\": \"123\"}"
  )
  ```

  Also incorrect placement of `@transport` has been fixed to `SCHEMA`

  ```diff
  directive @transport on
  -  FIELD_DEFINITION
  +  SCHEMA
  ```

  There is still backwards compatibility but this might look like a breaking change for some users
  during schema validation.

### Patch Changes

- [#7046](https://github.com/ardatan/graphql-mesh/pull/7046)
  [`ac77ce9`](https://github.com/ardatan/graphql-mesh/commit/ac77ce94f1e9a78e2dace14128ea1d6843732d19)
  Thanks [@ardatan](https://github.com/ardatan)! - New option for query string parameters
  `jsonStringify`;

  Now either under the operation or globally, you can set `jsonStringify` to `true` to stringify
  nested query string parameters as JSON.

  ```yaml
  operations:
    - type: Query
      field: books
      method: GET
      path: /books
      queryStringOptions:
        jsonStringify: true
      queryParamArgMap:
        page: page
      argTypeMap:
        page:
          type: object
          additionalProperties: false
          properties:
            limit:
              type: integer
            offset:
              type: integer
      responseSample:
        books:
          - title: 'Book 1'
          - title: 'Book 2'
  ```

  Then the URL will be `/books?page={"limit":10,"offset":0}`, as you can see `page` is stringified
  as JSON.

- Updated dependencies
  [[`f985978`](https://github.com/ardatan/graphql-mesh/commit/f9859784ad854207e4d32bda11c904b5301610ee),
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae),
  [`7544594`](https://github.com/ardatan/graphql-mesh/commit/75445949f91f225ffed15491b8040b61ec4cf3ae)]:
  - @graphql-mesh/utils@0.98.9
  - @graphql-mesh/transport-common@0.3.0
  - @graphql-mesh/types@0.98.9

## 0.2.9

### Patch Changes

- [#7140](https://github.com/ardatan/graphql-mesh/pull/7140)
  [`6a99c52`](https://github.com/ardatan/graphql-mesh/commit/6a99c52644a399f9992487faa549907e36c73b9a)
  Thanks [@renovate](https://github.com/apps/renovate)! - Support graphql-js@16.9.0

## 0.2.8

### Patch Changes

- [#7054](https://github.com/ardatan/graphql-mesh/pull/7054)
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207)
  Thanks [@ardatan](https://github.com/ardatan)! - Do not consume the uploaded file inside the fetch
  call, and pass it to the upstream directly as a stream
- Updated dependencies
  [[`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207),
  [`b5bf97c`](https://github.com/ardatan/graphql-mesh/commit/b5bf97c6fd92dbfa9ed88e03003910a1247149a0),
  [`4c75671`](https://github.com/ardatan/graphql-mesh/commit/4c756717247eb0a8f3431e31e6c86fc97297bd32),
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207),
  [`88d6232`](https://github.com/ardatan/graphql-mesh/commit/88d623289e187435ddc88bbe3f4623a727101207)]:
  - @graphql-mesh/utils@0.98.8
  - @graphql-mesh/types@0.98.8
  - @graphql-mesh/transport-common@0.2.8

## 0.2.7

### Patch Changes

- Updated dependencies []:
  - @graphql-mesh/types@0.98.7
  - @graphql-mesh/utils@0.98.7
  - @graphql-mesh/transport-common@0.2.7

## 0.2.6

### Patch Changes

- [#7030](https://github.com/ardatan/graphql-mesh/pull/7030)
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c)
  Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/utils@^10.2.1` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.2.1)
    (from `^10.2.0`, in `peerDependencies`)
- Updated dependencies
  [[`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c),
  [`270679b`](https://github.com/ardatan/graphql-mesh/commit/270679bb81046727ffe417800cbaa9924fb1bf5c)]:
  - @graphql-mesh/cross-helpers@0.4.3
  - @graphql-mesh/transport-common@0.2.6
  - @graphql-mesh/types@0.98.6
  - @graphql-mesh/utils@0.98.6

## 0.2.5

### Patch Changes

- Updated dependencies
  [[`c4d2249`](https://github.com/ardatan/graphql-mesh/commit/c4d22497b4249f9a0969e1d01efbe0721774ce73)]:
  - @graphql-mesh/utils@0.98.5
  - @graphql-mesh/types@0.98.5
  - @graphql-mesh/transport-common@0.2.5

## 0.2.4

### Patch Changes

- Updated dependencies
  [[`fb59244`](https://github.com/ardatan/graphql-mesh/commit/fb592447c12950582881b24c0ca035a34d2ca48c)]:
  - @graphql-mesh/transport-common@0.2.4
  - @graphql-mesh/types@0.98.4
  - @graphql-mesh/utils@0.98.4

## 0.2.3

### Patch Changes

- Updated dependencies
  [[`c47b2aa`](https://github.com/ardatan/graphql-mesh/commit/c47b2aa8c225f04157c1391c638f866bb01edffa)]:
  - @graphql-mesh/transport-common@0.2.3
  - @graphql-mesh/types@0.98.3
  - @graphql-mesh/utils@0.98.3

## 0.2.2

### Patch Changes

- [`96dd11d`](https://github.com/ardatan/graphql-mesh/commit/96dd11d3c5b70a4971e56d47c8b200d4dc980f38)
  Thanks [@ardatan](https://github.com/ardatan)! - Bump GraphQL Tools versions

- Updated dependencies
  [[`96dd11d`](https://github.com/ardatan/graphql-mesh/commit/96dd11d3c5b70a4971e56d47c8b200d4dc980f38)]:
  - @graphql-mesh/transport-common@0.2.2
  - @graphql-mesh/cross-helpers@0.4.2
  - @graphql-mesh/types@0.98.2
  - @graphql-mesh/utils@0.98.2

## 0.2.1

### Patch Changes

- Updated dependencies
  [[`3d88cb8`](https://github.com/ardatan/graphql-mesh/commit/3d88cb8ff1829081411fcb2051ad18d7f89536ba),
  [`6044b7f`](https://github.com/ardatan/graphql-mesh/commit/6044b7f8bd72ee3d4460d9f09f303ea6fc4e007b)]:
  - @graphql-mesh/string-interpolation@0.5.4
  - @graphql-mesh/types@0.98.1
  - @graphql-mesh/utils@0.98.1
  - @graphql-mesh/transport-common@0.2.1

## 0.2.0

### Patch Changes

- [#6845](https://github.com/ardatan/graphql-mesh/pull/6845)
  [`d793807`](https://github.com/ardatan/graphql-mesh/commit/d793807f43ece9bf797f1b9fc9252ab959753492)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:

  - Updated dependency [`qs@6.12.1` ↗︎](https://www.npmjs.com/package/qs/v/6.12.1) (from `6.12.0`,
    in `dependencies`)

- [#6779](https://github.com/ardatan/graphql-mesh/pull/6779)
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Explicitly specify type for type exports

- Updated dependencies
  [[`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`2fcadce`](https://github.com/ardatan/graphql-mesh/commit/2fcadce67b9acbcab2a14aa9ea57dbb84101f0b5),
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84),
  [`6399add`](https://github.com/ardatan/graphql-mesh/commit/6399addeeca2d5cf0bf545c537d01c784de65e84)]:
  - @graphql-mesh/transport-common@0.2.0
  - @graphql-mesh/types@0.98.0
  - @graphql-mesh/utils@0.98.0

## 0.1.6

### Patch Changes

- Updated dependencies
  [[`52f74e7`](https://github.com/ardatan/graphql-mesh/commit/52f74e75219a32d30dea693a571c64c9c7519eb6)]:
  - @graphql-mesh/types@0.97.5
  - @graphql-mesh/utils@0.97.5
  - @graphql-mesh/transport-common@0.1.5

## 0.1.5

### Patch Changes

- Updated dependencies
  [[`e2fb7ed`](https://github.com/ardatan/graphql-mesh/commit/e2fb7edb8b02a53fa6f1b1f1fba629ea7c84488f),
  [`e2fb7ed`](https://github.com/ardatan/graphql-mesh/commit/e2fb7edb8b02a53fa6f1b1f1fba629ea7c84488f),
  [`ff33394`](https://github.com/ardatan/graphql-mesh/commit/ff3339451d8911f9b9265e158ad86844648ee12f)]:
  - @graphql-mesh/utils@0.97.4
  - @graphql-mesh/types@0.97.4
  - @graphql-mesh/transport-common@0.1.4

## 0.1.4

### Patch Changes

- Updated dependencies
  [[`57f4a60`](https://github.com/ardatan/graphql-mesh/commit/57f4a601c1f9819937c784ab9aae68f3368cbefd)]:
  - @graphql-mesh/types@0.97.3
  - @graphql-mesh/utils@0.97.3
  - @graphql-mesh/transport-common@0.1.3

## 0.1.3

### Patch Changes

- Updated dependencies
  [[`7a712ab`](https://github.com/ardatan/graphql-mesh/commit/7a712ab915ac3216765951080e689d510b5682a6)]:
  - @graphql-mesh/types@0.97.2
  - @graphql-mesh/utils@0.97.2
  - @graphql-mesh/transport-common@0.1.2

## 0.1.2

### Patch Changes

- [#6645](https://github.com/ardatan/graphql-mesh/pull/6645)
  [`9667954`](https://github.com/ardatan/graphql-mesh/commit/96679547598ccdaf765335b13b937248df662d77)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`qs@6.12.0` ↗︎](https://www.npmjs.com/package/qs/v/6.12.0) (from `6.11.2`,
    in `dependencies`)

## 0.1.1

### Patch Changes

- Updated dependencies
  [[`dbaf72c`](https://github.com/ardatan/graphql-mesh/commit/dbaf72c4520f64524dce14b798019639c4d57020)]:
  - @graphql-mesh/types@0.97.1
  - @graphql-mesh/utils@0.97.1
  - @graphql-mesh/transport-common@0.1.1

## 0.1.0

### Patch Changes

- Updated dependencies
  [[`92dce67`](https://github.com/ardatan/graphql-mesh/commit/92dce67df35d70001ca9c818870a85256175279a),
  [`70b05a2`](https://github.com/ardatan/graphql-mesh/commit/70b05a20a948b5ebed5306c14710c8839225cdad)]:
  - @graphql-mesh/types@0.97.0
  - @graphql-mesh/utils@0.97.0
  - @graphql-mesh/transport-common@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies
  [[`0f274ef`](https://github.com/ardatan/graphql-mesh/commit/0f274ef8177068da65e50e08607998d0ed63e8b9)]:
  - @graphql-mesh/utils@0.96.6
  - @graphql-mesh/types@0.96.6
  - @graphql-mesh/transport-common@0.0.3

## 0.0.2

### Patch Changes

- [#6563](https://github.com/ardatan/graphql-mesh/pull/6563)
  [`2138dea`](https://github.com/ardatan/graphql-mesh/commit/2138dea53c28fafe92fa1dc4243e3329d401d064)
  Thanks [@ardatan](https://github.com/ardatan)! - Handle nullable required fields as nullable in
  GraphQL

- Updated dependencies
  [[`4b3ea1d`](https://github.com/ardatan/graphql-mesh/commit/4b3ea1d4ac804341d8dcae289ec1eac37026b908)]:
  - @graphql-mesh/types@0.96.5
  - @graphql-mesh/transport-common@0.0.2
  - @graphql-mesh/utils@0.96.5

## 0.0.1

### Patch Changes

- [#6541](https://github.com/ardatan/graphql-mesh/pull/6541)
  [`a7984e5`](https://github.com/ardatan/graphql-mesh/commit/a7984e5ab214ddd7f75dca0f03b2e7e8ad768211)
  Thanks [@ardatan](https://github.com/ardatan)! - New Fusion packages

- Updated dependencies
  [[`ae7b085`](https://github.com/ardatan/graphql-mesh/commit/ae7b085e93ba911f03bbfd2a15ff9ca8be9f4de8),
  [`a7984e5`](https://github.com/ardatan/graphql-mesh/commit/a7984e5ab214ddd7f75dca0f03b2e7e8ad768211)]:
  - @graphql-mesh/types@0.96.4
  - @graphql-mesh/transport-common@0.0.1
  - @graphql-mesh/utils@0.96.4
