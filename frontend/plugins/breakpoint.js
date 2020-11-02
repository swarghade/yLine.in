import Vue from 'vue'
import { format, parseISO } from 'date-fns'

import { VueMaskDirective } from 'v-mask'
Vue.directive('mask', VueMaskDirective);


Vue.filter('customTime', (value)=> {
   if(!value) return ''
   return format(parseISO("2000-01-01 " + value),"hh:mm aa")
})



Vue.prototype.$breakpoint = new Vue({
   data() {
      return {
         mountedBreakpoints: {},
         default: {
            xs: true,
            xsOnly: true,
            xsAndUp: true,
            sm: false,
            smOnly: true,
            smAndDown: true,
            smAndUp: false,
            md: false,
            mdOnly: false,
            mdAndDown: true,
            mdAndUp: false,
            lg: false,
            lgOnly: false,
            lgAndDown: true,
            lgAndUp: false,
            xl: false,
            xlOnly: false,
            xlAndDown: true
         }
      }
   },
   computed: {
      is() {
         return Object.keys(this.$vuetify.default).reduce((breakpoints, dim) => {
            breakpoints[dim] = this.breakpointWithDefault(dim)
            return breakpoints
         }, {})
      }
   },
   methods: {
      breakpointWithDefault(breakpoint) {
         return Object.keys(this.$data.mountedBreakpoints).length > 0 ? this.$data.mountedBreakpoints[breakpoint] : this.$data.default[breakpoint]
      }
   }
})

export default async function ({ app }) {
   if (!app.mixins) {
      app.mixins = []
   }

   app.mixins.push({
      mounted() {
         this.$breakpoint.$data.mountedBreakpoints = this.$vuetify.breakpoint
      }
   })
}
