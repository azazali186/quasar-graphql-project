<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { provide, computed, ref } from "vue";
import { useMeta } from "quasar";
import { useI18n } from "vue-i18n";
import { ElConfigProvider } from "element-plus";
import auth from "./store/auth";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import km from "element-plus/dist/locale/km.mjs";
import Utils from "./helpers/Utils";

const { t, locale } = useI18n({ useScope: "global" });

const elLocale = computed(() => {
  console.log(locale.value);
  switch (locale.value) {
    case "en":
      return en;
    case "ch":
      return zhCn;
    case "kh":
      return km;
    default:
      return en;
  }
});

const title = computed(() =>
  t(Utils.getKey("Malaysia Lottery-Management System"))
);

useMeta(() => {
  return {
    title: title.value,
  };
});

provide("auth", auth);
provide("locale", locale);
</script>
