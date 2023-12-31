export default {


  calalogue_management: {
    label: "catelogue",
    icon: "mdi-shape-outline",
    to: { name: "catelogue" },
    permissions: [
      "Category: View Category",
      "Category: Create Category",
      "Category: Edit/Update Category",
      "Category: Delete Category",
      "Product: View Product",
      "Product: Create Product",
      "Product: Edit/Update Product",
      "Product: Delete Product",
      "Tag: View Tag",
      "Tag: Create Tag",
      "Tag: Edit/Update Tag",
      "Tag: Delete Tag",
    ],
    children: []
  },
  deal_management: {
    label: "Deal Management",
    permissions: [
      "Deal: View Deal",
      "Deal: Create Deal",
      "Deal: Edit/Update Deal",
      "Deal: Delete Deal",
      "Deal: Extend/Time Deal",
      "Winner: Create Winner",
      "Order: View Order",
      "Payment: Create Payment",
      "Order: Edit/Update Order",
      "Order: Delete Order",
      "Order: Views Order",
      "PrizeClaim: View PrizeClaim",
      "PrizeClaim: Views PrizeClaim",
      "PrizeClaim: Create PrizeClaim",
      "PrizeClaim: Edit/Update PrizeClaim",
    ],
    children: [
      {
        label: "Deals",
        icon: "mdi-handshake",
        to: { name: "deal" },
        permissions: ["Deal: View Deal", "Deal: Edit/Update Deal"],
      },
      {
        label: "Orders",
        icon: "mdi-order-bool-descending-variant",
        to: { name: "order" },
        permissions: ["Order: View Order", "Order: Views Order"],
      },
      {
        label: "Prize Claim",
        icon: "fab fa-jedi-order",
        to: { name: "prize" },
        permissions: ["PrizeClaim: View PrizeClaim", "PrizeClaim: Views PrizeClaim","PrizeClaim: Create PrizeClaim","PrizeClaim: Edit/Update PrizeClaim"],
      },
    ],
  },
  shipment_management: {
    label: "Shipment Management",
    permissions: [
      "Shipping: View Shipping",
      "Shipping: Create Shipping",
      "Shipping: Edit/Update Shipping",
      "Shipping: Delete Shipping",
    ],
    children: [
      {
        label: "Shipping",
        icon: "mdi-ferry",
        to: { name: "shipping" },
        permissions: ["Deal: Shipping Shipping", "Shipping: Edit/Update Shipping"],
      },
      {
        label: "tracking",
        icon: "mdi-ferry",
        to: { name: "tracking" },
        permissions: ["Deal: Shipping tracking", "Shipping: Edit/Update tracking"],
      },
      {
        label: "Carriers",
        icon: "mdi-truck",
        to: { name: "carriers" },
        permissions: ["Carrier: Views Carrier", "Carrier: All Carrier","Carrier: Create Carrier","Carrier: Edit/Update Carrier","Carrier: Delete Carrier"],
      },
    ],
  },
  transaction_management: {
    label: "Transaction Management",
    permissions: [
      "Transaction: View Transaction",
      "Transaction: Create Transaction",
      "Transaction: Edit/Update Transaction",
      "Transaction: Delete Transaction",
      "Payment Gateway: View Payment Gateway",
      "Payment Gateway: Create Payment Gateway",
      "Payment Gateway: Update Payment Gateway",
      "Payment Gateway: Delete Payment Gateway",
    ],
    children: [
      {
        label: "Transactions",
        icon: "mdi-currency-usd",
        to: { name: "transaction" },
        permissions: ["Transaction: View Transaction", "Transaction: Edit/Update Transaction"],
      },
      {
        label: "Payment Gateway",
        icon: "mdi-currency-usd",
        to: { name: "payment-gateway" },
        permissions: ["Payment Gateway: View Payment Gateway", "Payment Gateway: Create Payment Gateway"],
      },
    ],
  },

  admin_management: {
    label: "Admin Management",
    permissions: [
      "User: View User",
      "User: Create User",
      "User: Edit/Update User",
      "User: Delete User",
      "Role: View Role",
      "Role: Create Role",
      "Role: Edit/Update Role",
      "Role: Delete Role",

      "Members: View All Members",
      "Members: View Members",
      "Members: Views Members",
      "Members: Create Members",
      "Members: Edit/Update Members",
      "Members: Delete Members",

      "Permission: View Permission",

      "Bots: View Bots",
      "Bots: View Pagination Bots"
    ],
    children: [
      {
        label: "Users",
        icon: "mdi-account-multiple-outline",
        to: { name: "users" },
        permissions: ["User: View User", "User: Create User"],
      },
      {
        label: "Member List",
        icon: "mdi-account-multiple-outline",
        to: { name: "members" },
        permissions: ["Members: View Members", "Members: Create Members"],
      },
      {
        label: "Bot List",
        icon: "mdi-account-outline",
        to: { name: "bot" },
        permissions: ["Bots: View Bots", "Bots: View Pagination Bots"],
      },
      {
        label: "Roles",
        icon: "mdi-account-cog-outline",
        to: { name: "roles" },
        permissions: ["Role: View Role", "Role: Create Role"],
      },
      {
        label: "Permissions",
        icon: "mdi-shield-key-outline",
        to: { name: "permissions" },
        permissions: ["Permission: View Permission"],
      },
    ],
  },
  system_settings: {
    label: "System Settings",
    permissions: [
      "Currency: View Currency",
      "Currency: Create Currency",
      "Currency: Edit/Update Currency",
      "Currency: Delete Currency",
      "Language: View Language",
      "Language: Create Language",
      "Language: Edit/Update Language",
      "Language: Delete Language",
      "Whitelist IP: View Whitelist IP",
      "Whitelist IP: Create Whitelist IP",
      "Whitelist IP: Edit/Update Whitelist IP",
      "Whitelist IP: Delete Whitelist IP",
      "State: View State",
      "State: Create State",
      "State: Edit/Update State",
      "State: Delete State",
      "Country: View Country",
      "Country: Create Country",
      "Country: Edit/Update Country",
      "Country: Delete Country",
      "Banner: View Banner",
      "Banner: Create Banner",
      "Banner: Edit/Update Banner",
      "Banner: Delete Banner",
    ],
    children: [
      {
        label: "Master Settings",
        icon: "mdi-tools",
        to: { name: "settings" },
        permissions: ["Country: View Country", "Country: Create Country"],
      },
      {
        label: "Country-State",
        icon: "mdi-flag",
        to: { name: "country-state" },
        permissions: ["Country: View Country", "Country: Create Country", "State: View State", "State: Create State"],
      },
      {
        label: "Currencies",
        icon: "mdi-currency-usd",
        to: { name: "currencies" },
        permissions: ["Currency: View Currency", "Currency: Create Currency"],
      },
      {
        label: "Languages",
        icon: "mdi-translate",
        to: { name: "languages" },
        permissions: ["Language: View Language", "Language: Create Language"],
      },
      {
        label: "Whitelist IP",
        icon: "mdi-desktop-mac",
        to: { name: "whitelist-ips" },
        permissions: [
          "Whitelist IP: View Whitelist IP",
          "Whitelist IP: Create Whitelist IP",
        ],
      },
      {
        label: "Banner",
        icon: "mdi-picture-in-picture-top-right-outline",
        to: { name: "banner" },
        permissions: ["Banner: View Banner", "Banner: Create Banner"],
      },
    ],
  },
  log_history: {
    label: "Logs",
    permissions: ["Report: View Audit Logs"],
    children: [
      {
        label: "Activity Logs",
        icon: "mdi-clipboard-pulse-outline",
        to: { name: "audit-logs" },
        permissions: ["Report: View Audit Logs"],
      },
    ],
  },
};
