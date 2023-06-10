<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Edit Whitelist IP"))
      }}</span>
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
        v-model="whitelistIP.address"
        :label="$t(Utils.getKey('IP Address'))"
        dense
        outlined
        lazy-rules
        maxlength="20"
        :oninput="(evt) => Utils.validateIP(evt)"
        :rules="[
          (val) => val.length || $t(Utils.getKey('Please enter IP Address')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        type="textarea"
        :autofocus="true"
        v-model="whitelistIP.remarks"
        :label="$t(Utils.getKey('Remarks'))"
        dense
        outlined
        autogrow
        :rules="[
          (val) => val.length || $t(Utils.getKey('Please enter remarks')),
        ]"
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
import { ref, inject } from "vue";
import { useQuasar } from "quasar";
import useWhitelistIP from "src/composables/useWhitelistIP";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const auth = inject("auth");
const $q = useQuasar();
const { saving, update } = useWhitelistIP();
const whitelistIP = ref({ ...props.data });

async function onSubmit() {
  try {
    await update(whitelistIP.value.id, whitelistIP.value);
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
      message: t(Utils.getKey(err)),
    });
  }
}
</script>

<style></style>
