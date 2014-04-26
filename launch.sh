#!/bin/bash

if [[ $1 == "prod" ]] || [[ $1 == "--prod" ]]; then
  type forever >/dev/null 2>&1 || { 
    echo "Forever isn't installed"
    node app.js --prod
    exit
  }

  script="${PWD}/app.js"
  testRunning=$(forever list | grep $script)

  if [[ $testRunning != "" ]]; then
    echo "Application is already running. Restarting..."
    forever restart $script --prod
    exit
  fi

  forever start $script --prod
  exit
fi

type supervisor >/dev/null 2>&1 || { 
  node app.js
  exit
}

supervisor -i .tmp,.git,views,assets app.js
