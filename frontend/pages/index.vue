<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs10
      sm8
      md6
    >
    </v-flex>
  </v-layout>
</template>

<script>


export default {
  computed: {

  },
  components: {
  },
  mounted(){
    this.$router.push('/shops')
  }
}
</script>
