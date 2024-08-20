export const debugMessage = (message: string, debug: boolean) => {
  if (!import.meta.env.PROD && debug) {
    console.log(message);
  }
};
