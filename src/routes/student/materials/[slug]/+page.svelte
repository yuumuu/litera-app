<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import api from '$lib/api';

	let material = $state(null);
	let currentChapterIndex = $state(0);
	let loading = $state(true);

	const slug = page.params.slug;

	onMount(async () => {
		try {
			const res = await api.get(`/materials/${slug}`);
			material = res.data.data;
		} catch (e) {
			console.error('Failed to load material', e);
		} finally {
			loading = false;
		}
	});

	async function startQuiz() {
		// Logic to start attempt and redirect to quiz
		// goto(`/student/materials/${slug}/quiz`);
	}
</script>

{#if loading}
	<div class="min-h-screen flex items-center justify-center">
		<div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
	</div>
{:else if material}
	<div class="max-w-4xl mx-auto p-6 md:p-10">
		<header class="mb-10 text-center">
			<h1 class="text-4xl font-black text-slate-900 dark:text-white mb-4">{material.title}</h1>
			<div class="flex items-center justify-center gap-4 text-sm text-slate-500">
				<span class="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold">
					Chapter {currentChapterIndex + 1} of {material.chapters.length}
				</span>
				<span>•</span>
				<span>{material.estimated_duration} mins total</span>
			</div>
		</header>

		<div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 prose dark:prose-invert max-w-none">
			<h2 class="text-2xl font-bold mb-6">{material.chapters[currentChapterIndex].title}</h2>
			<div class="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
				{@html material.chapters[currentChapterIndex].content}
			</div>
		</div>

		<footer class="mt-12 flex items-center justify-between bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
			<button 
				disabled={currentChapterIndex === 0}
				onclick={() => currentChapterIndex--}
				class="px-6 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 disabled:opacity-30 transition-colors"
			>
				Previous
			</button>

			<div class="hidden md:block text-slate-400">
				Reading Progress: {Math.round(((currentChapterIndex + 1) / material.chapters.length) * 100)}%
			</div>

			{#if currentChapterIndex < material.chapters.length - 1}
				<button 
					onclick={() => currentChapterIndex++}
					class="px-10 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
				>
					Next
				</button>
			{:else}
				<a 
					href="/student/materials/{slug}/quiz"
					class="px-10 py-2 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors"
				>
					Take Quiz
				</a>
			{/if}
		</footer>
	</div>
{/if}
