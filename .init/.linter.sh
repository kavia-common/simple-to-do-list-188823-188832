#!/bin/bash
cd /home/kavia/workspace/code-generation/simple-to-do-list-188823-188832/frontend_react_js
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

