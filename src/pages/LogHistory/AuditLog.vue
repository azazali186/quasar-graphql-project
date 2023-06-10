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
          :selected="selected"
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <el-date-picker
              class="q-mt-xs q-mr-sm input_whiteF"
              v-model="filters.dates"
              type="daterange"
              :range-separator="$t(Utils.getKey('To'))"
              :start-placeholder="$t(Utils.getKey('Start date'))"
              :end-placeholder="$t(Utils.getKey('End date'))"
              value-format="YYYY-MM-DD"
            />

            <q-select
              class="q-mr-sm q-mt-xs"
              v-model="filters.user_id"
              :options="users"
              outlined
              dense
              clearable
              emit-value
              map-options
              option-value="id"
              option-label="name"
              use-input
              @filter="filterUsers"
              :label="
                filters.user_id
                  ? $t(Utils.getKey('User'))
                  : $t(Utils.getKey('Select User'))
              "
              style="width: 230px"
            />
            <q-select
              class="q-mr-sm q-mt-xs"
              v-model="filters.event"
              :options="actionsItem"
              outlined
              dense
              clearable
              use-input
              @filter="filterAction"
              :label="
                filters.event
                  ? $t(Utils.getKey('Action'))
                  : $t(Utils.getKey('Select Action'))
              "
              style="width: 200px"
            />
            <q-select
              class="q-mr-sm q-mt-xs"
              v-model="filters.auditable_type"
              :options="models"
              outlined
              dense
              emit-value
              map-options
              option-value="key"
              option-label="value"
              use-input
              @filter="filterModel"
              clearable
              :label="
                filters.auditable_type
                  ? $t(Utils.getKey('Model'))
                  : $t(Utils.getKey('Select Model'))
              "
              style="width: 280px"
            />
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
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
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <template v-slot:body-cell-new_values="props">
            <q-td class="text-center">
              <q-chip class="cursor-pointer q-ma-none" clickable>
                {{ $t(Utils.getKey("View Details")) }}
                <q-tooltip
                  :style="{
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    breakWord: 'break-all',
                  }"
                  max-width="700px"
                >
                  <div class="row" :style="{ minWidth: '400px' }">
                    {{ getAuditableName(props.row.auditable_type) }} ID:
                    {{ props.row.auditable_id }}
                  </div>
                  <q-separator />

                  <div class="row" :style="{ minWidth: '600px' }">
                    <div class="col-6">
                      <div class="">{{ $t(Utils.getKey("OLD VALUES")) }}</div>
                      <q-separator />
                      <template
                        v-for="(value, key, i) in props.row.old_values"
                        :key="i"
                      >
                        <div v-if="key == 'content'">
                          {{ $t(Utils.getKey(key)) }} :
                          <span v-html="JSON.parse(value).en"></span>
                        </div>
                        <div v-else>
                          {{ $t(Utils.getKey(key)) }} : {{ value }} <br />
                        </div>
                      </template>
                    </div>
                    <div class="col-6">
                      <div class="">{{ $t(Utils.getKey("NEW VALUES")) }}</div>
                      <q-separator />
                      <template
                        v-for="(value, key, i) in props.row.new_values"
                        :key="i"
                      >
                        <div v-if="key == 'content'">
                          {{ $t(Utils.getKey(key)) }} :
                          <span v-html="JSON.parse(value).en"></span>
                        </div>
                        <div v-else>
                          {{ $t(Utils.getKey(key)) }} : {{ value }} <br />
                        </div>
                      </template>
                    </div>
                  </div>
                </q-tooltip>
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-user_agent="props">
            <q-td class="text-center">
              <span class="cursor-pointer q-ma-none"
                >{{ getUserAgent(props.row.user_agent) }}
              </span>
            </q-td>
          </template>
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import useTable from "../../composables/useTable";
import useAudit from "../../composables/useAudit";
import useUser from "src/composables/useUser";
import Utils from "../../helpers/Utils";
import _ from "lodash";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";

var uaParser = require("ua-parser-js");
const $q = useQuasar();
const { loading, columns, items, auditModels, paginate } = useAudit();
const { pagination, onRequest, selected } = useTable(paginate);
const { all } = useUser();

let modelsTemp = [];
let userTemp = [];
let actionTemp = ["Created", "Updated", "Deleted"];

const actionsItem = ref(actionTemp);
const users = ref([]);
const models = ref([]);
const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];

const filters = reactive({
  user_id: "",
  event: "",
  auditable_type: "",
  dates: defaultDate,
});

Promise.all([getUsers(), getModels()]);

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
      descending: true,
    },
    filter: { ...filters },
  });
});

async function getUsers() {
  try {
    const response = await all();
    users.value = userTemp = response.data;
  } catch (err) {}
}

async function getModels() {
  try {
    const response = await auditModels();
    models.value = modelsTemp = response.data.map((appModel) => {
      let arr = appModel.auditable_type.split("\\");
      return {
        key: appModel.auditable_type,
        value: arr[arr.length - 1],
      };
    });
  } catch (err) {}
}

const getUserAgent = (uaString) => {
  let parsed = uaParser(uaString);
  let ua = "";

  // if (typeof parsed.device.model !== "undefined") {
  //   ua += `Device: ${parsed.device.model}, `;
  // }

  // if (typeof parsed.os.name !== "undefined") {
  //   ua += `OS: ${parsed.os.name} ${parsed.os.version}, `;
  // }

  // if (typeof parsed.browser.name !== "undefined") {
  //   ua += `Browser: ${parsed.browser.name} ${parsed.browser.version}`;
  // }

  return getDeviceName(parsed.os.name);
};

const getDeviceName = (os) => {
  if (os == undefined || os == null || os == "" || !os) {
    return "N/A";
  }

  let pcs = ["Windows", "Linux", "Unix", "MacOS"];

  if (pcs.includes(os)) {
    return "PC";
  }

  return os;
};

const getAuditableName = (auditableType) => {
  let arr = auditableType.split("\\");
  return arr[arr.length - 1];
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }
};

const filterModel = (val, update) => {
  models.value = Utils.filterDropdownOptions(modelsTemp, val, update, "value");
};

const filterUsers = (val, update) => {
  users.value = Utils.filterDropdownOptions(userTemp, val, update, "name");
};

const filterAction = (val, update) => {
  actionsItem.value = Utils.filterDropdownOptions(actionTemp, val, update);
};
</script>
