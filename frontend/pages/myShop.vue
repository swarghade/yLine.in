<template>
  <v-layout
    justify-center
    align-center
  >
    <client-only>
    
    <!-- Error -->
    <v-snackbar 
      v-model="snackbar.status"
      bottom
      :timeout="2000"
    >
      {{snackbar.message}}
    </v-snackbar>

    
      <v-dialog
        :max-width="$vuetify.breakpoint.smAndDown ? '90vw' : '50vw'"
        v-model="dialog.status"
      
        
      >
        <v-card class="pa-4 text-center">
          <p class="c-sub-header"> Edit your shop </p> <br/>
          <shop-form @patch:success="onSuccess()" :formData="shop" method="PATCH"> </shop-form>
        </v-card>
      </v-dialog>

      <v-dialog
        :max-width="$vuetify.breakpoint.smAndDown ? '90vw' : '50vw'"
        v-model="deleteDialog.status"
      
        
      >
        <v-card class="pa-4 text-center">
          <p class="c-sub-header"> Are you sure you want to delete your shop  ? </p> <br/>
          
          <v-layout justify-space-around>
            <v-btn class="red--text" text @click="deleteDialog.status = false"> Cancel </v-btn>
            <v-btn text @click="handleRemove" > Delete </v-btn>
          </v-layout>
        </v-card>
      </v-dialog>
    

    <v-flex xs10 md6 lg8
    >
    
          <!-- main content -->
      <v-layout v-if="!loading">
        <v-flex xs12  class="black--text" px-2>

          <span class="c-main-header"> {{shop.name}}  
            <v-btn @click="dialog.status=true" rounded outlined width="64" > EDIT </v-btn>
            <v-btn @click="deleteDialog.status=true" rounded outlined  > DELETE </v-btn>
          </span>

          <br/> 
          <br/>
          <div class="c-sub-header py-1"> Timings : <client-only> <br v-if="$vuetify.breakpoint.smAndDown" /> </client-only>
            <v-chip class="timeChips"> {{shop.start_time | customTime}} </v-chip> - <v-chip class="timeChips"> {{shop.end_time | customTime}} </v-chip>
          </div>
          <div >
            <h1 class="c-sub-header py-1" > Address : <client-only> <br v-if="$vuetify.breakpoint.smAndDown" /> </client-only> 
              <span class="c-body" style="opacity: .7; letter-spacing: -1px !important;"> {{shop.address}} </span>  
            </h1> 
          </div>
          <br/>
          <div id="appointments">
            <br/>
            <h1 class="c-sub-header"> Generate SLOTS </h1>
            
            <v-layout justify-center wrap >
              <v-tabs v-model="tab" grow>
                <v-tab> Automatically  </v-tab>
                <v-tab> Manually </v-tab>
              </v-tabs>

              <v-tabs-items v-model="tab" style='width: 100%' >
                <!-- automatically -->
                <v-tab-item>
                  <v-layout justify-center width='100%'>
                    <v-flex xs12 md10> 
                      <ValidationObserver ref="automaticForm">
                        <v-form class="py-5">
                          <!-- Start Time -->
                          <v-menu
                            ref="menu2"
                            v-model="menu2"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="form.start"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          >
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                rounded
                                outlined
                                v-model="semanticStartTime"
                                label="Start Time"
                                :prepend-inner-icon="mdiClock"
                                readonly
                                dense
                                v-on="on"
                              ></v-text-field>
                            </template>

                            <ValidationProvider 
                              v-slot="{ errors }"
                              name="time"
                              rules="required"
                              
                            >
                              <v-time-picker
                                v-if="menu2"
                                v-model="form.start"
                                full-width
                                @click:minute="$refs.menu2.save(form.start)"
                                ampm-in-title
                                :error-messages="errors"
                              ></v-time-picker>
                            </ValidationProvider>
                          </v-menu>

                          <v-menu
                            ref="menu3"
                            v-model="menu3"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            :return-value.sync="form.end"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                          
                          >
                            
                            <template v-slot:activator="{ on }">
                              <v-text-field
                                rounded
                                outlined
                                v-model="semanticEndTime"
                                label="End Time"
                                :prepend-inner-icon="mdiClock"
                                readonly
                                dense
                                v-on="on"
                              ></v-text-field>
                            </template>

                            <ValidationProvider 
                              v-slot="{ errors }"
                              name="time"
                              rules="required"
                              
                            >
                              <v-time-picker
                                v-if="menu3"
                                v-model="form.end"
                                full-width
                                @click:minute="$refs.menu3.save(form.end)"
                                ampm-in-title
                                :error-messages="errors"
                              ></v-time-picker>
                            </ValidationProvider>
                          </v-menu>

                          <ValidationProvider 
                            v-slot="{ errors }"
                            name="intervals"
                            rules="required|integer|min_value:5|max_value:120"
                            
                          >
                            <v-text-field
                              v-model="form.interval"
                              outlined
                              dense
                              rounded
                              label="Intervals (Minutes)"
                              :error-messages="errors"
                              
                            > </v-text-field>
                          </ValidationProvider>

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
                                dense
                                readonly
                                v-on="on"
                                :border=5
                                rounded
                                outlined
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              ref="picker"
                              v-model="form.date"
                              :min="new Date().toISOString().substr(0,10)"
                              @change="save"
                            ></v-date-picker>
                          </v-menu>

                          <ValidationProvider 
                            v-slot="{ errors }"
                            name="limit"
                            rules="required|integer|min_value:1"
                            
                          >
                            <v-text-field
                              v-model="form.limit"
                              outlined
                              dense
                              rounded
                              label="limit"
                              hint="Number of users allowed in one slot"
                              :error-messages="errors"
                              > </v-text-field>
                          </ValidationProvider>

                          <v-btn outlined rounded style="width: 100%" @click="handleAutomatic"> Submit </v-btn>


                        </v-form>
                      </ValidationObserver>
                    </v-flex>
                  </v-layout>
                </v-tab-item>

                <v-tab-item class="text-center mt-5" >
                  <!-- -->
                  <p class="c-sub-header"> You came to the wrong neighborhood </p>
                </v-tab-item>
              </v-tabs-items>
            </v-layout>
          </div>
          <br/>
        </v-flex>
    
      </v-layout>
      <v-layout v-else>
        <p class="c-title" > Loading ... </p>
      </v-layout>

    </v-flex>
    </client-only>
  </v-layout>
