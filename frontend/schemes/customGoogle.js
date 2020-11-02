import Oauth2Scheme from '@nuxtjs/auth/lib/schemes/oauth2'
import nanoid from 'nanoid'
const isHttps = process.server ? require('is-https') : null

const DEFAULTS = {
  token_type: 'Bearer',
  response_type: 'token',
  tokenName: 'Authorization',
  token_key: 'access_token',
  refresh_token_key: 'refresh_token'
}

const encodeQuery = queryObject => {
  return Object.entries(queryObject)
    .filter(([key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

const parseQuery = queryString => {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

function normalizePath (path = '') {
  // Remove query string
  let result = path.split('?')[0]

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }

  return result
}



export default class customGoogle extends Oauth2Scheme {

  get _scope () {
    return Array.isArray(this.options.scope)
      ? this.options.scope.join(' ')
      : this.options.scope
  }

  get _redirectURI () {
    const url = this.options.redirect_uri

    if (url) {
      return url
    }

    if (process.server && this.req) {
      const protocol = 'http' + (isHttps(this.req) ? 's' : '') + '://'

      return protocol + this.req.headers.host + this.$auth.options.redirect.callback
    }

    if (process.client) {
      return window.location.origin + this.$auth.options.redirect.callback
    }
  }

  async mounted () {
    // Sync token
    const token = this.$auth.syncToken(this.name)
    // Set axios token
    if (token) {
      this._setToken(token)
    }

    // Handle callbacks on page load
    const redirected = await this._handleCallback()

    if (!redirected) {
      return this.$auth.fetchUserOnce()
    }
  }

  _setToken (token) {
    // Set Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
  }

  _clearToken () {
    // Clear Authorization token for all axios requests
    this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
  }

  async reset () {
    this._clearToken()

    this.$auth.setUser(false)
    this.$auth.setToken(this.name, false)
   // this.$auth.setRefreshToken(this.name, false)

    return Promise.resolve()
  }

  login ({  state, nonce } = {}) {

    const url = this.options.authorization_endpoint /*+ '?' + encodeQuery(opts)*/ 
    window.location = url
  }

  async fetchUser () {
    if (!this.$auth.getToken(this.name) ) {
      return
    }

    if (!this.options.userinfo_endpoint) {
      this.$auth.setUser({})
      return
    }

    const user = await this.$auth.requestWith(this.name, {
      url: this.options.userinfo_endpoint + '/' + this.$auth.$storage.getUniversal('id')
    })

    this.$auth.setUser(user)
  }

  async _handleCallback (uri) {
    // Handle callback only for specified route
    if (this.$auth.options.redirect && normalizePath(this.$auth.ctx.route.path) !== normalizePath(this.$auth.options.redirect.callback)) {
      return
    }
    // Callback flow is not supported in server side
    if (process.server) {
      return
    }

    const hash = parseQuery(this.$auth.ctx.route.hash.substr(1))
    const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)
    // accessToken/idToken

    //alert(JSON.stringify(parsedQuery,'',2))
    let token = parsedQuery[this.options.token_key]
    let id = parsedQuery['id']
    

    if (!token || !token.length) {
      return
    }

    // Append token_type
    if (this.options.token_type) {
      token = this.options.token_type + ' ' + token
    }

    this.$auth.$storage.setUniversal('loggedIn',true)
    this.$auth.$storage.setUniversal('id',id)
    // Store token
    this.$auth.setToken(this.name, token)
    
    // Set axios token
    this._setToken(token)  

    // Store refresh tokena
    /* if (refreshToken && refreshToken.length) {
      refreshToken = this.options.token_type + ' ' + refreshToken
      this.$auth.setRefreshToken(this.name, refreshToken)
    }
    */

    // Redirect to home
    this.$auth.redirect('home', true)

    return true // True means a redirect happened
  }
}
