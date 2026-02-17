<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/state";
    import api from "$lib/api";
    import confetti from "canvas-confetti";
    import type { Attempt } from "$lib/types";

    let attempt = $state<Attempt | null>(null);
    let loading = $state(true);

    const attemptId = page.params.id;

    onMount(async () => {
        try {
            const res = await api.get(`/attempts/${attemptId}`);
            attempt = res.data.data;

            if (attempt && attempt.status === "passed") {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#2563eb", "#4f46e5", "#10b981"],
                });
            }
        } catch (e) {
            console.error("Failed to load result", e);
        } finally {
            loading = false;
        }
    });

    onDestroy(() => {
        confetti.reset();
    });
</script>

<div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6"
>
    {#if loading}
        <div
            class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
    {:else if attempt}
        <div
            class="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700"
        >
            <div
                class="p-10 text-center {attempt.status === 'passed'
                    ? 'bg-linear-to-b from-blue-600 to-indigo-600 text-white'
                    : 'bg-linear-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-white'}"
            >
                <div
                    class="w-24 h-24 mx-auto bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-6 border border-white/30"
                >
                    {#if attempt.status === "passed"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path d="M20 6 9 17l-5-5" /></svg
                        >
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg
                        >
                    {/if}
                </div>
                <h1 class="text-4xl font-black mb-2">
                    {attempt.status === "passed"
                        ? "Incredible Job!"
                        : "Keep Practicing"}
                </h1>
                <p class="opacity-80 font-medium">
                    You scored {attempt.percentage}% on this comprehension gate.
                </p>
            </div>

            <div class="p-10">
                <div class="grid grid-cols-2 gap-6 mb-10">
                    <div
                        class="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center"
                    >
                        <p
                            class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
                        >
                            XP EARNED
                        </p>
                        <p class="text-3xl font-black text-blue-600">
                            +{attempt.xp_earned || 0}
                        </p>
                    </div>
                    <div
                        class="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center"
                    >
                        <p
                            class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
                        >
                            RANK
                        </p>
                        <p class="text-3xl font-black text-indigo-600">
                            #{attempt.rank || "-"}
                        </p>
                    </div>
                </div>

                {#if attempt.badges && attempt.badges.length > 0}
                    <div class="mb-10">
                        <h3
                            class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4"
                        >
                            Badges Unlocked
                        </h3>
                        <div class="flex flex-wrap gap-4">
                            {#each attempt.badges as badge}
                                <div class="group relative">
                                    <div
                                        class="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 transition-transform hover:scale-110"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="32"
                                            height="32"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            ><circle
                                                cx="12"
                                                cy="8"
                                                r="7"
                                            /><polyline
                                                points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"
                                            /></svg
                                        >
                                    </div>
                                    <span
                                        class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        {badge.name}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <div class="flex flex-col gap-4">
                    <a
                        href="/student/dashboard"
                        class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-center shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                    >
                        Back to Dashboard
                    </a>
                    <button
                        onclick={() => window.print()}
                        class="w-full py-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
