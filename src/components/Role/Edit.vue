<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Role")) }}</span>
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
        v-model="roleData.name"
        :label="$t(Utils.getKey('Name'))"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[
          (val) => val.length || $t(Utils.getKey('Please enter role name')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        type="textarea"
        :autofocus="true"
        v-model="roleData.description"
        :label="$t(Utils.getKey('Description'))"
        dense
        outlined
        maxlength="100"
        lazy-rules
        autogrow
        :rules="[
          (val) =>
            val.length ||
            $t(Utils.getKey('Please enter description of this role')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pb-xs q-pt-none row">
      <div class="text-bold text-uppercase">
        {{ $t(Utils.getKey("Permissions")) }}
      </div>
      <q-space />
      <div>
        <q-checkbox
          v-model="selectAll"
          :label="$t(Utils.getKey('Select All'))"
        />
      </div>
    </q-card-section>
    <q-card-section class="q-pt-xs">
      <q-splitter
        v-model="splitterModel"
        v-if="Object.keys(permissions).length"
        style="border: 1px solid #ccc"
      >
        <template v-slot:before>
         <div style="height: 650px;">
          <q-tabs v-model="tab" vertical class="text-primary">
            <template v-for="(items, name, i) in permissions" :key="i">
              <q-tab
                class="text-left"
                :name="name"
                v-if="name"
                :label="$t(Utils.getKey(name))"
              />
              <q-separator v-if="i !== Object.keys(permissions).length - 1" />
            </template>
          </q-tabs>
         </div>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <template  v-for="(items, name, i) in permissions" :key="i">
              <!-- <q-tab-panel :name="name">
                <div class="" v-for="item in items" :key="item.id">
                  <q-checkbox
                    v-model="rolePermissions"
                    :val="item.id"
                    :label="$t(Utils.getKey(item.name))"
                  />
                </div>
              </q-tab-panel> -->
              <q-tab-panel    v-if="name" :name="name" class="d-flex">
                <div class="flex-1">
                  <div class="" v-for="item in items" :key="item.id">
                    <q-checkbox
                      v-model="rolePermissions"
                      :val="item.id"
                      :label="$t(Utils.getKey(item.name))"
                    />
                  </div>
                </div>
                <div>
                  <q-checkbox
                    v-model="subSelectAll['select-'+i]"
                    v-on:click="onChangeSelect(items, i)"
                    :label="$t(Utils.getKey('Select All'))"
                  />
                </div>
              </q-tab-panel>
            </template>
          </q-tab-panels>
        </template>
      </q-splitter>
      <Loading :loading="isLoading" />
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
        >{{ $t(Utils.getKey("Update")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useACL from "src/composables/useACL";
import Utils from "src/helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  role: Object,
});
const emit = defineEmits(["onClose", "onUpdated"]);

const isLoading = ref(true);
const $q = useQuasar();
const { saving, updateRole, getAllPermissions } = useACL();
const splitterModel = ref(30);
const tab = ref("");
const selectAll = ref(false);
const roleData = ref({ ...props.role });
const rolePermissions = ref(props.role.permissions.map((role) => role.id));
const permissions = ref({});
const subSelectAll = ref({
  select: false
})
initPermissions();

watch(selectAll, (newValue, _) => {

  if (newValue) {
    for (const [key, value] of Object.entries(permissions.value)) {
      value.forEach((p) => {
        rolePermissions.value.push(p.id);
      });
    }
  } else {
    rolePermissions.value = [];
  }
  updateSubSelectAll(permissions, newValue)

});
const onChangeSelect = (item, index) => {
  console.log(subSelectAll.value['select-'+index])
  if(subSelectAll.value['select-'+index] == true){
    item.forEach((p) => {
        rolePermissions.value.push(p.id);
    });
  } else {
    let newPermistion = []
    item.forEach((p) => {
      newPermistion.push(p.id)
    })
    rolePermissions.value =  rolePermissions.value.filter(id => !newPermistion.includes(id))
  }
}
async function initPermissions() {
  isLoading.value = true;
  const response = await getAllPermissions();
  let groupedPermissions = {};

  response.data.forEach((permission) => {
    let groupName = permission.name.substring(0, permission.name.indexOf(":"));

    if (groupedPermissions.hasOwnProperty(groupName) === true) {
      groupedPermissions[groupName].push({
        ...permission,
        name: permission.name.replace(`${groupName}:`, ""),
      });
    } else {
      groupedPermissions[groupName] = [
        {
          ...permission,
          name: permission.name.replace(`${groupName}:`, ""),
        },
      ];
    }
  });

  permissions.value = Object.fromEntries(
    Object.entries(groupedPermissions).sort(([, a], [, b]) => {
      return a.length - b.length;
    })
  );

  tab.value = Object.keys(permissions.value)[0];
  updateSubSelectAll(permissions,false)
  isLoading.value = false;

}
function updateSubSelectAll(permissions, status) {
  for (let index = 0; index < Object.keys(permissions.value).length; index++) {
    console.log('changed')
    subSelectAll.value['select-'+index] = status;
  }
}

async function onSubmit() {
  if (rolePermissions.value.length === 0) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("Please select permissions for the role")),
    });

    return;
  }

  try {
    await updateRole(props.role.id, {
      ...roleData.value,
      permissions: rolePermissions.value,
    });
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

<style></style>
