import express from "express";


const app = express();




const port = process.env.PORT || 3000;
export default app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});