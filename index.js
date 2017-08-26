let express = require('express');
let bodyParser = require('body-parser');
let exec = require('child_process').exec;

let app = express();

const prj_dir = '/var/www/pi/grahamera';

const exec_callback = (err, stdout, stderr) => {
  if(stdout) { console.log(stdout) };
  if(stderr) console.log(stderr);
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
  pusher = !!pusher || {name: 'unkown'};

  console.log(`${pusher.name} just pushed to ${repository.name}`);
  console.log('pulling code from GitHub...');

  // reset any local changes
  exec(`git -C ${prj_dir} reset --hard`, exec_callback);

  // ditch any files that were added locally
  exec(`git -C ${prj_dir} clean -df`, exec_callback);

  // pull latest code
  exec(`git -C ${prj_dir} pull -f`, exec_callback);

  // npm install
  exec(`npm -C ${prj_dir} install --production`, exec_callback);

  res.sendStatus(200);
  res.end();
});


app.listen(5000, () => {
  console.log(' === ', 'Listening on port 5000');
});
