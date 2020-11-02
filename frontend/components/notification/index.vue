<template>
  <div>
    <v-snackbar
      v-model="snackbar.status"
      bottom
      :color="snackbar.color"

    >
      {{snackbar.message}}
    </v-snackbar>
    
    <v-dialog
      v-model="dialog.status"
      max-width="45vmax"
      
    >
      <div class="white pa-3 text-center" style='width: 100%'>
        <h1 class="c-body"> How was {{selection.name}} ? </h1>
        <v-rating style='width: 100% !important' size="56" v-model="form.rating"> </v-rating>
        <ValidationProvider
          v-slot="{ errors }"
          name="message"
          rules="required|min:3"
          ref="messageProvider"
        >
          <v-textarea outlined height="86" rounded label="Review" :error-messages="errors" v-model="form.message"> </v-textarea>
        </ValidationProvider>

        <v-btn outlined rounded style="width:100%" @click="handleRating()"> Submit </v-btn>
      </div>
    </v-dialog>

    <v-menu open-on-hover offset-y  >
      <template v-slot:activator="{ on, attrs }">
        <v-btn

          v-bind="attrs"
          v-on="on"
          text
        >

          <v-icon > {{mdiBell}} 
            
          </v-icon>
          <v-badge
            v-if="notifications.length > 0"
            color="red"
            :content="notifications.length"
          >

          </v-badge>  
        </v-btn>
      </template>

      <v-list style="min-width: 35vmax !important">
        <v-list-item v-if="notifications.length == 0">
          None
        </v-list-item>
        <v-list-item
          v-for="(item, index) in notifications"
          :key="index"
          @click="selection=item;dialog.status=true"
        >
          <v-list-item-title> Please rate <span class="font-weight-bold"> {{item.name}} </span></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>

import { mdiBell } from '@mdi/js'

export default {

  data(){
    return {
      notifications: [],
      interval: null,
      dialog: {
        status: false
      },
      snackbar: {
        status: false,
        message: '',
        color: 'info'
      },
      selection: {
        
      },
      form: {
        rating: 0
      },

      mdiBell
    }
  },

  mounted(){
    this.fetchNotifications()

    this.interval = setInterval(() => this.fetchNotifications(),15000)
  },

  methods: {
    async fetchNotifications(){
      try{
        if(this.$store.state.user.loggedIn)
        {
          let res = await this.$axios.$get('slots-users?rating=true');
        //console.log(res)
        if(res)
        this.notifications = res
        }
      
      }
      catch(e){
        //console.log(e)
      }
      
    },
    async handleRating(){
      let cpy = {}
      cpy.shop_id = this.selection.shop_id
      cpy.su_id = this.selection.id
      cpy.rating = this.form.rating
      cpy.message = this.form.message

      try{
        let res = await this.$axios.$post('ratings',cpy)

        if(res)
        {
          this.snackbar.color = 'success'
          this.snackbar.message = 'Successfully rated'
          this.snackbar.status = true

          this.dialog.status = false
          
          this.fetchNotifications()

        }
      }
      catch(e){
        this.snackbar.color = 'red'
        this.snackbar.message = 'Something went wrong'
        this.snackbar.status = true
      }
    }
  },

  beforeDestory(){

  }

}
</script>

<style>

</style>