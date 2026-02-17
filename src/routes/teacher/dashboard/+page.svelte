<script lang="ts">
    import { onMount } from "svelte";
    import api from "$lib/api";
    import { auth } from "$lib/auth";
    import { activeNav } from "$lib/nav";
    import type { Material, TeacherStats } from "$lib/types";

    let stats = $state<TeacherStats>({
        total_materials: 0,
        total_students: 0,
        total_attempts: 0,
        average_score: 0,
    });
    let materials = $state<Material[]>([]);
    let loading = $state(true);

    onMount(async () => {
        activeNav.set("dashboard");
        try {
            const [statsRes, matRes] = await Promise.all([
                api.get("/analytics/teacher"),
                api.get("/materials"),
            ]);
            stats = statsRes.data;
            materials = matRes.data.data;
        } catch (e) {
            console.error("Failed to load teacher data", e);
        } finally {
            loading = false;
        }
    });
</script>

<div class="p-6 max-w-7xl mx-auto">
    <header
        class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
    >
        <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white">
                Teacher Dashboard
            </h1>
            <p class="text-slate-500 dark:text-slate-400">
                Manage your educational content and monitor students.
            </p>
        </div>
        <a
            href="/teacher/materials/new"
            class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M5 12h14" /><path d="M12 5v14" /></svg
            >
            New Material
        </a>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {#each [{ label: "Total Materials", value: stats.total_materials, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" }, { label: "Active Students", value: stats.total_students, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" }, { label: "Total Attempts", value: stats.total_attempts, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" }, { label: "Avg. Score", value: `${stats.average_score}%`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" }] as stat}
            <div
                class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
                <p
                    class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1"
                >
                    {stat.label}
                </p>
                <p class="text-3xl font-black {stat.color}">{stat.value}</p>
            </div>
        {/each}
    </div>

    <!-- Materials List -->
    <section>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                Your Materials
            </h2>
            <button class="text-sm text-blue-600 font-bold hover:underline"
                >View All</button
            >
        </div>

        <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
        >
            <table class="w-full text-left">
                <thead
                    class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700"
                >
                    <tr>
                        <th
                            class="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider"
                            >Title</th
                        >
                        <th
                            class="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider"
                            >AI Status</th
                        >
                        <th
                            class="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider"
                            >Attempts</th
                        >
                        <th
                            class="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider"
                            >Avg. Score</th
                        >
                        <th
                            class="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right"
                            >Actions</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    {#each materials as material}
                        <tr
                            class="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                        >
                            <td class="px-6 py-4">
                                <div
                                    class="font-bold text-slate-900 dark:text-white"
                                >
                                    {material.title}
                                </div>
                                <div
                                    class="text-xs text-slate-400 line-clamp-1"
                                >
                                    {material.description || "No description"}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold {material.ai_status ===
                                    'completed'
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                        : material.ai_status === 'processing'
                                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 animate-pulse'
                                          : 'bg-slate-100 dark:bg-slate-900 text-slate-500'}"
                                >
                                    {material.ai_status}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium"
                            >
                                {material.attempt_count}
                            </td>
                            <td
                                class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium"
                            >
                                {material.average_score}%
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    class="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                    aria-label="Edit Material"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        ><path
                                            d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"
                                        /><path d="m15 5 4 4" /></svg
                                    >
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>
</div>
