import {defineStore} from "pinia";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import firestore from "../firebase/db/firestore";
import {nanoid} from "nanoid";

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
    getChatRefDoc(chatId) {
      return doc(this.firestore, "chats", chatId);
    },
    getChatById(chatId) {
      return new Promise((resolve) => {
        this.getChats.then(async (data) => {
          const currentChat = data.find((item) => item.id === chatId);

          resolve(currentChat ?? false);
        });
      });
    },
    async updateMessages({text, userId, login, photo, chatId}) {
      return new Promise(async (resolve) => {
        const currentChat = await this.getChatById(chatId);

        if (!currentChat) return;

        await updateDoc(this.getChatRefDoc(chatId), {
          messages: [
            ...currentChat.data.messages,
            {
              id: nanoid(),
              text,
              createdBy: {userId, login, photo},
            },
          ],
        });

        resolve();
      });
    },
    deleteMessage({chatId, messageId}) {
      this.getChatById(chatId).then((currentChat) => {
        if (!currentChat) return;

        updateDoc(this.getChatRefDoc(chatId), {
          messages: currentChat.data.messages.filter(
              (message) => message.id !== messageId
          ),
        });
      });
    },
    updateNewPhotoUserMessages(newUrl, userId) {
      this.getChats.then((chats) => {
        chats.forEach((chat) => {
          if (chat.data.messages.length > 0) {
            const newMessages = chat.data.messages.map((message) => {
              if (message.createdBy.userId === userId) {
                message.createdBy.photo = newUrl
              }

              return message
            });

            updateDoc(this.getChatRefDoc(chat.id), {
              messages: [...newMessages],
            });
          }
        });
      });
    },
    updateMessageText({chatId, messageId, text}) {
      this.getChatById(chatId).then((currentChat) => {
        if (!currentChat) return;

        const curMessageIndex = currentChat.data.messages.findIndex(
            (message, index) => message.id === messageId
        );

        const newMessages = [...currentChat.data.messages];

        newMessages.splice(curMessageIndex, 1, {
          ...newMessages[curMessageIndex],
          text,
        });

        updateDoc(this.getChatRefDoc(chatId), {
          messages: [...newMessages],
        });
      });
    },
  },
};

const useDbStorage = defineStore("dbStorage", settingStore);

export default useDbStorage;
