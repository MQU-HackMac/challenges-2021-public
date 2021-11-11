<script lang="ts">
	import { enhance } from '$lib/form';
	import { onMount } from 'svelte';
	import { leetText } from './store';

	let bigBox = false;
	let manifestoLocation = '';

	onMount(() => {
		manifestoLocation = window.location + 'manifesto.txt?H="Accept=text/html';
	});
</script>

<div>
	{#if !bigBox}
		<form
			action="/transleet"
			method="POST"
			use:enhance={{
				result: async (res, form) => {
					const json = await res.json();
					$leetText = json.text;

					form.reset();
					bigBox = !bigBox;
				}
			}}
		>
			<div class="form-container">
				<input
					class="search-element {bigBox ? 'big-box' : 'search-box'}"
					id="search-box"
					type="text"
					name="q"
					placeholder={manifestoLocation}
				/>
				<input type="submit" id="search-submit" hidden />
				<button class="search-element button" for="search-submit">Transleet</button>
			</div>
		</form>
	{:else}
		<button
			class="search-element return-button"
			on:click={() => {
				bigBox = !bigBox;
			}}>Retransleet</button
		>
		<textarea readonly class="search-element big-box" type="text" value={$leetText} />
	{/if}
</div>

<style>
	* {
		outline: none;
		border: none;
		border-radius: 0.25rem;
	}

	.return-button {
		animation-name: showButton;
		animation-duration: 0.8s;
		margin-bottom: 0.5rem;
	}

	.big-box {
		animation-name: growBox;
		animation-duration: 0.8s;
		background-color: var(--heading-color);
		height: 75vh;
		width: 95vw;
	}

	.search-element {
		font-family: var(--font-mono);
		background-color: var(--heading-color);
		color: var(--accent-color);
		padding: 0.25rem;
	}

	.form-container {
		display: grid;
		grid-template-columns: 8fr 2fr;
		justify-items: center;
		align-items: center;
		gap: 2rem;
	}

	.search-box {
		width: 100%;
		background-color: var(--heading-color);
		color: var(--accent-color);
	}

	.button:active {
		box-shadow: 0 3px var(--primary-color);
		transform: translateY(3px);
	}

	@keyframes growBox {
		0% {
			width: 40vw;
			height: 100%;
		}
		30% {
			width: 95vw;
			height: 100%;
		}
		80% {
			height: 75vh;
		}
	}

	@keyframes shrinkBox {
		0% {
			height: 75vh;
			width: 95vw;
		}
		30% {
			height: 100%;
			width: 95vw;
		}
	}

	@keyframes showButton {
		0% {
			visibility: hidden;
		}
		80% {
			visibility: hidden;
			opacity: 0;
		}
		100% {
			visibility: visible;
			opacity: 1;
		}
	}
</style>
