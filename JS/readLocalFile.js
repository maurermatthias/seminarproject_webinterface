function readTextFile(file,method)
{
	//var fileNew  = "file:///C:/Users/mojo/Dropbox/Semi/webinterface/XML%20files/"+file+".xml";
	var fileNew  = "XML%20files/"+file+".xml";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", fileNew, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                method(allText);
            }
        }
    }
    rawFile.send(null);
}

