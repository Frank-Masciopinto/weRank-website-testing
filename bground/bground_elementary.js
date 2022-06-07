function setstorage(data_object){
    return new Promise(function (resolve){
        cs.set(data_object, function(){
            resolve("true");
        });	
    });
}
function getstorage(data_array){
    return new Promise(function (resolve){
        if(Array.isArray(data_array) == false || data_array.length == null || parseInt(data_array.length) <= 0){
            resolve("false");
        }
        cs.get(data_array, function(data){
            resolve(data);
        });
    });
}

function load_js(tabid,file){
    return new Promise(function (resolve){
    chrome.tabs.executeScript(tabid, {file: file, runAt: "document_end"}, function(resp){
        if(chrome.runtime.lastError){
            resolve("false");
        }else{
            resolve("true");
        }
    });
    });
}

function load_js_code(tabid,code){
    return new Promise(function (resolve){
        chrome.tabs.executeScript(tabid, {code: code, runAt: "document_end"}, function(resp){
            if(chrome.runtime.lastError){
                resolve("false");
            }else{
                resolve("true");
            }
        });
    });  
}

function load_all_tabs(){
    return new Promise(function (resolve){
        chrome.tabs.query({}, function (data){
            resolve(data);
        });
    });
}

function remove_inactivetab(){
    
}


// on removed and on changed tab info
chrome.tabs.onRemoved.addListener(function(t,tdata){
if(chrome.runtime.lastError){
}else{
    if(t == EXTENSION_TAB_ID){
        clean_all(false);
        return false;
    }
}
});

chrome.tabs.onReplaced.addListener(function (newtabid, oldtabid) {
    if (chrome.runtime.lastError){
    } else {
        if (oldtabid == EXTENSION_TAB_ID){
            EXTENSION_TAB_ID = newtabid;
        }
    }
});


// proxy auth required

chrome.webRequest.onAuthRequired.addListener(function(details){
    if(W.AUTH.USER != ""
    && W.AUTH.PASS != ""
    && details != null
    && details.isProxy != null
    && details.isProxy == true
    && details.statusCode != null
    && parseInt(details.statusCode) == 407){
    return {authCredentials: {username: W.AUTH.USER, password: W.AUTH.PASS}};
    }
}, 
{urls: ["<all_urls>", "http://*/*", "https://*/*", "ftp://*/*"]},["blocking"]);