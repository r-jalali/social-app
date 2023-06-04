const path = require("path");
const { merge } = require("lodash");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { shield } = require("graphql-shield");

const permissionFiles = loadFilesSync(path.join(__dirname, "./permissions"));
const permissions = merge({}, ...permissionFiles);

module.exports = shield(permissions, { allowExternalErrors: true });
