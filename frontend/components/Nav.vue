<template>

  <Desktop style="max-height: 64px !important"/>
    <!-- <Mobile v-show="$vuetify.breakpoint.smAndDown"/> -->
</template>
<script>

//import { mdiMenu } from '@mdi/js'
import Desktop from './nav/Desktop.vue'


export default {
  components: {
    Desktop
  },
  data () {
    return {
      //mdiMenu
    }
  }
}
</script>

<style>

</style>
