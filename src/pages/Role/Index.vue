<template>
  <q-page>
    <q-card style="margin-top:20px; margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
          color="primary"
          :loading="loading"
          :rows="roles"
          row-key="id"
          :columns="roleColumns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          v-model:selected="selected"
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
            <q-space />
            <add-button
              v-if="Utils.hasPermissions(['Role: Create Role'])"
              :disable="loading"
              @click="showAdd = true"
              tooltip-text="Add"
              color="primary"
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
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="
                  props.row.name !== 'super admin' &&
                  Utils.hasPermissions(['Role: Edit/Update Role'])
                "
                class="q-ml-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  props.row.name !== 'super admin' &&
                  Utils.hasPermissions(['Role: Delete Role'])
                "
                class="q-ml-sm"
                size="xs"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-role @onClose="showAdd = false" @onAdded="onRefresh" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-role
        :role="selectedRole"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showDelete" position="top" persistent>
      <delete-role
        :role="selectedRole"
        @onClose="showDelete = false"
        @onDelete="onRefresh"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useACL from "../../composables/useACL";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddRole from "../../components/Role/Add.vue";
import EditRole from "../../components/Role/Edit.vue";
import DeleteRole from "../../components/Role/Delete.vue";

const { loading, roleColumns, roles, paginateRoles } = useACL();
const {
  showAdd,
  showEdit,
  showDelete,
  selected,
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginateRoles);

const selectedRole = ref();
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

const onEditClick = (row) => {
  showEdit.value = true;
  selectedRole.value = row;
};

const onDeleteClick = (row) => {
  showDelete.value = true;
  selectedRole.value = row;
};
const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
