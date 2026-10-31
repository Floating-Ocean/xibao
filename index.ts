import { Context, Schema } from 'hydrooj';

export const name = 'errorpage-theme';
export const Config = Schema.intersect([
    Schema.object({
        theme: Schema.union(['xibao_bgm', 'xibao', 'cloudflare', 'bsod_win10', 'bsod_win11']).default('cloudflare'),
    }),
    Schema.union([
        Schema.object({
            theme: Schema.const('xibao_bgm'),
        }),
        Schema.object({
            theme: Schema.const('xibao'),
        }),
        Schema.object({
            theme: Schema.const('cloudflare'),
            by: Schema.string().default('Cloudflare'),
            url: Schema.string().role('url').default('https://www.cloudflare.com'),
            location: Schema.string().default('San Francisco'),
        }),
        Schema.object({
            theme: Schema.const('bsod_win10'),
        }),
        Schema.object({
            theme: Schema.const('bsod_win11'),
        }),
    ] as const),
]);

export function apply(ctx: Context, config: ReturnType<typeof Config>) {
    return ctx.on('handler/error', (h, e) => {
        if (!(e instanceof Error)) return;
        (e as any)._theme = config.theme;
        if (config.theme !== 'cloudflare') return;
        Object.assign(e, {
            _by: config.by,
            _url: config.url,
            _location: config.location,
        });
    });
}
