const express = require('express');
const mongoose =require('mongoose');

const routes = require('./routes');
const { ValidationError,NotFoundError } = require('./lib/errors');
mongoose.connect('mongodb://localhost:27017/petdb',
{useNewUrlParser: true,useUnifiedTopology:true})

const app = express();


const db =mongoose.connection


db.on('error',(err)=>
    {
         console.log(err)
    })

db.once('open',()=>    // database connection check
    {
    console.log('database conection established');
    })

app.use(express.json({ limit: '100kb' }));
app.use('/', routes);
app.use('/', (err, req, res, next) => {
  // default to 500 internal server error unless we've defined a specific error
  let code = 500;
  if (err instanceof ValidationError) {
    code = 400;
  }
  if (err instanceof NotFoundError) {
    code = 404;
  }
  res.status(code).json({
    message: err.message,
  });
});


app.listen(3002, function(req,res){        /// set port at 3002

  console.log("Server started at port 3002");
})

module.exports = app;