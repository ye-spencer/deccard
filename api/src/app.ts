import { Hono } from "hono";
import decksRouter from "./routes/deck"
import { HTTPException } from "hono/http-exception";
import cardsRouter from "./routes/card";
import { cors } from "hono/cors";


const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/", decksRouter);

app.route("/", cardsRouter);



app.onError((err, c) => {
  console.error("Caught error:", err);
 
  if (err instanceof HTTPException)
  {
    return err.getResponse();
  } 
  
  return c.json(
    {
      message: "An unexpected error occurred",
    },
    500,
  );
});

export default app;
