<template>
  <q-page padding>
    <q-item>
      <q-item-section class="my-box cursor-pointer q-hoverable">
        <q-item-label>
          {{ userData?.name }}
        </q-item-label>
        <q-item-label caption>ID: {{ userData?.id }}</q-item-label>
        <q-item-label>
          {{ userData?.email }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script>
import { watch, ref } from "vue";
import { useQuery, useResult } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import { useQuasar } from 'quasar'
const $q = useQuasar();

import gql from "graphql-tag";
const userData = ref();


const route = useRoute();

console.log('router     ', useRoute()?.currentRoute?.query?.id)

// let id = route.params.id;
const { result, loading, error, refetch } = useQuery(
  gql`
        query getUser($id: Int!){
          getUser(id: $id) {
            id
            name
            email
        }
        }
      `,
  {
    id: route,
  }
);

userData.value = useResult(result, null, (data) => data.getUser);

watch(
  () => this.$route,
  async (newId) => {
    // id = newId;
    console.log('newId  ', newId)
    refetch({ id: parseInt(newId) });
  }
);

/* export default {
  name: "PageName",

  setup() {

  },
}; */
</script>
