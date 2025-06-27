import { useStoryblokApi } from '@storyblok/astro';

const getLanguageCodes = async () => {
	const storyblokApi = useStoryblokApi();
	const { data } = await storyblokApi.get('cdn/spaces/me');

	return data.space.language_codes;
};

const getI18nStorySlug = (currentLanguage, story) => {
	const slug =
		story.translated_slugs.find((slug) => slug.lang === currentLanguage)
			?.path ?? story.default_full_slug;
	return slug;
};

export { getLanguageCodes, getI18nStorySlug };
