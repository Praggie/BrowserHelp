setTimeout(function(){
    document.getElementById("edw-test-utteranceTextField").setAttribute('value','near-by supermarkets');
    document.getElementById("edw-test-textAskButton").click();
    setTimeout(function() {
    	document.getElementById("edw-test-utteranceTextField").setAttribute('value','near-by supermarkets');
    	document.getElementById("edw-test-textAskButton").click();
    	setTimeout(function() {
    		document.getElementById("edw-test-utteranceTextField").value = 'highlight links';
    		document.getElementById("edw-test-textAskButton").click();
    		setTimeout(function() {
    			document.getElementById("edw-test-utteranceTextField").value = 'open first';
    			document.getElementById("edw-test-textAskButton").click();
    		},3000);
    	},2000);
    },1000);
},1000);


