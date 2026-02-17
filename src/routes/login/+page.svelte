<script lang="ts">
	import { auth } from '$lib/auth';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		loading = true;
		error = '';
		try {
			const res = await auth.login({ email, password });
			if (res.user.role === 'teacher') {
				goto('/teacher/dashboard');
			} else {
				goto('/student/dashboard');
			}
		} catch (e: any) {
			error = e.response?.data?.message || 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
	<div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
		<div class="text-center mb-10">
			<h1 class="text-4xl font-black bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LITERA</h1>
			<p class="text-slate-500 dark:text-slate-400 mt-2">AI-Powered Education Platform</p>
		</div>

		<form onsubmit={handleLogin} class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
					placeholder="name@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
					placeholder="••••••••"
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
				class="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
			>
				{loading ? 'Signing in...' : 'Sign In'}
			</button>
		</form>

		<div class="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
			<p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Are you a guest student?</p>
			<a
				href="/guest-access"
				class="inline-block px-6 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
			>
				Enter Access Code
			</a>
		</div>
	</div>
</div>
