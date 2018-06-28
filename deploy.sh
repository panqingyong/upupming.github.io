#!/bin/bash

git add .

if [ "$#" -eq 0 ]; then
    git commit -m "Updated: blog source"
else 
    git commit -m "$1"
fi

git push

