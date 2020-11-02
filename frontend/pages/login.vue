<template>
  <v-layout align-center justify-center fill-height>
    <client-only>
      <v-flex xs10 md4 lg6 >
        <v-card>
          <v-layout row wrap class="text-center" justify-center align-center pa-5>
            <v-flex xs10 md5 >
              <!-- :disabled="$auth.$storage.getUniversal('loggedIn')" -->
              <v-btn color="" @click="$auth.loginWith('customGoogle')" target="_blank" > 
                <v-icon src> </v-icon>
                Login with google
              </v-btn>

            </v-flex>
          
            <v-flex shrink :xs12="$vuetify.breakpoint.smAndDown" :mt-5="$vuetify.breakpoint.smAndDown">
              <v-btn fab disabled small> OR </v-btn>
            </v-flex>
            <v-flex xs10 md5 pa-5>
              <ValidationObserver ref="loginObserver">
                <v-form>
                  <ValidationProvider 
                    v-slot="{ errors }"
                    name="Name"
                    rules="required|email"
                    
                  >
                    <v-text-field v-model="email" 
                      autocorrect="off" autocapitalize="none"
                      :error-messages="errors"  
                    >  </v-text-field>
                  </ValidationProvider>
                  <ValidationProvider 
                    v-slot="{ errors }"
                    name="Name"
                    rules="required|min:3|max:64"
                    
                  >
                    <v-text-field type="password"  :error-messages="errors" v-model="password"  placeholder="Password">  </v-text-field>
                  </ValidationProvider>
                  <v-btn @click="handleLocalLogin"> Submit </v-btn> 
                </v-form>
              </ValidationObserver>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </client-only>
  </v-layout>

</template>

<script>
export default {

  function ({ $auth }) {
    $auth.onRedirect( (to,from) => {
      alert(to)
    } )
  },
  data(){
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleLocalLogin(){
      const isValid = await this.$refs.loginObserver.validate()  
      try
      {
        if(isValid)
        {
          let login = await this.$auth.loginWith('customLocal', { data: { strategy: 'local', email: this.email, password: this.password } })

          if(login)
          {
            /*console.log(login)
            let tok = 'Bearer '+login.data.accessToken
            this.$auth.setToken('local',tok)
            this.$axios.setHeader('Authorization', tok )
            this.$auth.setUser(login.data.user)
            */

          }

        }
      }
      catch(e){
        console.log(e)
      }
    
    }
  }

}
</script>

<style>

</style>