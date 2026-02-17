<script lang="ts">
	import { auth } from '$lib/auth';
	import { goto } from '$app/navigation';

	let name = $state('');
	let accessCode = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleGuestAccess() {
		loading = true;
		error = '';
		try {
			await auth.guestLogin(accessCode, name);
			goto('/student/dashboard');
		} catch (e: any) {
			error = e.response?.data?.message || 'Invalid access code';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-blue-100 dark:from-slate-950 dark:to-slate-900 p-4">
	<div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
		<div class="mb-8 items-center flex gap-4">
			<a href="/login" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500" aria-label="login">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			</a>
			<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Guest Access</h1>
		</div>

		<form onsubmit={handleGuestAccess} class="space-y-6">
			<div>
				<label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					required
					class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
					placeholder="Enter your name"
				/>
			</div>

			<div>
				<label for="code" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Access Code</label>
				<input
					type="text"
					id="code"
					bind:value={accessCode}
					required
					class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all font-mono tracking-widest text-center text-lg"
					placeholder="X0Y1Z2"
				/>
			</div>

			{#if error}
				<div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
					{error}
				</div>
			{/if}

			<button
				type="submit"
				disabled={loading}
				class="w-full py-4 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
			>
				{loading ? 'Validating...' : 'Start Learning'}
			</button>
		</form>
	</div>
</div>
