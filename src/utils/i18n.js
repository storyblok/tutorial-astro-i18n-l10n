import { useStoryblokApi } from '@storyblok/astro';

const getLanguageCodes = async () => {
	const storyblokApi = useStoryblokApi();
	const { data } = await storyblokApi.get('cdn/spaces/me');

	return data.space.language_codes;
};

const getI18nStorySlug = (currentLanguage, story, languages) => {
	console.log('currentLanguage', currentLanguage);
	// this is strictly for translated slugs using the app
	const translatedSlug = story.translated_slugs?.find((slug) => {
		return slug.path !== 'home' && slug.lang === currentLanguage;
	});

	const defaultSlug = translatedSlug
		? story.default_full_slug
		: story.full_slug;

	const cleanedSlug =
		defaultSlug === 'home' || defaultSlug === 'eu/home' ? '' : defaultSlug;
	const slug = translatedSlug?.path ?? cleanedSlug;

	console.log(slug, 'slug');

	// If no current language is provided, return the slug without a preceding language code
	// TODO: also use this function in the first part to account for default_full_slug not being there if no translated slug is set
	if (!currentLanguage) {
		const slugArray = slug.split('/');
		console.log('slugArray', slugArray);
		// If the first part of the slug is a language code, remove it
		if (languages.includes(slugArray[0])) slugArray.shift();
		console.log('slugArray after removing language code', slugArray.join('/'));
		return slugArray.join('/');
	}

	// Match 'us/' at the start and remove it
	if (/^us\//.test(slug)) {
		return slug.replace(/^us\//, `${currentLanguage}/`);
	}

	// Match 'eu/' at the start and inject language after
	if (/^eu\//.test(slug)) {
		return slug.replace(/^eu\//, `eu/${currentLanguage}/`);
	}

	// If no region matched, return as-is or handle as needed
	return slug;
};

export { getLanguageCodes, getI18nStorySlug };
