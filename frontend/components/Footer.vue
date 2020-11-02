<template>
  <v-layout>
    <client-only> <Mobile v-if="$vuetify.breakpoint.smAndDown" /> </client-only>

    <v-footer
        app
        id="footer"
        v-show="!$vuetify.breakpoint.smAndDown"
    >

        <v-layout justify-center>Powered by Essential Tech</v-layout>
    </v-footer>
  </v-layout>
</template>

<script>

import Mobile from './nav/Mobile.vue'

export default {
  components: {
    Mobile
  },

}
</script>

<style>
  #footer{
    
  }

</style>
