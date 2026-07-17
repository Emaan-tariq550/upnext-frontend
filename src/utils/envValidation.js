const REQUIRED_ENV_VARS = ['VITE_API_BASE_URL', 'VITE_SOCKET_URL'];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(
      `UPNEXT frontend cannot start: missing env vars [${missing.join(', ')}]. Check your .env file.`
    );
  }
}

export default validateEnv;