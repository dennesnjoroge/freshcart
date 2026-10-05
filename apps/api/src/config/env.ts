export const getEnvVar = (value: string): string => {
  const envVar = process.env[value];
  if (!envVar) {
    throw new Error(`Missing required environment variable: ${value}`);
  }
  return envVar;
};
