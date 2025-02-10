import { goto } from '$app/navigation';
import { page } from '$app/state';

export function getUrlQuery(name: string) {
	return page.url.searchParams.get(name);
}

export function setUrlQuery(name: string, value: string) {
	const url = new URL(page.url);
	url.searchParams.set(name, value);
	goto(url, { replaceState: false });
}

export function toggleUrlQuery(name: string) {
	setUrlQuery(name, getUrlQuery(name) === '1' ? '' : '1');
}
