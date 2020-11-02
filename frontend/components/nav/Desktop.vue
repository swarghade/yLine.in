<template>
  <v-app-bar
      app
      elevate-on-scroll
      height="64px"
      full-width
      v-show="$vuetify.breakpoint.mdAndUp"
      style="will-change: true"
  >
    
    <v-layout
      class="w-100"
      justify-space-between mt-3
      align-center

    >
      <client-only>
      
        <v-flex shrink pl-5 >
          <v-img  width="128" :src="this.$vuetify.theme.dark ?  WhiteLogo : BlackLogo"> </v-img>
        </v-flex>
      
      <v-flex>
      </v-flex>
        <!--
        <v-flex md4 mt-3
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <v-text-field
            height="32px"
            filled
            rounded
            disabled
            dense
            placeholder="Search for a shop"
          >
          </v-text-field>
        </v-flex>
        -->
      </client-only>

      <v-flex>
      </v-flex>
      
      <desktopCore v-show="showDesktopMenu" row justfiy-end shrink >
      </desktopCore>
      
    </v-layout>
  </v-app-bar>
</template>

<script>

import {  } from "@mdi/js"
import desktopCore from './desktopCore'

import WhiteLogo from '~/assets/logo-white.png'
import BlackLogo from '~/assets/logo-black.png'

export default {
  components: {
    desktopCore
  },
  data(){
    return {
      showDesktopMenu: true,
      showMobileMenu: false,
      drawer: false,
      WhiteLogo,
      BlackLogo
    }
  },

  watch: {
    '$vuetify.breakpoint.smAndDown': function (val){
      this.showMobileMenu = val
    },
    '$vuetify.breakpoint.mdAndUp': function (val){
      this.showDesktopMenu = val
    },

  },

  mounted(){
    /*
    this.$nextTick( () => {
      if(this.$vuetify.breakpoint.smAndDown)
      {
        this.showDesktopMenu = true
        this.showMobileMenu = false
      }
      if(this.$vuetify.breakpoint.smAndDown)
      {
        this.showDesktopMenu = false
        this.showMobileMenu = true
      }
    } )
    */
    
  }

}
</script>

<style>

</style>
