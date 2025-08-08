import { useStoryblokApi } from '@storyblok/astro';

const getRegionCodes = () => {
	// this could be managed in Storyblok as well
	return ['us', 'eu'];
};

const languageCodesPerRegion = {
	// this could be managed in Storyblok as well
	us: ['es'],
	eu: ['es', 'fr', 'de'],
};

const getAvailableLanguagesForRegion = (region) => {
	return languageCodesPerRegion[region] || [];
};

const getLanguageCodes = async () => {
	const storyblokApi = useStoryblokApi();
	const { data } = await storyblokApi.get('cdn/spaces/me');

	return data.space.language_codes;
};

const getCleanSlug = async (slug) => {
	const slugParts = slug.split('/');

	const languages = await getLanguageCodes();
	const regions = getRegionCodes();

	if (languages.includes(slugParts[0])) {
		// If the first part of the slug is a language code, remove it
		slugParts.shift();
	}

	if (regions.includes(slugParts[0])) {
		// If the first part of the slug is a region code, remove it
		slugParts.shift();
	}

	return slugParts.join('/');
};

const getTranslatedSlug = async (story, language) => {
	if (!story.translated_slugs) return false;

	const translatedSlug = story.translated_slugs?.find((slug) => {
		return slug.path !== 'home' && slug.lang === language;
	});

	if (!translatedSlug) return false;
	return await getCleanSlug(translatedSlug.path);
};

export {
	getLanguageCodes,
	getRegionCodes,
	getAvailableLanguagesForRegion,
	getCleanSlug,
	getTranslatedSlug,
};
