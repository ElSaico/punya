import { goto } from '$app/navigation';
import { page } from '$app/state';

export function getUrlQuery(name: string) {
	return page.url.searchParams.get(name);
}

export function isUrlQuery(name: string) {
	return getUrlQuery(name) === '1';
}

export function setUrlQuery(name: string, value: string) {
	const url = new URL(page.url);
	url.searchParams.set(name, value);
	goto(url, { replaceState: false });
}

export function toggleUrlQuery(name: string) {
	const visible = page.url.searchParams.get(name) === '1' ? '' : '1';
	setUrlQuery(name, visible.toString());
}
