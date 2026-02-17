<script lang="ts">
	import { onMount } from 'svelte';
	import api from '$lib/api';
	import { auth } from '$lib/auth';
	import { activeNav } from '$lib/nav';

	let materials = $state([]);
	let loading = $state(true);

	onMount(async () => {
		activeNav.set('dashboard');
		try {
			const res = await api.get('/materials');
			materials = res.data.data;
		} catch (e) {
			console.error('Failed to load materials', e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="p-6 max-w-7xl mx-auto">
	<header class="mb-8">
		<h1 class="text-3xl font-black text-slate-900 dark:text-white">Welcome back, {$auth.user?.name}!</h1>
		<p class="text-slate-500 dark:text-slate-400">Jump back into your learning journey.</p>
	</header>

	{#if loading}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each Array(3) as _}
				<div class="bg-white dark:bg-slate-800 rounded-2xl h-64 animate-pulse"></div>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each materials as material}
				<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
					<div class="aspect-video bg-slate-100 dark:bg-slate-900 relative">
						{#if material.cover_image}
							<img src={material.cover_image} alt={material.title} class="w-full h-full object-cover" />
						{:else}
							<div class="w-full h-full flex items-center justify-center text-slate-400">
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v18"/><path d="M12 11h4"/><path d="M12 7h4"/><path d="M12 15h4"/></svg>
							</div>
						{/if}
						<div class="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 shadow-sm">
							{material.difficulty_level || 'Beginner'}
						</div>
					</div>
					
					<div class="p-6 flex-1 flex flex-col">
						<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{material.title}</h2>
						<p class="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2">{material.description || 'No description available.'}</p>
						
						<div class="mt-auto flex items-center justify-between">
							<div class="text-xs text-slate-400 flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
								{material.estimated_duration || 15} mins
							</div>
							<a 
								href="/student/materials/{material.slug}" 
								class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
							>
								Start Reading
							</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
