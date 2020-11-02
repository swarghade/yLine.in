<template>
  <client-only>
    <v-container 
      align-start
      :key="uniqueKey"
      
    >
      <v-dialog
        v-model="dialog.status"
        max-width="300px"
        
      >
        <v-card>
          <v-card-text> <canvas id="qr" > </canvas> </v-card-text>
          <v-card-actions>
            <v-btn text style="width: 100%" @click="dialog.status =  false"> Close </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-model="snackbar.status"
        :color="snackbar.color"
        :top="snackbar.top"
        :bottom="snackbar.bottom"
      >
        {{snackbar.message}}
      </v-snackbar>
      <h1 class="c-sub-header"> Appointments </h1> <br/>
    
          <v-tabs v-model="tab" grow  >
            <v-tab > Upcoming ({{upcoming.length}}) </v-tab>
            <v-tab > Past ({{past.length}}) </v-tab>
            
          </v-tabs>

          <v-tabs-items v-model="tab">
            
            <v-tab-item>
              <v-layout
                justify-start
                wrap
              >
                <v-flex
                  xs12 md6 lg3
                  pa-2
                  v-for=" (item,key) in upcoming"
                    :key="key"
                >
                  <v-card class="pa-5"
                    
                  >
                    <v-layout justify-space-between >
                      
                      <v-flex shrink  mt-3>
                        <v-img :src="require('../../assets/store.jpg')"
                          cover
                          style="border-radius: 50%; width: calc(56px + 1vw); height: calc(56px + 1vw)"
                        > </v-img>
                      </v-flex>
                      <v-flex ml-3 >
                        <v-card-title class="">
                          {{item.name}}
                        </v-card-title>
                        <v-card-subtitle>
                          <p class="body-1" > {{format(item.start,"PPPp")}} </p>
                          {{ item.diff }} 
                        </v-card-subtitle>
                      </v-flex>
                    </v-layout>
                    
                      <v-card-actions class="pa-0" style="width:100% !important">
                        <v-spacer/>
                        <a class="v-btn v-btn--flat v-btn--rounded v-btn--text theme--light v-size--default" :href="handleMap(item)" target="_blank"> Open in Maps</a>
                        <v-btn text outlind rounded @click="generateQR(item)" > Show QR </v-btn>
                        <v-btn text outlined rounded color="red"
                          @click="handleDelete(item.slot_id,item.user_id)"
                        > DELETE </v-btn>
                      </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-tab-item>
            <v-tab-item>
              <v-layout
                justify-start
                wrap
              >
                <v-flex
                  xs12 md6 lg3
                  pa-2
                  v-for=" (item,key) in past"
                      :key="key"
                  >
                    <v-card class="pa-5"
                      
                    >
                      <v-layout justify-space-between >
                        
                        <v-flex shrink  mt-3>
                          <v-img :src="require('../../assets/store.jpg')"
                            cover
                            style="border-radius: 50%; width: calc(56px + 1vw); height: calc(56px + 1vw)"
                          > </v-img>
                        </v-flex>
                        <v-flex ml-3 >
                          <v-card-title class="">
                            {{item.name}}
                          </v-card-title>
                          <v-card-subtitle>
                            <p class="body-1" > {{format(item.start,"PPPp")}} </p>
                            {{ item.diff }} 

                            
                          </v-card-subtitle>
                        </v-flex>
                      </v-layout>
                      
                        <v-card-actions class="pa-0" style="width:100% !important">
                          
                          <v-btn text outlind rounded 
                            v-if="!item.used"
                            nuxt
                            :to="`/shops/${item.shop_id}`"
                          > Reschedule </v-btn>
                          <v-btn text outlind rounded 
                            v-if="item.used"
                            nuxt
                            :to="`/shops/${item.shop_id}`"
                          > Rebook </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
              </v-layout>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
  </client-only>
</template>

<script>

