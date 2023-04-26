<template>
  <v-banner
      class="pa-2 pa-md-4 d-flex justify-center align-center"
      color="pink-darken-1"
      icon="mdi-account-box"
      lines="two"
      v-if="!loader"
  >
    <template v-slot:prepend>
      <svg-icon class="infoSvg" type="mdi" :path="icons.info" color="deepskyblue" size="32"></svg-icon>
    </template>

    <v-banner-text class="bannerText pa-0">
      {{ text }}
    </v-banner-text>

    <v-banner-actions>
      <slot></slot>
    </v-banner-actions>
  </v-banner>
  <div class="loader d-flex justify-center align-center" v-else>
    <svg-icon class="loaderSvg" type="mdi" :path="icons.load" color="black"></svg-icon>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiInformation, mdiLoading} from '@mdi/js';

export default {
  name: "setting-banner",
  components: {SvgIcon},
  props: {
    loader: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true
    }
  },

  setup() {
    const icons = {
      load: mdiLoading,
      info: mdiInformation
    }

    return {
      icons
    }
  }
}
</script>

<style scoped>
.loader {
  background: white;
  height: 100px;

}

@media (max-width: 600px) {

  .bannerText {
    min-height: 120px;
    padding: 0;
    margin-right: 10px;
  }

  .infoSvg {
    display: none;
  }
}
</style>