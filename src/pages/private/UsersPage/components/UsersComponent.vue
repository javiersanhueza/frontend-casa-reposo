<template>
  asdsad
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useUserStore } from 'stores/user';
import pinia from 'src/stores';

export default defineComponent({
  name: 'UsersComponent',

  setup() {
    const userStore = useUserStore(pinia());

    onMounted(async() => {
      await userStore.getUsers();
    })
    return {

    }
  }
})
</script>
