const jsonServer = require("json-server");
const auth = require("json-server-auth");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Bind the router db to the app
server.db = router.db;

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add auth routes
server.use(auth);

// Use default router
server.use(router);

const startPort = process.env.PORT || 5000;

// Function to try different ports if the default is in use
const startServer = (port) => {
  server
    .listen(port, () => {
      console.log(`JSON Server with auth is running on port ${port}`);
      console.log(`Auth endpoints available at:`);
      console.log(`POST http://localhost:${port}/register`);
      console.log(`POST http://localhost:${port}/login`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
};

startServer(startPort);
