const { shield, allow, rule, deny } = require("graphql-shield");

module.exports = {
  Query: {
    posts: allow,
  },
};