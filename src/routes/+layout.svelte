<script lang="ts">
	import "../app.css";
	import { auth } from "$lib/auth";
	import { activeNav } from "$lib/nav";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	let { children } = $props();
	let isMobileMenuOpen = $state(false);

	onMount(() => {
		auth.init();
	});

	const navItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
			path: "/student/dashboard",
		},
		{
			id: "leaderboard",
			label: "Leaderboard",
			icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
			path: "/leaderboard",
		},
	];

	const teacherNavItems = [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
			path: "/teacher/dashboard",
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "M18 20V10M12 20V4M6 20v-6",
			path: "/teacher/analytics",
		},
	];

	const currentNavItems = $derived(
		$auth.user?.role === "teacher" ? teacherNavItems : navItems,
	);
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
	{#if $auth.isAuthenticated && !page.url.pathname.includes("/quiz") && !page.url.pathname.includes("/login") && !page.url.pathname.includes("/guest-access")}
		<!-- Sidebar Desktop -->
		<aside
			class="hidden lg:flex w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 fixed h-full z-20"
		>
			<div class="flex items-center gap-3 mb-12 px-2">
				<div
					class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20"
				>
					L
				</div>
				<span
					class="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
					>LITERA</span
				>
			</div>

			<nav class="space-y-2 flex-1">
				{#each currentNavItems as item}
					<a
						href={item.path}
						class="flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all {$activeNav ===
						item.id
							? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
							: 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"><path d={item.icon} /></svg
						>
						{item.label}
					</a>
				{/each}
			</nav>

			<div
				class="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800"
			>
				<div class="flex items-center gap-3 px-2 mb-6">
					<div
						class="w-10 h-10 rounded-full bg-linear-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-blue-600"
					>
						{$auth.user?.name?.charAt(0)}
					</div>
					<div class="flex-1 min-w-0">
						<p
							class="text-sm font-bold text-slate-900 dark:text-white truncate"
						>
							{$auth.user?.name}
						</p>
						<p
							class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
						>
							{$auth.user?.role}
						</p>
					</div>
				</div>
				<button
					onclick={() => auth.logout()}
					class="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path
							d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
						/><polyline points="16 17 21 12 16 7" /><line
							x1="21"
							x2="9"
							y1="12"
							y2="12"
						/></svg
					>
					Logout
				</button>
			</div>
		</aside>

		<!-- Mobile Header -->
		<div
			class="lg:hidden fixed top-0 inset-x-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-30 px-4 flex items-center justify-between"
		>
			<div class="flex items-center gap-2">
				<div
					class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm"
				>
					L
				</div>
				<span class="font-black text-slate-900 dark:text-white"
					>LITERA</span
				>
			</div>
			<button
				onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="p-2 text-slate-600 dark:text-slate-400"
				aria-label="Toggle Menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="4" x2="20" y1="12" y2="12" /><line
						x1="4"
						x2="20"
						y1="6"
						y2="6"
					/><line x1="4" x2="20" y1="18" y2="18" /></svg
				>
			</button>
		</div>

		<main class="flex-1 lg:ml-72 mt-16 lg:mt-0">
			{@render children()}
		</main>
	{:else}
		<main class="flex-1 w-full">
			{@render children()}
		</main>
	{/if}
</div>
