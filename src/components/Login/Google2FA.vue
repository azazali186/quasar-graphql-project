<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '600px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("")) }}</span>
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

    <q-card-section class="text-center">
      <span>{{
        $t(
          Utils.getKey(
            "Please open Google Authenticator App and scan the QR code"
          )
        )
      }}</span>
    </q-card-section>

    <q-card-section class="text-center q-pt-none">
      <div v-html="g2faData.qr_image"></div>
    </q-card-section>

    <q-card-section>
      <div>
        {{
          $t(
            Utils.getKey(
              "Please enter the CODE generated on your Google Authenticator App"
            )
          )
        }}
      </div>
      <q-input
        v-model="code"
        autofocus
        :disable="loading"
        outlined
        dense
        :placeholder="$t(Utils.getKey('Enter Code'))"
        lazy-rules
        :rules="[
          (val) =>
            Number.isInteger(val) || $t(Utils.getKey('Please Enter Code')),
        ]"
        :maxlength="6"
        :oninput="(evt) => Utils.onlyPostiveInteger(evt, true)"
      />
    </q-card-section>

    <q-card-section class="text-center q-mt-md">
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
        >{{ $t(Utils.getKey("Confirm")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useUser from "src/composables/useUser";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, verifyCode } = useUser();
const g2faData = ref({ ...props.data });
const code = ref("");

async function onSubmit() {
  try {
    const response = await verifyCode({
      code: code.value,
      name: g2faData.value.name,
      secret_key: g2faData.value.secret_key,
    });

    console.log(response);
    emit("onClose");

    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("Code Verified")),
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
