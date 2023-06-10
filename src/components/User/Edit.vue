<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit User")) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <q-input
        :autofocus="true"
        v-model="user.name"
        :label="$t(Utils.getKey('Name'))"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[
          (val) => val.length || $t(Utils.getKey('Please enter username')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        :autofocus="true"
        type="email"
        readonly
        v-model="user.email"
        :label="$t(Utils.getKey('Email id'))"
        dense
        outlined
        maxlength="20"
        @keydown.space="(event) => event.preventDefault()"
        lazy-rules
        :rules="[
          (val) => val.length || $t(Utils.getKey('Please enter user id')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-select
        :autofocus="true"
        v-model="user.role_id"
        :options="roleOptions"
        :label="$t(Utils.getKey('Role'))"
        emit-value
        map-options
        option-label="name"
        option-value="id"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[(val) => val || $t(Utils.getKey('Please select Role'))]"
      />
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
         style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useUser from "src/composables/useUser";
import useACL from "src/composables/useACL";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { saving, update } = useUser();
const { getAllRoles } = useACL();
const roleOptions = ref([]);
const user = ref({
  ...props.data,
  role_id: props.data?.roles[0]?.id,
});

Promise.allSettled[(fetchRoles())];

watch(
  () => user.value.role_id,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      let role = roleOptions.value.find((item) => item.id == newValue);
    }
  }
);
async function fetchRoles() {
  try {
    const response = await getAllRoles();
    roleOptions.value = response.data;
  } catch (e) {}
}

async function onSubmit() {
  let role = roleOptions.value.find((item) => item.id == user.value.role_id);

  try {
    await update(user.value.id, { ...user.value });

    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>
