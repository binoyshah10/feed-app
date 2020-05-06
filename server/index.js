const express = require('express');
const cors = require('cors');
const http = require('http');
const env = require('dotenv').config();
const cookieParser = require('cookie-parser')

const routes = require('./routes/index');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(cookieParser());
app.use(cors({
  credentials: true, 
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept']
}));

// setting routes
app.use(routes);

// returning 401 unauthorized error
app.use(function(err, req, res, next) {
  console.log(err);
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({message:err});
    return;
  }
  next();
});

const server = http.createServer(app);

server.listen(PORT, () => {console.log(`Server has started on ${PORT}`)});

