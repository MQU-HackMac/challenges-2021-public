<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import GlitchTitle from '$lib/GlitchTitle/index.svelte';
	import URLBox from '$lib/URLBox/index.svelte';
</script>

<svelte:head>
	<title>w37c0m3</title>
</svelte:head>

<section style="justify-content: flex-start;">
	<GlitchTitle />
	<URLBox />
</section>

<section />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
