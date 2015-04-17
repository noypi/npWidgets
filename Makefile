all: np-img-enlarger.min.js np-img-widgets.min.js

np-img-enlarger.js:
	cat npImageServices.js npImageWidgets.Enlarger.js > np-img-enlarger.js

np-img-enlarger.min.js: np-img-enlarger.js
	minify.sh np-img-enlarger.js > np-img-enlarger.min.js

np-img-widgets.js:
	cat npImageServices.js npImageWidgets.Enlarger.js npImageWidgets.js > np-img-widgets.js

np-img-widgets.min.js: np-img-widgets.js
	minify.sh np-img-widgets.js > np-img-widgets.min.js

clean:
	rm np-img-*
