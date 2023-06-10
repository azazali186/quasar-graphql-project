<template>
  <q-btn
    dense
    round
    unelevated
    :icon="props.icon"
    color="accent"
    :disable="props.disable"
    @click="emit('click')"
  >
    <q-tooltip v-if="props.tooltipText">{{ $t(Utils.getKey(props.tooltipText)) }}</q-tooltip>
  </q-btn>
</template>

<script setup>
import Utils from '../../helpers/Utils'

const props = defineProps({
  disable: Boolean,
  tooltipText: String,
  icon: {
    type: String,
    default: 'mdi-plus',
  }
});

const emit = defineEmits(["click"]);
</script>
