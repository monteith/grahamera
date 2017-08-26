#!/usr/bin/env bash

git reset --hard HEAD
git clean -df
git pull -f
npm install --production