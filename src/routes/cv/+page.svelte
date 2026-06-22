<script>
	import { IconArrowLeft, IconFileDownload } from '@tabler/icons-svelte';

	let frameEl;

	// The resume HTML already ships with print styles, so "Download PDF" just
	// opens the browser's print dialog scoped to the resume — the user picks
	// "Save as PDF".
	function downloadPdf() {
		if (frameEl?.contentWindow) {
			frameEl.contentWindow.focus();
			frameEl.contentWindow.print();
		}
	}
</script>

<svelte:head>
	<title>CV · Atif Bin Ferdous</title>
	<meta name="description" content="Curriculum vitae of Atif Bin Ferdous — Full-Stack Software Engineer." />
</svelte:head>

<main class="bg-primary-950 flex min-h-screen w-full flex-col text-white">
	<header
		class="bg-primary-900/80 border-primary-800 sticky top-0 z-10 flex items-center justify-between gap-4 border-b px-5 py-3 backdrop-blur md:px-8"
	>
		<a
			href="/#home"
			class="text-primary-200 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
		>
			<IconArrowLeft size={18} />
			<span>Back</span>
		</a>

		<h1 class="text-sm font-bold tracking-widest uppercase md:text-base">Curriculum Vitae</h1>

		<button
			type="button"
			onclick={downloadPdf}
			class="bg-primary-100 text-primary-900 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
		>
			<IconFileDownload size={18} />
			<span>Download PDF</span>
		</button>
	</header>

	<div class="flex-1">
		<iframe
			bind:this={frameEl}
			src="/cv/resume_1.html"
			title="Atif Bin Ferdous — CV"
			class="h-full min-h-[calc(100vh-57px)] w-full border-0 bg-white"
		></iframe>
	</div>
</main>
