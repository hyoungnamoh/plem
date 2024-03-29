module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          components: './src/components',
          pages: './src/pages',
          api: './src/api',
          assets: './src/assets',
          constants: './src/constants',
          helper: './src/helper',
          hooks: './src/hooks',
          states: './src/states',
          tabs: './src/tabs',
          utils: './src/utils',
          types: './src/types',
        },
      },
    ],
  ],
};
