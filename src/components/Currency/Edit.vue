<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Currency")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <q-input :autofocus="true" v-model="currency.name" :label="$t(Utils.getKey('Name'))" dense outlined maxlength="20"
        lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val => Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
        ]" />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input :autofocus="true" v-model="currency.code" :label="$t(Utils.getKey('code'))" dense outlined
        maxlength="20" lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val => Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
        ]" />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input :autofocus="true" v-model="currency.symbol" :label="$t(Utils.getKey('symbol'))" dense outlined
        maxlength="20" lazy-rules :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val => Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
        ]" />
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
          $t(Utils.getKey("Cancel"))
      }}</q-btn>
      <q-btn color="accent" class="q-px-md q-ml-md" style="color: var(--q-primary) !important" @click="onSubmit" :disable="saving">{{ $t(Utils.getKey("Save"))
      }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useCurrency from "src/composables/useCurrency";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useCurrency();
const currency = ref({ ...props.data });

async function onSubmit() {
  try {
    if (!Utils.containsOnlyCharacter(currency.value.name) || !Utils.containsOnlyCharacter(currency.value.code)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("only character")),
      });
      return;
    }
    await update(currency.value.id, { ...currency.value });
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

<style>

</style>
