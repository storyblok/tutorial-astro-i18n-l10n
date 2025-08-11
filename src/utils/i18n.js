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

	let languageCode = '';

	if (languages.includes(slugParts[0])) {
		// If the first part of the slug is a language code, remove it
		languageCode = slugParts[0];
		slugParts.shift();
	}

	let regionCode = '';
	if (regions.includes(slugParts[0])) {
		// If the first part of the slug is a region code, remove it
		regionCode = slugParts[0];
		slugParts.shift();
	}

	return { slug: slugParts.join('/'), languageCode, regionCode };
};

const getTranslatedSlug = async (story, language) => {
	if (!story.translated_slugs) return false;

	const translatedSlug = story.translated_slugs?.find((slug) => {
		return slug.path !== 'home' && slug.lang === language;
	});

	if (!translatedSlug) return false;
	return (await getCleanSlug(translatedSlug.path)).slug;
};

const getLink = async (linkSlug, currentLanguage) => {
	if (!linkSlug) return '';

	const { slug, languageCode, regionCode } = await getCleanSlug(linkSlug);

	const includeRegion =
		regionCode && regionCode !== 'us' ? `${regionCode}/` : '';

	let includeLanguage = '';
	if (languageCode || currentLanguage) {
		includeLanguage = (languageCode || currentLanguage) + '/';
	}

	if (slug === 'home') {
		return `/${includeRegion}${includeLanguage}`;
	}

	return `/${includeRegion}${includeLanguage}${slug}`;
};

export {
	getLanguageCodes,
	getRegionCodes,
	getAvailableLanguagesForRegion,
	getCleanSlug,
	getTranslatedSlug,
	getLink,
};
