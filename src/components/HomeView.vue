<template>
  <v-container class="w-100">
    <MenuView></MenuView>
    <div class="d-flex flex-column align-center justify-center gp20" v-if="route.name === 'home'">
      <v-img
          class="rounded-circle"
          :width="150"
          :src="photoURL"
          :alt="displayName"
      ></v-img>
      <span class="text-subtitle-1">Приветствую {{ displayName }}!</span>
    </div>
    <router-view></router-view>
  </v-container>
</template>


<script>
import useAuthStore from "../storage/useAuthStore.js"
import {useRoute} from 'vue-router'
import MenuView from "./MenuView.vue";

export default {
  components: {MenuView},
  setup() {
    const route = useRoute()

    const authStore = useAuthStore()
    const user = authStore.getInfoUser;

    const {displayName, photoURL} = user;

    return {route, displayName, photoURL}
  }
}
</script>

<style scoped>

</style>