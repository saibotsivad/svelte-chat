import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'node:url'

export default defineConfig({
	plugins: [svelte({ configFile: false })],
	root: 'demo-app',
	base: './',
	build: {
		outDir: '../demo',
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
		},
	},
})
