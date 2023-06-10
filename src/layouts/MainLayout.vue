<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="bg-accent pl-0 text-theme">
        <q-btn flat round dense :class="!leftDrawerOpen ? 'ml-5' : ''" icon="mdi-menu" aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          {{
            $t(Utils.getKey($route.meta.caption))
            ? $t(Utils.getKey($route.meta.caption))
            : $t(Utils.getKey($route.meta.subtitle))
          }}
        </q-toolbar-title>
        <q-select v-model="locale" :options="localeOptions" :label="$t(Utils.getKey('Language'))" dense emit-value
          class="select_dark" map-options option-label="name" option-value="locale_web" options-dense outlined :style="{
            minWidth: '120px',
            borderRadius: '3px',
            color: '#000',
          }" />
        <q-btn @click="showConfirm = true" flat round dense icon="mdi-account-key-outline" class="q-mx-sm">
          <q-tooltip>{{ $t(Utils.getKey("Change password")) }}</q-tooltip>
        </q-btn>

        <q-btn flat round dense icon="mdi-logout" @click="logout">
          <q-tooltip>{{ $t(Utils.getKey("Logout")) }}</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" :class="
      $q.dark.isActive
        ? 'q-px-md q-pb-md bg-grey-10'
        : 'q-px-md q-pb-md bg-grey-1'
    " style="background:#f5efeb !important; font-weight: 600; padding-right: 0px; border-right:none !important;">
      <q-list class="row branding" @click="dashboard" style="cursor: pointer">
        <q-item class="col-12 logo-wrapper text-center">
          <q-item-section>
            <!-- <q-img src="~/assets/logo.png" :style="{ maxWidth: '97px', margin: 'auto' }" /> -->
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator />
      <q-list>
        <q-item to="/" clickable active-class="active-menu-link" class="q-py-none q-my-md nav-item-wrapper" exact>
          <q-item-section avatar>
            <q-icon name="mdi-desktop-mac-dashboard" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(Utils.getKey("Dashboard")) }}</q-item-label>
          </q-item-section>
        </q-item>
        <template v-for="(modul, key, j) in navItems">
          <template v-if="modul.permissions.some((p) => permissions.includes(p))">
            <div :key="j">
              <q-expansion-item v-if="modul.children.length > 0" :label="$t(Utils.getKey(modul.label))"
                class="q-my-sm side_menu" :header-style="{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }" :default-opened="!hideCollaps.includes(modul.label)" :content-inset-level="0.2">
                <template v-for="(item, i) in modul.children" :key="i">
                  <menu-items v-if="item.permissions.some((p) => permissions.includes(p))" :key="key + '-' + i"
                    :label="item.label" :icon="item.icon" :to="item.to" @click="menuClick(item.to)" />
                </template>
              </q-expansion-item>

              <q-item v-if="modul.children.length === 0 && modul.permissions.some((p) => permissions.includes(p))" exact
                clickable active-class="active-menu-link" class="q-py-none q-my-md nav-item-wrapper" :to="modul.to">
                <q-item-section avatar>
                  <q-icon :name="modul.icon" size="xs" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ $t(Utils.getKey(modul.label)) }}</q-item-label>
                </q-item-section>
              </q-item>

            </div>
          </template>
        </template>
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-dialog v-model="showConfirm" position="top" persistent>
        <RestPassword @onClose="showConfirm = false" />
      </q-dialog>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { store } from '../store/store'
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ref, computed, watch, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import auth from "../store/auth";
import MenuItems from "components/Menu/Items";
import navItems from "components/Menu/nav-items";
// import RestPassword from "components/User/RestPassword"
import useLanguage from "../composables/useLanguage";
import useStore from '../composables/useStore'
import Utils from "src/helpers/Utils";
import { i18n } from "src/boot/i18n";
const $q = useQuasar();
const { all } = useLanguage();
const { locale } = useI18n({ useScope: "global" });
const router = useRouter();
const localeOptions = ref([]);
const leftDrawerOpen = ref(false);
const hideCollaps = ref([
  'Logs',
  'System Settings',
  'Admin Management',
  'Shipment Management',
  'Transaction Management',
])
const permissions = computed(() => {
  if (auth.state.user) {
    return auth.state.user.permissions
  }
  return []

});
const showConfirm = ref(false)

getLanguages();

watch(leftDrawerOpen, (newValue, _) => {
  store.leftDrawerOpen = leftDrawerOpen.value
  //  alert('home')
});
watch(locale, (newValue, _) => {
  document.title = i18n.global.t(
    Utils.getKey("One Shop")
  );
  localStorage.setItem("locale", newValue);
});

async function getLanguages() {
  try {
    const response = await all();
    localeOptions.value = response.data;
  } catch (error) { }
}

const logout = async () => {
  try {
    await auth.logout();
    router.push("/auth/login");
  } catch (error) {
  }
};
const isSame = ref('')
const menuClick = (link) => {
  store.menuSelect += 1
  if (store.menuSelect > 1) {
    store.isOne = false
  }
}

const dashboard = () => {
  router.push("/");
};
onMounted(() => {
  if (!auth.state.user) {
    router.push({ name: 'Page: Login' });
  }
})
document.title = i18n.global.t(
  Utils.getKey("One Shop")
);
</script>
