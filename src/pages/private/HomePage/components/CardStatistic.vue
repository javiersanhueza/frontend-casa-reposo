<template>
  <q-card class="my-card" :class="classCard" flat style="border-radius: 10px">
    <q-item v-if="!vertical">
      <q-item-section avatar>
        <q-avatar
          :icon="icon"
          text-color="white"
          font-size="60px"
          size="60px"
        />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-center">
          <q-chip color="white" text-color="grey-7">
            {{ title }}
          </q-chip>
        </q-item-label>
        <q-item-label class="text-center text-white text-h4">
          {{ subTitle }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="vertical">
      <q-item-section>
        <q-item-label class="text-center">
          <q-chip color="white" text-color="grey-7">
            {{ title }}
          </q-chip>
        </q-item-label>
        <q-item-label class="text-center text-white text-h4">
          {{ subTitle }}
        </q-item-label>
        <q-item-label class="text-center">
          <q-avatar
            :icon="icon"
            text-color="white"
            font-size="60px"
            size="60px"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CardStatisticComponent',

  props: {
    classCard: {
      type: String
    },
    icon: {
      type: String
    },
    title: {
      type: String
    },
    subTitle: {
      type: String
    },
    vertical: {
      type: Boolean,
      default: false
    }
  }
})

</script>

<style scoped>
.my-card {
  flex: 1 1 20%;
  box-sizing: border-box;
}

@media (max-width: 1200px) {
  .my-card {
    flex: 1 1 45%;
  }
}

@media (max-width: 600px) {
  .my-card {
    flex: 1 1 100%;
  }
}
</style>
