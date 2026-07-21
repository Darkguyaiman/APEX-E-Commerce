function configured(value: string | undefined) {
  return Boolean(value && !value.startsWith('replace_with'));
}

function getConfiguredBaseUrl() {
  if (configured(process.env.APP_URL)) {
    return process.env.APP_URL;
  }

  if (configured(process.env.NEXT_PUBLIC_APP_URL)) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (configured(process.env.GOOGLE_REDIRECT_URI)) {
    return new URL(process.env.GOOGLE_REDIRECT_URI!).origin;
  }

  return null;
}

function getForwardedBaseUrl(request: Request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!host) return null;

  const proto = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.replace(':', '');
  return `${proto}://${host}`;
}

export function getPublicUrl(path: string, request: Request) {
  const baseUrl = getConfiguredBaseUrl() || getForwardedBaseUrl(request) || request.url;

  return new URL(path, baseUrl);
}
