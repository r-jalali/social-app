const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { applyMiddleware } = require("graphql-middleware");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const permissions = require("./graphql/permissions");

async function startApolloServer() {
  await mongoose.connect("mongodb://localhost:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const schemaWithMiddleware = applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema: schemaWithMiddleware,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`
    🚀  Server is running
    📭  Query at ${url}
  `);
}

startApolloServer();
