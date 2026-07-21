import path from 'path';

const imageContentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

export function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'uploads');
}

export function getLegacyProductUploadDir() {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images', 'product');
}

export function getImageContentType(filename: string) {
  return imageContentTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream';
}

export function getSafeUploadFilename(filename: string) {
  const basename = path.basename(filename);
  return basename === filename && /^[a-zA-Z0-9._-]+$/.test(filename) ? filename : null;
}

export function getUploadFilePath(filename: string) {
  const safeFilename = getSafeUploadFilename(filename);
  return safeFilename ? path.join(/*turbopackIgnore: true*/ getUploadDir(), safeFilename) : null;
}

export function getLegacyProductUploadFilePath(filename: string) {
  const safeFilename = getSafeUploadFilename(filename);
  return safeFilename ? path.join(/*turbopackIgnore: true*/ getLegacyProductUploadDir(), safeFilename) : null;
}
