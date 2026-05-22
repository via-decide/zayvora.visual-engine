const PLATFORM_CONFIG = {
  youtube: { width: 1920, height: 1080, fps: 30, format: '16:9' },
  shorts: { width: 1080, height: 1920, fps: 30, format: '9:16' },
  reels: { width: 1080, height: 1920, fps: 30, format: '9:16' },
};

export function mapPlatformConfig(platform = 'youtube') {
  return PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.youtube;
}

export function validatePlatform(platform) {
  return Object.keys(PLATFORM_CONFIG).includes(platform);
}
