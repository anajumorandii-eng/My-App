/** iPad desktop mode reports Macintosh; touch distinguishes it from a Mac. */
export function needsPdfFile(platform: { userAgent: string; maxTouchPoints?: number }): boolean {
  return /iPad|iPhone|iPod/.test(platform.userAgent) || (/Macintosh/.test(platform.userAgent) && (platform.maxTouchPoints ?? 0) > 1);
}
