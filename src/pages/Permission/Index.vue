<template>
  <q-page>
    <q-card style="margin-top:20px; margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
          color="primary"
          :loading="loading"
          :rows="permissions"
          row-key="id"
          :columns="permissionColumns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          @row-click="onRowClick"
          @row-dblclick="onRowDblClick"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.name"
              :placeholder="$t(Utils.getKey('Search'))"
              style="width: 300px"
            />
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
          </template>
          <!-- header column -->
          <template v-slot:header-cell="props">
            <q-th :props="props">
              {{
                props.col.label === "#"
                  ? props.col.label
                  : $t(Utils.getKey(props.col.label))
              }}
            </q-th>
          </template>
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-roles="props">
            <q-td class="text-center">
              {{ getRolesName(props.row) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>
  </q-page>
</template>

<script setup>
import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import { onMounted, reactive } from "vue";
import useTable from "../../composables/useTable";
import useACL from "../../composables/useACL";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";

const { loading, permissionColumns, permissions, paginatePermissions } =
  useACL();
const {
  pagination,
  onRequest,
  onRefresh,
  onRowClick,
  onRowDblClick,
  onDelete,
} = useTable(paginatePermissions);

const filters = reactive({
  name: "",
});

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "name",
    },
    filter: undefined,
  });
});

const getRolesName = (row) => {
  return row.roles.map((role) => role.name.toUpperCase()).join(", ");
};
const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
