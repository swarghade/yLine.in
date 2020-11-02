<template>
  <v-bottom-navigation
    :value="activePage"
    :height="$vuetify.breakpoint.smOnly ? '15vh' : '8vh'"
    bottom
    fixed
    grow
  >
    <template v-if="$store.state.auth.loggedIn && !$store.state.auth.user.roles.includes('shop')">
      <v-btn text class="h-100" nuxt to="/account"  >
        <span>My Account</span>
        <v-icon>{{mdiCog}}</v-icon>
      </v-btn>
      <v-btn text class="h-100" nuxt to="/shops" >
        <span>Stores</span>
        <v-icon>{{mdiMapMarker}}</v-icon>
      </v-btn>
      <v-btn text class="h-100" nuxt to="/appointments">
        <span>My Appointment</span>
        <v-icon>{{mdiCalendarMonth}}</v-icon>
      </v-btn>
    </template>

    <template v-if="$store.state.auth.loggedIn && $store.state.auth.user.roles.includes('shop')">
      <v-btn text class="h-100" nuxt to="/scanner"  >
        <span>Scanner</span>
        <v-icon>{{mdiCog}}</v-icon>
      </v-btn>
      <v-btn text class="h-100" nuxt to="/shops" >
        <span>Shops</span>
        <v-icon>{{mdiMapMarker}}</v-icon>
      </v-btn>
      <v-btn text class="h-100" nuxt to="/myShop#appointments">
        <span>Generate Slot</span>
        <v-icon>{{mdiCalendarMonth}}</v-icon>
      </v-btn>
    </template>
  </v-bottom-navigation>
</template>

<script>

import {mdiMapMarker, mdiCalendarMonth, mdiCog } from '@mdi/js'

export default {
  data(){
    return {
      activePage: 1,
      mdiMapMarker,
      mdiCalendarMonth,
      mdiCog
    }
  }
}
</script>

<style>

</style>
