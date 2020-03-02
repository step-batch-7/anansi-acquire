#!/bin/bash

cat <<EOF > .git/hooks/pre-commit  
npm run allTests
if [ \$? != 0 ]; then 
    exit 1
fi
EOF
chmod +x .git/hooks/pre-commit  
cat <<EOF > .git/hooks/pre-push  
npm run allTests 
if [ \$? != 0 ]; then 
    exit 1
fi
EOF
chmod +x .git/hooks/pre-push  