#!/bin/bash

echo "🔐 Rebuilding google-services.json from base64..."
mkdir -p android/app
echo "$GOOGLE_SERVICES_JSON_BASE64" | base64 -d > android/app/google-services.json
ls -l android/app/google-services.json
