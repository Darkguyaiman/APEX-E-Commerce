function configured(value: string | undefined) {
  return Boolean(value && !value.startsWith('replace_with'));
}

export function getPublicUrl(path: string, request: Request) {
  const baseUrl = configured(process.env.NEXT_PUBLIC_APP_URL)
    ? process.env.NEXT_PUBLIC_APP_URL
    : request.url;

  return new URL(path, baseUrl);
}
