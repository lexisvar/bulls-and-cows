#!/bin/sh
type supervisor >/dev/null 2>&1 || { 
    node app.js
    exit
}
supervisor -i .tmp,.git,views,assets app.js
