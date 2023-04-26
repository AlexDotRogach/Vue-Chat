<template>
  <div class="formWrap rounded-xl">
    <form class="pa-6 pa-md-10" @submit.prevent="submit">
      <v-text-field
          label="email"
          type="email"
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          placeholder="johndoe@gmail.com"
          bg-color="white"
      ></v-text-field>

      <v-text-field
          class="mt-1"
          label="password"
          v-model="password.value.value"
          :error-messages="password.errorMessage.value"
          :type="passwordState ? 'text' : 'password'"
          bg-color="white"
      ></v-text-field>

      <v-btn class="mt-2" size="x-small" @click="togglePassword" color="white">
        {{ passwordState ? "показать" : "скрыть" }}
      </v-btn>

      <div class="d-flex flex-column flex-md-row justify-md-center gp10">
        <v-btn
            class="mt-5"
            type="submit"
            size="small"
        >
          Вход
        </v-btn>
        <router-link to="/registration">
          <v-btn class="mt-md-5 mt-2 w-100" size="small">
            Регистрация
          </v-btn>
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import {ref} from 'vue'
import {useField, useForm} from 'vee-validate'
import useAuthStore from "../../storage/useAuthStore.js";

export default {
  setup() {
    const authStore = useAuthStore()
    const passwordState = ref(false)

    const {handleSubmit} = useForm({
      validationSchema: {
        email(value) {
          if (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(value)) return true

          return 'Must be a valid e-mail.'
        },
        password(value) {
          if (value?.length >= 8) return true;

          return `The password length must be more, now - ${value?.length}`
        }
      },
    })

    const togglePassword = () => {
      passwordState.value = !passwordState.value
    }

    const email = useField('email')
    const password = useField('password')

    const submit = handleSubmit(authStore.authorizationUser)

    return {submit, email, password, passwordState, togglePassword}
  },
}
</script>

<style scoped>
.formWrap {
  align-self: center;
  background: rgba(0, 0, 0, .6);
  min-width: 250px;
  max-width: 400px;

  margin: 0 auto;
}
</style>
