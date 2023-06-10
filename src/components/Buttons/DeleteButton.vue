<template>
  <q-btn
    dense
    round
    unelevated
    color="red-7"
    :class="props.class"
    :disable="props.disable"
    @click="emit('click')"
    icon="mdi-trash-can"
  >
    <q-tooltip v-if="props.tooltipText">{{$t(Utils.getKey( props.tooltipText)) }}</q-tooltip>
  </q-btn>
</template>

<script setup>
import Utils from '../../helpers/Utils'

const props = defineProps({
  disable: Boolean,
  tooltipText: String,
  class: String,
});

const emit = defineEmits(["click"]);
</script>
