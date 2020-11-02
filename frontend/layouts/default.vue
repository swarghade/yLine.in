<template>
  <v-app 
    style="overflow-x: hidden"
  >
    <Nav  style="position: fixed !important; max-height: 64px !important"/>

    <div style="height: 36px !important"> &nbsp; </div>

    <client-only>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      right
      style="position: fixed !important"
      fixed
    >
      <desktopCore column align-start class="pa-2 mt-5"> </desktopCore>
    </v-navigation-drawer>

    </client-only>

    <v-app-bar class="" style="position: fixed !important; width: 100%;z-index: 5" 
      v-show="showMobileMenu" 
      class="pa-0" 
      justify-end
      full-width
      align-center
      >
        <v-spacer/>
        <template>
          <Notification/>
        </template>
        <template>
          <v-btn text @click="drawer=true" height="64px"> <v-icon> {{mdiMenu}} </v-icon> </v-btn> 
        </template>
    </v-app-bar>

    <v-content  
      class="mt-0 pt-5 pb-5 "
    >
      <v-container fluid class="pa-0 ma-0  " fill-height align-start style="will-transform: opacity; padding-bottom: 8vh !important">
        <nuxt />
      </v-container>
      
    </v-content>
    
    <Footer />
  </v-app>
</template>
,
<script>
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import desktopCore from '../components/nav/desktopCore'
import Notification from '../components/notification/index'
import { mdiMenu } from "@mdi/js"

export default {
  components: {
    Footer,
    Nav,
    desktopCore,
    Notification
  },
  data () {
    return {
      drawer: false,
      mdiMenu,
      showMobileMenu: true
      
    }
  },
  watch: {
    '$vuetify.breakpoint.smAndDown': function (val){
      this.showMobileMenu = val
    }
  },
  
  async mounted(){
    if(!navigator.geolocation)
    {
      this.store.gps.commit('supported',false)
    }
    if(this.$vuetify.breakpoint.smAndDown)
      this.showMobileMenu = true
    else
      this.showMobileMenu  = false

    let { data } = await this.$axios.$get('category')
    this.$store.commit('category/set',data)
  }
}
</script>

<style >
  .filepond--item {
    width: calc(50% - .5em);
  }


  .h-100{
    height: 100% !important;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity,transform .2s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
    transform: translateY(10px)
  }
  .c-main-header {
    font-size: 4rem !important;
    font-weight: 300 !important;
    letter-spacing: 0.04em !important;

  }

  .c-sub-header {
    font-weight: 100 !important;
    font-size: 3rem !important;
    line-height: 95% !important;
  }

  .c-body{
    font-weight: 250 !important;
    font-size: 2.35rem !important;
  }

  .c-body-2{
    font-weight: 250 !important;
    font-size: 1.85rem !important;
  }

  .c-overline{
    letter-spacing: 0.1666666667em !important;
    font-weight: 400 !important;
    font-size: 1rem !important;
  }

  @media only screen and (min-width: 960px) and (max-width: 1263px) {
    .c-main-header {
      font-size: 2.75rem !important;
    }

    .c-sub-header{
      font-size: 1.9rem !important;
    }

    .c-body{
      font-size: 1.15rem !important;
      font-weight: 300 !important;
      
    }

    .c-body-2{
      font-weight: 250 !important;
      font-size: 1.0rem !important;
    }
  }

  @media only screen and (max-width: 959px) {
    .c-main-header {
      font-size: 2.0rem !important;
    }

    .c-sub-header{
      font-size: 1.35rem !important;
      font-weight: 300 !important;
    }

    .c-body{
      font-size: 1.25rem !important;
      font-weight: 300 !important;
    }

    .c-overline{
      font-size: 0.75em !important;
      letter-spacing: 0.1666666667em !important;
      font-weight: 400 !important;
    }

    .timeChips > *{
      font-size: 0.95rem !important;
    }
  }


    .grid{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    column-gap: 2px;
    row-gap: 2px;
  }

  .grid-img:nth-child(1){
    grid-column: 1/3 !important;
    grid-row: 1/5 !important;
  }

    .grid-img:nth-child(2){
      grid-column: 3 !important;
      grid-row: 1/3 !important;
      
    }
    .grid-img:nth-child(3){
      grid-column: 3 !important;
      grid-row: 3/5 !important;
    }


  
  @media only screen and (max-width: 959px) {
    .grid{
      grid-template-columns: 1fr 1fr 1fr 1fr !important;
      grid-template-rows: 1fr 1fr 1fr 1fr !important;
    }


    .grid-img:nth-child(1){
      grid-column: 1/5 !important;
      grid-row: 1/4 !important;

    }

    .grid-img:nth-child(2){
      grid-column: 1/3 !important;
      grid-row: 4 !important;
      
    }
    .grid-img:nth-child(3){
      grid-column: 3/5 !important;
      grid-row: 4 !important;
      
    }

  }


body::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
	border-radius: 10px;
}

body::-webkit-scrollbar
{
	width: 10px;
	background-color: #F5F5F5;
}

body::-webkit-scrollbar-thumb
{
	background-color: #AAA;
	border-radius: 10px;
	background-image: -webkit-linear-gradient(90deg,
	                                          rgba(0, 0, 0, .2) 25%,
											  transparent 25%,
											  transparent 50%,
											  rgba(0, 0, 0, .2) 50%,
											  rgba(0, 0, 0, .2) 75%,
											  transparent 75%,
											  transparent)
}

</style>
