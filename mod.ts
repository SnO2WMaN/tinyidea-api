import { Application, Router } from "oak/mod.ts";
import { MongoClient } from "mongo/mod.ts";

const mc = new MongoClient();
await mc.connect(
  // parsedArgs.mongoUri,
  "mongodb://user:pass@127.0.0.1:27017/tinyidea?authSource=admin",
);

const app = new Application();
const router = new Router();

// const ideasColl = db.collection("ideas");

router.post("/pop", async ({ params, request, response }) => {
  if (request.hasBody()) {
    response.status = 400;
    return;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
