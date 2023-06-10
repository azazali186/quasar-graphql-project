<template>
  <q-btn
    flat
    label="Cancel"
    color="grey-7"
    class="submit-button"
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
});

const emit = defineEmits(["click"]);
</script>
