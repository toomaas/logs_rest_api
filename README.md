# logs_rest_api
## Master thesis
* Joaquim Abreu

Ready for [OpenShift](https://www.openshift.com/)
#### setup:
* clone the repository
```
git clone https://github.com/toomaas/logs_rest_api.git
```
* open and run on the terminal
```
npm install
npm start
````
***
You can also use a process manager such as [PM2](https://pm2.io/doc/en/runtime/overview/?utm_source=pm2&utm_medium=website&utm_campaign=rebranding)
```
npm install pm2 -g
```
* Change npm start to  
```
pm2 start server.js -i max --exp-backoff-restart-delay=100 --name logs-api
```
* Or use an [ecosystem.config.js](https://pm2.io/doc/en/runtime/guide/ecosystem-file/) with the pm2 configurations
```
pm2 start ./ecosystem.config.js,
```
* monitor the application on console 
```
pm2 monit
```
