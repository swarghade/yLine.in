<template>
  <v-layout justify-center align-center fluid>

    <v-dialog
      v-model="dialog.status"
      max-width='50vmax !important'
      flat

    >
    <v-layout justify-center fluid>
      <v-card class="pa-5">
        <div class="display-2" v-html="dialog.message">  </div> 
        <br/>
        <v-card-actions>
          <v-btn width="100%" text rounded outlined @click="dialog.status = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
    </v-dialog>
    <client-only>

      <v-flex xs8 md6 style="max-height: 80vh !important; text-center">
        <!-- <p class="decode-result">Last result: <b>{{ result }}</b></p> -->
        Status : {{status}}
        <template v-if="validationPending">
          <v-progress-circular indeterminate color="primary">
          </v-progress-circular>
        </template>
        <template v-if="validationSuccess">

        </template>
        <qrcode-stream  :camera="camera" @decode="onDecode" @init="onInit" >
          <template v-if="validationSuccess">
            Approved
          </template>
          <template v-if="validationFailure">
            Failed
          </template>

        </qrcode-stream>
  
      </v-flex>
    </client-only>
  </v-layout>
</template>

<script>


export default {
  components: {
    
  },
  data(){
    return {
      error: '',
      isValid: undefined,
      camera: 'auto',
      result: '',
      loading: true,
      status: '',
      dialog: {
        status: false,
        message: ''
      },
      regex: /slot_id:(\d+)\|user_id:(\d+)/
    }
  },
  computed: {
    validationPending () {
      return this.isValid === undefined
        && this.camera === 'off'
    },

    validationSuccess () {
      return this.isValid === true
    },

    validationFailure () {
      return this.isValid === false
    }
  },
  watch: {
    isValid(val){
      if(val == true)
      {
        this.dialog.status =true
        this.dialog.message = "User entry has been <span style='color: green'> APPROVED </span>"
      }
      else
      {
        this.dialog.status =true
        this.dialog.message = "User entry has been <span style='color: red'> Denied </span>"
      }
    }
  },
  methods: {
    async onDecode (result) {
      this.result = result
      this.turnCameraOff()

      // pretend it's taking really long
      await this.timeout(2000)
  
      let slot_id = this.regex.exec(result)
      if(slot_id && slot_id[1] && slot_id[2])
      {
        console.log(` 1 `)
  
        try{
          console.log(` try `)
          const res = await this.handleSlotBooking(slot_id[1],slot_id[2])
          if(res)
            this.isValid = true
          else
            this.isValid = false
        }
        catch(e){
          console.log(` in catch `)
          if(e)
            this.isValid = false
        }
      }
      else
      {
        console.log(` 2 `)
        this.isValid = false

      }
      //alert(slot_id) 

      // some more delay, so users have time to read the message
      await this.timeout(2000)
      this.turnCameraOn()

    },

    async handleSlotBooking(slot_id,user_id){
      console.log(` Slot_id & user_id ${slot_id} & ${user_id} `)
      return this.$axios.$patch(`scanner/${user_id}`,{ slot_id : slot_id })

      //const data = await this.$axios.$patch('/slots_users')
    },

    async onInit (promise) {
      try {
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      }
    },
    resetValidationState () {
      this.isValid = undefined
    },
    turnCameraOn () {
      this.camera = 'auto'
    },

    turnCameraOff () {
      this.camera = 'off'
    },

    timeout (ms) {
      return new Promise(resolve => {
        window.setTimeout(resolve, ms)
      })
    }


  },
  mounted(){

  }
}
</script>

<style>

</style>