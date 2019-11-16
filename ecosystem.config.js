module.exports = {
  apps : [
  {
    name: 'Worker',
    script: 'out/src/start-worker.js',
    autorestart: true,
    exec_mode: 'fork',
    // interpreter_args: ["--inspect-brk=7803"],
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 3, //"max",   
    watch: false,
    max_memory_restart: '1G',
    log_file: 'worker.log',
    env: {
      NODE_ENV: 'development',
      DEBUG: 'kafka-node:*'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'Scheduler',
    script: 'out/src/start-scheduler.js',
    interpreter_args: ["--inspect=7802"],
    autorestart: true,
    exec_mode: 'fork',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,    
    watch: false,
    max_memory_restart: '1G',
    log_file: 'scheduler.log',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};