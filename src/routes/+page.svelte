<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { auth } from "$lib/auth";

    onMount(async () => {
        await auth.init();
        if ($auth.isAuthenticated) {
            if ($auth.user?.role === "teacher") {
                goto("/teacher/dashboard");
            } else {
                goto("/student/dashboard");
            }
        } else {
            goto("/login");
        }
    });
</script>

<div
    class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"
>
    <div
        class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
    ></div>
</div>
