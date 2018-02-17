const config = require('./config');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express();

// middlewares
// handlebars
// partials
hbs.registerPartials(`${__dirname}/views/partials`);
// view engine
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  const now = new Date().toString();
  const { url, method } = req;
  const log = `${method} for ${url} @ ${now}`;
  const logFile = `server.log`;
  console.log(log);
  fs.writeFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log(`Unable to append to ${logFile}`);
    }
  });
  next();
});

// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// host the whole public folder
app.use(express.static(`${__dirname}/public`));

const port = config.port;

// hbs helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('upper', (text) => {
  return text.toUpperCase();
});


app.get('/', (req, res) => {
  res.send({
    name: 'Jessica', 
    likes: [
      'Joe',
      'Star Trek',
      'Cross Stitch',
      'Training for a 5K',
    ],
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    greeting: 'Hello There',
    welcomeMsg: 'yolo',
    authorName: 'Joe Saraceno',
  });
});

app.get('/home', (req, res) => {
  res.render('home.hbs', {
    welcomeMsg: 'yolo',
    authorName: 'Joe Saraceno',
  });
});

app.get('/bad', (req, res) => {
  const errObj = {};
  errObj.msg = `Failed`;
  res.send(errHandler(errObj));
});

app.listen(port, () => {
  console.log(`App Server listening on Port ${port}`);
});

const errHandler = (err) => {
  if (err.hasOwnProperty('msg')) {
    return err.msg;
  } else {
    return err;
  }
}