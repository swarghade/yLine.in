<template>
  <v-layout
    row
    wrap
    fill-height
    align-start
    justify-center
  >
    <div :key="'abc'+gpsKey">
      <component :is="gpsComponent" > </component>
    </div>

    <v-flex 
      xs12 
      pa-5
      style=""
      class="black white--text" 

    >
      <v-layout fill-height 
        fluid
        mt-5
        :justify-center="dynamicMobile"
        :justify-space-around="!dynamicMobile" 
        align-center
        :row="!dynamicMobile"
        :column="dynamicMobile"
        :reverse="dynamicMobile"
      >
        <v-flex lg4 xs10 :class='{"text-left" : !dynamicMobile, "text-center": dynamicMobile }'  >

          <h1 class="c-sub-header"> Practise Social Distancing </h1>
          <span class="c-body" style='opacity: .65'> The right way </span>

          <client-only>
            <br/> 
            <v-btn 
              
              outlined 
              rounded 
              class="my-2"
              dark 
              v-if="!$store.state.gps.status"
              @click="() => { ++gpsKey; gpsComponent='cGps' }"
              style='' > Enable Location 
            </v-btn>
            <br v-if="$store.state.gps.status" />
          </client-only>

        </v-flex> 
    
        <v-flex lg2 xs4 class='text-right' style="position: relative; width: 50%">
          <v-img :src="phone" contain> </v-img>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 pa-5>
      <v-expansion-panels accordion >
        <v-expansion-panel >
          <v-expansion-panel-header><v-layout justify-center> Filters </v-layout></v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-layout justify-center wrap>
              <v-flex xs12 md4 px-5>
                <v-select
                  v-model="filter.category_id"
                  :items="computedCategory"
                  rounded
                  label="Categories"
                  multiple
                  filled
                  
                ></v-select>
              </v-flex>

              <v-flex xs12 md4 px-5>
                <v-select
                  v-model="filter.distance"
                  :items="temp.distance"
                  label="Distance"
                  filled
                  rounded
                  
                >
                </v-select>
              </v-flex>

              <v-flex xs12 md4 px-5>
                <v-select
                  v-model="filter.rating"
                  :items="temp.rating"
                  filled
                  rounded
                  label="Rating"
                  
                >
                </v-select>
              </v-flex>

              <v-flex xs12 md4 px-5>
                <v-btn rounded outlined width="100%" 
                  @click="fetchShops(filter)"
                > Apply </v-btn>
              </v-flex>

            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>

    </v-flex>
    <v-flex xs11 md3 v-if="errored || (shops && shops.length == 0) || !shops"> <h1 class="c-sub-header"> No shop nearby :( </h1>  </v-flex>
    <v-flex
      
      xs11
      md3
      v-else
      v-for="(shop,index) in shops"
      :key="index"
      class="pa-5 mt-2"
    >

      <v-card style="border-radius: 8px !important" 
        nuxt
        :to="`/shops/${shop.shop_id}`"
        class="shop-card elevation-4"
        
      >
        <v-layout justify-space-between wrap  >
          <!-- Image -->
          <v-flex xs12 sm5 md12>
            <v-img 
              cover
              :style="imageSize"
              :lazy-src="require('~/assets/placeholder.png')"
              eager
              transition="fade"
              :src="shop.images[0]"
            ></v-img>
          </v-flex>
          <!-- Content -->
          <v-flex xs12 sm7 md12 pa-3>
            <h1 class='display-3' style="font-size: 2rem !important">{{shop.name}}</h1>
            <div class='subtitle-1' style="opacity: .6"> 
              <v-icon> {{mdiClock}} </v-icon>  
              </client-only> <v-chip>{{shop.start_time | customTime }}</v-chip> - <v-chip>{{shop.end_time | customTime}}</v-chip>
            </div>
            <div>
              <template  v-if="$store.state.gps.status == false">
                <p class="body-1 mt-2">
                  Please enable location to know the distance
                </p>
              </template>
              <div class="subtitle-1" style="opacity: .6"
                v-if="shop.latitude && shop.longitude && $store.state.gps.status"
              > <v-icon> {{mdiCrosshairsGps}} </v-icon> Distance : {{ (calculateDistance( { latitude: $store.state.gps.latitude ,longitude: $store.state.gps.longitude  }, { latitude : shop.latitude, longitude : shop.longitude } )) }} </div>
            </div>

            <div >
              <p class="subtitle-1" style='opacity: .6'> <v-icon> {{mdiStore}} </v-icon> Category : {{startCase(shop.category_name)}} </p>
            </div>

            <div style="width: 100%">
              <template v-if="shop.rating">
                <div class='subtitle-1' style="opacity: .6"> 
                  <v-icon> {{mdiShieldBug}} </v-icon>  Safety : <v-rating readonly style="display: inline" :value="Number(shop.rating)" color="yellow darken-3"
                    background-color="grey darken-1"
                    x-large> </v-rating>
                  
                </div>
              </template>
              <template v-else>
                <div class="subtitle-1 py-1 " style='height: 40px' > 
                  <v-icon> {{mdiShieldBug}} </v-icon>  Rating not available
                </div>
              </template>
            </div>

          </v-flex> 
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import { format, parseISO } from 'date-fns'
import { startCase, assign, clone } from 'lodash'
import { mdiClock, mdiCrosshairsGps, mdiShieldBug, mdiStore } from '@mdi/js'
import { getDistance } from 'geolib';
import cGps from "../../components/gps/index"
import lower from '~/components/svg/lower'
import upper from '~/components/svg/upper'
import phone from '~/assets/phone.svg'

import { emptyObject } from 'check-types'

export default {

  loading: true,

  async asyncData ({ params, store, $axios }) {

    try {
      let opts = {
          latitude: '19.136326',
          longitude: '72.827660',
          distance: 50000,
          limit: 10,
          offset: 0
        }

      let userQuery = store.state.internals.shops.query;
      if(userQuery && typeof userQuery == 'object' && Object.keys(userQuery).length > 0)
        assign(opts,store.state.internals.shops.query)
      
      const res = await $axios.get("shops",{ params: opts })
      //console.log(JSON.stringify(res))
      return {
        shops: res.data,
        total: res.total
      }
    }
    catch(e){ 
      return { shops : []}
      console.log(e)
    }
  },
  components: {
    cGps,
    lower,
    upper
  },
  data(){
    return {
      shops: [],
      total: 0,
      errored: false,
      format,
      parseISO,
      mdiClock,
      getDistance,
      mdiShieldBug,
      mdiStore,
      mdiCrosshairsGps,
      cGps,
      gpsComponent: '',
      gpsKey: 0,
      dynamicMobile: false,
      phone,
      startCase,
      imageSize: {
        width: '50vmax',
        height: '30vh'
      },

      temp: {
        default : {
          latitude: '19.136326',
          longitude: '72.827660',
          distance: 50000,
          limit: 10,
          offset: 0
        
        },
        distance: [ { text: '5 KM', value: 5000 },
                    { text: '15 KM', value: 15000 },
                    { text: '30 KM', value: 30000 },
                    { text: '50 KM', value: 50000},
                    { text: '100 KM', value: 100000}
                  ],
        rating: [
          { text: 'All', value: null },
          { text: '5 Star', value: 5 },
          { text: '4 Star', value: 4 },
          { text: '3 Star', value: 3 },
          { text: '2 Star', value: 2 },
          { text: '1 Star', value: 1 }
        ]
        
      },
      filter: {
        category_id: [],
        distance: 50000,
        rating: null,
      
      },

    }
  },

  watch: {
    '$vuetify.breakpoint.smAndDown': function(val){
      this.dynamicMobile = val
    },


  },
  async mounted(){
      if(this.$vuetify.breakpoint.smAndDown )
        this.dynamicMobile = true

      this.gpsComponent = ''
      
      if( this.$auth.$storage.getUniversal('gpsPermission') && this.$auth.$storage.getUniversal('gpsPermission') == true )
      {
        this.gpsComponent = 'cGps'
      }
      
      this.fetchShops()

  },


  computed: {
    filteredStore(){
      if(this.shops)
      {
        this.shops.sort(  )
      }
    },
    computedCategory(){
      return this.$store.state.category.data.map( (k,i) => { return {text: startCase(k.name), value: k.id} } )
    },

  },

  methods : {
    calculateDistance(cord1,cord2){
      let dist = getDistance(cord1,cord2)
      let suffix = ''

      if(dist < 1000)
      {
        suffix = 'M'
      }
      else
      {
        dist = Math.round(dist/1000)
        suffix = 'KM'
      }
        
      return dist + ' ' +suffix
    },
    async fetchShops(opts={}){
      
      let temp = this.temp.default
      
      if(this.$store.state.gps.status && this.$store.state.gps.latitude && this.$store.state.gps.longitude)
      {
        opts.latitude = this.$store.state.gps.latitude
        opts.longitude = this.$store.state.gps.longitude
      } 

      console.log(`In fetchShops `)

      console.log(` Temp.default -> ${this.temp.default} `)

      assign(temp,opts)
      
      console.log(temp)

      let res
      try{
        res = await this.$axios.$get('shops',{ "params" : temp })
      }
      catch(e){
        //alert('errored')
        this.shops = []
        this.errored = true
        //console.log(e.response.data.status)
        if(e.response.data.status == 401)
        {
          this.$router.push('login')
        }
        else
        {
          console.log(e)
        }
      }
      //console.log(temp)

      if(res)
      {
        //console.log(res.data.data)
        this.shops = res.data
        this.total = res.total
      }
        
    }
  }



}
</script>

<style>

  .shop-card{
    
  }

  @media only screen and (max-width: 959px){
    .shop-card{
      max-width: 100vw !important;
    }
  }

</style>