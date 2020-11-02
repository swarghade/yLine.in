module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['vuetify'],
  extends: [
    //'@nuxtjs',
    //'eslint:recommended',
    //'plugin:vue/recommended',
  ],
  // add your custom rules here
  rules: {
    '//nuxt/no-cjs-in-config': 'off',
    //'vue/singleline-html-element-content-newline' : 'off',
    //'vuetify/no-deprecated-classes': 'error'
  }
}
