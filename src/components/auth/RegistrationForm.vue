<template>
  <div class="formWrap rounded-xl">
    <form class="pa-6 pa-md-10" @submit.prevent="submit">
      <v-text-field
          label="login"
          type="text"
          v-model="login.value.value"
          bg-color="white"
          :error-messages="login.errorMessage.value"
      ></v-text-field>

      <v-text-field
          label="email"
          type="email"
          v-model="email.value.value"
          bg-color="white"
          :error-messages="email.errorMessage.value"
          placeholder="johndoe@gmail.com"
      ></v-text-field>

      <v-text-field
          label="phone"
          type="phone"
          v-model="phone.value.value"
          bg-color="white"
          :error-messages="phone.errorMessage.value"
          placeholder="(099) 222-23-23"
      ></v-text-field>

      <v-text-field
          class="mt-1"
          label="password"
          v-model="password.value.value"
          bg-color="white"
          :error-messages="password.errorMessage.value"
          :type="passwordState ? 'text' : 'password'"
      ></v-text-field>

      <v-text-field
          class="mt-1"
          label="repeat password"
          v-model="passwordRepeat.value.value"
          bg-color="white"
          :error-messages="passwordRepeat.errorMessage.value"
          :type="passwordState ? 'text' : 'password'"
      ></v-text-field>


      <v-btn class="mt-2" size="x-small" @click="togglePassword" color="white">
        {{ passwordState ? "показать" : "скрыть" }}
      </v-btn>

      <div class="gp10 d-flex flex-column flex-md-row justify-md-space-between">
        <router-link class="isAccount" to="/authorization">
          <v-btn class="mt-5" size="small">
            У вас уже есть аккаунт?
          </v-btn>
        </router-link>
        <v-btn class="mt-md-5 mt-2" type="submit" size="small">
          Зарегистироваться
        </v-btn>
      </div>
    </form>
  </div>
</template>

<script>
import {ref} from 'vue'
import {useField, useForm} from 'vee-validate'
import useAuthStore from "../../storage/useAuthStore.js";
import phoneTemplate from "../../utils/phoneTemplate.js";

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
          if (value?.length >= 8) return true

          return `The password length must be more, now - ${value?.length ?? 0}`
        },
        passwordRepeat(value) {
          if (password.value.value === value) return true;

          return "Different passwords"
        },
        login(value) {
          if (value?.length > 2) return true;

          return "Short login"
        },
        phone(value) {
          if (!isNaN(+value) && value?.length === 10) {
            phone.setValue(phoneTemplate(value))
          }

          if (/^\([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}/.test(value)) return true

          return 'phone is`t correct'
        }
      },
    })

    const togglePassword = () => passwordState.value = !passwordState.value

    const email = useField('email')
    const password = useField('password')
    const passwordRepeat = useField('passwordRepeat')
    const login = useField('login')
    const phone = useField('phone')

    const submit = handleSubmit(authStore.registerUser)

    return {submit, email, login, phone, password, passwordRepeat, passwordState, togglePassword}
  },
}
</script>

<style scoped>
.formWrap {
  align-self: center;
  background: rgba(0, 0, 0, .6);
  min-width: 250px;
  max-width: 500px;

  margin: 0 auto;
}

.isAccount {
  color: white;
}
</style>
