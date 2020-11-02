<template>
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
            :prepend-icon="mdiCalendar"
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


</template>

<script>
export default {

  data(){
    return {

    }
  },
  
  methods: {

  }

}
</script>

<style>

</style>