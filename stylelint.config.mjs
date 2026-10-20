export default {
  rules: {
    "declaration-property-value-disallowed-list": {
      "font-size": ["/(^|[^0-9.])([0-9]|1[01])px/"],
      "border-radius": ["/[0-9]+px/"],
    },
  },
  ignoreFiles: ["src/styles/tokens.css"],
};
