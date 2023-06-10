<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Language")) }}</span>
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
        v-model="language.name"
        :label="$t(Utils.getKey('Name'))"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val =>  Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
        ]"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        :autofocus="true"
        v-model="language.locale"
        :label="$t(Utils.getKey('Locale'))"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val =>  Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
        ]"
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        :autofocus="true"
        v-model="language.locale_web"
        :label="$t(Utils.getKey('Locale Web'))"
        dense
        outlined
        maxlength="20"
        lazy-rules
        :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val =>  Utils.containsOnlyCharacter(val) || $t(Utils.getKey('only character')),
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import useLanguage from "src/composables/useLanguage";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useLanguage();
const language = ref({
  name: "",
  locale: "",
});

async function onSubmit() {
  try {
    if(!Utils.containsOnlyCharacter(language.value.name)  ||  !Utils.containsOnlyCharacter(language.value.locale)){
      // $q.notify({
      //   position: "top-right",
      //   type: "negative",
      //   icon: "fas fa-check",
      //   message: t(Utils.getKey("only character")),
      // });
      return ;
    }
    await add(language.value);
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
      message:t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>

<style></style>
