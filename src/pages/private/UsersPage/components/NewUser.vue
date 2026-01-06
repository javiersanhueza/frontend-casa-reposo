<template>
  <q-dialog v-model="internalDialogVisible">
    <q-card class="q-dialog-plugin my-big-dialog">
      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6 text-grey-7">{{ title }}</div>
          <q-btn flat round dense icon="close" @click="closeDialog" />
        </div>
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="row q-col-gutter-md">

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="user.firstName"
                label="Nombre (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="user.secondName"
                label="Segundo nombre (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="user.firstSurname"
                label="Apellido paterno (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="user.secondSurname"
                label="Apellido materno (*)"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                filled
                dense
                v-model="user.email"
                label="Email (*)"
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo inválido'
                ]"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                dense
                filled
                v-model="user.password"
                label="Contraseña (*)"
                type="password"
                autocomplete="new-password"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                dense
                filled
                v-model="user.role"
                :options="roleOptions"
                label="Rol (*)"
                emit-value
                map-options
                :rules="[(val: string) => !!val || 'Campo requerido']"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md row no-wrap items-center" :class="{'dialog-actions': $q.screen.xs}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <q-btn outline label="Cancelar" color="white" text-color="primary" @click="closeDialog" />
          <q-btn unelevated label="Aceptar" text-color="white" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { globalMixin } from 'src/mixins/globalMixin';
import { CreateUserPayload } from 'src/interfaces/users.interface';

export default defineComponent({
  name: 'NewUser',

  props: {
    title: { type: String, required: true },
    isEdit: { type: Boolean, default: false },
    userEdit: { type: Object as () => CreateUserPayload, default: () => ({}) },
    dialogVisible: { type: Boolean, required: true },
  },

  emits: ['update:dialogVisible', 'submitted'],

  mixins: [globalMixin],

  setup(props, { emit }) {

    const internalDialogVisible = computed({
      get: () => props.dialogVisible,
      set: (val: boolean) => emit('update:dialogVisible', val)
    });

    const user = ref<CreateUserPayload>({
      email: '',
      firstName: '',
      firstSurname: '',
      secondName: '',
      secondSurname: '',
      password: ''
    });

    watch(() => props.userEdit, (val) => {
      if (props.isEdit && val) {
        console.log(props.userEdit);
        user.value = { ...val };
      }
    }, { immediate: true });

    const closeDialog = () => {
      emit('update:dialogVisible', false);
      resetForm();
    };

    const resetForm = () => {
      user.value = {
        email: '',
        firstName: '',
        firstSurname: '',
        secondName: '',
        secondSurname: '',
        password: '',
      };
    };

    const genderOptions = [
      { label: 'Masculino', value: 'Masculino' },
      { label: 'Femenino', value: 'Femenino' },
      { label: 'Otro', value: 'Otro' }
    ];

    const roleOptions = [
      { label: 'Super Usuario', value: 'superUser' },
      { label: 'Administrador', value: 'admin' }
    ];

    const onSubmit = async () => {
      emit('submitted', user.value, closeDialog);
    };

    return {
      user,
      internalDialogVisible,
      props,
      genderOptions,
      roleOptions,

      closeDialog,
      onSubmit
    };
  }
});
</script>

<style scoped>
.my-big-dialog {
  width: 50vw;
  max-width: 600px;
}
</style>
