import { createI18n } from "vue-i18n";
import messages from "src/i18n";
import { api } from "../boot/axios";

// set locals to local storage
let locale = localStorage.getItem("locale");
localStorage.setItem("locale", locale ? locale : "en");

// Create I18n instance
const i18n = createI18n({
  legacy: false,
  locale: locale,
  globalInjection: true,
  messages,
  async missing(locale, key) {
    var camelCased = key.replace(/_([a-z])/g, function (m, g) { return " " + g[0].toUpperCase(); });
    var value = camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
    var storedMissingTranslation = localStorage.getItem("missingTranslation_" + locale)
    const FormData = require("form-data");
    var formData = new FormData();
    formData.append(key, value);
    if (!storedMissingTranslation) {
      storedMissingTranslation = new Object();
    }
    else {
      storedMissingTranslation = JSON.parse(storedMissingTranslation)
      // console.log(storedMissingTranslation)
    }
    if (!(key in storedMissingTranslation)) {
      storedMissingTranslation[key] = value
      //update missing translation to server
      let obj = {};
      obj[key] = value;
      localStorage.setItem("missingTranslation_" + locale, JSON.stringify(storedMissingTranslation))
      await api.post("/log-admin-dashboard-missing-key?locale=" + locale + "&&data=" + JSON.stringify(obj))
    }
  },
});
export default ({ app }) => {
  // Tell app to use the I18n instance
  app.use(i18n);
};

export { i18n };
