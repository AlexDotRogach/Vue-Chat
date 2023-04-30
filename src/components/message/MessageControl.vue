<template>
  <div class="text-center ml-2">
    <v-menu
        open-on-click
    >
      <template v-slot:activator="{ props }">
        <div v-bind="props">
          <svg-icon type="mdi" :path="mdiDotsHorizontal"></svg-icon>
        </div>
      </template>

      <v-list>
        <v-list-item
            v-for="(item, index) in items"
            :key="index"
        >
          <v-list-item-title class="listItemText" @click="clickChooseAction(index)">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import {mdiDotsHorizontal} from '@mdi/js';
import UseDbStorage from "../../storage/useDbStorage.js";

export default {
  components: {SvgIcon},
  props: {
    messageId: {
      type: String,
      required: true
    },
    chatId: {
      type: String,
      required: true
    }
  },
  setup(props, {emit}) {
    const dbStorage = UseDbStorage();
    const items = [
      {title: 'Удалить'},
      {title: 'Редактировать'}
    ];

    const clickChooseAction = (index) => {
      switch (index) {
        case 0:
          dbStorage.deleteMessage(props)
          break;
        case 1:
          emit("toggleInputEdit")
          break;
      }
    }

    return {items, clickChooseAction, mdiDotsHorizontal}
  }
}
</script>

<style scoped>
.listItemText {
  border-bottom: .3px solid black;
  cursor: pointer;
  border-radius: 5px;
  padding: 2px;
}

.listItemText:hover {
  background: rgba(0, 0, 0, .1);
}
</style>