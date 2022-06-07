function createnotif(title,text){
    if(title == ""){
        title = "Webranks Automation Extension";
    }
    return new Promise(function (resolve){
        chrome.notifications.create({type: "basic", iconUrl:"./images/logo.png", title: title, message: text, requireInteraction: false},
            function(data){
            resolve("true");
        });
    });
}
function getproxysettings(title,text){
return new Promise(function (resolve){
    chrome.proxy.settings.get(
    {},
    function(config) {
        resolve(config);
    });
});
}

function clearproxysettings(){
return new Promise(async function (resolve){
    var wait3 = await fakeproxysetup();
    var wait = await clearpr_data();
    var wait1 = await clearcasheddata();   
    if(wait == "true" && wait1 == "true" && wait3 == "true"){
        resolve("true");
    }else{
        resolve("false");
    }
});
}

function fakeproxysetup(){
    return new Promise(function (resolve){
    var config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
            scheme: "http",
            host:"192.168.1.0",
            port:80
          }
        }
      };
      try{
        chrome.proxy.settings.set(
            {value: config, scope: "regular"},
            function(data){
                if(chrome.runtime.lastError){
                    W.AUTH.PASS = "";
                    W.AUTH.USER = "";
                    resolve("false");
                }else{
                    resolve("true");
                }
            });
      }catch(ex){
        W.AUTH.PASS = "";
        W.AUTH.USER = "";
        resolve("false");
      }
    });
}

function clearpr_data(){
    return new Promise(function (resolve){
        W.AUTH.PASS = "";
        W.AUTH.USER = "";
        chrome.proxy.settings.clear({ scope: "regular"},
        function(data){
            resolve("true");
        });
    });
}

function clearcasheddata(){
    return new Promise(function (resolve){
        chrome.browsingData.removePasswords({
        "originTypes": {
          "protectedWeb": false,
          "unprotectedWeb": false,
          "extension": true
        }
      },function(){
        resolve("true");
      });
    });
}