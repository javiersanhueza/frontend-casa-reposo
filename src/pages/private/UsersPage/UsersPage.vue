<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Usuarios</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section>
      <users-component />
    </q-card-section>
  </q-card>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn @click="dialogVisible = true" fab icon="add" color="primary">
      <q-tooltip
        v-if="!$q.screen.xs"
        anchor="center left"
        self="center middle"
        :offset="[55, 55]"
      >
        Nuevo usuario
      </q-tooltip>
    </q-btn>
  </q-page-sticky>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UsersComponent from 'pages/private/UsersPage/components/UsersComponent.vue';

export default defineComponent({
  name: 'UsersPage',
  components: { UsersComponent },

  setup() {
    const dialogVisible = ref(false);

    return {
      dialogVisible,
    };
  },
});
</script>
