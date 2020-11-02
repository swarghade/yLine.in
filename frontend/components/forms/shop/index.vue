<template>
<client-only>
  <ValidationObserver ref="observer">
    <v-form class="pa-2"
    >
      
      <ValidationProvider rules="" v-slot="{ validate, errors }" ref="fileProvider">
        
        
          <v-layout wrap fluid>
            <v-flex xs12>
              <v-label class="c-body"> Image Layout </v-label>
                <div class="grid mb-2">
                  <template v-if="method == 'PATCH' ">
                    <img class="grid-img" style=" grid-column: 1/3; grid-row: 1/5; width: 100%; height: 100%; object-fit: cover !important" :src="form.images[0]" alt="store image"> </img>
                    <div class="grey grid-img" style="grid-column: 3;grid-row: 1/3; border-color: black !important;" >
                      <img v-if="form.images[1]" class="" style=" width: 100%; height: 100%; object-fit: cover !important" :src="form.images[1]" alt="store image"> </img>
                    </div>
                    <div class=" grey grid-img" style="grid-column: 3;grid-row: 3/5; border-color: black !important;">
                      <img v-if="form.images[2]" class="" style=" width: 100%; height: 100%; object-fit: cover !important" :src="form.images[2]" alt="store image"> </img>
                    </div>
                    </template>
                  <template v-else>
                    <div class="grey lighten-4 grid-img pa-5 c-body " v-for="(k,i) of Array(3)">
                      {{i+1}}
                    </div>
                  </template>
                </div>
            </v-flex>
            <v-flex xs12>
              
              <span class="c-body red--text"> {{Array.isArray(errors) ? errors.join() : errors}} </span>
              <file-pond 
                :required=true
                :files="tempForm.images"
                :allowReplace=true
                :allowMultiple="true" 
                :allowReorder="true" 
                itemInsertLocation="after"  
                :maxFiles="3"
                :checkValidity=true
                @error="handleFileErrored"
                @updatefiles="handleFileAdd"
                maxFileSize='1mb'
                :acceptedFileTypes="['image/jpeg','image/jpg','image/png','image/webp']"
                ref="pond"
                @init="handleFilePondInit"
                


              > </file-pond>
            </v-flex>
            </div>
          </v-layout>
      </ValidationProvider>
      </ValidationProvider>

      <ValidationProvider 
        v-slot="{ errors }"
        name="Name"
        rules="required|min:2|max:128"
        ref="nameProvider"
        
      >
        <v-text-field 
          v-model="form.name"
          outlined 
          dense 
          rounded 
          label="Name*"
          :error-messages="errors"
        >  </v-text-field>
      </ValidationProvider>

      <ValidationProvider 
        v-slot="{ errors }"
        name="Address"
        rules="required|min:5|max:255"
        
      >
        <v-text-field 
          v-model="form.address"
          outlined
          dense 
          rounded 
          label="Address*"
          :error-messages="errors"
          >
          </v-text-field>
      </ValidationProvider>

      <ValidationProvider 
        v-slot="{ errors }"
        name="State"
        rules="required"
        
      >
        <v-autocomplete
          v-model="form.state"
          :items="geography.states"
          :error-messages="errors"

          label="State *"
          dense
          rounded
          outlined
        >
        </v-autocomplete>
      </ValidationProvider>

      <ValidationProvider 
        v-slot="{ errors }"
        name="Category"
        rules="required"
        
      >
        <v-autocomplete
          v-model="form.category_id"
          :items="computedCategory"
          :error-messages="errors"

          label="Category"
          dense
          rounded
          outlined
        >
        </v-autocomplete>
      </ValidationProvider>
      
      <ValidationProvider 
        v-slot="{ errors }"
        name="City"
        rules="required|min:2|max:50"
        
      >
        <v-text-field
          v-model="form.city"

          outlined
          rounded
          label="City *"
          dense
          :error-messages="errors"
        > </v-text-field>
      </ValidationProvider>

      <ValidationProvider 
        v-slot="{ errors }"
        name="zip"
        rules="required|length:6"
        
      >
        <v-text-field
          v-model="form.zip_code"
          outlined
          rounded
          label="ZIP code *"
          dense
          :error-messages="errors"
          :counter=6
          
        > </v-text-field>
      </ValidationProvider>


      
      <v-layout
        class=" px-3 "
        style=""
        wrap
        align-content-center
        justify-space-between
        row
        
        
        
      >
      
        <v-flex  xs3 >
          
            <v-select
              :items="['+91','+022']"
              value="+91"
              v-model="tempForm.numCode"
              dense
              class=""
              rounded
              outlined
              full-width
            
            >
            </v-select>
          
        </v-flex>

        <v-flex xs7 px-2>
          <ValidationProvider
            v-slot="{ errors }"
            rules=""
            name="phone_number"
            ref="phoneNumber"
          >
            <v-text-field
              v-mask="dynamicMask"
              v-model="tempForm.number"
              rounded
              style="width: 100%"
              dense
              outlined
              :placeholder="dynamicMask"
              @keyup.enter="submitNumberList()"
              ref="number"
              :error-messages="errors"
              @change="validateNumber(tempForm.numCode,tempForm.number)"
              
            > 
            </v-text-field>
          </ValidationProvider>
        </v-flex>

        <v-flex  shrink >
          <v-btn class=" " fab rounded outlined small @click=" submitNumberList() ">
            <v-icon> {{mdiCheck}} </v-icon>
          </v-btn>
        </v-flex>

        <v-flex xs12 mb-5>

          <v-layout justify-space-between wrap>
            <template v-if="tempForm.numberList.length == 0">
              <v-flex>
                <v-chip class="body-2 ma-1"> Please enter atleast one contact number </v-chip>
                <v-icon class="animateArrow"> {{mdiArrowUp}} </v-icon>
              </v-flex>
              
            </template>
            <template v-for="(k,i) of tempForm.numberList">
              <v-chip class="body-2 ma-1"> {{k}} &nbsp;&nbsp;&nbsp; <v-icon tiny @click="removeNumberList(i)" style="padding-bottom: 1px"> {{mdiClose}} </v-icon> </v-chip>
            </template>
          </v-layout>
          
        </v-flex>

        
      </v-layout>

      <!-- Start time -->
      <v-menu
        ref="menu2"
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="form.start_time"
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
            v-model="form.start_time"
            full-width
            @click:minute="$refs.menu2.save(form.start_time)"
            ampm-in-title
            :error-messages="errors"
          ></v-time-picker>
        </ValidationProvider>
      </v-menu>

      <!-- End time -->
      <v-menu
        ref="menu3"
        v-model="menu3"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="form.end_time"
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
          name="Endtime"
          rules="required"
          
        >
          <v-time-picker
            v-if="menu3"
            v-model="form.end_time"
            full-width
            @click:minute="$refs.menu3.save(form.end_time)"
            ampm-in-title
          ></v-time-picker>
        </ValidationProvider>
      </v-menu>

      <!-- GPS thingy -->
      <template v-if="$store.state.gps.status">
        <p class="c-body"> Location has been set </p>
      </template>
      <template v-else>
        <component :is="gpsComponent"> </component>
        <v-btn outlined rounded style="width: 100%"
          @click="gpsComponent='cGps'"
        > Get Current Location </v-btn>
      </template>

      <br/>

      <v-btn 
        outlined 
        rounded 
        style="width: 100%"
        @click="handleFormSubmit()"
      > Submit </v-btn> 
    </v-form>
    
  </ValidationObserver>
  </client-only>
