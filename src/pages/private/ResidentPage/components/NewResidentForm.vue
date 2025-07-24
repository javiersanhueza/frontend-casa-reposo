<template>
  <q-form @submit="onSubmit">
    <q-card-section class="q-gutter-y-sm">
      <div class="row">

        <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-md' : '']">

          <div>
            <ImageCropper @cropped="resident.photo = $event" v-if="activeCropper" />
          </div>

          <!-- Mostrar vista previa si ya hay una foto -->
          <div v-if="resident.photo">
            <div class="text-subtitle2 text-grey-7 text-center">Vista previa foto residente</div>

            <div style="position: relative; width: 200px; height: 200px; margin: auto;">
              <q-skeleton
                v-if="loadingImage"
                type="QAvatar"
                style="width: 200px; height: 200px; border-radius: 50%;"
              />
              <img
                v-show="!loadingImage"
                :src="resident.photo"
                alt="Foto residente"
                @load="loadingImage = false"
                style="border-radius: 50%; width: 200px; height: 200px; position: absolute; top: 0; left: 0;"
              />
            </div>
          </div>
          <div class="row q-mt-md" v-if="isEdit && residentPhotoOriginal && resident.photo && !activeCropper">
            <div class="col-12 text-center">
              <q-btn @click="resident.photo = null; activeCropper = true" icon="delete" color="red" label="Eliminar" />
            </div>
          </div>
        </div>

        <div class="col-sm-8 col-12">
          <div class="row">
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.name"
                label="Nombre (*)"
                lazy-rules
                :rules="[
                  (val: string) => val && val.length > 0 || 'Campo requerido'
                ]"
                outlined
                dense
              />
            </div>
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.paternalSurname"
                label="Apellido paterno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
            <div class="col-sm-4 col-12">
              <q-input
                v-model="resident.maternalSurname"
                label="Apellido materno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row">
            <div :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                dense
                label="Fecha nacimiento (*)"
                v-model="resident.birthDate"
                mask="##/##/####"
                :rules="[(val: string) => !!val || 'Campo requerido']"
                outlined
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                      anchor="top right"
                      self="top left"
                    >
                      <q-date
                        v-model="resident.birthDate"
                        mask="DD/MM/YYYY"
                        format="DD/MM/YYYY"
                        :options="optionsBirthDate"
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-sm-6 col-12">
              <q-input
                v-model="resident.rut"
                label="Rut (*)"
                lazy-rules
                :rules="[
          (val: string) => val && val.length > 0 || 'Campo requerido',
          (val: string) => validateRut(val) || 'RUT inválido'
        ]"
                @update:model-value="resident.rut = formatRut($event)"
                dense
                outlined
              />
            </div>
          </div>

          <q-input
            v-model="resident.address"
            label="Dirección (*)"
            lazy-rules
            :rules="[
          (val: string) => val && val.length > 0 || 'Campo requerido'
        ]"
            outlined
            dense
          />

          <div class="row">
            <div :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : 'q-mb-lg']">
              <q-select
                dense
                outlined
                v-model="resident.professionId"
                option-value="id"
                option-label="description"
                emit-value
                map-options
                :options="filteredProfessions"
                label="Profesión (*)"
                use-input
                input-debounce="100"
                @filter="customFilterProfession"
                clearable
                @clear="resident.professionId = ''"
                lazy-rules
                :rules="[
              (val: number) => val && val > 0 || 'Campo requerido'
            ]"
              />
            </div>

            <div class="col-sm-6 col-12">
              <q-select
                dense
                outlined
                v-model="resident.religionId"
                option-value="id"
                option-label="description"
                emit-value
                map-options
                :options="filteredReligions"
                label="Religión (*)"
                use-input
                input-debounce="100"
                @filter="customFilterReligion"
                clearable
                @clear="resident.religionId = ''"
                lazy-rules
                :rules="[
              (val: number) => val && val > 0 || 'Campo requerido'
            ]"
              />
            </div>
          </div>

          <div class="text-subtitle2 text-grey-7">Apoderado</div>

          <div class="row">
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.guardian.name"
                label="Nombre (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.guardian.paternalSurname"
                label="Apellido paterno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
            <div class="col-sm-4 col-12">
              <q-input
                v-model="resident.guardian.maternalSurname"
                label="Apellido materno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row">
            <div :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.guardian.rut"
                label="Rut (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido',
              (val: string) => validateRut(val) || 'RUT inválido'
            ]"
                @update:model-value="resident.guardian.rut = formatRut($event)"
                dense
                outlined
              />
            </div>

            <div class="col-sm-6 col-12">
              <q-input
                v-model="resident.guardian.phone"
                label="Teléfono (*)"
                mask="+56 # ########"
                fill-mask
                unmasked-value
                outlined
                dense
                :rules="[
              (val: string) => !!val && val.length === 9 || 'Debe ingresar 9 dígitos'
            ]"
              />
            </div>
          </div>

          <q-input
            v-model="resident.guardian.address"
            label="Dirección (*)"
            lazy-rules
            :rules="[
          (val: string) => val && val.length > 0 || 'Campo requerido'
        ]"
            outlined
            dense
          />

          <div class="text-subtitle2 text-grey-7">Apoderado secundario</div>

          <div class="row">
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.secondaryGuardian.name"
                label="Nombre (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
            <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.secondaryGuardian.paternalSurname"
                label="Apellido paterno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
            <div class="col-sm-4 col-12">
              <q-input
                v-model="resident.secondaryGuardian.maternalSurname"
                label="Apellido materno (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido'
            ]"
                outlined
                dense
              />
            </div>
          </div>

          <div class="row">
            <div :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                v-model="resident.secondaryGuardian.rut"
                label="Rut (*)"
                lazy-rules
                :rules="[
              (val: string) => val && val.length > 0 || 'Campo requerido',
              (val: string) => validateRut(val) || 'RUT inválido'
            ]"
                @update:model-value="
              resident.secondaryGuardian.rut = formatRut($event)
            "
                dense
                outlined
              />
            </div>

            <div class="col-sm-6 col-12">
              <q-input
                v-model="resident.secondaryGuardian.phone"
                label="Teléfono (*)"
                mask="+56 # ########"
                fill-mask
                unmasked-value
                outlined
                dense
                :rules="[
              (val: string) => !!val && val.length === 9 || 'Debe ingresar 9 dígitos'
            ]"
              />
            </div>
          </div>

          <q-input
            v-model="resident.secondaryGuardian.address"
            label="Dirección (*)"
            lazy-rules
            :rules="[
          (val: string) => val && val.length > 0 || 'Campo requerido'
        ]"
            outlined
            dense
          />

          <small class="text-grey-7">(*) Campo requerido</small>
        </div>
      </div>
    </q-card-section>

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

import { rutMixin } from 'src/mixins/rutMixin';
import pinia from 'src/stores';
import { useOptionStore } from 'stores/option';
import { useResidentStore } from 'stores/resident';
import { Options } from 'src/interfaces/options.interface';
import { NewResident } from 'src/interfaces/residents.interface';
import ImageCropper from 'components/ImageCropper.vue';

export default defineComponent({
  name: 'NewResidentForm',
  components: { ImageCropper },

  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },

  mixins: [rutMixin],

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

