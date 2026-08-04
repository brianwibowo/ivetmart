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
	const isCIEnv = process.env.NODE_ENV === "test" || process.env.BUN_ENV === "test" || !!process.env.CI;

	if (isCIEnv) {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const timeoutPromise = new Promise<never>((_, reject) => {
			timer = setTimeout(() => reject(new Error("Database query timeout in CI environment")), 500);
		});

		try {
			const data = await Promise.race([promise, timeoutPromise]);
			if (timer) clearTimeout(timer);
			return [null, data];
		} catch (err) {
			if (timer) clearTimeout(timer);
			return [err instanceof Error ? err : new Error(String(err)), null];
		}
	}

	try {
		const data = await promise;
		return [null, data];
	} catch (err) {
		return [err instanceof Error ? err : new Error(String(err)), null];
	}
}
