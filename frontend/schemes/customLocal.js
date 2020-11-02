import LocalScheme from '@nuxtjs/auth/lib/schemes/local'



export default class customLocal extends LocalScheme{

  async login (endpoint) {
    if (!this.options.endpoints.login) {
      return
    }

    // Ditch any leftover local tokens before attempting to log in
    await this.$auth.reset()

    const { response, result } = await this.$auth.request(
      endpoint,
      this.options.endpoints.login,
      true
    )

    if (this.options.tokenRequired) {
      const token = this.options.tokenType
        ? this.options.tokenType + ' ' + result
        : result

      this.$auth.setToken(this.name, token)
      this._setToken(token)
    }
    

    if (this.options.autoFetchUser) {
      await this.fetchUser()
    }
    else
    {
      this.$auth.setUser(response.data.user)
      this.$auth.$storage.setUniversal('id',response.data.user.id)
    }

    return response
  }

  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    /*if(endpoint)
      endpoint = endpoint + '/' + this.$auth.$storage.getUniversal('id')
      */
    /*else if(this.options.endpoints.user)
    {
      this.options.endpoints.user.url + '/' + this.$auth.$storage.getUniversal('id')
    }
*/
    /*const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )*/
    //console.log(' app -> '+this.app+' ctx -> '+this.ctx.app)
    try{
      let user = await this.$auth.ctx.app.$axios.$get('users',{ params: { id: this.$auth.$storage.getUniversal('id') } })
      this.$auth.setUser(user.data[0])
    }
    catch(e){
      //console.log(e)
    }
  }

}