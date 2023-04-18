var express = require('express')
var cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const mysql = require('mysql2');
const options = { customCssUrl: '/public/css/swagger-ui.css',};
require('dotenv').config();
const port = process.env.PORT;
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var app = express()
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Sample API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(cors())
app.use(express.json())
app.use('/public/css', express.static('public/css'));
app.use('/', indexRouter);
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customCssUrl: CSS_URL }));
app.listen(port, function () {
  console.log('CORS-enabled web server listening on port ' + port)
})
