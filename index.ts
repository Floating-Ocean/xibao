import { Context, Schema } from 'hydrooj';

const THEMES = ['xibao_bgm', 'xibao', 'cloudflare', 'bsod_win10', 'bsod_win11'] as const;
const CLOUDFLARE_DEFAULTS = {
    by: 'Cloudflare',
    url: 'https://www.cloudflare.com',
    location: 'San Francisco',
};

export const name = 'errorpage-theme';
export const Config = Schema.intersect([
    Schema.object({
        custom: Schema.boolean().default(false)
            .description('Random theme per error unless enabled'),
        theme: Schema.union([...THEMES]).default('cloudflare')
            .description('Used only when custom is enabled'),
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
            by: Schema.string().default(CLOUDFLARE_DEFAULTS.by),
            url: Schema.string().role('url').default(CLOUDFLARE_DEFAULTS.url),
            location: Schema.string().default(CLOUDFLARE_DEFAULTS.location),
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
        const theme = config.custom
            ? config.theme
            : THEMES[Math.floor(Math.random() * THEMES.length)];
        (e as any)._theme = theme;
        if (theme !== 'cloudflare') return;
        const cloudflare = config as any;
        Object.assign(e, {
            _by: cloudflare.by || CLOUDFLARE_DEFAULTS.by,
            _url: cloudflare.url || CLOUDFLARE_DEFAULTS.url,
            _location: cloudflare.location || CLOUDFLARE_DEFAULTS.location,
        });
    });
}
