import { createRouter, createWebHashHistory } from "vue-router";
import { removeQueryParams, removeHash } from "./utils";
import useAuthStore from "../storage/useAuthStore.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const logOutUser = () => {
  const authStore = useAuthStore();

  signOut(authStore.$state.auth).then(() => {
    console.log("выход успешен");
  });
};

const isAuthState = () => {
  const authStore = useAuthStore();

  return new Promise((resolve, reject) => {
    onAuthStateChanged(authStore.$state.auth, (user) => {
      user ? resolve(user) : reject();
    });
  });
};

const routes = [
  {
    name: "app",
    path: "/",
    redirect: "/authorization",
    beforeEnter: [logOutUser],
  },
  {
    name: "home",
    path: "/:userId",
    component: () => import("../components/HomeView.vue"),
    children: [
      {
        name: "chats",
        path: "chats",
        component: () => import("../components/ChatsView.vue"),
      },
      {
        name: "myChats",
        path: "myChats",
        component: () => import("../components/ChatsView.vue"),
      },
      {
        name: "setting",
        path: "setting",
        component: () => import("../components/SettingView.vue"),
      },
      {
        name: "messages",
        path: "messages/:chatId",
        component: () => import("../components/message/MessagesView.vue"),
      },
    ],
  },
  {
    name: "auth",
    path: "/authorization",
    component: () => import("../components/auth/AuthorizationForm.vue"),
    beforeEnter: [removeQueryParams, removeHash, logOutUser],
  },
  {
    name: "registration",
    path: "/registration",
    component: () => import("../components/auth/RegistrationForm.vue"),
    beforeEnter: [removeQueryParams, removeHash, logOutUser],
  },
  {
    name: "error",
    path: "/:catchAll(.*)",
    redirect: "/authorization",
    beforeEnter: [removeQueryParams, removeHash],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const allowRouts = ["auth", "registration"];

router.beforeEach((to, from, next) => {
  if (allowRouts.includes(to.name)) next();

  isAuthState()
    .then((user) => {
      const userIdByParams = to.params?.userId;

      if (user.uid !== userIdByParams) next({ name: "auth" });

      next();
    })
    .catch(() => {
      next({ name: "auth" });
    });
});

export default router;
