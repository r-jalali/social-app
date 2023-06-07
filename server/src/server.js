const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const permissions = require("./graphql/permissions");

async function createApolloServer(
  options = {
    listen: { port: 4000 },
  }
) {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
  });

  const { url } = await startStandaloneServer(server, options);

  return { server, url };
}

module.exports = createApolloServer;
