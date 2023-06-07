const mongoose = require("mongoose");
const createApolloServer = require("./server");

async function startApolloServer() {
  await mongoose.connect("mongodb://localhost:27017/social", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const { url } = await createApolloServer();

  console.log(`
      🚀  Server is running
      📭  Query at ${url}
    `);
}

startApolloServer();
