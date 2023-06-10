<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Role")) }}</span>
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
        v-model="role.name"
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
        v-model="role.description"
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
          <q-tabs  v-model="tab" vertical class="text-primary">
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
            <template v-for="(items, name, i) in permissions" :key="i">
              <q-tab-panel  v-if="name" :name="name" class="d-flex">
                <div class="flex-1">
                  <div class="" v-for="item in items" :key="item.id">
                    <q-checkbox
                      v-model="role.permissions"
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
        style="color: var(--q-primary) !important"
        class="q-px-md q-ml-md"
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
import useACL from "src/composables/useACL";
import Utils from "src/helpers/Utils";
import { useI18n } from "vue-i18n";
import { includes, toLength } from "lodash";
import Loading from "src/components/Shared/Loading.vue";
const emit = defineEmits(["onClose", "onAdded"]);
const { t } = useI18n();

const $q = useQuasar();
const { saving, addRole, getAllPermissions } = useACL();
const permissions = ref({});
const splitterModel = ref(30);
const tab = ref("");
const selectAll = ref(false);
const subSelectAll = ref({
  select: false
})
const role = ref({
  name: "",
  description: "",
  permissions: [],
});
const isLoading = ref(true);
initPermissions();

watch(selectAll, (newValue, _) => {
  if (newValue) {
    let iIndxe  = 0
    for (const [key, value] of Object.entries(permissions.value)) {
      subSelectAll.value['select-'+iIndxe] = true
      iIndxe++
      value.forEach((p) => {
        role.value.permissions.push(p.id);
      });
    }
  } else {
    let iIndxe  = 0
    for (const [key, value] of Object.entries(permissions.value)) {
      subSelectAll.value['select-'+iIndxe] = false
      iIndxe++
    }
    role.value.permissions = [];
  }
});
// watch(subSelectAll, (newValue, _) => {
//   if (newValue) {
//     for (const [key, value] of Object.entries(permissions.value)) {
//       value.forEach((p) => {
//         role.value.permissions.push(p.id);
//       });
//     }
//   } else {
//     role.value.permissions = [];

//   }
// });
const onChangeSelect = (item, index) => {
  // console.log(subSelectAll.value['select-'+index])
  if(subSelectAll.value['select-'+index] == true){
    item.forEach((p) => {
        role.value.permissions.push(p.id);
    });
  } else {
    let newPermistion = []

    item.forEach((p) => {
      newPermistion.push(p.id)
    })
     role.value.permissions = role.value.permissions.filter(id => !newPermistion.includes(id))
  }
  console.log(role.value.permissions);
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
  let i = 0
  for (const property in permissions.value) {
    subSelectAll.value['select-'+i] = false;
    i++
  }
  tab.value = Object.keys(permissions.value)[0];
  isLoading.value = false;
}

async function onSubmit() {
  if (role.value.permissions.length === 0) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey("Please select permissions for the role")),
    });
    return;
  }

  try {
    await addRole(role.value);
    emit("onAdded");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
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
