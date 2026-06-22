<script>
	import {
		absoluteUrl,
		author,
		defaultDescription,
		defaultImage,
		defaultKeywords,
		defaultTitle,
		siteName
	} from '$lib/seo';

	/**
	 * @typedef {Object} SeoProps
	 * @property {string}   [title]       Page title. Used verbatim for <title>.
	 * @property {string}   [description] Meta description.
	 * @property {string[]} [keywords]    Page-specific keywords, merged with the site defaults.
	 * @property {string}   [canonical]   Site-root-relative path for the canonical URL (e.g. "/about").
	 * @property {string}   [image]       Site-root-relative path to the sharing image.
	 * @property {'website' | 'article' | 'profile'} [type] Open Graph type.
	 * @property {boolean}  [noindex]     When true, asks crawlers not to index the page.
	 * @property {string}   [jsonLd]      Optional pre-stringified JSON-LD to embed.
	 */

	/** @type {SeoProps} */
	let {
		title = defaultTitle,
		description = defaultDescription,
		keywords = [],
		canonical = '/',
		image = defaultImage,
		type = 'website',
		noindex = false,
		jsonLd = null
	} = $props();

	const canonicalUrl = $derived(absoluteUrl(canonical));
	const imageUrl = $derived(absoluteUrl(image));
	const allKeywords = $derived([...new Set([...defaultKeywords, ...keywords])].join(', '));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={allKeywords} />
	<meta name="author" content={author} />
	<link rel="canonical" href={canonicalUrl} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={imageUrl} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
	{/if}
</svelte:head>
