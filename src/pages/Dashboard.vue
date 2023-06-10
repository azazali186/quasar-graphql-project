<template>
  <q-page>
    <q-card class="card_container pa-3" style="background: white">
      <!-- Card  -->
      <!-- Card  -->

    </q-card>
  </q-page>
</template>

<script setup>
import { ref, provide, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
// chart

onMounted(async () => {
  //
});
</script>
<style scoped>
.mt_16 {
  margin-top: 16px;
}

@media only screen and (max-width: 912px) {
  .p_small {
    padding: 16px !important;
  }

  .mt_16 {
    margin-top: 0px;
  }
}

.amount_card {
  min-height: 142px;
}

.card_style {
  box-shadow: none;
  height: 400px;
  background: #fff;
  padding: 12px;
}

.card_style_small {
  box-shadow: none;
  height: 146px;
  background: #fff;
  padding: 12px;
}

.card_container {
  margin: 0px;
  margin-left: 0px;
  margin-top: 20px;
  box-shadow: none;
  min-height: 85vh;
  background: #f5efeb;
}

.active_num {
  font-weight: bold;
  position: absolute;
  font-size: 20px;
  z-index: 98;
}

@media screen and (max-width: 912px) {
  .card_style_small {
    box-shadow: none;
    height: auto;
    background: #fff;
    padding: 12px;
  }

  .d_flex_between {
    justify-content: space-around;
  }
}</style>
