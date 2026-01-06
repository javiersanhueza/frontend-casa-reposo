<template>
  <q-form @submit="onSubmit">

    <q-card-section>
      <div class="row" v-if="screen.gt.sm">
        <div class="col-sm-6 col-12 q-pr-sm">
          <q-btn
            class="full-width"
            outline
            label="Volver"
            color="white"
            text-color="primary"
            @click="router.push({ name: 'ResidentPage' })"
          />
        </div>
        <div class="col-sm-6 col-12">
          <q-btn
            class="full-width"
            unelevated
            :label="isEdit ? 'Editar' : 'Crear'"
            color="primary"
            text-color="white"
            type="submit"
          />
        </div>
      </div>

      <div class="row" v-else>
        <div class="col-sm-6 col-12 q-mb-sm">
          <q-btn
            class="full-width"
            unelevated
            :label="isEdit ? 'Editar' : 'Crear'"
            color="primary"
            text-color="white"
            type="submit"
          />
        </div>
        <div class="col-sm-6 col-12">
          <q-btn
            class="full-width"
            outline
            label="Volver"
            color="white"
            text-color="primary"
            @click="router.push({ name: 'ResidentPage' })"
          />
        </div>
      </div>
    </q-card-section>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar, date, QSelect, Notify } from 'quasar';
import { useRouter, useRoute } from 'vue-router';

import pinia from 'src/stores';
import { useOptionStore } from 'stores/option';
import { useResidentStore } from 'stores/resident';
import { Options } from 'src/interfaces/options.interface';
import { NewResident } from 'src/interfaces/residents.interface';

export default defineComponent({
  name: 'NewResidentForm',

  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const { screen } = useQuasar();
    const today = date.formatDate(new Date(), 'YYYY/MM/DD');
    const optionStore = useOptionStore(pinia());
    const residentStore = useResidentStore(pinia());
    const professions = ref<Options[]>([]);
    const filteredProfessions = ref<Options[]>();
    const filteredReligions = ref<Options[]>([]);
    const religions = ref<Options[]>([]);
    const idResident = route.params.idResident;
    const loadingImage = ref(true);
    const residentPhotoOriginal = ref('');
    const activeCropper = ref(true);


    const optionsBirthDate = (date: string) => {
      return today >= date;
    };

    const resident = ref<NewResident>({
      name: '',
      paternalSurname: '',
      maternalSurname: '',
      rut: '',
      birthDate: '',
      address: '',
      professionId: '',
      religionId: '',
      guardian: {
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        rut: '',
        phone: '',
        address: '',
      },
      secondaryGuardian: {
        name: '',
        paternalSurname: '',
        maternalSurname: '',
        rut: '',
        phone: '',
        address: '',
      },
      photo: '',
    });

    const onSubmit = async () => {
      const response = props.isEdit
        ? await residentStore.editResident(Number(idResident), resident.value)
        : await residentStore.createResident(resident.value);

      if (!!response?.resident) {
        Notify.create({
          type: 'positive',
          message: `Residente ${
            props.isEdit ? 'actualizado' : 'creado'
          } con éxito`,
          position: 'top',
          timeout: 3000,
        });

        await router.push({ name: 'ResidentPage' });
      }
    };

    const getOptions = async () => {
      await optionStore.getOptionsResidentForm();
      professions.value = optionStore.professions || [];
      religions.value = optionStore.religions || [];
    };

    const getResidentById = async () => {
      const response = await residentStore.getResidentById(Number(idResident));

      const [year, month, day] = response.birthDate.split('-');

      resident.value = {
        name: response.name,
        paternalSurname: response.paternalSurname,
        maternalSurname: response.maternalSurname,
        rut: response.rut,
        birthDate: `${day}/${month}/${year}`,
        address: response.address,
        professionId: response.professionId,
        religionId: response.religionId,
        guardian: {
          name: response.principalGuardian.name,
          paternalSurname: response.principalGuardian.paternalSurname,
          maternalSurname: response.principalGuardian.maternalSurname,
          rut: response.principalGuardian.rut,
          phone: response.principalGuardian.phone,
          address: response.principalGuardian.address,
        },
        secondaryGuardian: {
          name: response.secondaryGuardian.name,
          paternalSurname: response.secondaryGuardian.paternalSurname,
          maternalSurname: response.secondaryGuardian.maternalSurname,
          rut: response.secondaryGuardian.rut,
          phone: response.secondaryGuardian.phone,
          address: response.secondaryGuardian.address,
        },
        photo: response.photo
      };

      residentPhotoOriginal.value = response.photo

      activeCropper.value = !response.photo;

    };

    const customFilterProfession = (
      inputValue: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
    ) => {
      const needle = inputValue.toLowerCase();

      doneFn(() => {
        filteredProfessions.value = professions.value.filter((p) =>
          p.description.toLowerCase().includes(needle)
        );
      });
    };

    const customFilterReligion = (
      inputValue: string,
      doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void
    ) => {
      const needle = inputValue.toLowerCase();

      doneFn(() => {
        filteredReligions.value = religions.value.filter((p) =>
          p.description.toLowerCase().includes(needle)
        );
      });
    };

    const clearResidentPhoto = () => {
      resident.value.photo = '';
    }

    onMounted(async () => {
      await getOptions();
      filteredProfessions.value = [...professions.value];
      filteredReligions.value = [...religions.value];

      if (props.isEdit) {
        await getResidentById();
      }
    });

    return {
      router,
      resident,
      screen,
      today,
      religions,
      professions,
      filteredProfessions,
      filteredReligions,
      loadingImage,
      residentPhotoOriginal,
      activeCropper,

      onSubmit,
      optionsBirthDate,
      customFilterProfession,
      customFilterReligion,
      clearResidentPhoto
    };
  },
});
</script>

<style scoped>
.cropper-container {
  position: relative;
  display: inline-block;
  max-width: 300px;
  width: 100%;
}

.delete-btn {
  position: absolute;
  top: 30px;
  right: 15px;
  z-index: 10;
}
</style>

