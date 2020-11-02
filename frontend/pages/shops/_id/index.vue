<template>
  <v-layout class="black" full-width pa-5 style="min-height: 100vh" wrap

  >
    <v-snackbar
      v-model="snackbar.status"
      :color="snackbar.color"
      :top="snackbar.top"
      :bottom="snackbar.bottom"
    >
      {{snackbar.message}}
    </v-snackbar>

    <!--  -->
    <v-flex class="" xs12 md6 px-2 >
      <div class='grid  mt-5'style="min-height: 45vh " >
          <img class="grid-img" style=" grid-column: 1/3; grid-row: 1/5; width: 100%; height: 100%; object-fit: cover !important" :src="shop.images[0]" alt="store image"> </img>
          <div class="grey grid-img" style="grid-column: 3;grid-row: 1/3; border-color: black !important;" >
            <img v-if="shop.images[1]" class="" style=" width: 100%; height: 100%; object-fit: cover !important" :src="shop.images[1]" alt="store image"> </img>
          </div>
          <div class=" grey grid-img" style="grid-column: 3;grid-row: 3/5; border-color: black !important;">
            <img v-if="shop.images[2]" class="" style=" width: 100%; height: 100%; object-fit: cover !important" :src="shop.images[2]" alt="store image"> </img>
          </div>
      </div>

    </v-flex>
    <v-flex xs12 md6 class="white--text" px-2 mt-2>
      <h1 class="c-main-header"> {{shop.name}} </h1>
      <!-- <client-only>
        <div v-if="distance">
          <h1 class="c-body"> This shop is <span class=" font-weight-regular"> 24 KM </span> away from you </h1>
        </div>
      </client-only> -->
      <client-only>
        <template v-if="$vuetify.breakpoint.smAndUp" >
          <br/> 
          <br/>
        </template>
      </client-only>
      <div class="c-sub-header py-1"> <span > Timings : </span>
        <v-chip class="timeChips"> {{shop.start_time | customTime}} </v-chip> - <v-chip class="timeChips"> {{shop.end_time | customTime}} </v-chip>
      </div>
      <div >
        <h1 class="c-sub-header py-1" > <span > Address : </span>
          <span class="c-body" style="opacity: .7; letter-spacing: -1px !important;"> {{shop.address}} </span>  
        </h1> 
      </div>
      <template v-if="shop.rating">
        <div class='c-sub-header py-1' style>
        Safety : <v-rating style="display: inline" :value="Number(shop.rating)" color="yellow darken-3"
            background-color="grey darken-1"
            readonly
            x-large> </v-rating>
          
        </div>
      </template>
      <template v-else>
        <div class="c-body " > 
          <v-icon> {{mdiShieldBug}} </v-icon> <span style="opacity: .7">  Rating not available</span>
        </div>
      </template>

      <client-only> <br v-if="$vuetify.breakpoint.smAndDown" /> </client-only>

      <div class="c-body"> Contact : 
        <client-only>
          <template v-if="$vuetify.breakpoint.smAndDown">
            <br/>
          </template>
        </client-only>

        <template v-if="shop.phone_numbers.length == 0">
          <span> No contact information </span>
        </template>

        <template v-else="shop.phone_numbers" >  
          <a :href="'tel:'+k" :key="i" v-for="(k,i) in shop.phone_numbers"
            style="text-decoration: none"
          >
            <v-chip  class="ma-2 c-overline" > {{k}} </v-chip>
          </a>
          </template> 
      </div>

      <div class="c-body" >
        
        Category : {{startCase(shop.category_name)}}
      </div>
      
      <br/>
      
      <client-only>
        <v-layout>
          <span class="c-sub-header"> Date :  </span>
          <v-flex xs8 md6 mx-2>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="semanticDate"
                  label="Date"
                  :prepend-inner-icon="mdiCalendar"
                  readonly
                  v-on="on"
                  :border=5
                  rounded
                  outlined
                  :dense="$vuetify.breakpoint.smAndDown"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="date"
                :min="new Date().toISOString().substr(0,10)"
                :max="format(addDays( parseISO(new Date().toISOString()), 21 ),'yyyy-MM-dd').toString().substr(0, 10)"
                :max-days=14
                @change="save"
              ></v-date-picker>

              
            </v-menu>
          </v-flex>
        </v-layout>
      </client-only>

      <client-only>
        <v-flex>
          <v-list
          >
            <v-list-item class="pa-0" v-if="slotItems.length == 0">
              <p class="c-body"> No slots are available :( </p>
            </v-list-item>

            <v-list-item class="pa-0 slot-item" v-for="(slot, key) in slotItems"  :key="key">
              <v-layout class="c-body" justify-space-between wrap
                style="border-bottom: 1px solid #5f6060"
                py-2
                
              >
                <v-flex :shrink="$vuetify.breakpoint.xsOnly" md6 >
                  <p style="margin-bottom: 0px !important"> {{slot.slot}} </p>
                  <p style="margin-bottom: 6px !important; opacity: .9; color: #81C784" 
                    class="c-overline" 
                    v-if="slot.status"> 
                      {{slot.available}} 
                      {{`slot${ slot.available > 1 ?  "s" : ""  } available`}} </p>
                  <p v-if="!slot.status"> </p>
                </v-flex>

                <v-flex xs3 md3 >
                  <template v-if="$store.state.auth.loggedIn && $route.params.id == $store.state.auth.user.id">
                    <v-btn v-if="$vuetify.breakpoint.smAndUp" disabled color="#66BB6A" rounded> Is Available </v-btn>
                  </template>
                
                  <template v-else-if="slot.status && slot.valid ">
                    <v-btn  outlined 
                            :rounded="$vuetify.breakpoint.smAndUp" width="50%" color="#66BB6A" style="border: 1.25px solid #66BB6A !important;" 
                      @click="bookSlot(slot)"
                    > Book </v-btn>
                  </template>
                  <template v-else>
                    <v-btn text rounded disabed width="50%" color="red" > {{!slot.valid ? "Not available" : "BOOKED"}} </v-btn>
                  </template>
                </v-flex>
              </v-layout>
            </v-list-item>
          </v-list>
        </v-flex>
      </client-only>

      

      <!-- client only -->
      
    </v-flex> 
  </v-layout>
</template>

<script>

import { mdiCalendar, mdiShieldBug, mdiPhone, mdiStore } from '@mdi/js'
import { format, parseISO, addDays, compareDesc, formatISO } from 'date-fns'
import  { emptyObject } from 'check-types'
import qs from 'querystring'

import { startCase } from 'lodash'

export default {
  async asyncData ({ params, $axios }) {
    try {
      const res = await $axios.$get(`shops/${params.id}`)
      //console.log(JSON.stringify(res))
      return {
        shop: res
      }
    }
    catch(e){
      return {
        shops: [],
        errored: true
      }

      throw e
    }
  },

  data(){
    return {
      isDesktop: true,
      date: format( parseISO((new Date().toISOString())) ,"yyyy-MM-dd"),
      picker: new Date().toISOString().substr(0, 10),

      loading: true,
      startCase,

      snackbar: {
        status: false,
        message: '',
        color: 'info',
        top: true,
        bottom: false
      },

      shop: {},
      distance: true,
      menu: '',

      headers: [ { text: 'Slot Time', value: "slot" }, { text: 'Available', value: 'available' }, { text: "Status", value: "status" } ],
      slotItems: [ ],

      mdiCalendar,
      mdiShieldBug,
      format,
      addDays,
      parseISO,
      mdiPhone,
      mdiStore
    }
  },
  computed: {
    semanticDate(){
      return format(parseISO(this.date),'dd MMM yyyy')
    },
    
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'DATE'))
    },
  },
  
  methods: {
    async save (date) {
      this.$refs.menu.save(date)
      this.fetchSlots()
      
    },

    async getShopInfo(){
      this.shop = await this.$axios.$get(`shops/${params.id}`)
    },

    async getSlot(p={}){
      return this.$axios.$get('/slots',{ params: p }) 
    },
    async fetchSlots(){

      this.loading = true

      const slotTemp = await this.getSlot({ date: this.date, shop_id: this.$route.params.id })
      this.slotItems = this.transformToTable(slotTemp).filter((k,i,a) => k.valid)

      this.loading = false

    },
    
    transformToTable(arr){
      return arr.map( ( k,i,a ) => {
        let obj = {}
        obj.slot_id = k.slot_id
        let slot_start =  format(parseISO("2000-01-01 " + k.slot_start),"hh:mm aa")
        let slot_end =  format(parseISO("2000-01-01 " + k.slot_end),"hh:mm aa")
        obj.slot = ` ${slot_start} TO ${slot_end} `
        obj.status = k.is_available
        obj.available = k.limit - k.bookings
        const date = format(parseISO(k.date),'yyyy-MM-dd')
        //const date = formatISO(new Date(), 'yyyy-MM-dd' ) 
        let now =  parseISO( new Date().toISOString())
        //alert(` Now -> ${now} end -> ${slot_end} `)
        //alert( compareDesc(new Date(), slot_end) )
        //console.log( ' curr -> ' +parseISO(new Date().toISOString()) )
        //console.log(format(parseISO(date +' ' + k.slot_end),'PPPPpppp'))

        obj.valid = compareDesc(now, parseISO(date +' ' + k.slot_end) )  == -1 ? false : true


        return obj
      } )
    },
    async bookSlot(slot){
      try{
        const data = await this.$axios.$post(`slots-users`,{slot_id : slot.slot_id})
        if(data)
        {
          this.snackbar.message = "Slot booked successfully"
          this.snackbar.color = "success"
          this.snackbar.status = true

          this.fetchSlots()
        }
        
        
      }
      catch(e){
        //let msg = ''
        //if(e.message.match(/You are not allowed to book a slot in your own shop/gi))
        console.log(JSON.stringify(e,'',2))
        
        this.snackbar.message = e.response.data.message
        this.snackbar.color = "red"
        this.snackbar.status = true
        
      }
    }

  },
  async mounted(){
    setTimeout( () => this.$vuetify.theme.dark = true, 0 )

    if(emptyObject(this.shop))
      await this.getShopInfo()
    
    this.fetchSlots()
  },
  beforeRouteLeave(to,from,next){
    if(!((to.path).match(/\/shops\/\d+/)) ) 
      setTimeout( () => this.$vuetify.theme.dark = false, 200 )
    next()
  }
  
}
</script>

<style scoped> 

  .theme--dark.v-application, .v-toolbar__content, .theme--dark.v-sheet, table, .v-data-footer{
    background-color: #000 !important;
    background: #000 !important;
  }

  td {
    font-size: 2.0rem !important;
    font-weight: 180 !important;
    padding: 0.75rem !important;
  }

  .timeChips{
    font-size: 1.2rem !important;
    font-weight: 350 !important;
    opacity: .8;
    letter-spacing: 3px !important;
  }

  .slot-item{
    border-bottom: 1px solid #444444;
  }

  .slot-item:last-child {
    border-bottom: 0px !important;
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

  


</style>