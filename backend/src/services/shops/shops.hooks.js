const { authenticate } = require('@feathersjs/authentication').hooks
const { protect } = require('@feathersjs/authentication-local').hooks

const { validateSchema, preventChanges,  discard, disallow } = require('feathers-hooks-common')
//const { clone } = require('lodash')

const debug = require('debug')('shops/hooks')

const { ajv } = require('../../util/ajv')
const schemas = require('./shops.schemas')
const short = require('short-uuid')

const BUCKET_NAME = 'token-images'


const fileUploadHook =  function() {
  return async (context) => {

    if(!context.params.files || context.params.files.length == 0)
    {
      return context
    }

    let uploads = []
    try {
      
      const s3 = context.app.get('s3')
      context.params.files.forEach( async (image,index) => {
        
        debug('[%o] image -> %o',index,image)

        const params = {
          Bucket : BUCKET_NAME,
          Key : short.generate().substr(0,6)+'-'+image.originalname,
          Body : image.buffer,
          ACL : 'public-read',
          ContentType: image.mimetype
        }
        uploads.push(s3.upload(params).promise())
      
      } )

      let d = await Promise.all(uploads)
    
      if(d)
      {
        debug('d -> %o',d)
        context.data.images = d.map( (k) => {
          debug('IN Map %o',k)
          return k['Location']
        } )
        return context
      }
      
      
      
    }
    catch(e) {
      // delete cloud
      //console.log(e)
      throw e
    }
  }
}

const splitAtLast = ( str, k='/' ) => {
  if( str.length == 0 || !str )
    return null 

  let at = str.lastIndexOf(k)
  if(at == -1)
    return null
  return str.slice(at,str.length)
}


const deleteUploadedFiles =  function(){
  return async (context) => {

    debug(' to Delete : %o ',context.data.images)

    if(context.data && context.data.images)
    {
      const s3 = context.app.get('s3')

      let cpy = {}
      cpy.Bucket = BUCKET_NAME
      cpy.Delete = {}
      cpy.Delete.Objects = context.data.images.map( (k) => {
        const key = splitAtLast(k)
        return { Key : key }
      } )

      let d = await s3.deleteObjects(cpy).promise()
      if(d)
        debug('Deleted successfully %o',d)
    }

    return context
  }
}

const removeValidator = ajv.compile(schemas.remove)


function alterParams(key, value) {
  return async (context) => {
    
    context.params.query[key] = value

    return context
  }
}



module.exports = {
  before: {
    all: [],
    find: [ 
      //authenticate('jwt'),
      validateSchema(schemas.find, ajv),
      alterParams('x_deleted',false)
    ],
    get: [ 
      //authenticate('jwt'), 
      validateSchema(schemas.get, ajv),
    ],
    create: [
      authenticate('jwt'),
      discard('approved'),
      discard('x_deleted'),
      validateSchema(schemas.create, ajv),
      fileUploadHook(),
      
    ],
    update: [
      disallow(),
      authenticate('jwt'),
      discard('approved'),
      discard('x_deleted'),
      validateSchema(schemas.update, ajv),
      fileUploadHook(),

    ],
    patch: [
      authenticate('jwt'),
      discard('approved'),
      discard('x_deleted'),
      validateSchema(schemas.update, ajv),
      fileUploadHook()
      
    ],
    remove: [
      authenticate('jwt')
    ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      
    ],
    find: [],
    get: [],
    create: [ ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [deleteUploadedFiles()],
    update: [deleteUploadedFiles()],
    patch: [deleteUploadedFiles()],
    remove: []
  }
}
