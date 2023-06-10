<template>
  <q-card :style="{ width: '400px', minHeight: '150px' }">
    <q-bar class="bg-primary text-white">
      <q-icon
        name="fas fa-exclamation-triangle"
        color="warning"
        text-color="white"
      />
      <div>{{ $t(Utils.getKey(title)) }}</div>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        :disable="deleting"
        @click="emit('cancel')"
      >
        <q-tooltip>{{ $t(Utils.getKey('Close')) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="row items-center">
      <span class="q-ml-sm">{{ $t(Utils.getKey(message)) }}</span>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        dense
        v-if="!hideCancel"
        flat
        :label="$t(Utils.getKey('Cancel'))"
        :disable="props.deleting"
        color="black"
        @click="emit('cancel')"
      />
      <q-btn
        dense
        :disable="props.deleting"
        color="negative"
        @click="emit('confirm')"
      >
        <template v-if="props.deleting">
          <q-spinner-grid color="white" size="xs" />
        </template>
        <template v-else> {{ buttonLabel ?? $t(Utils.getKey("Delete")) }} </template>
      </q-btn>
    </q-card-actions>
  </q-card>

  <!-- <q-inner-loading :showing="deleting" style="width:100%">
    <q-spinner-grid color="primary" size="xl" />
  </q-inner-loading> -->
</template>

<script setup>
import Utils from "../../helpers/Utils"

const props = defineProps({
  buttonLabel: String,
  message: String,
  deleting: Boolean,
  title: {
    type: String,
    default: 'Confirm'
  },
  hideCancel: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<style></style>
