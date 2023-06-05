const { shield, allow, rule, deny, inputRule } = require("graphql-shield");
const yup = require("yup");

const isEmailFormatValid = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup
        .string()
        .email("Email is not valid")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
    }),
  })
);

module.exports = {
  Query: {},
  Mutation: {
    createUser: isEmailFormatValid,
  },
  User: {},
};
