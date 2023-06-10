<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Update password")) }}</span>
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
        v-model="user.current_password"
        :autofocus="true"
        :label="$t(Utils.getKey('current_password'))"
        dense
        outlined
        maxlength="15"
        lazy-rules
        :rules="[val => !!val || $t(Utils.getKey('Field is required'))]"
      />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-input
        :type="showPassword.password ? 'text' : 'password'"
        v-model="user.password"
        :label="$t(Utils.getKey('new password'))"
        dense
        outlined
        maxlength="15"
        lazy-rules
        :rules="[
        val => !!val || $t(Utils.getKey('Field is required')),
        val => val.length > 5 || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
        val =>  !Utils.containsOnlyNumbers(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
        val =>  !Utils.containsOnlyCharacter(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
        val =>  Utils.containsNumbersAndCaracter(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers'))
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="showPassword.password ? 'fas fa-eye' : 'fas fa-eye-slash'"
            size="xs"
            @click="showPassword.password = !showPassword.password"
          />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section class="q-pt-none">
        <q-input
        :type="showPassword.confirm ? 'text' : 'password'"
        v-model="user.confirm"
        :label="$t(Utils.getKey('confirm password'))"
        dense
        outlined
        maxlength="15"
        lazy-rules
        :rules="[
          val => !!val || $t(Utils.getKey('Field is required')),
          val => val.length > 5 || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
          val =>  !Utils.containsOnlyNumbers(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
          val =>  !Utils.containsOnlyCharacter(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
          val =>  Utils.containsNumbersAndCaracter(val) || $t(Utils.getKey('Must in between 6 to 15 characters and numbers'))
          ]">
           <template v-slot:append>
          <q-icon
            :name="showPassword.confirm ? 'fas fa-eye' : 'fas fa-eye-slash'"
            size="xs"
            @click="showPassword.confirm = !showPassword.confirm"
          />
        </template>
        </q-input>
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
        class="q-px-md q-ml-md"
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("update")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useUser from "src/composables/useUser";
import Utils from "../../helpers/Utils";
import auth from "src/store/auth";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["onClose", "onUpdated"]);
const { t } = useI18n();
const $q = useQuasar();
const { saving, updatePassword } = useUser();
const showPassword = ref({
  password: false,
  confirm: false
})
const user = ref({
  ...auth.state.user,
  current_password: '',
  confirm: ''
});

const onSubmit = async () => {
  console.log('auth', auth.state.user)
    try {
    console.log('user=', user)
    if(user.value.password == '' || user.value.current_password == '' || user.value.confirm == ''){
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message:t(Utils.getKey('field is required')),
      });
      return
    }
    console.log('contain number',Utils.containsNumbersAndCaracter(user.value.password))
    // if(Utils.containsNumbersAndCaracter(user.value.password)){
    //   return
    // }
    if(user.value.password.length < 6 || !Utils.containsNumbersAndCaracter(user.value.password) ||  Utils.containsOnlyNumbers(user.value.password) || Utils.containsOnlyCharacter(user.value.password) ){
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message:t(Utils.getKey('Must in between 6 to 15 characters and numbers')),
      });
      return
    }
   if(user.value.password != user.value.confirm){
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message:t(Utils.getKey('new password and confirm password incorrect')),
      });
      return
    }
    let result = await updatePassword(user.value.id, { ...user.value });
    if(result.data.status){
      $q.notify({
        position: "top",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
      emit("onClose");
    } else {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message:t(Utils.getKey('Current password is incorrect')),
      });
    }

  } catch (err) {
    $q.notify({
      position: "top",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message:t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>
