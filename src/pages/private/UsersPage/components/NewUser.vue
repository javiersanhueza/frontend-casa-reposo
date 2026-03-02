<template>
  <q-dialog v-model="internalDialogVisible" persistent>
    <q-card style="width: 800px; max-width: 95vw;" class="q-dialog-plugin rounded-borders">

      <q-toolbar class="bg-primary text-white q-py-sm">
        <q-avatar>
          <q-icon name="person_add" size="md" />
        </q-avatar>
        <q-toolbar-title class="text-weight-bold text-subtitle1">
          {{ title || 'Nuevo Usuario' }}
        </q-toolbar-title>
        <q-btn flat round dense icon="close" v-close-popup @click="closeDialog">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-form @submit="onSubmit">
        <q-card-section class="scroll" style="max-height: 75vh;">
          <div class="row q-col-gutter-md">

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-sm row items-center">
              <q-icon name="badge" class="q-mr-sm" size="20px" /> Datos Personales
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.firstName"
                label="Primer Nombre *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="person" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.secondName"
                label="Segundo Nombre *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="person_outline" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.firstSurname"
                label="Apellido Paterno *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="group" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.secondSurname"
                label="Apellido Materno *"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="group_add" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 text-subtitle2 text-primary text-uppercase text-weight-bold q-mt-lg row items-center">
              <q-icon name="security" class="q-mr-sm" size="20px" /> Acceso y Permisos
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.email"
                label="Correo Electrónico *"
                lazy-rules
                :rules="[
                  (val: string) => !!val || 'Campo requerido',
                  (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Correo inválido'
                ]"
              >
                <template v-slot:prepend><q-icon name="email" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                outlined
                v-model="user.password"
                label="Contraseña *"
                type="password"
                autocomplete="new-password"
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="lock" color="grey-6" /></template>
              </q-input>
            </div>

            <div class="col-12">
              <q-select
                outlined
                v-model="user.role"
                :options="roleOptions"
                label="Rol de Sistema *"
                emit-value
                map-options
                lazy-rules
                :rules="[(val: string) => !!val || 'Campo requerido']"
              >
                <template v-slot:prepend><q-icon name="admin_panel_settings" color="grey-6" /></template>
              </q-select>
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="bg-grey-1 q-px-lg q-py-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey-8"
            class="q-px-md"
            @click="closeDialog"
          />
          <q-btn
            unelevated
            label="Guardar"
            color="primary"
            icon="save"
            type="submit"
            class="q-px-md q-ml-sm"
          />
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
