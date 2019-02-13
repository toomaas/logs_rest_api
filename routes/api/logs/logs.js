var axios = require('axios');
const fs = require('fs');

module.exports.post = async function (req, res) {
  let data = req.body;
  let url = 'http://10.11.112.38:5000';
  let config = {
    headers: {
      'Content-Type': 'application/json',
    },
    maxContentLength: 31457280    //maxlength 30 mb
  };
var stream = fs.createWriteStream("axios_error.txt",{flags:'a'});
  try {
    let result = await axios.post(url, data, config);
    res.send("ok");
    stream.write(new Date().toISOString()+result+" \n");
  } catch (error) {
    res.send("error");
    stream.write("error \n");
    // fs.writeFile("aixos_error.txt", error, (err) => {
    //   // throws an error, you could also catch it here
    //   if (err) throw err;
    //   // success case, the file was saved
    //   console.log('file saved!');
    // });
  }
};