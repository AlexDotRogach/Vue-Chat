<template>
  <v-row justify="center">
    <v-dialog
        v-model="this.dialog"
        persistent
        width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Создание чата</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
              >
                <v-text-field
                    label="Название чата"
                    required
                    v-model="nameChat"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue-darken-1"
              variant="text"
              @click="closeDialog"
          >
            Закрыть
          </v-btn>
          <v-btn
              color="blue-darken-1"
              variant="text"
              @click="createChat"
          >
            Создать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {ref} from "vue"
import useDbStorage from "../../storage/useDbStorage.js";
import useAuthStore from "../../storage/useAuthStore.js";
import toast from "../../utils/toast.js"

export default {
  props: {
    dialog: Boolean
  },
  setup(props, {emit}) {
    const dbStorage = useDbStorage()
    const authStore = useAuthStore()
    const nameChat = ref("")

    const closeDialog = () => emit("closeDialog");
    const createChat = () => {
      if (!nameChat.value) {
        toast.error("Название чата не может быть пустым")
        return
      }

      const {displayName} = authStore.getInfoUser;
      const {uid} = authStore.getCurrentUser;

      if (!uid) return;

      const data = {
        name: nameChat.value,
        createdBy: {
          login: displayName,
          id: uid
        },
        messages: []
      }

      dbStorage.createChat(data).then((id) => {
        console.log(`chat was created with id - ${id}`)
        toast.success("Чат создан")
        closeDialog()
        nameChat.value = ""
      })
    }

    return {closeDialog, createChat, nameChat}
  }
}
</script>

<style scoped>

</style>