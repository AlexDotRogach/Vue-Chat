import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import router from "../router/router.js";
import toast from "../utils/toast.js";

const settingStore = {
  state: () => ({
    auth: getAuth(),
  }),
  getters: {
    getCurrentUser() {
      return this.auth.currentUser;
    },
    getInfoUser() {
      if (!this.getCurrentUser) return;

      let userInfo = {};

      this.getCurrentUser.providerData.forEach(
        (profile) => (userInfo = { ...profile })
      );

      return userInfo;
    },
  },
  actions: {
    registerUser({ login, email, password }) {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(({ user: { uid } }) => {
          this.updateProfileUser({ login, uid });
        })
        .catch((error) => {
          toast.error(error.code);
        });
    },
    authorizationUser({ email, password }) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(({ user: { uid } }) => {
          this.signInUser(uid, "Авторизация успешна");
        })
        .catch((error) => {
          toast.error(error.code);
        });
    },
    logOutUser() {
      signOut(this.auth).then(() => {
        router.replace({ name: "auth" }).then((data) => {
          toast.success(`Выход успешный`);
        });
      });
    },
    updateProfileUser({ login, uid }) {
      updateProfile(this.getCurrentUser, {
        displayName: login,
        photoURL:
          "https://www.meme-arsenal.com/memes/ad49f5fb6248c93511637fd13463918f.jpg",
      }).then(() => {
        this.signInUser(uid, "Пользователь успешно создан");
      });
    },
    updatePhotoUser(url) {
      return updateProfile(this.getCurrentUser, {
        photoURL: url,
      });
    },
    signInUser(idUser, text) {
      router
        .replace(`/${idUser}`)
        .then(() => {
          toast.success(`${text}`);
        })
        .catch(() => {
          toast.error("Smth wrong");
        });
    },
    sendResetToEmail() {
      const emailByUser = this.getInfoUser.email;
      const emailType = emailByUser.slice(
        emailByUser.lastIndexOf("@") + 1,
        emailByUser.lastIndexOf(".")
      );

      if (emailType !== "gmail") {
        toast.error(`Ваша почта имеет ${emailType}, а нужен gmail`);
        return false;
      }

      return sendPasswordResetEmail(this.auth, this.getInfoUser.email);
    },
    deleteAccount() {
      return deleteUser;
    },
  },
};

const useAuthStore = defineStore("authStore", settingStore);

export default useAuthStore;
