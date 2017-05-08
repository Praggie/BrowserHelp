function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var currentUrl = window.location.href;

if(currentUrl.includes('google')) {
	/*

	var css = ".r {overflow:visible !important; z-index: 0;position: relative;}.r:before {z-index: 1;display: inline-block;position: absolute;left: -2rem;bottom: 1.2rem;margin: 0 0.5rem 0 0;width: 1.5rem;height: 1.5rem;font-size: 0.9rem;line-height: 1.5rem;text-align: center;background-color: rgba(255, 255, 0, 0.5);border: solid 2px rgba(0, 0, 0, 0.5);content: attr(data-index);}";
	// var css = css.concat("a {overflow:visible !important; z-index: 0;position: relative;}a:before {z-index: 1;display: inline-block;position: absolute;left: -2rem;bottom: 1.2rem;margin: 0 0.5rem 0 0;width: 1.5rem;height: 1.5rem;font-size: 1.2rem;opacity: 0.5;line-height: 1.5rem;text-align: center;background-color: #ff0;border: solid 2px #000;content: attr(data-index);}");
	
	//todo: concat other css and second while loop. Does not work: selection based on item path in google. Solve by selection based on data attribute
	//todo: color: inherits; mix-blend-mode: difference; for always seeing number properly

	var i = 1;
	while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
	  //getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
	  getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3`).setAttribute("data-index", i);
	  i++;
	}

	*/

	var css = "h3.r {overflow:visible !important} a:not(.ab_button) {overflow:visible !important; z-index: 0;position: relative;} a:not(.ab_button):before {z-index: 1;display: inline-block;position: absolute;left: -2rem;bottom: 1.2rem;margin: 0 0.5rem 0 0;width: 1.5rem;height: 1.5rem;font-size: 0.9rem;line-height: 1.5rem;text-align: center;background-color: rgba(255, 255, 0, 0.5);border: solid 2px rgba(0, 0, 0, 0.5);content: attr(data-index);}";
	var links = document.querySelectorAll("a:not(.ab_button)"); //document.getElementsByTagName('a');
	var number = 15
	for(var i = 0; i< links.length; i++){
	  links[i].setAttribute("data-index", number++);
	  // links[i].style.backgroundColor = "yellow";
	}

	// second loop to give all result links a low data-attribute number of 1-14
	number = 1;
	var links = document.querySelectorAll("div>h3.r>a:not(.ab_button)"); //document.getElementsByTagName('a');
	for(var i = 0; i< links.length; i++){
	  links[i].setAttribute("data-index", number++);
	  // links[i].style.backgroundColor = "yellow";
	}
} else {
	var css = "a {overflow:visible !important; z-index: 0;position: relative;}a:before {z-index: 1;display: inline-block;position: absolute;left: -2rem;bottom: 1.2rem;margin: 0 0.5rem 0 0;width: 1.5rem;height: 1.5rem;font-size: 0.9rem;line-height: 1.5rem;text-align: center;background-color: rgba(255, 255, 0, 0.5);border: solid 2px rgba(0, 0, 0, 0.5);content: attr(data-index);}";
	var i = 1;
	var links = document.getElementsByTagName('a');
	for(var i = 0; i< links.length; i++){
	  links[i].setAttribute("data-index", i);
	  // links[i].style.backgroundColor = "yellow";
	}
}



head = document.head || document.getElementsByTagName('head')[0],
style = document.createElement('style');

style.type = 'text/css';
style.title = 'highlights';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);