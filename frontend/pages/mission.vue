<template>
  <v-layout class="black white--text " wrap justify-center>
    <v-flex xs12 class="pa-2" style="min-height: 100vh; text-align: center">
      <v-layout justify-center align-center pt-5 wrap>
        <v-flex xs10 md7>
          <v-img contain :style="artSize" :src="require('~/assets/artwork1.jpg')"> </v-img>
          <p class="caption grey--text" style=""> Artwork by <!--<span class="grey--text text--lighten-1"> Katerina Nencini </span> --> @ <a class="blue--text" style="text-decoration: none" target="__blank" href="https://www.instagram.com/mondocapovoltoillustrazioni/"> mondocapovoltoillustrazioni </a> </p>
        </v-flex>
        <v-flex xs12 md7 py-3>
          <h1 class="c-main-header" style="font-weight: 350 !important"> Why <span class='red--text lighten--2'> risk </span> your precious life  ?  </h1>
        </v-flex>

        <v-flex
          xs10 md6
        >
          <v-btn centered rounded outlined dark style="width: 100%" @click="$vuetify.goTo('#secondContent')" > Explore </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    
    
    <v-flex xs12  class="pa-2 text-center" style="min-height: 90vh;">
      <v-layout align-center justify-center column fill-height id="secondContent">
      <h1 class="c-main-header" style="font-weight: 350 !important"> What would you do when  </h1> <br/>
      <h2 class="c-body" style="opacity: .7"> You have to leave your house to survive, </h2>
      <h2 class="c-body" style="opacity: .7"> But.. Leaving your house becomes a threat itself</h2>
      <br/> <br/>
      <h2 class="c-main-header font-italic font-weight-light" style="color: #FFB984"> CATCH 22 </h2>
      </v-layout>

    </v-flex>

    <v-flex xs12  class=" pa-2 text-center " style="min-height: 80vh">
      <h1 class="c-main-header" style="font-weight: 350 !important"> Fear of Contagion  </h1>
        <ul class="c-body text" style="opacity: .75; list-style: none; padding: 0"> 
          <li> Human fear uncertainty more than failure </li>
          <li> Imagine having constant fear of contracting COVID-19 everytime you step out of your house </li>
        </ul> 

        <br/> <br>
        
        <v-layout fill-height column align-center id="crowd-parent">
          <h1 class="c-sub-header">  Social distancing is our best bet </h1>
            <div id="crowd" class="pa-0 ma-0">  </div>
          <h1 class="c-sub-header" style='opacity: .75'> But we cannot achieve it in certain situations  </h1>
          <v-layout justify-center>
              <div :style="artSize" id="line" class="pa-0 ma-0">  </div>
          </v-layout>
        </v-layout>
        <!-- Animation -->

        
        <!-- Animation -->

    </v-flex>

    <v-flex xs12 md6 class="pa-2 text-center" style="min-height: 100vh">
      
      <h1 class="c-main-header" style=''> That's where we come in  </h1> <br/>
      <br/>
      <div class="text-left ml-5 pr-3" >
        <h1 class="c-body" style="opacity: .85"> Shops registering under us would, </h1>
        <h1 class="c-body grey--text text--lighten-1" style=""> <v-badge dark class="black--text" content="1"  color="white" > </v-badge> &nbsp; &nbsp; Be instructed to comply by official safety guidelines  </h1>
        <h1 class="c-body grey--text text--lighten-1" style=""> <v-badge dark class="black--text" content="2"  color="white" > </v-badge> &nbsp; &nbsp; Have a safety rating metric </h1>
        <h1 class="c-body grey--text text--lighten-1" style=""> <v-badge dark class="black--text" content="2"  color="white" > </v-badge> &nbsp; &nbsp; Have digital appointment facility to <span class="light-green--text"> reduce physical contact </span> </h1>
      </div>
      <br/> <br/>
      <p class="c-body grey--text text--lighten-1" style=''> With every digital appointment you book from us, you are contributing towards the fight against coronavirus. Users would be confident about a store by looking at the user ratings.
        Additionally users would feel safer knowing that a service like this exists 
      </p>

      <v-layout justify-center id="mobile-parent" >
        <div id="mobileLottie" :style="artSize" > </div>
      </v-layout>

    </v-flex>

    <v-flex xs12 class="pa-2 text-center" style="min-height: 100vh">
      <h1 class="c-main-header" style=''> IN Conclusion <span class="caption grey--text">  TLDR  </span> </h1>

      <br/> <br/>
      <p class="c-body grey--text">
        This is an attempt to revive a feeling of certainty & responsibility among us.
      </p>
       <br/> <br/>
      <v-layout column justify-center align-center column>
        <p class="c-sub-header"> Want to have a chat with us ? </p>
        <a target="__blank" href="https://essentialtech.in/#contactUs" class="v-btn v-btn--depressed v-btn--flat v-btn--outlined v-btn--rounded theme--dark v-size--default"> Contact US  </a>
      </v-layout>


      <div style="height: 25vh"> &nbsp; </div>
      <h1 class="c-body font-weight-regular grey--text text--lighten-1" > Always remember, <br/>  Surviving, in essence, is an individual effort  </h1>
      <v-layout justify-center>
          <div id="isolate" class="pa-0 ma-0">  </div>
        </v-layout>
    </v-flex>

    <v-flex xs12 class="pa-2 text-center" style="min-height: 80vh">
      <v-layout align-content-center wrap justify-center fill-height>
        <h1> fin. </h1>
      </v-layout>
    </v-flex>



  </v-layout>
