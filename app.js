const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    compression = require('compression'),
    csrf = require('csurf'),
    Language = require('./models/language');

console.log('connecting to MongoDB');
var db_uri = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost';
mongoose.connect(db_uri);

const csrfProtection = csrf({ cookie: true });

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express['static'](__dirname + '/static'));
app.use(compression());
app.use(cookieParser());

app.get('/', csrfProtection, (req, res) => {
  Language.find({}).sort('-created').limit(6).exec((err, langs) => {
    res.render('home', {
      recentLanguages: langs || [],
      csrfToken: req.csrfToken()
    });
  });
});

app.get('/start', csrfProtection, (req, res) => {
  res.render('start', {
    name: req.query.name,
    csrfToken: req.csrfToken()
  });
});

app.post('/make', csrfProtection, (req, res) => {
  var languageName = req.body.language_name.replace(/\s+/g, '');
  Language.findOne({ name: languageName }, (err, match) => {
    if (err) {
      return res.json(err);
    }
    if (match) {
      return res.json({ error: 'language with this name alredy exists' });
    }
    var l = new Language({
      name: languageName,
      humanlanguage: req.body.human_language,
      author: req.body.author,
      version: '1',
      rtl: req.body.rtl,
      cmd: {},
      updated: new Date(),
      created: new Date()
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
      res.redirect('/api/' + languageName);
    });
  });
});

app.get('/api/:lang_name', csrfProtection, (req, res) => {
  Language.findOne({ name: req.params.lang_name }, (err, lang) => {
    if (err) {
      return res.json(err);
    }
    if (!lang) {
      return res.json({ error: 'no such language' });
    }
    res.render('api', {
      lang: lang,
      csrfToken: req.csrfToken()
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('ready to go');
});
