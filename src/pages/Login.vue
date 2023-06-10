// eslint-disable-next-line vue/multi-word-component-names
<template>
  <q-layout>
    <q-page-container class="bg-part-login">
      <div class="fixed-width">
        <div class="two-columns">
          <q-card class="p-3" outlined="0" flat>
            <div>
              <div class="v-align-div">
                <div class="logo-box-heading">
                  <div class="logo-mid">
                    <!-- <q-img src="~assets/logo.png"></q-img> -->
                  </div>
                </div>
              </div>

            </div>

            <q-card-section>
              <label>{{ $t(Utils.getKey("Language")) }}</label>
              <q-select v-model="locale" :options="localeOptions" :label="$t(Utils.getKey('Language'))" dense emit-value
                map-options option-label="name" option-value="locale_web" outlined lazy-rules
                @update:model-value="resetFilters()" :rules="[
                  (val) => val.length || $t(Utils.getKey('Select Language')),
                ]">
                <template v-slot:prepend>
                  <q-icon name="fas fa-language" size="sm" class="q-pr-sm" />
                </template>
              </q-select>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <label>{{ $t(Utils.getKey("Username")) }}</label>
              <q-input autofocus :disable="loading" outlined dense :placeholder="$t(Utils.getKey('Enter User name'))"
                v-model="name" maxlength="30" ref="nameInputRef" :rules="[
                  (val) =>
                    (val && val.length) ||
                    $t(Utils.getKey('Enter User name')),
                ]">
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="sm" class="q-pr-sm" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <label>{{ $t(Utils.getKey("Password")) }}</label>
              <q-input :disable="loading" outlined dense :type="showPassword ? 'text' : 'password'" maxlength="15"
                :placeholder="$t(Utils.getKey('Enter Password'))" v-model="password" ref="passwordInputRef" :rules="[
                  (val) =>
                    (val && val.length) || $t(Utils.getKey('Enter password')),
                ]">
                <template v-slot:prepend>
                  <q-icon name="fas fa-lock" size="sm" class="q-pr-sm" />
                </template>
                <template v-slot:append>
                  <q-icon :name="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" size="xs"
                    @click="showPassword = !showPassword" />
                </template>
              </q-input>
            </q-card-section>
            <div class="row">
              <q-card-section class="col-md-4 col-xs-12">
                <q-input ref="codeInputRef" dense outlined v-model="code" :maxlength="6"
                  :oninput="(evt) => Utils.onlyPostiveInteger(evt, true)" :label="$t(Utils.getKey('Six Digits Code'))"
                  :rules="[
                    (val) =>
                      parseInt(val) || $t(Utils.getKey('Please Enter Code')),
                  ]"></q-input>
              </q-card-section>

              <q-card-section class="col-md-8 col-xs-12">
                <q-btn type="button" dense :label="$t(Utils.getKey('Google Authenticator'))" class="g-auth-btn full-width"
                  @click="onVerify2FA" :disable="loading" />
              </q-card-section>
            </div>

            <q-card-section>
              <q-btn type="submit" :disable="loading" :loading="loading" class="full-width"
                :label="$t(Utils.getKey('Login'))" color="primary" @click="onSubmit" />
            </q-card-section>
          </q-card>
        </div>
      <!-- <div class="half right bg-color-blue-dark">
            <div class="v-align-div">
              <div class="logo-box-heading">
                <div class="logo-mid">
                  <q-img src="~assets/logo-big.png"></q-img>
                </div>
              </div>
            </div>
                  </div> -->
      </div>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="show2FAdialog" persistent>
    <google2-f-a :data="google2faData" @onClose="show2FAdialog = false" />
  </q-dialog>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { apolloClients } from "../boot/apollo";
import { useQuasar } from "quasar";
import Utils from "../helpers/Utils";
import useLanguage from "../composables/useLanguage";
import useUser from "src/composables/useUser";
import Google2FA from "src/components/Login/Google2FA.vue";

const { t, locale } = useI18n({ useScope: "global" });
const { all } = useLanguage();
const { verifyUser2FA, verifyCode, enableGa } = useUser();

const auth = inject("auth");
const $q = useQuasar();
const router = useRouter();
const name = ref("");
const password = ref("");
const nameInputRef = ref(null);
const passwordInputRef = ref(null);
const codeInputRef = ref(null);
const showPassword = ref(false);
const loading = ref(false);
const show2FAdialog = ref(false);
const localeOptions = ref([]);
const google2faData = ref(null);
const code = ref("");

getLanguages();

watch(locale, (newValue, _) => {
  localStorage.setItem("locale", newValue);
  //this.form.reset();
});

async function getLanguages() {
  try {
    const response = await all();
    localeOptions.value = response.data;
  } catch (error) { }
}

async function onVerify2FA() {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();

  if (!nameInputRef.value.hasError && !passwordInputRef.value.hasError) {
    loading.value = true;

    try {
      const response = await verifyUser2FA({
        name: name.value,
        password: password.value,
      });

      google2faData.value = {
        ...response.data,
        name: name.value,
      };

      show2FAdialog.value = true;
      loading.value = false;
    } catch (err) {
      loading.value = false;
      let errorMessage = Utils.getErrorMessage(err);

      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey(errorMessage)),
      });
    }
  }
}

async function onSubmit() {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();

  if (!nameInputRef.value.hasError && !passwordInputRef.value.hasError) {
    loading.value = true;

    try {
      let checkenableGa = await enableGa({ name: name.value });
      if (checkenableGa.data.status) {
        codeInputRef.value.validate();
        if (codeInputRef.value.hasError) {
          loading.value = false;
          return;
        }
        await verifyCode({
          login: true,
          code: code.value,
          name: name.value,
        });
      }
      await apolloClients.query("/sanctum/csrf-cookie");

      const response = await apolloClients.mutate("/auth/login", {
        email: name.value,
        password: password.value,
      });

      auth.setAuth(response.data);
      router.push("/");
      loading.value = false;
    } catch (err) {
      loading.value = false;
      let errorMessage = Utils.getErrorMessage(err);
      console.error(errorMessage, 'errorMessage');
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey(errorMessage)),
      });
    }
  }
}
const resetFilters = () => {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();
  codeInputRef.value.validate();
};
</script>

<style></style>
