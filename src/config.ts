import { context } from '@opentelemetry/api'
import { ResolvedTraceConfig, Trigger } from './types.js'

const configSymbol = Symbol('Otel Workers Tracing Configuration')

export type Initialiser = (env: Record<string, unknown>, trigger: Trigger) => ResolvedTraceConfig

export function setConfig(config: ResolvedTraceConfig, ctx = context.active()) {
	return ctx.setValue(configSymbol, config)
}

export function getActiveConfig(): ResolvedTraceConfig {
	const config = context.active().getValue(configSymbol) as ResolvedTraceConfig
	if (!config) {
		console.warn('No active configuration found!')
	}
	return (
		config ?? {
			fetch: { includeTraceContext: true },
			handlers: { fetch: { acceptTraceContext: true } },
			sampling: { headSampler: {} },
			service: { name: 'testint-inboxed' },
			spanProcessors: [
				{
					traceLookup: {},
					localRootSpanLookup: {},
					inprogressExports: {},
					exporter: null,
				},
			],
			propagator: {},
		}
	)
}
