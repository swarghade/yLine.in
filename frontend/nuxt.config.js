const colors = require('vuetify/es5/util/colors').default

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const BASE_URL = process.env.production ? 'https://yline.in/api/' : 'http://localhost/api/'
const BASE_URL = 'https://yline.in/api/'



module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'yLine : Book your appointments online',
    title: 'yLine : Book your appointments online',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Leverage techonology to avoid physical contact' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  auth : {
    strategies: {

      customLocal: {                                                      
        _scheme: '~/schemes/customLocal',
        autoFetchUser: false,
        tokenRequired: true,
        endpoints: {
          login: { url: 'authentication', method: 'post', propertyName: 'accessToken' },
          user: {
            url: 'users', method: 'get', propertyName : false
          }
        }
      },
      customGoogle: {
        _scheme: '~/schemes/customGoogle',
        authorization_endpoint: BASE_URL +'oauth/connect/google?',
        scope: ['openid', 'profile', 'email'],
        userinfo_endpoint: BASE_URL + 'users',
        client_id: `32566651297-vqdaqa7tk44apftaui3hfr9l5sgkao88.apps.googleusercontent.com`
      }
    }
  },
  router: {
    //middleware: ['auth']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#5f00ba', height: '2px',  throttle: 0  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: "~/plugins/load", ssr: true },
    "~/plugins/breakpoint",
    {src: "~/utilities/validation",ssr: false},
    { src: '~/plugins/scanner', ssr: false },
    { src: '~/plugins/uploader', ssr: false }
    
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    //'@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
    
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    ['@nuxtjs/axios',{ credentials: true}],
    '@nuxtjs/pwa',
    '@nuxtjs/auth'
    
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: BASE_URL,
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    icons: {
      iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    theme: {
      themes: {
        options: {
          customProperties: true
        },
        dark: {
          background: '#000000',
          primary: colors.blue.darken2,
          accent: '#000000',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }

      }
    }
  },
  pageTransition: {
    name: "fade",
    mode: "out-in"
  },

  env : {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    transpile: ['@nuxtjs/auth', 'vue-plugin-load-script'],

    extend (config, {isServer}) {
    //  if (isServer)  config.plugins.push(new BundleAnalyzerPlugin({}));
  }
  }
}
