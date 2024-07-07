import { useOpenTelemetry } from '@envelop/opentelemetry';
import usePrometheus from '@graphql-mesh/plugin-prometheus';
import { defineConfig as defineServeConfig } from '@graphql-mesh/serve-cli';
import { trace } from '@opentelemetry/api';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { BasicTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Create Jaeger exporter
const exporter = new JaegerExporter({
  serviceName: 'my-service-name',
  host: 'localhost',
  port: 6832,
});

// Configure OpenTelemetry provider
const provider = new BasicTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();

export const serveConfig = defineServeConfig({
  proxy: {
    endpoint: 'https://countries.trevorblades.com',
  },
  plugins: pluginCtx => [
    useOpenTelemetry({
      ...pluginCtx,
      resolvers: true,
      variables: true,
      result: true,
      tracer: trace.getTracer('default'),
    }),
    usePrometheus({
      ...pluginCtx,
      requestCount: true,
      requestSummary: true,
      parse: true,
      validate: true,
      contextBuilding: true,
      execute: true,
      errors: true,
      delegation: true,
      fetchMetrics: true,
      fetchRequestHeaders: true,
      fetchResponseHeaders: true,
      http: 'my-http-duration-metric',
      httpRequestHeaders: true,
      httpResponseHeaders: true,
      deprecatedFields: true,
      endpoint: '/metrics',
    }),
  ],
});
