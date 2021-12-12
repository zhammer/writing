import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        target: '#svelte',
        router: false,
    },
    preprocess: preprocess(),
};

export default config;