<script lang="ts">
	import { onMount } from 'svelte';
	import { animateTitle } from './index';

	onMount(() => {
		animateTitle(30);
	});
</script>

<h1>Translate into the superior tongue</h1>

<style>
	h1 {
		margin: 3rem 0;
		width: 100%;
		font-size: 2.5rem;
		font-family: var(--font-mono);
		color: #081c15;
	}
</style>
