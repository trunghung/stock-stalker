del ..\stock-release\js\combine.js

java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/config.js > ../stock-release/js/config.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/credential.js > ../stock-release/js/credential.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/data.js > ../stock-release/js/data.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/debug.js > ../stock-release/js/debug.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/portfoliomgr.js > ../stock-release/js/portfoliomgr.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/editPort.js > ../stock-release/js/editPort.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/history.js > ../stock-release/js/history.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/home.js > ../stock-release/js/home.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/news.js > ../stock-release/js/news.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/protocol.js > ../stock-release/js/protocol.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/template.js > ../stock-release/js/template.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/templates/template_view_stock.js > ../stock-release/js/templates/template_view_stock.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/util.js > ../stock-release/js/util.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/viewPort.js > ../stock-release/js/viewPort.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/viewStock.js > ../stock-release/js/viewStock.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar js/stocktrack.js > ../stock-release/js/stocktrack.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar sdk/sdk.js > ../stock-release/sdk/sdk.js


java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar sdk/sdk.js > ../stock-release/js/sdk.js

java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge sdk/sdk.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/stocktrack.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/credential.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/history.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/editPort.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/protocol.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/home.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/news.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/viewPort.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/viewStock.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/portfoliomgr.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/util.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/config.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/debug.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/template.js >> ../stock-release/js/combine.js
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --nomunge js/templates//template_view_stock.js >> ../stock-release/js/combine.js

java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --type css css/stocktrack.css > ../stock-release/css/stocktrack.css
java -jar ../yuicompressor/build/yuicompressor-2.4.2.jar --type css sdk/sdk.css > ../stock-release/sdk/sdk.css

copy yahoo.finance.scrapper.new.xml ..\stock-release\