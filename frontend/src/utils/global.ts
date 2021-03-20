export const baseApiUrl = window.location.hostname.includes('localhost')
  ? process.env.VUE_APP_BASE_URL_LOCAL
  : process.env.VUE_APP_BASE_URL_REMOTE;
