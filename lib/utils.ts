import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isVideoUrl(url: string): boolean {
	try {
		const { pathname } = new URL(url);
		return pathname.endsWith(".mp4") || pathname.endsWith(".webm") || pathname.endsWith(".mov");
	} catch {
		return false;
	}
}

/** Returns the first non-video URL from a media array — useful for thumbnails, OG images, and emails. */
export const getProductThumbnail = (urls: string[]): string | undefined => {
	return urls.find((url) => !isVideoUrl(url));
};

/**
 * Safe error handling utility for promises.
 * Returns tuple [error, result].
 *
 * @example
 * const [err, data] = await safe(db.select().from(users));
 */
export async function safe<T>(promise: Promise<T>): Promise<[Error, null] | [null, T]> {
	try {
		const data = await promise;
		return [null, data];
	} catch (err) {
		return [err instanceof Error ? err : new Error(String(err)), null];
	}
}
