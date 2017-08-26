let express = require('express');
let bodyParser = require('body-parser');
let exec = require('child_process').exec;

let app = express();

const exec_callback = (err, stdout, stderr) => {
  if (err) {
    console.table(err);
  }
  if(stdout) {
    console.log(stdout);
  }
  if(stderr) {
    console.log(stderr);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello');
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

  // reset any local changes
  let shell = exec(`./webhook.sh`, exec_callback);



  shell.on('exit', code => {

  });

  res.sendStatus(200);
  res.end();
});


app.listen(5000, () => {
  console.log(' === ', 'Listening on port 5000');
});
