import { useStoryblokApi } from '@storyblok/astro';

const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get('cdn/spaces/me');

const languages = data.space.language_codes;

export { languages };
