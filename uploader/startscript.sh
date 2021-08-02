#!/bin/sh
screen -d -m -S minecraft
screen -d -m -S node
wait
screen -S minecraft -p 0 -X stuff "cd minecraft/^M"
screen -S minecraft -p 0 -X stuff "java -jar server.jar^M"
screen -S node -p 0 -X stuff "node script.js^M"