</template>

<script>

import { mdiClock, mdiCheck, mdiCalendar  } from '@mdi/js'
import { format, parseISO } from 'date-fns'
import * as qs from "querystring"

import ShopForm from '../components/forms/shop/index'

import { clone, omit } from 'lodash'


export default {
  components: {
    ShopForm
  },
  data(){
    return {
      parseISO,
      format,


      mdiCalendar,
      tab: null,
      shop: {},
      loading: false,

      snackbar: {
        status: false,
        message: ""
      },
      menu: null,
      menu2: null,
      menu3: null,

      dialog: {
        status: false
      },

      deleteDialog: {
        status: false
      },

      form: {
        start: '09:00',
        end: '17:00',
        interval: 30,
        date : format( parseISO((new Date().toISOString())) ,"yyyy-MM-dd"),
        limit: 1
      },


      mdiClock
    }
  },
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'DATE'))
    },
  },
  methods: {

    save(){
      this.$refs.menu.save(this.form.date)
    },

    async handleRemove(){
      try{
        const status = await this.$axios.delete('shops')
        if(status)
        {
          this.snackbar.status = true
          this.snackbar.message = "Successfully deleted your shop"
          this.$store.state.auth.user.roles = this.$store.state.auth.user.roles.filter( (k) =>  k != 'shop' )
          this.$router.push('shops')
        }
        
      }
      catch(e){
        this.snackbar.status = true
        this.snackbar.message = "Something went wrong. Please try again later"
      }
    },

    async handleAutomatic(){
      const isValid = await this.$refs.automaticForm.validate()

      if(isValid)
      {
        try {
          
          let opts = clone(this.form)
          opts.date = format( parseISO(this.form.date),'dd/MM/yyyy') 

          const data = await this.$axios.$post('slots?autogenerate=1',opts)

          if(data)
          {
            this.snackbar.status = true
            this.snackbar.message = "Slots created successfully"
          }
        }
        catch(e){
          this.snackbar.status = true
          this.snackbar.message = "Something went wrong. Please try again later"
        }
      }
      
    },

    onSuccess(){
      
      this.dialog.status = false
      this.snackbar.message = "Edited successfully"
      this.snackbar.status = true
      this.fetchShop()

    },

    async fetchShop(){
      this.loading = true
      try {
        const data = await this.$axios.$get(`/shops/${this.$store.state.auth.user.id}`)
        console.log('shop -> '+JSON.stringify(data,'',2))
        this.shop = omit(data,['shop_id','rating','approved','category_name'])
        //alert(JSON.stringify(data,'',2))
        this.loading = false
      }
      catch(e){
        this.snackbar.status = true
        this.snackbar.message = "Something went wrong. Please try again"

        console.log(e)
        this.loading = false
        
      }
    }
  },

  async mounted(){
    this.$nextTick( () => this.fetchShop() )
  },
  computed:{
    semanticStartTime(){
        if(!this.form.start)
          return ''
        return format(parseISO("2002-01-01 " + this.form.start),'hh:mm aa')

    },
    semanticEndTime(){
      if(!this.form.start)
        return ''
      return format(parseISO("2002-01-01 " + this.form.end), 'hh:mm aa')
      
    },
    semanticDate(){
      if(this.form.date)
        return format(parseISO(this.form.date),'dd MMM yyyy')
      else
        ''
    }
  }

}
</script>

<style>

</style>