<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import api from '$lib/api';

	let material = $state(null);
	let attempt = $state(null);
	let questions = $state([]);
	let currentQuestionIndex = $state(0);
	let selectedAnswer = $state(null);
	let loading = $state(true);
	let submitting = $state(false);
	let startTime = $state(Date.now());
	let timer = $state(0);
	let interval: any;

	const slug = page.params.slug;

	onMount(async () => {
		try {
			// 1. Get material and start attempt
			const matRes = await api.get(`/materials/${slug}`);
			material = matRes.data.data;
			
			const attRes = await api.post(`/materials/${material.id}/attempts`);
			attempt = attRes.data.data;
			questions = material.questions || [];
			
			interval = setInterval(() => {
				timer = Math.floor((Date.now() - startTime) / 1000);
			}, 1000);
		} catch (e) {
			console.error('Failed to start quiz', e);
			goto(`/student/materials/${slug}`);
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	async function submitAnswer() {
		if (selectedAnswer === null) return;
		submitting = true;
		try {
			await api.post(`/attempts/${attempt.id}/answer`, {
				question_id: questions[currentQuestionIndex].id,
				answer_id: selectedAnswer
			});
			
			if (currentQuestionIndex < questions.length - 1) {
				currentQuestionIndex++;
				selectedAnswer = null;
			} else {
				// Finish attempt
				const finishRes = await api.post(`/attempts/${attempt.id}/finish`);
				goto(`/student/results/${attempt.id}`);
			}
		} catch (e) {
			console.error('Failed to submit answer', e);
		} finally {
			submitting = false;
		}
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
	{#if loading}
		<div class="flex flex-col items-center justify-center h-[80vh]">
			<div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
			<p class="text-slate-500 font-bold">Preparing your quiz...</p>
		</div>
	{:else if attempt && questions.length > 0}
		<div class="max-w-3xl mx-auto">
			<header class="flex items-center justify-between mb-8">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
						L
					</div>
					<div>
						<h1 class="font-bold text-slate-900 dark:text-white line-clamp-1">{material.title}</h1>
						<p class="text-xs text-slate-500">Comprehension Gate</p>
					</div>
				</div>
				<div class="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-mono font-bold text-blue-600 dark:text-blue-400">
					{formatTime(timer)}
				</div>
			</header>

			<!-- Progress Bar -->
			<div class="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-10 overflow-hidden">
				<div 
					class="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-500"
					style="width: {((currentQuestionIndex + 1) / questions.length) * 100}%"
				></div>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-200 dark:border-slate-700">
				<span class="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">
					Question {currentQuestionIndex + 1} of {questions.length}
				</span>
				<h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-8">
					{questions[currentQuestionIndex].question_text}
				</h2>

				<div class="space-y-4">
					{#each questions[currentQuestionIndex].answers || [] as answer}
						<button 
							onclick={() => selectedAnswer = answer.id}
							class="w-full text-left p-5 rounded-2xl border-2 transition-all group {selectedAnswer === answer.id ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}"
						>
							<div class="flex items-center gap-4">
								<div class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-colors {selectedAnswer === answer.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 dark:border-slate-600 text-slate-400 group-hover:border-slate-300'}">
									{String.fromCharCode(65 + (questions[currentQuestionIndex].answers.indexOf(answer)))}
								</div>
								<span class="text-slate-700 dark:text-slate-300 font-medium">{answer.answer_text}</span>
							</div>
						</button>
					{/each}
				</div>

				<div class="mt-12 flex justify-end">
					<button 
						disabled={selectedAnswer === null || submitting}
						onclick={submitAnswer}
						class="px-10 py-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100"
					>
						{#if submitting}
							<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						{:else}
							{currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
						{/if}
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center h-[80vh]">
			<p class="text-slate-500">No questions available for this material.</p>
			<a href="/student/dashboard" class="mt-4 text-blue-600 font-bold">Back to Dashboard</a>
		</div>
	{/if}
</div>
