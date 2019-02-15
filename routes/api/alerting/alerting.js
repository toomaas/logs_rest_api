const {exec} = require('child_process');


module.exports.post = async function (req, res) {
  console.log(res);
res.send("ok");
};

module.exports.get = async function (req, res) {
  exec('elastalert --verbose --rule example_frequency.yaml', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
    
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  res.send("cmd exec");
};