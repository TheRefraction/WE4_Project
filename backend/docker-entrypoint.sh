#!/bin/sh
set -e

echo "Dependencies analysis..."

if [ ! -f /app/node_modules/.package-json-checksum ] || \
   ! md5sum -c /app/node_modules/.package-json-checksum > /dev/null 2>&1; then

  echo "package.json has been modified - running npm install..."
  npm install
  md5sum /app/package.json > /app/node_modules/.package-json-checksum
  echo "Done!"
else
  echo "Dependencies are already up to date!"
fi

exec "$@"