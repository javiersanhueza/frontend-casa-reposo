<template>
  <q-chip class="bg-white" style="width: 100%">
    <q-avatar :color="colorAvatar" text-color="white">{{ amount }}</q-avatar>
    <div class="text-grey-7 text-right" style="width: 100%">{{ title }}</div>
  </q-chip>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TypeAccidentComponent',

  props: {
    colorAvatar: {
      type: String
    },
    amount: {
      type: Number
    },
    title: {
      type: String
    }
  }
})

</script>
