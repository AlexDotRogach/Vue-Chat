<template>
  <v-row>
    <v-col cols="12"><span class="text-h4">Действия над аккаунтом:</span></v-col>
  </v-row>
  <v-row>
    <v-col class="mx-auto" cols="12" lg="6">
      <setting-banner text="Для сброса пароля необходимо, чтобы почта была gmail. Также почта должна существовать."
                      :loader="loader.password">
        <v-btn @click="clickSendResetToEmail">Сбросить пароль</v-btn>
      </setting-banner>
    </v-col>

    <v-col class="mx-auto" cols="12" lg="6">
      <setting-banner
          text="Для смены картинки укажите правильный url на нее. В случаи не верной ссылки, картинка не поменяеться."
          :loader="loader.photo">
        <v-btn @click="clickUpdatePhoto">
          Обновить фото
          <v-overlay
              activator="parent"
              location-strategy="connected"
              scroll-strategy="block"
          >
            <v-text-field class="mt-1"
                          label="photo"
                          v-model="photoUrl"
                          bg-color="white"
                          @blur="updatePhoto"
            >
            </v-text-field>
          </v-overlay>
        </v-btn>
      </setting-banner>
    </v-col>
  </v-row>
  <v-row>
    <v-col class="mx-auto" cols="12" lg="6">
      <setting-banner text="После нажатия на 'удалить аккаунт' вы больше не сможете зайти. Все чаты пропадут."
                      :loader="loader.password">
        <v-btn @click="clickDeleteAccount">Удалить аккаунт</v-btn>
      </setting-banner>
    </v-col>
  </v-row>
</template>

<script>
import {ref} from 'vue'
import useAuthStore from "../storage/useAuthStore.js";
import useDbStorage from "../storage/useDbStorage.js";
import toast from "../utils/toast.js";
import {deleteUser} from "firebase/auth";
import {useRouter} from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore()
    const dbStorage = useDbStorage()
    const {sendResetToEmail, getInfoUser, updatePhotoUser, deleteAccount} = authStore;
    const loader = ref({
      password: false,
      photo: false
    })
    const photoUrl = ref('')

    const clickSendResetToEmail = () => {
      loader.value.password = true;

      const answerBySend = sendResetToEmail();

      if (!answerBySend) {
        loader.value.password = false;
        return;
      }

      answerBySend.then(() => {
        toast.success(` Письмо отправлено на почту ${getInfoUser.email}`)
      }).catch((error) => {
        toast.error(error.code)
      }).finally(() => {
        loader.value.password = false;
      })
    }

    // img
    const clickUpdatePhoto = () => {
      photoUrl.value = ""
      toast.info("При закрытие произойдет обновление фотографии");
    }

    const successImage = (img) => {
      if (!img.target.complete) return;

      updatePhotoUser(photoUrl.value).then(() => {
        loader.value.photo = false;
        toast.success(`Картинка успешно обновлена`)
      }).catch(() => {
        toast.error("Проблемы с обновлением")
      })
    }

    const errorImage = (img) => {
      loader.value.photo = false;
      toast.error(`Ссылка ${img.target.src} не есть картинкой`)
    }

    const updatePhoto = () => {
      const img = new Image();

      loader.value.photo = true;

      img.src = photoUrl.value
      img.onload = successImage
      img.onerror = errorImage;
    }

    // account
    const clickDeleteAccount = () => {
      const userId = authStore.getCurrentUser.uid;
      const deleteUser = deleteAccount()

      deleteUser(authStore.getCurrentUser).then(() => {
        dbStorage.getChats.then((chats) => {
          chats.forEach(chat => {
            if (chat.data.createdBy.id === userId) {
              dbStorage.deleteChat(chat.id)
            }
          })

          router.push({name: "auth"})
          toast.success("Аккаунт удален")
        })
      }).catch((error) => {
        console.log(error)
        toast.error(error.code)
      });
    }

    return {clickSendResetToEmail, clickUpdatePhoto, clickDeleteAccount, updatePhoto, loader, photoUrl}
  },
}
</script>

<style scoped>


</style>
