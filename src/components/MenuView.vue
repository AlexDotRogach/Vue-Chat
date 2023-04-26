<template>
  <v-card class="menu">
    <v-layout>
      <v-navigation-drawer
          expand-on-hover
          rail
      >
        <v-list>
          <v-list-item v-if="photoURL && displayName && email"
                       :prepend-avatar="photoURL"
                       :title="displayName"
                       :subtitle="email"
          ></v-list-item>
          <v-list-item v-else
                       prepend-avatar="https://www.meme-arsenal.com/memes/ad49f5fb6248c93511637fd13463918f.jpg"
                       title="empty"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <router-link :to="links.chats">
            <v-list-item prepend-icon="mdi-folder" title="Чаты" value="chats"></v-list-item>
          </router-link>
          <router-link :to="links.myChats">
            <v-list-item prepend-icon="mdi-account-multiple" title="Мои чаты" value="myChats"></v-list-item>
          </router-link>
          <router-link :to="links.setting">
            <v-list-item prepend-icon="mdi-account-multiple" title="Настройки" value="setting"></v-list-item>
          </router-link>
          <v-list-item class="exit mt-5" prepend-icon="mdi-account-multiple" title="Выход" value="exit"
                       @click="logOut"></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script>
import {ref} from "vue"
import useAuthStore from "../storage/useAuthStore.js"
import {useRoute} from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const user = authStore.getInfoUser;
    const logOut = authStore.logOutUser
    const route = useRoute()
    const userId = route.params?.userId;

    const links = {
      chats: {name: 'chats', params: {userId: userId}},
      myChats: {name: 'myChats', params: {userId: userId}},
      setting: {name: 'setting', params: {userId: userId}}
    }

    const {displayName, email, photoURL} = user;


    return {
      displayName,
      email,
      photoURL,
      links,
      logOut
    }
  }
}
</script>

<style scoped>
.menu {
  z-index: 1;
}

.exit {
  color: red;
}
</style>