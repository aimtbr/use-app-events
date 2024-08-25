const debugMessage = (message: string, debug: boolean) => {
  const isProduction =
    import.meta.env.PROD || import.meta.env.MODE === 'production';

  if (isProduction || !debug) {
    return;
  }

  console.log(message);
};

export default debugMessage;
