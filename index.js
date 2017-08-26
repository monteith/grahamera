let express = require('express');
let bodyParser = require('body-parser');
let exec = require('child_process').exec;

let app = express();

const exec_callback = (err, stdout, stderr) => {
  if (err) {
    console.table(err);
    throw new Error(err.code);
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

  // reset any local changes
  try {
    let shell = exec(`./webhook.sh`, exec_callback);

    shell.on('exit', code => {
      console.log(' === ', `Exiting with code: ${code}`);
    });
  } catch (err) {
    res.sendStatus(500);
    res.end();
  }
  
  res.sendStatus(200);
  res.end();
});


app.listen(5000, () => {
  console.log(' === ', 'Listening on port 5000');
});
