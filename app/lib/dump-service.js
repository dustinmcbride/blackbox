import config from '../config/config';
const dumpService = {}

//TODO will break on fail, maybe a timeout
dumpService.startService = function startDump (){
    this.getDump(config.dumpUrl).then(function(response){
    dumpService.data = (JSON.parse(response))
    dumpService.startService()
  })  
}

dumpService.getDump = function getDump (url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Check you dump server, failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        console.log(body.join(''))

        resolve(body.join(''))
      })
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    })
};

dumpService.data = {}

export default dumpService;
