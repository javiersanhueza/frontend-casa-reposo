<template>
  <q-item
    :to="{ name: to }"
    :active="show"
    @click="activeItem"
  >
    <q-item-section avatar>
      <q-icon :class="{'text-grey-7': !show}" :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label :class="{'text-grey-7': !show}">{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ItemComponent',

  props: {
    to: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    setActive: {
      type: Function,
      required: true
    }
  },

  setup(props) {
    const activeItem = () => {
      props.setActive();
    }

    return {
      activeItem
    }
  }
})
</script>
