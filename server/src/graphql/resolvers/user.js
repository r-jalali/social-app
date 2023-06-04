const User = require("../../models/user");
const { GraphQLError } = require("graphql");

module.exports = {
  Query: {
    hello: () => "hello world!!!!",
    users: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const { email, password } = input;
        return await User.create({ email, password });
      } catch (error) {
        if (error.code === 11000) {
          throw new GraphQLError("Email already exists");
        }
        return error;
      }
    },
  },
};
