<template>
  <v-layout align-start v-bind="$attrs">

    <client-only>
      <v-flex shrink v-if="$vuetify.breakpoint.smAndDown">
        <v-img width="70%" height="auto" :src="this.$vuetify.theme.dark ?  WhiteLogo : BlackLogo"> </v-img>
      </v-flex>
      <br/>
    </client-only>

    <v-flex shrink >
      <v-btn text nuxt to="/"> HOME </v-btn>
    </v-flex>
    <v-flex>
      <v-btn text nuxt to="/shops"> SHOPS </v-btn>
    </v-flex>
    <v-flex>
      <v-btn text nuxt to="/mission"> MISSION </v-btn>
    </v-flex>
      <!-- <v-btn text nuxt to="/about"> ABOUT </v-btn> -->
    <v-flex>
      <client-only>
        <v-btn v-if="$store.state.auth.loggedIn" text nuxt to="/appointments" > My appointments </v-btn>
      </client-only>
    </v-flex>
    <v-flex>
      
      <client-only>
        <v-menu
          offset-y
          bottom
          open-on-hover
          close-on-content-click
          close-on-click
          v-if="$auth.$storage.getUniversal('loggedIn')"
        >
          
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" >  
                Account &nbsp;
                <v-icon small> {{mdiArrowDownDropCircle}} </v-icon>  
            </v-btn> 
          </template>

          <v-list >

            <v-list-item>
              <v-layout justify-center>
                <v-flex shrink>
                  <v-img class="avatar mb-2 " style="width: 64px !important; height: 64px !important; border-radius: 50%" 
                    :aspect-ratio="1" 
                    :src="$store.state.auth.user.profile_picture ? $store.state.auth.user.profile_picture : require('~/assets/avatar.jpg')" 
                  > </v-img>
                </v-flex>
              </v-layout>
            </v-list-item>
            <v-list-item class="mb-5">
              <span class="subtitle-1"> {{$store.state.auth.user.email}} </span>         
            </v-list-item>
            <v-list-item nuxt to="/upgrade"
              v-if=" !$store.state.auth.user.roles.includes('shop')"
            >
              <h1 class='subtitle-1'> Upgrade to a SHOP </h1>
            </v-list-item>

            <v-list-item
              v-else
              nuxt
              to="/myShop"
            >
              <h1 class="subtitle-1"> My shop </h1>
            </v-list-item>

            <v-list-item nuxt @click="$auth.logout()">
              <h1 class='subtitle-1'> Logout </h1>
            </v-list-item>
          </v-list>
          
        </v-menu>
        
        <v-btn text v-else nuxt to="/login">
          LOGIN
        </v-btn>
      </client-only>
    </v-flex>
    <v-flex shrink v-if="$store.state.auth.loggedIn">
      
      <span class='subtitle-1'> {{$store.state.auth.user.name}} </span>
    </v-flex>
  </v-layout>
</template>

<script>

import { mdiArrowDownDropCircle } from '@mdi/js'
import WhiteLogo from '~/assets/logo-white.png'
import BlackLogo from '~/assets/logo-black.png'

export default {
  components: {
    
  },
  data(){
    return {
      mdiArrowDownDropCircle,
      WhiteLogo,
      BlackLogo
    }
  }
}
</script>

<style>
  .avatar{
    border: 1px solid rgba(0,0,0,.2)
  }
</style>