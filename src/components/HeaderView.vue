<template>
  <header class="d-flex align-center justify-end pr-5">
    <v-btn @click="toggleDialog">
      Создать чат
    </v-btn>
  </header>
  <DialogCreateChatView :dialog="isDialog" @closeDialog="toggleDialog"></DialogCreateChatView>
</template>

<script>
import {ref} from "vue"
import DialogCreateChatView from "./DialogCreateChatView.vue";

export default {
  components: {DialogCreateChatView},
  setup() {
    const isDialog = ref(false)
    const toggleDialog = () => {
      isDialog.value = !isDialog.value
    }

    return {
      toggleDialog,
      isDialog
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
</style>