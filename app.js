const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    compression = require('compression'),
    Language = require('./models/language');

console.log('connecting to MongoDB');
var db_uri = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost';
mongoose.connect(db_uri);

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express['static'](__dirname + '/static'));
app.use(compression());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/start', (req, res) => {
  res.render('start', {
    name: req.query.name
  });
});

app.post('/make', (req, res) => {
  console.log(req.body.rtl);
  var l = new Language({
    name: req.body.language_name,
    humanlanguage: req.body.human_language,
    author: req.body.author,
    version: '1',
    rtl: req.body.rtl,
    cmd: {}
  });
  var uniques = [];
  for (var key in req.body) {
    if (key[0] === 'x') {
      // it's a command
      var cmdtext = req.body[key].replace(/\s+/g, '');
      if (!cmdtext) {
        // blank, might be optional?
        continue;
      }
      if (uniques.indexOf(cmdtext) > -1) {
        return res.json({ error: 'A command or keyword was reused' });
      } else {
        uniques.push(cmdtext);
        l.cmd[key] = cmdtext;
      }
    }
  }
  l.save((err) => {
    if (err) {
      return res.json(err);
    }
    res.redirect('/api/' + l._id);
  });
});

app.get('/api', (req, res) => {
  res.render('explainer');
});

app.get('/api/:lang_id', (req, res) => {
  Language.findById(req.params.lang_id, (err, lang) => {
    if (err) {
      return res.json(err);
    }
    if (!lang) {
      return res.json({ error: 'no such language' });
    }
    res.render('api', {
      lang: lang
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('ready to go');
});
