<template>
  <router-view />
</template>

<script>

import { defineComponent, provide } from 'vue'
import { ApolloClients } from '@vue/apollo-composable'
import { apolloClients } from 'src/boot/apollo'

export default defineComponent({
  name: 'App',
  setup() {
    provide(ApolloClients, apolloClients)
  },
})
</script>
