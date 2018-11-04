#!/bin/bash

echo "====> Prepare Start <===="

if [ ! -d "$PROJECT_HOME_PATH" ]; then
  git clone "$PROJECT_PUBLISH_GIT" "$PROJECT_HOME_PATH"
  if [ ! -d "$PROJECT_HOME_PATH" ]; then
    echo "[E] clone git error."
    exit 1
  fi
  cd $PROJECT_HOME_PATH
else
  cd $PROJECT_HOME_PATH
  git reset --hard
  git fetch
  git reset --hard origin/master
  git pull
fi

echo "-----------------------------"
git log -n 1
echo "====> Build Start <===="

ls -l
rnc -v

npm install --production
rnc build
rnc upload


if [ $? -ne 0 ];then
  echo "[E] qmis release error"
  exit 1
fi
