let express = require('express');
let bodyParser = require('body-parser');
let exec = require('child_process').exec;

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello there');
});

app.get('/payload', (req, res) => {
  res.send(200);
  console.log('get /payload');
});

app.post('/payload', (req, res) => {
  let {repository, pusher} = req.body;
  repository = !!repository || {name: 'unknown'};
  pusher = !!pusher || {name: 'unknown'};

  console.log(`${pusher.name} just pushed to ${repository.name}`);
  console.log('pulling code from GitHub...');

  let shell = exec(`./webhook.sh`, (err, stdout) => {
    if (err) {
      console.log(' === Error: \n', err, '\n ===');
      res.sendStatus(500);
    }
    else {
      res.sendStatus(200);
    }
    console.log(`${stdout}`);
    res.end();
  });

  shell.on('exit', code => {
    if (code === 0) {
      console.log(' === Success! Exiting child process');
    }
    else {
      console.log(` === Exiting with code: ${code}`);
    }
  })
});


app.listen(5000, () => {
  console.log(' === ', 'Listening on port 5000');
});
