<template>
  <v-layout align-center justify-center fill-height>
    <v-snackbar
      v-model="snackbar.status"
      :color="snackbar.color"
      :timeout=2000
    >
      snackbar.message
    </v-snackbar>

    <v-dialog
      max-width="35vw"
      v-model="requestSuccess"
      
    >
      <v-card class="pa-4 text-center">
        <p class="c-sub-header"> Success </p>
        <p class="c-body"> Your request has been submitted for approval.
          Our representative will contact you soon.
        </p>

        <v-btn @click="requestSuccess = false">Okay</v-btn>
      </v-card>
    </v-dialog>
    
    <v-flex xs10 md6 lg4
      v-if="$store.state.auth.user.roles.includes('shop')"
    >
      <p class="c-sub-header"> Ohhhhh :( </p>
      <p class="c-body"> Your profile is still under review. </p>
    </v-flex>

    <template v-if="alreadyExists == -1">
      <v-flex xs12 md6 lg4 class="white v-sheet" pa-5  >
        <v-skeleton-loader loading type="image, article">  </v-skeleton-loader>
      </v-flex>
    </template>
    
    <template v-else-if="alreadyExists == 1">
      <v-flex xs12 md6 lg4 class="white v-sheet" pa-5  >
        <shop-form @patch:success="handleSuccess()" :formData="shop" method="PATCH"> </shop-form>
      </v-flex>
    </template>

    <template v-else-if="alreadyExists == 0">

      <v-flex xs12 md6 lg4 class="white v-sheet" pa-5 v-if="!$store.state.auth.user.roles.includes('shop')" >
        <p class="c-sub-header"> Upgrade to a shop </p> <br/>

        <shop-form 
          @post:success="handleSuccess"
          @error=" snackbar.color='red'; snackbar.message = 'Something went wrong';snackbar.status = true; "
        > </shop-form>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>

const objectToFormData = function(obj, form, namespace) {
    
  var fd = form || new FormData();
  var formKey;
  
  for(var property in obj) {
    if(obj.hasOwnProperty(property)) {
      
      if(namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }
    
      // if the property is an object, but not a File,
      // use recursivity.
      if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        
        objectToFormData(obj[property], fd, property);
        
      } else {
        
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
      
    }
  }
  
  return fd;
    
};

import { omit } from 'lodash'


import ShopForm from '../components/forms/shop/index'

export default {
  components: {
    ShopForm
  },
  data(){
    return {
      requestSuccess: false,
      snackbar: {
        status: false,
        color: 'info'
      },

      loaded: false,
      shop: {

      },
      alreadyExists: -1,


    }
  },

  methods: {
    handleSuccess(){
      this.snackbar.color='green'; 
      this.snackbar.status = true; 
      this.snackbar.message = 'Success'; 
      this.$store.state.auth.user.roles.push('shop')
      this.$router.push('/myShop');
    }
  },
  computed:{

  },

  async mounted(){

    try{
      let result = await this.$axios.$get(`shops/${this.$store.state.auth.user.id}`)

      if(result)
      {
        this.alreadyExists = 1
        this.shop = omit(result,['shop_id','rating','approved','category_name'])
        // Object.assign({},this.shop, result)

        this.loading  = false
      }
    }
    catch(e){
      this.loading = false
      this.alreadyExists = 0
    }    
    
  }

}
</script>

<style>

</style>