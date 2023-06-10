<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '500px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey('Delete Role')) }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="deleting"
      >
        <q-tooltip>{{ $t(Utils.getKey('Close')) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <template v-if="loading">
      <q-card-section class="text-center q-mt-lg">
        <q-spinner-grid size="30" color="primary" />
      </q-card-section>
    </template>

    <template v-else-if="roleUsers.length !== 0">
      <q-card-section>
        <div class="text-bold text-uppercase q-pb-sm">
          {{ $t(Utils.getKey(props.role.name +'s Role Users')) }}
        </div>
        <q-list bordered separator>
          <q-item v-for="(user, i) in roleUsers" :key="i">
            <q-item-section>
              <q-item-label>{{ i + 1 }}. {{ user.name }}</q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-badge
          class="text-bold bg-warning full-width q-pa-sm text-white text-uppercase q-mt-md"
          >{{ $t(Utils.getKey('Assign these User(s) another role')) }}</q-badge
        >
        <q-select
          class="q-mt-md"
          :style="{ minWidth: '200px' }"
          v-model="newRole"
          :options="roles"
          option-value="id"
          option-label="name"
          emit-value
          map-options
          dense
          outlined
          :label="$t(Utils.getKey('Select New Role')) "
        />
      </q-card-section>
    </template>

    <template v-else>
      <q-card-section>
        <q-badge
          class="text-subtitle1 bg-warning full-width q-pa-sm text-white q-mt-md"
          >{{ $t(Utils.getKey('Are you sure you want to delete this Role')) }}</q-badge
        >
      </q-card-section>
    </template>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="deleting"
        >{{ $t(Utils.getKey('Cancel')) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="deleting"
        >{{ $t(Utils.getKey('Delete Role')) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref} from "vue";
import { useQuasar } from "quasar";
import { api } from "../../boot/axios";
import useACL from "src/composables/useACL";
import Utils from "src/helpers/Utils";

import { useI18n } from "vue-i18n";
const {t}  = useI18n();
const props = defineProps({ role: Object });
const emit = defineEmits(["onClose", "onDelete"]);

const $q = useQuasar();
const { loading, deleting, deleteRole, getAllRoles } = useACL();
const roles = ref([]);
const roleUsers = ref([]);
const newRole = ref();

loading.value = true;
Promise.all([getRoleUsers(), initRoles()]);
loading.value = false;

async function getRoleUsers() {
  try {
    const response = await api.get(`/roles/${props.role.id}/users`);
    roleUsers.value = response.data;
  } catch (err) {
    console.log(err);
  }
}

async function initRoles() {
  try {
    const response = await getAllRoles();
    roles.value = response.data
      .filter(
        (role) => role.name !== "super admin" && role.name !== props.role.name
      )
      .map((role) => {
        return {
          ...role,
          name: role.name.toUpperCase(),
        };
      });
  } catch (err) {
    console.log(err);
  }
}

async function onSubmit() {
  if (roleUsers.value.length && !newRole.value) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey('Please select new role')),
    });

    return;
  }

  try {
    await deleteRole(props.role.id, `new_role=${newRole.value}`);
    emit("onDelete");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey('deleted successfully')),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message:t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>

<style></style>
