import "dotenv/config";
import express from "express";
import * as Sentry from "@sentry/node";
import routes from "./routes";
import logger from "./utils/logger";

const app = express();
Sentry.init({
  dsn: "https://a568b8b1301a422f92529ee465db8f33@sentry.io/4626043",
  release: `hb_backend@${process.env.npm_package_version}`,
  debug: true
});

app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.use(Sentry.Handlers.errorHandler());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(req.status || 500).send({
    status: "Error",
    message: err.message
  });
});

const port = process.env.PORT || 3000;
export default app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
