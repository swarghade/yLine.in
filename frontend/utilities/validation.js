import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend, setInteractionMode } from 'vee-validate'

import LoadScript from 'vue-plugin-load-script'
Vue.use(LoadScript)

Vue.loadScript("https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.6.10/lottie_light_canvas.min.js")

// rules
import { email, required, min, max, min_value , max_value, numeric, alpha, alpha_num, length, integer, size, image, mimes } from 'vee-validate/dist/rules'

extend('email',email)
extend('required',required)
extend('min',min)
extend('max',max)
extend('numeric',numeric)
extend('alpha',alpha)
extend('alpha_num',alpha_num)
extend('length',length)
extend('integer',integer)
extend('max_value',max_value)
extend('min_value',min_value)

extend('mimes', mimes)
extend('image', image)
extend('size', size)



// min_value, max_value,

Vue.component('ValidationProvider',ValidationProvider)
Vue.component('ValidationObserver',ValidationObserver)

setInteractionMode('aggressive')



//axios
/*

Vue.$axios.interceptors.response.use( (res) => res, (error) => {
  if(error.response)
    Promise.reject(error.response)
  else
    Promise.reject(error)
} )
*/