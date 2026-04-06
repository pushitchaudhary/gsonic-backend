import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "G-Sonic Backend API",
      version: "1.0.0",
      description: "API documentation for G-Sonic - Home Appliances Store",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://g-sonic-backend-1.onrender.com",
        description: "Hosted testing server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT token stored in httpOnly cookie (set via login)",
        },
      },
    },
    security: [],
    tags: [
      { name: "Auth", description: "Authentication and session management" },
      { name: "User", description: "User operations" },
      { name: "Feedback", description: "Feedbacks on products." },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
