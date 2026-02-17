<script lang="ts">
    import { auth } from "$lib/auth";
    import { goto } from "$app/navigation";
    import api from "$lib/api";

    let title = $state("");
    let description = $state("");
    let file: File | null = $state(null);
    let loading = $state(false);
    let error = $state("");

    async function handleSubmit() {
        if (!file) return (error = "Please select a file");
        loading = true;
        error = "";

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);

        try {
            const res = await api.post("/materials", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // Optionally trigger AI generation if backend doesn't do it automatically
            await api.post(`/materials/${res.data.data.id}/generate-ai`);
            goto("/teacher/dashboard");
        } catch (e: any) {
            error = e.response?.data?.message || "Failed to upload material";
        } finally {
            loading = false;
        }
    }
</script>

<div class="p-6 max-w-3xl mx-auto">
    <header class="mb-10 flex items-center gap-4">
        <a
            href="/teacher/dashboard"
            aria-label="Back to dashboard"
            class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
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
                stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
            >
        </a>
        <h1 class="text-3xl font-black text-slate-900 dark:text-white">
            New Material
        </h1>
    </header>

    <form
        onsubmit={handleSubmit}
        class="space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl"
    >
        <div class="grid grid-cols-1 gap-6">
            <div>
                <label
                    for="title"
                    class="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide"
                    >Course Title</label
                >
                <input
                    type="text"
                    id="title"
                    bind:value={title}
                    required
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
                    placeholder="e.g. Introduction to Quantum Physics"
                />
            </div>

            <div>
                <label
                    for="desc"
                    class="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide"
                    >Description</label
                >
                <textarea
                    id="desc"
                    bind:value={description}
                    rows="3"
                    class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
                    placeholder="What will students learn from this material?"
                ></textarea>
            </div>

            <div>
                <label for=""
                    class="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide"
                    >Upload Document (PDF/Docx)</label
                >
                <div class="relative group">
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onchange={(e) =>
                            (file =
                                (e.target as HTMLInputElement).files?.[0] ||
                                null)}
                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div
                        class="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center transition-colors group-hover:border-blue-500/50 group-hover:bg-blue-50/10"
                    >
                        <div
                            class="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600"
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
                                ><path
                                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                /><polyline points="17 8 12 3 7 8" /><line
                                    x1="12"
                                    x2="12"
                                    y1="3"
                                    y2="15"
                                /></svg
                            >
                        </div>
                        <p class="text-slate-900 dark:text-white font-bold">
                            {file
                                ? file.name
                                : "Click to upload or drag and drop"}
                        </p>
                        <p class="text-xs text-slate-500 mt-1">
                            PDF or DOCX max 10MB
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {#if error}
            <div
                class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800"
            >
                {error}
            </div>
        {/if}

        <div class="pt-4">
            <button
                type="submit"
                disabled={loading}
                class="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
                {loading
                    ? "Processing through AI..."
                    : "Create & Generate Quiz"}
            </button>
            <p
                class="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-black"
            >
                AI will automatically generate chapters and comprehension
                questions.
            </p>
        </div>
    </form>
</div>
