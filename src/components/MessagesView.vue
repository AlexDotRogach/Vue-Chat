<template>
  <v-container class="pa-0">
    <v-list class="pa-6" lines="two" v-if="dbStorage.chats.length > 0">
      <v-list-subheader>Сообщения</v-list-subheader>
      <div v-for="message of dbStorage.chats.find((chat) => chat.id === chatId).data.messages"
           :key="message.id"
      >
        <div class="d-flex flex-row-reverse align-center justify-start mt-5" v-if="userId === message.createdBy.userId">
          <div class="d-flex flex-column gp10">
            <v-img class="rounded-circle" :src="message.createdBy.photo" :alt="message.createdBy.login" width="30"
            ></v-img>
            <span class="loginText">Вы</span>
          </div>
          <div class="mr-10 font-weight-medium">{{ message.text }}</div>
        </div>
        <div class="d-flex align-center mt-5" v-else>
          <div class="d-flex flex-column gp10">
            <v-img class="rounded-circle" :src="message.createdBy.photo" :alt="message.createdBy.login" width="30"
            ></v-img>
            <span class="loginText">{{ message.createdBy.login }}</span>
          </div>
          <div class="ml-10 font-weight-medium">{{ message.text }}</div>
        </div>
      </div>
    </v-list>
    <v-textarea auto-grow
                density="comfortable"
                clear-icon="mdi-close-circle"
                v-model="message"
                class="mt-6 test"
                label="Сообщение"
                rows="1"
    >
    </v-textarea>
    <v-btn @click="sendMessage">Отправить</v-btn>
  </v-container>
</template>

<script>
import {ref, onMounted, onUnmounted} from "vue"
import {useRoute} from "vue-router";
import useDbStorage from "../storage/useDbStorage.js";
import useAuthStore from "../storage/useAuthStore.js";
import toast from "../utils/toast.js";

export default {
  setup() {
    const route = useRoute()
    const dbStorage = useDbStorage()
    const authStore = useAuthStore()
    const message = ref("")
    const {chatId, userId} = route.params;
    let intervalId = 0;

    onMounted(() => {
      intervalId = setInterval(() => {
        dbStorage.updateChats()
      }, 1000)
    })

    onUnmounted(() => {
      clearInterval(intervalId)
    })

    const sendMessage = () => {
      if (!message.value) return;

      const infoUser = authStore.getInfoUser;

      const data = {
        chatId,
        userId: authStore.getCurrentUser.uid,
        login: infoUser.displayName,
        photo: infoUser.photoURL,
        text: message.value
      }

      dbStorage.updateMessages(data).then(() => {
        message.value = ''
        dbStorage.updateChats()
      });
    }

    return {
      message,
      sendMessage,
      dbStorage,
      chatId,
      userId
    }
  }
}
</script>

<style scoped>
.loginText {
  color: grey
}

</style>