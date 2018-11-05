#!/bin/bash

echo "====> 拉取项目 <===="
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


echo "====> 最新提交信息 <===="
git log -n 1

echo "====> 项目目录 <===="
ls -l

echo "====> @rnc/ci 版本 <===="
rnc -v

echo "====> 安装依赖 <===="
npm install --production


echo "====> 打包 <===="
rnc build

echo "====> 上传发布 <===="
rnc upload

echo "====> 发布成功 <===="


if [ $? -ne 0 ];then
  echo "[E] qmis release error"
  exit 1
fi
