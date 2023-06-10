<template>
  <q-page>
    <q-card style="margin-top:20px; margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              class="q-mr-sm q-mt-xs"
              dense
              outlined
              debounce="300"
              v-model="filters.address"
              :oninput="(evt) => Utils.validateIP(evt)"
              :placeholder="$t(Utils.getKey('Search'))"
              style="width: 300px"
            />
            <q-select
              class="q-mr-sm q-mt-xs"
              v-model="filters.status"
              :options="statusOptions"
              outlined
              dense
              clearable
              use-input
              :option-label="(name) => $t(Utils.getKey(name))"
              @filter="filterSatus"
              :label="
                filters.status
                  ? $t(Utils.getKey('Status'))
                  : $t(Utils.getKey('Select Status'))
              "
              style="width: 200px"
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
              v-if="Utils.hasPermissions(['Whitelist IP: Create Whitelist IP'])"
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
          <!-- no data -->
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
          <template v-slot:body-cell-logo="props">
            <q-td>
              <q-img
                :src="props.row.logo_url"
                style="max-height: 120px; max-width: 120px"
              >
                <template v-slot:loading>
                  <q-spinner-pie color="primary" />
                </template>
              </q-img>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <div>
                <q-toggle
                  ref="toggleRef"
                  :modelValue="props.row.status"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  :true-value="1"
                  :false-value="0"
                  size="50px"
                  @update:model-value="onToggleClick(props.row)"
                />
                <span>{{
                  props.row.status
                    ? $t(Utils.getKey("Enabled"))
                    : $t(Utils.getKey("Disabled"))
                }}</span>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="
                  Utils.hasPermissions([
                    'Whitelist IP: Edit/Update Whitelist IP',
                  ])
                "
                class="q-ml-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{
                  $t(Utils.getKey("Edit"))
                }}</q-tooltip>
              </q-btn>
              <q-btn
                v-if="
                  Utils.hasPermissions(['Whitelist IP: Delete Whitelist IP'])
                "
                class="q-ml-sm"
                size="xs"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip
                  >{{ $t(Utils.getKey("Delete")) }}
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <AddIP @onClose="showAdd = false" @onAdded="onRefresh" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <EditIP
        :data="selectedIp"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showStatusConfirm" persistent>
      <Confirm
        :message="`Are you sure you want to ${
          selectedIp.status === 1 ? 'disable' : 'enable'
        } this IP`"
        @cancel="showStatusConfirm = false"
        @confirm="onChangeStatus()"
        :deleting="deleting"
        :button-label="$t(Utils.getKey('Confirm'))"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this IP"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import useTable from "../../composables/useTable";
import useWhitelistIP from "../../composables/useWhitelistIP";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddIP from "../../components/WhitelistIP/Add.vue";
import EditIP from "../../components/WhitelistIP/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const $q = useQuasar();
const { loading, columns, items, update, paginate, trash } = useWhitelistIP();
const {
  showAdd,
  showEdit,
  showConfirm,
  deleting,
  pagination,
  selected,
  onRequest,
  onRefresh,
  onDelete,
} = useTable(paginate, trash);
const showStatusConfirm = ref(false);
const toggleRef = ref(null);
const selectedIp = ref();

let tempStatus = ["Enabled", "Disabled"];
const statusOptions = ref(tempStatus);

const filters = reactive({
  address: "",
  status: "",
});

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
    },
    filter: undefined,
  });
});

async function onChangeStatus() {
  try {
    await update(selectedIp.value.id, {
      ...selectedIp.value,
      status: selectedIp.value.status === 1 ? false : true,
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  } finally {
    showStatusConfirm.value = false;
    onRefresh();
  }
}

const onToggleClick = (row) => {
  showStatusConfirm.value = true;
  selectedIp.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [];
  selected.value.push(row);
};

const onEditClick = (row) => {
  showEdit.value = true;
  selectedIp.value = row;
};
const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }
};

const filterSatus = (val, update) => {
  statusOptions.value = Utils.filterDropdownOptions(tempStatus, val, update);
};
</script>
