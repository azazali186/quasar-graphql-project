import { reactive } from 'vue'

export const store = reactive({
  leftDrawerOpen: false,
  isOne : true,
  menuSelect: 0,
  orderNav: [
    {
      id: 1,
      name: 'Home',
      icon: 'home'
    },
    {
      id: 2,
      name: 'Report',
      icon: 'home'
    },
    {
      id: 3,
      name: 'Detial',
      icon: 'home'
    }
  ]
})
