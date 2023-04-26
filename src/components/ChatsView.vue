<template>
  <HeaderView></HeaderView>

  <v-container class="chats mt-12" v-if="dbStorage.chats.length > 0">
    <v-row>
      <div class="title pa-8">Чаты:</div>
    </v-row>

    <v-row v-for="chat of dbStorage.chats" :key="chat.id" class="chat mt-6 align-center">
      <v-col cols="6" sm="4">
        <div class="additional">Создан:</div>
        <div>{{ chat.data.createdBy.login }}</div>
      </v-col>

      <v-col cols="6" sm="4">
        <router-link :to="{name : 'messages', params: {userId: userId, chatId: chat.id}}">
          <div>{{ chat.data.name }}</div>
        </router-link>
      </v-col>

      <v-col class="d-flex justify-center justify-md-end pr-md-8" cols="12" sm="4">
        <v-btn v-if="userId === chat.data.createdBy.id" @click.stop="() => deleteChat(chat.id)">Удалить</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container class="chats mt-12" v-else>
    <v-row>
      <div class="title pa-8">У вас нету чатов</div>
    </v-row>
  </v-container>
</template>

<script>
import {onMounted, onUnmounted, watch} from "vue"
import {useRoute} from "vue-router";
import useDbStorage from "../storage/useDbStorage.js";
import useAuthStore from "../storage/useAuthStore.js";
import HeaderView from "./HeaderView.vue";
import toast from "../utils/toast.js";

export default {
  components: {HeaderView},
  setup() {
    const dbStorage = useDbStorage()
    const authStore = useAuthStore()
    const userId = authStore.getCurrentUser.uid;
    const route = useRoute();
    let intervalId = 0;

    onMounted(() => {
      intervalId = setInterval(() => {
        checkRoute()
      }, 1000)
    })

    onUnmounted(() => {
      clearInterval(intervalId)
    })

    const checkRoute = () => {
      if (route.name === "myChats") {
        dbStorage.chats = dbStorage.chats.filter(chat => chat.data.createdBy.id === userId)
      } else {
        dbStorage.updateChats()
      }
    }

    watch(route, () => {
      checkRoute()
    })

    checkRoute()

    const deleteChat = (id) => {
      dbStorage.deleteChat(id).then((id) => {
        console.log(`chat was created with id - ${id}`)
        toast.success("Чат удален")
      })
    }

    return {dbStorage, deleteChat, userId}
  }
}
</script>

<style scoped>

.chats {
  background: white;
  color: black;
}

.chat {
  transition: box-shadow .3s;
  cursor: pointer;
}

.chat:hover {
  box-shadow: 1px 1px 3px black;
}

.title {
  font-size: 32px;
  border-bottom: 1px solid black;
  width: 100%;
  text-align: left;
}
</style>