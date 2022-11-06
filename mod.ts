import { MongoClient } from "mongo/mod.ts";
import { Application, Router } from "oak/mod.ts";
import { z } from "zod/mod.ts";

const mc = new MongoClient();
await mc.connect(
  // parsedArgs.mongoUri,
  "mongodb://user:pass@127.0.0.1:27017/tinyidea?authSource=admin",
);
const db = mc.database();

const app = new Application();
const router = new Router();

const ideasColl = db.collection("ideas");

const PopPayload = z.object({
  message: z.string({
    required_error: "Message is required",
  }),
});
router.post("/pop", async ({ request, response }) => {
  if (!request.hasBody) {
    response.status = 400;
    return;
  }

  const rawPayload = await request.body({ type: "json" }).value
    .then((v) => v)
    .catch(() => undefined);
  if (rawPayload === undefined) {
    response.status = 400;
    response.body = { error: ["Payload cannot parse as JSON"] };
    return;
  }

  const parsePayloadResult = PopPayload.safeParse(rawPayload);
  if (!parsePayloadResult.success) {
    response.status = 400;
    response.body = { error: parsePayloadResult.error.format().message?._errors };
    return;
  }

  const { message } = parsePayloadResult.data;

  const unique = `${Date.now()}`;
  const storeIdea = await ideasColl
    .insertOne({
      unique,
      message,
      created_at: new Date(),
    })
    .catch(() => undefined);
  if (!storeIdea) {
    response.status = 500;
    response.body = { error: ["Something broken when storing data"] };
    return;
  }
  response.body = { unique };
  return;
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
