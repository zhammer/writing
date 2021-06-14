import static from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
    compilerOptions: null,

    // an array of file extensions that should be treated as Svelte components
    extensions: ['.svelte'],

    kit: {
        adapter: static,
        amp: false,
        appDir: '_app',
        files: {
            assets: 'static',
            hooks: 'src/hooks',
            lib: 'src/lib',
            routes: 'src/routes',
            serviceWorker: 'src/service-worker',
            template: 'src/app.html'
        },
        floc: false,
        host: null,
        hostHeader: null,
        hydrate: true,
        paths: {
            assets: '',
            base: ''
        },
        prerender: {
            crawl: true,
            enabled: true,
            force: false,
            pages: ['*']
        },
        router: true,
        ssr: true,
        target: null,
        trailingSlash: 'never',
        vite: () => ({})
    },

    // options passed to svelte.preprocess (https://svelte.dev/docs#svelte_preprocess)
    preprocess: null
};

export default config;