import auth from "../store/auth";
import moment from "moment";
import {i18n} from '../boot/i18n'
const { t } = i18n.global

class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = ''; // set the name property to identify the error type
  }
}
export default class Utils {
  static getErrorMessage(err) {
    console.log(err.response.data.messages);
    if (err.response) {
      if (err.response.data.messages) {
        return new CustomError(t(err.response.data.messages[0]))  ;
      }
      return new CustomError(t(err.response.data.message));
    }

    return new CustomError(t(err.toString()))
  }

  static canAccess(permittedRoles) {
    let roleExists = auth.state.roles.filter((role) =>
      permittedRoles.includes(role)
    );
    return roleExists.length > 0;
  }

  static hasPermissions(requiredPermissions) {
    let permissions = auth.state.user.permissions.filter((permission) => {
      return requiredPermissions
        .map((p) => p.toLowerCase())
        .includes(permission.toLowerCase());
    });

    return permissions.length > 0;
  }

  static formatCurrency(amount, currency = "USD", locale = "en") {
    return new Intl.NumberFormat(locale, {
      // style: "currency",
      // currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  static getKey(string) {
    return string
      ? string.toString()
          .toLowerCase()
          .trim()
          .replaceAll(/[^a-zA-Z0-9 ]/g, " ")
          .replaceAll(" ", "_")
      : "Q";
  }


  static dateTranslation(type) {
    switch (type) {
      case "days":
        return [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
      case "daysShort":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      case "monthsShort":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      case "months":
        return [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
    }
  }

  static randomString = (length) => {
    let chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let output = "";
    for (let x = 0; x < length; x++) {
      let i = Math.floor(Math.random() * 62);
      output += chars.charAt(i);
    }
    return output;
  };

  static onlyPostiveInteger(evt, canStartWithZero = false, length = 12) {
    let pattern = /^\d*[0-9]\d*$/;

    if (!pattern.test(evt.target.value)) {
      if (!canStartWithZero) {
        evt.target.value = 0;
      } else {
        evt.target.value = "";
      }
      //  canStartWithZero ? 0 : "";
    }
    // else {
    //   evt.target.value = canStartWithZero
    //     ? evt.targets.value
    //     : parseInt(evt.target.value);
    // }
    if (evt.target.value.length > length) {
      evt.target.value = evt.target.value.slice(0, length);
    }
  }

  static onlyPostiveIntegerEmpty(evt, canStartWithZero = false, length = 12) {
    let pattern = /^\d*[0-9]\d*$/;

    if (!pattern.test(evt.target.value)) {
      if (!canStartWithZero) {
        evt.target.value = 0;
      } else {
        // evt.target.value = "";
      }
      //  canStartWithZero ? 0 : "";
    } else {
      evt.target.value = canStartWithZero
        ? evt.targets.value
        : parseInt(evt.target.value);
    }
    if (evt.target.value.length > length) {
      evt.target.value = evt.target.value.slice(0, length);
    }
  }

  static numberValidation = (event, length = 4) => {
    if (event.target.value.length > length) {
      event.target.value = event.target.value.slice(0, length);
    } else {
      event.target.value = event.target.value.replace("-", "");
      event.target.value = event.target.value.replace(".", "");
    }
  };

  static clipboard = (val) => {
    navigator.clipboard.writeText(val);
  };

  static validationSpecailCaracter(evt, space = true) {
    let pattern = /^[a-zA-Z0-9 ._-]*$/;
    if (!space) {
      pattern = /^[a-zA-Z0-9._-]*$/;
    }
    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }

  static validationSpecailCaracter2(evt, space = true) {
    let pattern = /^[a-zA-Z0-9-]*$/;
    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }

  static validationOnlyNumber(val) {
    let pattern = /^[0-9]*$/;
    if (!pattern.test(val)) {
      return true
    }
    return false
  }
  //Only numbers are allowed carriers
  static validationOnlyNumberEvent(evt, space = true) {
    let pattern = /^[0-9]*$/;
    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }
  // only numbers are allowed for ISO
  static validationOnlyNumberForIso(evt, space = true) {
    let pattern = /^[+0-9]*$/;
    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }

  static validationNumberAndCaracter(evt, space = false) {
    let pattern = /^[a-zA-Z0-9 ]*$/;
    if (!space) {
      pattern = /^[a-zA-Z0-9]*$/;
    }
    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }

  static isNoSpecailCharacter(val) {
    let pattern = /^[a-zA-Z0-9-]*$/;
    if (!pattern.test(val)) {
      return true
    }
    return false
  }

  static formatRangePickerDate(d) {
    if (!d) return "";

    return d.map((t, i) =>
      i === 0
        ? moment(t).startOf("day").format("YYYY-MM-DD HH:mm")
        : moment(t).endOf("day").format("YYYY-MM-DD HH:mm")
    );
  }

  static filterDropdownOptions(options, value, updateFn, searchField = "") {
    let filtered = [];

    if (value === "") {
      updateFn(() => {
        return options;
      });

      return options;
    }

    updateFn(() => {
      filtered = options.filter((item) => {
        if (searchField === "") {
          return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }

        return (
          item[searchField].toLowerCase().indexOf(value.toLowerCase()) > -1
        );
      });
    });

    return filtered;
  }

  static validateIP(evt) {
    let pattern = /^[A-Z0-9.*]*$/;

    if (!pattern.test(evt.target.value)) {
      evt.target.value = evt.target.value.slice(0, evt.target.value.length - 1);
    }
  }

  static throttle = (fn, delay, pause = false, override = false) => {
    console.log("throttle");
    let lastTime = 0;

    return (...args) => {
      let now = moment();

      if (pause) return;

      console.log(now, lastTime);
      if (now - lastTime < delay && !override) return;

      console.log("throttle called");

      lastTime = now;
      fn(...args);
    };
  };

  static  containsNumbersAndCaracter = (str) => {
    let pattern = /^[a-zA-Z0-9]*$/;
    return Boolean(pattern.test(str));
  }

  static  containsOnlyNumbers = (str) => {
    return /^\d+$/.test(str);
  }
  static  containsOnlyCharacter = (str) => {
    return  /^[a-zA-Z]*$/.test(str);
  }

  static  containsOnlyCharacter2 = (str) => {
    return  str.replace(/[^a-zA-Z ]/g, "").replace(/[0-9]/g, "");
  }

  static  containsOnlyNumber2 = (str) => {
    return  str.replace(/[a-zA-Z]+/ig, '');

  }

  static containsOnlyNumber3 = (str) => {
    return str.replace(/[^a-zA-Z]/g, '');
  }

}
