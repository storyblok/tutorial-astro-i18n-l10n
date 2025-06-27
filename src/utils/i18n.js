import { useStoryblokApi } from '@storyblok/astro';

const getLanguageCodes = async () => {
	const storyblokApi = useStoryblokApi();
	const { data } = await storyblokApi.get('cdn/spaces/me');

	return data.space.language_codes;
};

const getI18nStorySlug = (currentLanguage, story) => {
	const translatedSlug = story.translated_slugs.find((slug) => {
		return slug.path !== 'home' && slug.lang === currentLanguage;
	});

	const defaultSlug =
		story.default_full_slug === 'home' ? '' : story.default_full_slug;
	const slug = translatedSlug?.path ?? defaultSlug;

	return slug;
};

export { getLanguageCodes, getI18nStorySlug };
