function getalllinksonpage(){
    var test = document.getElementsByTagName("a");
    var returnlinks = [];
    for(var i = 0, l = test.length; i<l;i++){
	    if(test[i] != null
	    && test[i].href != null
	    && test[i].href != ""
	    && test[i].href != "#"){
	        returnlinks.push(test[i].href.trim());
	    }
    }

    return returnlinks;
}

function linksthatmatchpattern(pattern,linksarray){
    var patternlinks = [];
    var isButton = (pattern.indexOf(':button:') > -1);
    var isLinkButton = (pattern.indexOf(':linkbutton:') > -1);
    pattern = pattern.replace(/\*/g,"");

    if (isButton) {
        // Fins button either by id (default) or by name (first instance)
        var parts = pattern.substr(8).split(':')
        var but = false;
        if (parts[0] == 'name') {
            buts = document.getElementsByName(parts[1]);
            if (buts.length > 0)
                but = buts[0];
        } else if (parts[0] == 'attr') {
            but = document.querySelector('[' + parts[1] + '="' + parts[2] + '"]');
        } else {
            but = document.getElementById(parts[0]);
        }
        if (but) {
            but.click();
            return [pattern];
        }
    } else if (isLinkButton) {
        var isFullPattern = (pattern.indexOf('.') > 0);
        pattern = pattern.substr(12);
        var url = null;
        var urlparams = "";
        var urlorigin = "";
        for(var i = 0, l = linksarray.length; i<l; i++){
            try {
                url = new URL(linksarray[i]);
                if (isFullPattern) urlparams = url.href;
                else urlparams = url.pathname;
                urlorigin = url.origin;
            }catch(e){urlparams = urlorigin = ""}
            if(urlparams.indexOf(pattern)> -1 && urlparams.substr(urlparams.length - pattern.length) != pattern){
                patternlinks.push(linksarray[i].substr(urlorigin.length));
            }
        }
        if (patternlinks.length > 0) {
            var random = Math.floor(Math.random() * parseInt(patternlinks.length));
            but = document.querySelector('[href="' + patternlinks[random] + '"]');
            if (but) {
                but.click();
                return [];
            }
        }
        return []
    } else {
        var isFullPattern = (pattern.indexOf('.') > 0);
        var url = null;
        var urlparams = "";
        for(var i = 0, l = linksarray.length; i<l; i++){
            try {
                url = new URL(linksarray[i]);
                if (isFullPattern) urlparams = url.href;
                else urlparams = url.pathname;
            }catch(e){urlparams = ""}
            //substr(id.length - 5);
            if(urlparams.indexOf(pattern)> -1 && urlparams.substr(urlparams.length - pattern.length) != pattern){
                patternlinks.push(linksarray[i]);
            }
        }
        return patternlinks;
    }
}

function getrandomlink(pattern){
    var allpaternlinks = linksthatmatchpattern(pattern, getalllinksonpage());
    if(allpaternlinks != null && allpaternlinks.length != null
        && !isNaN(parseInt(allpaternlinks.length))
        && parseInt(allpaternlinks.length) > 0){
        var random = Math.floor(Math.random() * parseInt(allpaternlinks.length));
        return allpaternlinks[random];
    }else{
        return "";
    }
}
//so one radnom link per earch pattern, if there is any. Return array of one link per each level.
function all_from_patters(patternsarray){
    var vlink = "";
    if(Array.isArray(patternsarray)
    && patternsarray.length != null
    && parseInt(patternsarray.length) > 0){
        for(var i = 0, l = parseInt(patternsarray.length); i<l; i++){
            if(patternsarray[i] != null && patternsarray[i][2] != null && patternsarray[i][3] != null && patternsarray[i][2] != ""){
                vlink = getrandomlink(patternsarray[i][2]);
                if(vlink != null && vlink != ""){
                    patternsarray[i][3] = vlink;
                }
            }
        }
        return patternsarray;
    }else{
        return [];
    }
}
function all_from_patters_return_msg(patternsarray){
    patternsarray = JSON.parse(window.atob(patternsarray));
    if(Array.isArray(patternsarray) && patternsarray.length != null && parseInt(patternsarray) >= 0){
        chrome.runtime.sendMessage({"type":"page_with_links_return","data": all_from_patters(patternsarray)});
    }else{
        chrome.runtime.sendMessage({"type":"page_with_links_return","data": []});
    }
}
