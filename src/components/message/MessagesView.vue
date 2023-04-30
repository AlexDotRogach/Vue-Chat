<template>
  <v-container class="pa-0">
    <v-list class="pa-6" lines="two" v-if="dbStorage.chats.length > 0">
      <div class="d-flex justify-space-between additional">
        <span>Сообщения чата {{ curChat.data.name }}</span>
        <span>Кол-во участников чата: {{ amoutUsersInChat }}</span>
      </div>
      <div v-for="message of dbStorage.chats.find((chat) => chat.id === chatId).data.messages"
           :key="message.id"
      >
        <div class="d-flex flex-row-reverse align-center justify-start mt-5"
             v-if="userId === message.createdBy.userId">
          <MessageControl :messageId="message.id" :chatId="chatId"
                          @toggleInputEdit="editInputSetting.toggleInputEdit(message.id)"></MessageControl>
          <div class="d-flex flex-column gp10">
            <v-img class="rounded-circle" :src="message.createdBy.photo"
                   :alt="message.createdBy.login" width="30"
            ></v-img>
            <span class="loginText">Вы</span>
          </div>
          <div v-if="!isOpenInputEdit[message.id]" class="mr-10 font-weight-medium">{{
              message.text
            }}
          </div>
          <!--          edit -->
          <input v-else class="inputEdit mr-4" type="text"
                 @blur="editInputSetting.blurInputEdit(message.id)"
                 ref="curRefInputEdit"/>
        </div>
        <!--        others people       -->
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
import MessageControl from "./MessageControl.vue";
import {ref, onMounted, onUnmounted, watch, computed} from "vue"
import {useRoute} from "vue-router";
import useDbStorage from "../../storage/useDbStorage.js";
import useAuthStore from "../../storage/useAuthStore.js";

export default {
  components: {MessageControl},
  setup() {
    const route = useRoute()
    const dbStorage = useDbStorage()
    const authStore = useAuthStore()
    const message = ref("")
    const amoutUsersInChat = ref(0);
    const isOpenInputEdit = ref({});
    const curRefInputEdit = ref(null)
    const {chatId, userId} = route.params;
    const curChat = computed(() => dbStorage.chats.find(chat => chat.id === chatId))

    // for UI
    const editInputSetting = {
      blurInputEdit: (id) => {
        isOpenInputEdit.value[id] = false;

        dbStorage.updateMessageText({chatId, messageId: id, text: curRefInputEdit.value[0].value})
      },
      toggleInputEdit: (id) => {
        isOpenInputEdit.value[id] = true;
      }
    }
    let intervalId = 0;

    const getCountUsersByChat = (chat) => {
      if (!chat) return 0;

      return chat.data.messages.reduce((usersId, message) => {
        usersId.push(message.createdBy.userId);
        return usersId
      }, []).filter((userId, index, arr) => arr.indexOf(userId) === index).length;
    }

    watch(curChat, (newValue, oldValue) => {
      if (!(newValue && oldValue)) return;

      if (oldValue.data.messages.length !== newValue.data.messages.length) {
        amoutUsersInChat.value = getCountUsersByChat(newValue)
      }
    })

    // focus input edit and set value to input
    watch(curRefInputEdit, () => {
      if (curRefInputEdit.value[0]) {
        const curInput = curRefInputEdit.value[0];

        curInput.focus();

        const messageId = Object.entries(isOpenInputEdit.value).find((value, key) => value)[0];
        const curMessage = curChat.value.data.messages.find(({id}) => id === messageId);

        if (curMessage) curInput.value = curMessage.text;
      }
    }, {deep: true})

    onMounted(() => {
      intervalId = setInterval(() => {
        dbStorage.updateChats()
      }, 1000)

      dbStorage.getChats.then(data => {
        amoutUsersInChat.value = getCountUsersByChat(data.find(chat => chat.id === chatId));
      })
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
      userId,
      amoutUsersInChat,
      editInputSetting,
      isOpenInputEdit,
      curRefInputEdit,
      curChat
    }
  }
}
</script>

<style scoped>
.loginText {
  color: grey
}

.inputEdit {
  text-align: right;
  border: none;
  outline: none;
}

</style>