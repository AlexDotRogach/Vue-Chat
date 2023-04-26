import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firestore from "../firebase/db/firestore";
import { nanoid } from "nanoid";

const settingStore = {
  state: () => ({
    firestore,
    chats: [],
  }),
  getters: {
    async getChats() {
      const querySnapshot = await getDocs(collection(this.firestore, "chats"));

      const data = [];

      querySnapshot.forEach((doc) => {
        data.push({
          data: doc.data(),
          id: doc.id,
        });
      });

      return data;
    },
  },
  actions: {
    async createChat(data) {
      try {
        const docRef = await addDoc(collection(this.firestore, "chats"), data);

        return new Promise((resolve) => {
          resolve(docRef.id);
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async deleteChat(id) {
      await deleteDoc(doc(this.firestore, "chats", id));

      return new Promise((resolve) => {
        resolve(id);
      });
    },
    updateChats() {
      this.getChats.then((data) => {
        this.chats = [...data];
      });
    },
    async updateMessages({ text, userId, login, photo, chatId }) {
      const chatRef = doc(this.firestore, "chats", chatId);

      return new Promise((resolve) => {
        this.getChats.then(async (data) => {
          const currentChat = data.find((item) => item.id === chatId);

          if (!currentChat) return;

          await updateDoc(chatRef, {
            messages: [
              ...currentChat.data.messages,
              {
                id: nanoid(),
                text,
                createdBy: { userId, login, photo },
              },
            ],
          });

          resolve();
        });
      });
    },
  },
};

const useDbStorage = defineStore("dbStorage", settingStore);

export default useDbStorage;
