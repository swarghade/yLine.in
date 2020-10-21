const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication')
const { LocalStrategy } = require('@feathersjs/authentication-local')
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth')
const config =  require('../config/default.json');



class GoogleStrategy extends OAuthStrategy {
  constructor(){
    super()
    
  }

  getRedirect(data){
  //console.log(` Redirect -> ${JSON.stringify(data.user,'',2)} `)

    let url = config.authentication.oauth.redirect
    let seperator = '#'
    let accessToken = 'access_token='+data.accessToken
    let user = '&id='+data.user.id
    
    return url + seperator + accessToken + user
  }

  async getEntityData(profile) {
  
    const baseData = await super.getEntityData(profile);    
    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      profile_picture: profile.picture,
      email: profile.email
    };
  }
}


module.exports = app => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('google', new GoogleStrategy());

  app.use('/authentication', authentication)
  app.configure(expressOauth())
}