</template>

<script>



import crowd from '~/assets/crowd.json'
import line from '~/assets/line.json'
import isolate from '~/assets/isolate-virus.json'
import lottie from 'lottie-web'

import mobile from '~/assets/mobile.json'



export default {

  data(){
    return {
      controller: null,
      artSize: {
        width: '65vw',
        height: '45vh',
        controller: null
      },

      animations: {
        crowd: null,
        line: null,
        isolate: null
      },

      scrollMagicErrored: false
    }
  },
  head: {
  },

  methods : {
    setupScrollMagic(){
      console.log(` setting up magic `)
      this.controller = new ScrollMagic.Controller()

      console.log(this.controller)
      const crowdScene = new ScrollMagic.Scene({ 
        triggerElement: document.getElementById('crowd'),
        duration: document.getElementById('crowd').clientHeight
      }).addTo(this.controller)

      crowdScene.on('progress', (e) => {
        if(e.progress <= 0.66 )
          this.animations.crowd.goToAndStop((e.progress*1.50)*60,true)
        else
          this.animations.crowd.goToAndStop(60,true)
      } )

      // mobileLottie

      const isolate = new ScrollMagic.Scene({ 
        triggerElement: document.getElementById('isolate'),
        duration: document.getElementById('isolate').clientHeight
      }).addTo(this.controller)

      isolate.on('progress', (e) => {

          this.animations.isolate.goToAndStop((e.progress)*180,true)

      } )

    }
  },

  watch: {
  
    /*'$vuetify.breakpoint.mdAndUp': function (val, oldVal) {

      if(val == true)
      {
        this.artSize.width = '55vw'
        this.artSize.height = '55vh'
      }
    },
    '$vuetify.breakpoint.smAndDown': function (val, oldVal) {

      if(val == true)
      {
        this.artSize.width = '95vw'
        this.artSize.height = '45vh'
      }
    }*/
  },
  
  created(){
    
    this.$loadScript("https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.7/ScrollMagic.min.js")
    .then( () => {
      //alert('loaded')
      this.setupScrollMagic()
    } )
    .catch( () => {
      this.scrollMagicErrored = true
    } )


  },
  


  mounted(){

    setTimeout( () => this.$vuetify.theme.dark = true, 250 )

    if(this.$vuetify.breakpoint.smAndDown)
    {
      this.artSize.width = '95vw'
      this.artSize.height = '45vh'
    }
    else
    {
      this.artSize.width = '75vw'
      this.artSize.height = '70vh'
    }
  
    

    this.animations.crowd = lottie.loadAnimation({
      animationData: crowd,
      container: document.getElementById('crowd'),
      renderer: 'canvas',
      loop: false,
      autoplay: true,
      
    })
    
    this.animations.crowd

    this.animations.line = lottie.loadAnimation({
      animationData: line,
      container: document.getElementById('line'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      rendererSettings: {
        width: '640',
        height: '640'
      }
      
    })

    this.animations.isolate = lottie.loadAnimation({
      animationData: isolate,
      container: document.getElementById('isolate'),
      renderer: 'canvas',
      loop: true,
      autoplay: false
      
    })

    this.animations.mobile = lottie.loadAnimation({
      animationData: mobile,
      container: document.getElementById('mobileLottie'),
      renderer: 'svg',
      loop: true,
      autoplay: true
      
    })
    


    
    
    
  },

  beforeRouteLeave(to,from,next){
    if(!((to.path).match(/\/shops\/\d+/)) ) 
      setTimeout( () => this.$vuetify.theme.dark = false, 0 )
    next()
  }


}
</script>

<style>

  #crowd{
    width: 55vmax;
    height: 55vmax;

  }
  #line{
    width: 65vmax;
    height: 65vmax;
    padding: 0px;
    margin: 0px;
    
  }
  #isolate{
    width: 45vmax;
    height: 45vmax;
    padding: 0px;
    margin: 0px;
    
  }

</style>