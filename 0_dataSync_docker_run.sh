#!/bin/sh
 docker run -itd --name hlfdata -v /home/hlf/dev_HGitee.com/redliquid-v4/liquidApp/log:/root/liquidApp/log hlf/redliquid:v1  -s=3000 -t=data
