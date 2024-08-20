module.exports = (api) => {
  const isTest = api.env('test');

  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        [
          'babel-preset-vite',
          {
            env: true,
            glob: false,
            hot: false,
          },
        ],
        '@babel/preset-typescript',
      ],
    };
  }

  return {};
};
