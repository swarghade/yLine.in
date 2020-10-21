// Initializes the `shops` service on path `/shops`
const { Shops } = require('./shops.class')
const createModel = require('../../models/shops.model')
const hooks = require('./shops.hooks')
const debug = require('debug')('shops/service')


//const  { authenticate } =  require('@feathersjs/authentication')

const multer = require('multer');
const storage = multer.memoryStorage()

const multipartMiddleware = multer({
  storage: storage,
  fileFilter(req, file, cb){

    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/webp' || file.mimetype == 'image/jpg' || file.mimetype == 'image.png' )
      cb(null,true)

    else
      cb(null,false)

  },
  limits: {
    fileSize: 5000000
  }
}); 

const multerMiddleware = multipartMiddleware.array('images[]',3)

function multipartWrap(req, res, next)
{
  debug('in wrap',req.method)
  debug(` req.files %o `,req.files)
  if((req.method.toLowerCase() == 'post' || req.method.toLowerCase() == 'patch' || req.method.toLowerCase() == 'put' ))
  {
    return multerMiddleware(req,res,next)
  }
  
  next()
}

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    id: 'shop_id'
  }
  


  // Initialize our service with any options it requires
  app.use('/shops', (req,res,next) => {
    debug(' body is - %o ',req.body)
    next()
  } , multipartWrap, ( req, res, next ) => {  
    debug('Body after multipart is -> %o %o',typeof req.body,req.body)
    req.feathers.files = req.files
    next();
  },
  new Shops(options, app) )

  // Get our initialized service so that we can register hooks
  const service = app.service('shops')

  service.hooks(hooks)
}
