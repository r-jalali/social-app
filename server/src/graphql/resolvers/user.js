const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const User = require("../../models/user");

require("dotenv").config();

module.exports = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const { email, password } = input;
        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign(
          { id: user.id, email, role: user.role },
          process.env.JWT_SECRET
        );

        return { user, token };
      } catch (error) {
        if (error.code === 11000) {
          throw new GraphQLError("Email already exists");
        }
        throw error;
      }
    },
  },
};
