import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { apolloClients } from "../boot/apollo";
import Utils from "../helpers/Utils";

export default function useACL() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    permissions: [],
    roles: [],
  });

  const roleColumns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "name",
      label: "NAME",
      required: true,
      field: (row) => row.name.toUpperCase(),
      align: "center",
      sortable: true,
    },
    {
      name: "description",
      label: "DESCRIPTION",
      required: true,
      field: (row) => row.description,
      align: "center",
      sortable: true,
    },
    {
      name: "created_at",
      label: "CREATED AT",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const permissionColumns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
      sortable: false,
    },
    {
      name: "name",
      label: "NAME",
      required: true,
      field: (row) => row.name,
      align: "center",
      sortable: true,
    },
    {
      name: "roles",
      label: "ROLES",
      required: false,
      field: (row) => row,
      align: "center",
    },
    {
      name: "guard_name",
      label: "GUARD",
      required: false,
      field: (row) => row.guard_name,
      align: "center",
      sortable: true,
    },
    {
      name: "created_at",
      label: "CREATED AT",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
  ];

  const addRole = async (data) => {
    try {
      state.saving = true;
      await api.post("/roles", data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updateRole = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/roles/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const deleteRole = async (id, params = "") => {
    try {
      state.deleting = true;
      await api.delete(`/roles/${id}?${params}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const getRole = async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getPermission = async (id) => {
    try {
      const response = await api.get(`/permissions/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const paginateRoles = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/roles/paginate", { params });
      state.roles = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getAllRoles = async () => {
    try {
      const response = await api.get("/roles/all");
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const paginatePermissions = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    try {
      const response = await api.get("/permissions/paginate", { params });
      state.permissions = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getAllPermissions = async () => {
    try {
      const response = await api.get("/permissions/all");
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  return {
    ...toRefs(state),
    roleColumns,
    permissionColumns,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    getPermission,
    paginateRoles,
    getAllRoles,
    paginatePermissions,
    getAllPermissions,
  };
}
