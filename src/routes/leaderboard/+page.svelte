<script lang="ts">
    import { onMount } from "svelte";
    import api from "$lib/api";
    import { activeNav } from "$lib/nav";
    import type { User } from "$lib/types";

    let students = $state<User[]>([]);
    let loading = $state(true);

    onMount(async () => {
        activeNav.set("leaderboard");
        try {
            const res = await api.get("/leaderboard");
            students = res.data.data;
        } catch (e) {
            console.error("Failed to load leaderboard", e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="p-6 max-w-4xl mx-auto">
    <header class="mb-10 flex flex-col items-center text-center">
        <div
            class="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 mb-6 border-b-4 border-amber-200 dark:border-amber-800 shadow-xl"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><circle cx="12" cy="8" r="7" /><polyline
                    points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"
                /></svg
            >
        </div>
        <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-2">
            Hall of Fame
        </h1>
        <p class="text-slate-500 dark:text-slate-400">
            The brightest minds in our learning community.
        </p>
    </header>

    {#if loading}
        <div class="space-y-4">
            {#each Array(5) as _}
                <div
                    class="h-20 bg-white dark:bg-slate-800 rounded-2xl animate-pulse"
                ></div>
            {/each}
        </div>
    {:else}
        <div class="space-y-4">
            {#each students as student, i}
                <div
                    class="flex items-center gap-6 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.01] {i ===
                    0
                        ? 'border-b-4 border-b-amber-400'
                        : ''}"
                >
                    <div
                        class="w-10 text-2xl font-black {i === 0
                            ? 'text-amber-500'
                            : i === 1
                              ? 'text-slate-400'
                              : i === 2
                                ? 'text-orange-400'
                                : 'text-slate-300'}"
                    >
                        {i + 1}
                    </div>

                    <div
                        class="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900"
                    >
                        {#if student.avatar}
                            <img
                                src={student.avatar}
                                alt={student.name}
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <div
                                class="w-full h-full flex items-center justify-center text-slate-300 font-bold"
                            >
                                {student.name.charAt(0)}
                            </div>
                        {/if}
                    </div>

                    <div class="flex-1">
                        <h3
                            class="font-bold text-slate-900 dark:text-white flex items-center gap-2"
                        >
                            {student.name}
                            {#if i === 0}
                                <span>👑</span>
                            {/if}
                        </h3>
                        <p class="text-xs text-slate-500 font-medium">
                            Level {student.level || 1} Apprentice
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-xl font-black text-blue-600">
                            {student.total_xp} XP
                        </p>
                        <p
                            class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                        >
                            {student.completed_materials} Materials
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
