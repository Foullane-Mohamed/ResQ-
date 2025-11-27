import jsonServer from "json-server";
import auth from "json-server-auth";

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

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
