// dotenv config
import "dotenv/config";

// app
import { app } from "./app.js";

const port = process.env.PORT || 5000;

// init server
app.listen(port, () => {
  console.log(`API running at ${port}`);
});