import querystring from 'querystring'
import { clone } from 'lodash'
import { formatDistanceStrict, format, parseISO, formatISO , formatDistanceToNowStrict, differenceInMilliseconds } from 'date-fns'
import QRCode from 'qrcode'

const setArray = (set, arr, target ) => {
  target.forEach( (k,i) => {
    set(arr,i,k)
  } )
  
}

export default {

  data(){
    return {
      uniqueKey: 0,
      upcoming: [],
      past: [],
      snackbar: {
        status: false,
        message: '',
        color: 'info',
        top: true,
        bottom: false
      },
      tab: 0,
      filter: 'past',
      formatISO,
      formatDistanceStrict,
      formatDistanceToNowStrict,
      differenceInMilliseconds,
      format,
      parseISO,

      dialog: {
        status: false,
        message: ''
      },
      globalDate: new Date(),
      interval: null
    }
  },
  methods: {
    generateGoogleDir(obj){
      obj.api = 1
      return `https://google.com/maps/dir/?${querystring.stringify(obj)}`
    },

    async handleDelete(slot_id, user_id){
      try{
        const data = await this.$axios.$delete(`slots-users/${slot_id}?user_id=${user_id}`)

        if(data)
        {
          this.snackbar.message = 'Deleted successfully'
          this.snackbar.status = true
          this.snackbar.color = 'success'

          await this.fetchAppointments()
        }
        
      }
      catch(e){
        this.snackbar.message = e.response.data.message
        this.snackbar.status = true
        this.snackbar.color = 'error'
      }
    },

    handleMap(data){
      let obj = {}
      if(data.latitude && data.longitude)
        obj.destination = `${data.latitude},${data.longitude}`
      else
        obj.destination = data.address

      return this.generateGoogleDir(obj)
    },
    async fetchAppointments(){
      if(this.$store.state.auth.loggedIn){
        try{
          const data = await this.$axios.$get(`slots-users?user_id=${this.$store.state.auth.user.id}`)
          //this.appointments = data
          if(data.length > 0)
          {
            let obj = {
              upcoming: [ ],
              past: [ ]
            }


            let temp = data.map( (k,i) => {

              let cpy = clone(k)
              const temp = k.date + " " + k.slot_end
              const temp_start = k.date + " " + k.slot_start
              cpy.start = parseISO(temp_start)
              cpy.end = parseISO(temp)
              const date = format(parseISO(temp),'yyyy-MM-dd HH:mm:ss')
              cpy.date_time = date
              cpy.diff = formatDistanceStrict( parseISO(temp_start), parseISO(this.globalDate.toISOString()) ,{addSuffix: true})
              cpy.diffInMilli = differenceInMilliseconds(parseISO(date), parseISO(this.globalDate.toISOString()))

              if(cpy.diffInMilli > 0 && !cpy.used)
                obj.upcoming.push(cpy)
              else
                obj.past.push(cpy)

              return cpy
              
            } )

            //this.$set( this.appointments, 'upcoming', obj.upcoming )
            //this.$set( this.appointments, 'past', obj.past )
            
            if(temp)
            {

              setArray(this.$set,this.upcoming, obj.upcoming)
              setArray(this.$set,this.past, obj.past)
              this.uniqueKey += 1

            }
            

          }

        }
        catch(e){
          console.log(JSON.stringify(e,'',2))
          throw e
        }
      }
    },

    async generateQR(item){

      this.dialog.status = true

      this.$nextTick( () => {
        const qr = document.getElementById('qr')
        //alert(` Item.slot_id ->  ${item.slot_id} `)
        QRCode.toCanvas(qr, `slot_id:${item.slot_id}|user_id:${this.$store.state.auth.user.id}`, { width : '256' } , (error) => {
          if(error)
            console.log(error)

        } )
      } )


    }

  },
  created(){
    this.interval = setInterval( ()=> { this.globalDate =  new Date(), 60000 } )
  },
  beforeDestroy(){
    clearInterval(this.interval)
  },
  async mounted(){
    this.fetchAppointments()
  }
    
}
</script>

<style>

</style