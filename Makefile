production:
	NODE_ENV=production node app.js  

debug: 
	DEBUG=express:* node app.js

build: package.json
	npm install
	mkdir -p assets
	cp ./public/* ./assets
	cp -r ./node_modules/purecss ./assets
	cp -r ./node_modules/font-awesome ./assets