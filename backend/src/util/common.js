module.exports = {

  name: {
    type : 'string',
    minLength: 3,
    maxLength: 128
  },
  password: {
    type: 'string',
    minLength: 4,
    maxLength: 24
  },
  state: {
    type: 'string',
    minLength: 3,
    maxLength: 128
  },
  id: {
    type: 'integer'
  },
  limit: {
    type: 'integer',
    minimum: 1,
    maximum: 100
  },
  offset: {
    type: 'integer',
    minimum: 1
  },
  number: {
    type : 'integer',
    min: 10000000
  },
  email: {
    type: 'string',
    format: 'email',
    minLength: 3,
    maxLength: 128
  },
  description : {
    type: 'string',
    minLength: 3,
    maxLength: 255
  },

        

}