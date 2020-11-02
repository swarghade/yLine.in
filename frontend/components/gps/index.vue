<template>
  <div style='opacity: 0;position: absolute'>
  </div>
</template>
<script>

export default {
  name: "gps",

  data(){
    return {
      loading: false,
      dialog: false
    }
  },
  methods: {
    successHandler(position){
      
      
      this.$store.commit('gps/location',{ latitude: position.coords.latitude, longitude : position.coords.longitude })
      this.loading = false
      this.$store.commit('gps/status',true)
      this.$auth.$storage.setUniversal('gpsPermission',true,true)

      
    },
    errorHandler(e){
      this.$store.commit('gps/status',false)

    },
    init(){

      if(!navigator.geolocation)
      {
        alert(` Geolocation is not supported `)
        this.$store.commit('gps/supported',false)
      }
      else
      {
        this.loading = true
        navigator.geolocation.getCurrentPosition(this.successHandler, this.errorHandler)
      }
    }
  },

  mounted(){
    this.init()
  }
  
}
</script>
