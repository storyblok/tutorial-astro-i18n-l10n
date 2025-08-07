import { useStoryblokApi } from '@storyblok/astro';
export async function getStoryblokPaths(region = 'us', languages) {
	const storyblokApi = useStoryblokApi();

	const links = await storyblokApi.getAll('cdn/links', {
		version: 'draft',
		starts_with: region,
	});

	const staticPaths = [];

	for (const link of links) {
		if (link.is_folder) continue;
		const cleanedSlug = link.slug.slice(3); // Remove the region prefix (e.g., 'us/' or 'eu/') from the slug
		console.log(link.slug);

		staticPaths.push({
			params: {
				slug: cleanedSlug === 'home' ? undefined : cleanedSlug,
			},
		});

		if (link.alternates && link.alternates.length > 0) {
			for (const alternate of link.alternates) {
				if (languages.includes(alternate.lang)) {
					if (alternate.translated_slug === 'home') continue;
					staticPaths.push({
						params: {
							slug: `${alternate.lang}/${alternate.translated_slug}`,
						},
					});
				}
			}
		}
	}

	return staticPaths;
}
