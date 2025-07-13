export const debugMessage = (message: string, debug: boolean | undefined) => {
  const isProduction =
    import.meta.env.PROD || import.meta.env.MODE === 'production';

  if (isProduction || !debug) {
    return;
  }

  console.log(message);
};
