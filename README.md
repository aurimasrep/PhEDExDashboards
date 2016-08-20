## Hadoop dashboard

This a test project: a web application that will allow Hadoop admins to create
ad-hoc dashboard for users and services.

## Requirements 

Install

* npm

## Instructions

Use nodejs to start your web app:

```bash
cd yarn-monitoring
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
#  - name   : yarn-monitoring
#    script : ./yarn-monitoring/./bin/www
#    watch  : true
#    env    :
#      NODE_ENV: development
#      ANALYTIX_NAMENODE: p01001532965510.cern.ch
#      PORT: 8088
#    env_production:
#      NODE_ENV: production
#      PORT: 8088
#    exec_mode: cluster
#    cwd: ./yarn-monitoring

pm2 start process.yml --only yarn-monitoring

#[PM2] [yarn-monitoring](0) ✓
#┌─────────────────┬────┬─────────┬──────┬────────┬─────────┬────────┬────────────┬──────────┐
#│ App name        │ id │ mode    │ pid  │ status │ restart │ uptime │ memory     │ watching │
#├─────────────────┼────┼─────────┼──────┼────────┼─────────┼────────┼────────────┼──────────┤
#│ yarn-monitoring │ 0  │ cluster │ 2996 │ online │ 251     │ 0s     │ 9.313 MB   │  enabled │
#└─────────────────┴────┴─────────┴──────┴────────┴─────────┴────────┴────────────┴──────────┘

```
