import { useQuasar } from "quasar";
import { reactive, ref, toRefs } from "vue";
import Utils from "src/helpers/Utils";
import { useI18n } from "vue-i18n";

export default function useTable(paginate, trash, bulkTrash) {
  const $q = useQuasar();
  const { t } = useI18n();

  const state = reactive({
    showAdd: false,
    showEdit: false,
    showDelete: false,
    showConfirm: false,
    filters: {},
    selected: [],
  });

  const pagination = ref({
    sortBy: "created_at",
    descending: false,
    page: 1,
    rowsPerPage: 15,
    rowsNumber: 0,
  });

  async function onRequest(props) {
    const { page, rowsPerPage, sortBy, descending } = props.pagination;
    try {
      const response = await paginate(props);
      pagination.value.rowsNumber = response.data.total;
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    } catch (err) {
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: err.toString(),
      });
    }
  }

  function onRefresh() {
    onRequest({
      pagination: pagination.value,
      filter: undefined,
    });
    state.selected = [];
    state.showAdd = false;
    state.showEdit = false;
    state.showDelete = false;
    state.showConfirm = false;
  }

  function onRowClick(evt, row) {
    state.selected = [row];
    state.showEdit = true;
  }

  function onRowDblClick(evt, row) {}

  async function onDelete(type = "Data") {
    let itemIds = state.selected.map((item) => {
      return item.id;
    });

    try {
      if (bulkTrash && itemIds.length > 1) {
        await bulkTrash(itemIds);
      } else {
        try {
          await trash(itemIds[0]);
        } catch (err) {
          //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
        }
      }

      $q.notify({
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey(`${type}(s) deleted successfully`)),
      });
    } catch (err) {
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: err.toString(),
      });
    }

    state.showConfirm = false;
    state.selected = [];
    onRequest({
      pagination: pagination.value,
      filter: undefined,
    });
  }

  return {
    ...toRefs(state),
    pagination,
    onRequest,
    onRefresh,
    onRowClick,
    onRowDblClick,
    onDelete,
  };
}
