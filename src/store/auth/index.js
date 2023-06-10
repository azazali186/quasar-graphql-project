import { reactive, readonly } from "vue";
import { apolloClients } from "../../boot/apollo";
import gql from 'graphql-tag'

const state = reactive({
  loggedIn: false,
  user: null,
  applicatons: [],
  roles: [],
  permissions: [],
  languages: [],
});

function setAuth(data) {
  state.loggedIn = true;
  state.user = data.user;
  state.user.applications = data.applications;
  state.user.roles = data.roles;
  state.user.permissions = data.permissions.map((p) => p.name);
}

async function checkAuth() {
  try {
    const response = await apolloClients.query('');
    setAuth(response.data);
  } catch (err) {
    await logout();
  }
}

async function logout() {
  try {
    state.loggedIn = false;
    state.user = null;
    await apolloClients.mutate("/auth/logout");
  } catch (err) {
    // Force redirect
    window.location = "/#/auth/login";
  }
}

export default {
  state: readonly(state),
  setAuth,
  checkAuth,
  logout,
};
