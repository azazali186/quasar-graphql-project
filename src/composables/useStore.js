import { reactive, toRefs, ref } from "vue";
export default function useStore() {
  const state = reactive({
    leftDrawerOpen: false,
  });

  const setLeftDrawer = (value) => {
    state.leftDrawerOpen = true
  }

  return {
    ...toRefs(state),
    setLeftDrawer
  };
}
