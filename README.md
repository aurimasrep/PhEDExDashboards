## PhEDEx dashboard

A web application that will allow to monitor PhEDEx block replica status in variuos ways.

## Requirements 

Install

* node
* npm

## Instructions

Use nodejs to start your web app:

```bash
cd br-monitoring 
npm install express
npm install
node ./bin/www
```

Or you can use pm2 to start web applications (instead of `node ./bin/www`, other npm instructions still needed)

```bash
npm install pm2 -g
```

for instance:

```
cat process.yml

#apps:
#  - name   : br-monitoring
#    script : ./br-monitoring/./bin/www
#    watch  : true
#    env    :
#      NODE_ENV: development
#      PORT: 8880
#    env_production:
#      NODE_ENV: production
#      PORT: 8880
#    cwd: ./br-monitoring

pm2 start process.yml --only br-monitoring

#[PM2] [br-monitoring](0) ✓
#┌───────────────┬────┬──────┬──────┬────────┬─────────┬────────┬────────────┬──────────┐
#│ App name      │ id │ mode │ pid  │ status │ restart │ uptime │ memory     │ watching │
#├───────────────┼────┼──────┼──────┼────────┼─────────┼────────┼────────────┼──────────┤
#│ br-monitoring │ 0  │ fork │ 2996 │ online │ 251     │ 0s     │ 9.313 MB   │  enabled │
#└───────────────┴────┴──────┴──────┴────────┴─────────┴────────┴────────────┴──────────┘

```
