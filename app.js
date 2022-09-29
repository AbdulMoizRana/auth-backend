const express = require("express");
const connectDB = require("./config/dataBase");
const routes = require('./routes/index');
const dotenv= require('dotenv');
var cors = require('cors')

dotenv.config();

const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors())
app.use(express.json());
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
app.use('/api/v1', routes);

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`));
