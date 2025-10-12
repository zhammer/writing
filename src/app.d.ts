// See https://svelte.dev/docs/kit/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace svelte.JSX {
		interface HTMLAttributes<T> {
			onswipeleft?: (event: CustomEvent) => void;
			onswiperight?: (event: CustomEvent) => void;
			onswipeup?: (event: CustomEvent) => void;
			onswipedown?: (event: CustomEvent) => void;
		}
		interface SvelteWindowAttributes {
			onswipeleft?: (event: CustomEvent) => void;
			onswiperight?: (event: CustomEvent) => void;
			onswipeup?: (event: CustomEvent) => void;
			onswipedown?: (event: CustomEvent) => void;
		}
	}
}

export {};
