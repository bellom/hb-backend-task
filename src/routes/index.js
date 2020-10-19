import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import userRoute from "./user";
import jsonRoute from "./json";
import thumbnailRoute from "./thumbnail";

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.1",
  info: {
    title: "HB_Backend REST API Documentation",
    version: "1.0.0",
    description: "A task for Hackerbay Inc"
  },
  servers: [
    {
      url: "http://localhost:3000/api/v1",
      description: "Locally hosted server"
    }
  ],
  basePath: "/" // the basepath of the endpoint
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./docs/**/*.yaml"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

export default function(app) {
  app.use("/api/v1", userRoute);
  app.use("/api/v1", jsonRoute);
  app.use("/api/v1", thumbnailRoute);
  app.use(swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
