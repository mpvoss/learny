#!/bin/bash

# remove az_func dir if it exists
if [ -d "az_func" ]; then
  rm -rf az_func
fi

# create az_func dir
mkdir az_func

#  copy files from ../test_func into az_func
cp -r ../test_func/. az_func


cd az_func
zip -r ../build.zip .
cd ..
echo "Build completed"

az functionapp deployment source config-zip -g rg-learny -n learny-functionapp --src build.zip --build-remote true
echo "Upload completed"
