import type { GraphQLSchema } from 'graphql';
import type { Logger, MeshFetch, MeshPubSub } from '@graphql-mesh/types';
import type { Executor } from '@graphql-tools/utils';

export type TransportEntry<TTransportKind extends string = string, TTransportOptions = any> = {
  kind: TTransportKind;
  subgraph: string;
  location?: string;
  headers?: [string, string][];
  options?: TTransportOptions;
};

export interface TransportBaseContext {
  fetch?: MeshFetch;
  pubsub?: MeshPubSub;
  logger?: Logger;
}

export interface TransportExecutorFactoryOpts<
  TTransportKind extends string = string,
  TTransportOptions = any,
> extends TransportBaseContext {
  subgraphName: string;
  transportEntry: TransportEntry<TTransportKind, TTransportOptions>;
  subgraph: GraphQLSchema;
}

export type TransportExecutorFactoryFn<
  TTransportKind extends string = string,
  TTransportOptions = any,
> = (
  opts: TransportExecutorFactoryOpts<TTransportKind, TTransportOptions>,
) => Executor | Promise<Executor>;

export type Transport<TTransportKind extends string = string, TTransportOptions = any> = {
  getSubgraphExecutor?: TransportExecutorFactoryFn<TTransportKind, TTransportOptions>;
};

export type DisposableExecutor = Executor & Partial<Disposable | AsyncDisposable>;
