rm index.zip 
cd skill
zip -X --recurse-paths ../index.zip recipes.js index.js node_modules
cd .. 
aws lambda update-function-code --function-name BrowserNavigator --zip-file fileb://index.zip