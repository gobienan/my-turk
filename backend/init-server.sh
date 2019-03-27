#!/bin/bash

mongod --dbpath=/database/ --bind_ip 127.0.0.1 &
npm start
