<template>
  <header class="d-flex align-center justify-space-between pr-5">
    <span class="amountChats">Кол-во чатов: {{ dbStorage.chats.length }}</span>
    <v-btn @click="toggleDialog">
      Создать чат
    </v-btn>
  </header>
  <DialogCreateChatView :dialog="isDialog" @closeDialog="toggleDialog"></DialogCreateChatView>
</template>

<script>
import {ref} from "vue"
import DialogCreateChatView from "../dialog/DialogCreateChat.vue";
import useDbStorage from "../../storage/useDbStorage.js";

export default {
  components: {DialogCreateChatView},
  setup() {
    const dbStorage = useDbStorage();
    const isDialog = ref(false)
    const toggleDialog = () => isDialog.value = !isDialog.value;


    return {
      toggleDialog,
      isDialog,
      dbStorage
    }
  }
}
</script>

<style scoped>
header {
  position: absolute;
  top: 0;
  left: 0;
  rigth: 0;

  background: var(--main-color-elements);
  height: 60px;
  width: 100%;
}

.amountChats {
  margin-left: 100px;
}

@media (max-width: 600px) {
  .amountChats {
    margin-left: 10px;
  }
}
</style>