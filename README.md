## PhEDEx dashboard

A web application that will allow to monitor PhEDEx block replica status in variuos ways. It provides current information on block replica sum aggregation and allows filtering data on specific fields.

## Installation

- In order to deploy node app, see ./doc/deploy file.
- In order to use node app, use ./doc/manage script. Available commandes: sysboot, start, restart, graceful, stip, status, help. Other option is to use pm2 directly for managing node app.
```
pm2 start process.yml
pm2 list
pm2 stop process.yml
# more commands available..
```
## Usage
- Connect to node app via browser (ip_address:port). Port should be specified in process.yml file.
- In order to see user guide to node app, see ./doc/instructions.
