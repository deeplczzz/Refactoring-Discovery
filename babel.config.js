module.exports = {
  presets: [
    '@babel/react', 
    '@babel/preset-env'
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
        style: 'css',
      },
      'antd',
    ],
    [
      'import',
      {
        libraryName: '@ant-design/charts',
        libraryDirectory: 'lib/plots',
        style: false,
      },
      '@ant-design/charts',
    ],
    ['@babel/plugin-transform-runtime',
      {
          "corejs": false,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining'
  ],
};
  