</template>

<script>

import cGps from '../../gps/index'
import { mdiClock, mdiCheck, mdiClose, mdiArrowUp  } from '@mdi/js'
import { format, parseISO } from 'date-fns'
import { states as gStates } from '~/utilities/geography'
import { cloneDeep, startCase } from 'lodash'

import qs from 'querystring'
import jsonToFormData from 'json-form-data'

const checkFilesValidity = (files) =>{
  if(files.length == 0)
    return false

  let res = files.map( (k,i,a) => {
    return k.status == 5 || k.status == 2
  } ).every( x => x == true )

  return res
} 
// Create component


export default {

  components: {
    cGps
  },
  props: {
    method: {
      type: String,
      default: 'POST'
    },
    formData: {
      type: Object
    }
  },
  data(){
    return {
      mdiClock,
      mdiClose,
      mdiArrowUp,
      cGps,
      mdiCheck,
      gpsComponent: "",
      menu2: false,
      menu3: false,
      requestSuccess: false,
      

      geography: {
        states: gStates
      },
      tempForm: {
        number: null,
        numCode: "+91",
        numberList: [],
        images: null
        
      },
      form: {
        images: [],
        name: "",
        start_time: "09:00",
        end_time: "17:00",
        address: "",
        state: "",
        city: "",
        zip_code: null,
        gps: {
          latitude: "",
          longitude: ""
        },
        phone_numbers: []
      }
    }
  },

  mounted(){
    if(this.formData)
    {
      this.form = cloneDeep(this.formData)
      this.tempForm.numberList = this.formData.phone_numbers
      

      if(this.form.latitude && this.form.longitude)
      {
        this.form.gps = { latitude: this.form.latitude, longitude : this.form.longitude }
        delete this.form.latitude
        delete this.form.longitude
      }

      if(this.form.approved)
        delete this.form.approved

      
    }
      
  },

  methods: {

    validateNumber(numCode, num) {
      let status = true
      if(!num || typeof num == 'number' && num <= 0 || typeof num == 'string' && num.length == 0)
      {
        return

      }
      else
      {
        let len = numCode === '+022' ? 8 : 10
        if(num.replace(/\s/g,'').length == len)
          status =  true
        else
          status = false

      }
      
      if(status == false)
        this.setPhoneErrored()
      
      return status
    },

    handleFilePondInit(){
      /*
      if(this.form.images){
        this.$refs.pond.addFiles(this.form.images)
      }*/

    },

    setPhoneErrored(){
      //let provider = this.$refs.phoneNumber
      this.$refs.phoneNumber.setFlags({ invalid: true })
      this.$refs.phoneNumber.setErrors('Phone number is invalid')

    },

    handleFileErrored(e,file,str){
      this.$refs.fileProvider.setFlags({invalid: true})
      this.$refs.fileProvider.setErrors(str ? str: 'Invalid Image(s)')
    },
    async handleFileAdd(e,files)
    {
      const provider = this.$refs.fileProvider
      provider.setFlags({valid: true})
      provider.setErrors([''])
      
    },

    clear () {
      this.form.name = ""
      this.form.start_time = "07:00"
      this.form.end_time = "17:00"
      this.form.address = ""
      this.form.gps.latitude = ""
      this.form.gps.longitude = ""
      this.$refs.observer.reset()
    },

    performPatches(){

      this.form.phone_numbers = []

      if(this.tempForm.numberList.length > 0)
      {
        this.form.phone_numbers = this.tempForm.numberList.map( (k) => k.replace(/\s/g,'') )
      }
      else 
        this.setPhoneErrored()

      

      
      this.form.gps.latitude = this.$store.state.gps.latitude
      this.form.gps.longitude = this.$store.state.gps.longitude
      

    },



    

    async handleFormSubmit(){

      let files = this.$refs.pond.getFiles()
      if(this.method == 'POST')
      {
        if(files.length == 0 )
        {
          this.handleFileErrored(null,null,'Atleast one Image is required')
          return;
        }
        
      }

      if(files.length > 0)
      {
        let fileStatus = checkFilesValidity(  files )
        if(!fileStatus)
        {
          this.handleFileErrored(null,null)
          return;
        }
      }
      this.performPatches()

      if(this.form.phone_numbers.length  == 0)
      {
        this.setPhoneErrored()
        return
      }
      

      const isValid = await this.$refs.observer.validate()

      if(this.form.phone_numbers.length == 0)
      {
        this.setPhoneErrored()
        return;
      }

      if(isValid)
      {
        
        let temp = cloneDeep(this.form)
        temp.images = []

        //images
        files.forEach( (k) => {
          temp.images.push(k.file)
        } )
        
        let data = jsonToFormData(temp,{ showLeafArrayIndexes: false })

        try{
          if(this.method == 'POST')
          {
            this.$axios.$post('/shops',data, { progress: true })
            .then( r => {   
              this.$emit('post:success')
            } )
          }
          else if(this.method == 'PATCH') 
          {
            this.$axios.$patch(`/shops/${this.$store.state.auth.user.id}`,data, { progress: true })
            .then( r => {   
              this.$emit('patch:success')
            } )
          }
        }
        catch(e){
          this.$emit('error',e)
        }
      
      }
      

    },

    submitNumberList(){

      if( this.validateNumber( this.tempForm.numCode, this.tempForm.number ))
      {
        const mix = this.tempForm.numCode + ' ' + this.tempForm.number
        if(!this.tempForm.numberList.includes(mix))
          this.tempForm.numberList.push( this.tempForm.numCode  + ' ' + this.tempForm.number )
      }
      else
        return false

    },
    
    removeNumberList(i){
      this.tempForm.numberList.splice(i,1)
    }

  },
  computed:{
    semanticStartTime(){
        if(!this.form.start_time)
          return ''
        return format(parseISO("2002-01-01 " + this.form.start_time),'hh:mm aa')

    },
    semanticEndTime(){
      if(!this.form.start_time)
        return ''
      return format(parseISO("2002-01-01 " + this.form.end_time), 'hh:mm aa')
      
    },

    dynamicMask(){
      return this.tempForm.numCode == "+91" ? "#### #### ##" : "#### ####"
    },

    computedCategory(){
      return this.$store.state.category.data.map( (k,i) => { return {text: startCase(k.name), value: k.id} } )
    }
  }
}
</script>

<style>

  .animateArrow{
    animation: upArrow .5s infinite ;
    animation-timing-function: ease-in-out;
    animation-direction: alternate;
  }

  @keyframes upArrow{
    0%{
      transform: translateY(0%)
    }
    100%{
      transform: translateY(-50%)
    }
  }

</style>