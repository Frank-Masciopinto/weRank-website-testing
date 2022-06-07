var INTERVAL_TIMEOUT = null;
var WORKINPROGRESS = false;
var PROXY_ID = "";
var MY_IP_STORE = "";
var LEVELS_ARRAY = [];
var EXTENSION_TAB_ID = 0;
var SITE_ID = "";
var SAVE_TRAFFIC = "";
var TIMEOUT_OF_PAGE = null;
var LINK = "";
var LEVEL = "";
var TRACK_OR_CLICK = false;
var SESSION = 1;
var INCOGNITO_WINDOW_ID;
var listener = null;
var USER_AGENT = "";

let user_agent_list = ["Mozilla/5.0 (Linux; Android 12; SM-S906N Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 10; SM-G996U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 10; SM-G980F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.96 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 9; SM-G973U Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 7.0; SM-G930VC Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0.1; SM-G935S Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 5.1.1; SM-G928X Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SD1A.210817.023; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.71 Mobile Safari/537.36"]

async function init_page_load() {
    await clearpr_data();
    await clearpr_data();
    await get_ip_latest();
}
init_page_load();
/* RESET APP EACH 12 HOURS */
chrome.alarms.create("alarm", { periodInMinutes: 720 });
chrome.alarms.onAlarm.addListener(function (alarm) {
    //window.location.reload();
    //chrome.tabs.create({
    //    url: 'chrome://restart'
    //});
});

/* RESET APP EACH 12 HOURS
Timeout as fallback if chrome alarm fails.
*/


/* CLEAR HISTORY AND CASHE EACH 30 MIN */
//setInterval(clearhistory, 1800000);

function clearhistory() {
    chrome.browsingData.remove({
        "since": 0,
        "originTypes": {
            "protectedWeb": true,
            "unprotectedWeb": true,
            "extension": false
        }
    }, {
        "appcache": true,
        "cache": true,
        "cacheStorage": true,
        "cookies": false,
        "downloads": false,
        "fileSystems": true,
        "formData": true,
        "history": true,
        "indexedDB": true,
        "localStorage": true,
        "serverBoundCertificates": false,
        "pluginData": true,
        "passwords": true,
        "serviceWorkers": true,
        "webSQL": true
    });
}
/* CLEAR HISTORY AND CASHE EACH 10 MIN */

async function page_with_links_return(data) {
    try {
        clearTimeout(TIMEOUT_OF_PAGE);
        if (LINK != null && LINK != "" && LEVEL != null && LEVEL != "") {
            link_level_pass(LINK, LEVEL);
        }
        if (LEVELS_ARRAY == null || parseInt(LEVELS_ARRAY.length) <= 0) {
            if (DEBUGGING) { console.log("All links competed for this session."); }
            clean_all(true);
            return false;
        }
        if (!TRACK_OR_CLICK) {
            if (DEBUGGING) { console.log("Page with all link Loaded, links extracted, page closed."); }
            // track visit api call
            var formdataurl = new URLSearchParams();
            formdataurl.set("siteId", SITE_ID);
            formdataurl.set("proxyId", PROXY_ID);
            formdataurl.set("proxyIp", MY_IP_STORE);
            jQuery.ajax({
                url: W.URL.TRACK_VISIT,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                data: formdataurl.toString(),
                cache: false,
                contentType: false,
                processData: false,
                method: "POST",
                dataType: "text",
                success: function (data) {
                    if (DEBUGGING) { console.log("TRACKVISIT api call, DONE"); }
                },
                error: function (data, statustxt) {
                    if (DEBUGGING) { console.log("TRACKVISIT api call, FAIL"); }
                    clean_all(true);
                }
            });
            TRACK_OR_CLICK = true;
            if (data != null && data[0] != null && data[0][3] != null && data[0][3] != "") {
                var tab_update = await tabs_updatenew(EXTENSION_TAB_ID, data[0][3]);
                LINK = data[0][3];
                LEVEL = data[0][0];
                if (tab_update == "false") {
                    clean_all(false);
                    return false;
                }
            }
            TIMEOUT_OF_PAGE = setTimeout(clean_all, W.TIMEOUTS.LEVELSNOTLOADAFTER, false); // if page not load after 55 secs
            LEVELS_ARRAY.shift();
            var temp = [LEVELS_ARRAY[0]];
            if (LEVELS_ARRAY == null || LEVELS_ARRAY.length == null || parseInt(LEVELS_ARRAY.length) <= 0 || LEVELS_ARRAY[0] == null) {
                temp = [];
            }
            W.TIMEOUTS.LEVELSPAGETIMEOUTRAND = randomNumber(W.TIMEOUTS.LEVELSPAGETIMEOUT, W.TIMEOUTS.LEVELSPAGETIMEOUTMAX);
            setTimeout(async function () {
                var codeload = await load_js(EXTENSION_TAB_ID, "./content_src/content.js");
                if (codeload == "true") {
                    codeload = await load_js_code(EXTENSION_TAB_ID, "all_from_patters_return_msg(\"" + window.btoa(JSON.stringify(temp)) + "\");");
                    if (codeload == "true") {
                    } else { clean_all(false); return false; }
                } else { clean_all(false); return false; }
            }, W.TIMEOUTS.LEVELSPAGETIMEOUTRAND);
        } else {
            var isButton = false;
            if (data != null && data[0] != null && data[0][3] != null && data[0][3] != ""
                && data[0][0] != null && data[0][0] != "") {
                isButton = data[0][3].indexOf(':button:') > -1;
                if (!isButton) {
                    var tab_update = await tabs_updatenew(EXTENSION_TAB_ID, data[0][3]);
                    LINK = data[0][3];
                    LEVEL = data[0][0];
                    if (tab_update == "false") {
                        clean_all(false);
                        return false;
                    }
                }
            }
            TIMEOUT_OF_PAGE = setTimeout(clean_all, W.TIMEOUTS.LEVELSNOTLOADAFTER, false); // if page not load after 55 secs
            LEVELS_ARRAY.shift();
            var temp = [LEVELS_ARRAY[0]];
            if (LEVELS_ARRAY == null || LEVELS_ARRAY.length == null || parseInt(LEVELS_ARRAY.length) <= 0 || LEVELS_ARRAY[0] == null) {
                temp = [];
            }
            W.TIMEOUTS.LEVELSPAGETIMEOUTRAND = randomNumber(W.TIMEOUTS.LEVELSPAGETIMEOUT, W.TIMEOUTS.LEVELSPAGETIMEOUTMAX);
            setTimeout(async function () {
                var codeload = await load_js(EXTENSION_TAB_ID, "./content_src/content.js");
                if (codeload == "true") {
                    codeload = await load_js_code(EXTENSION_TAB_ID, "all_from_patters_return_msg(\"" + window.btoa(JSON.stringify(temp)) + "\");");
                    if (codeload == "true") {
                    } else { clean_all(false); return false; }
                } else { clean_all(false); return false; }
            }, W.TIMEOUTS.LEVELSPAGETIMEOUTRAND);
        }
    } catch (ex) { clean_all(false); return false; }
}
async function load_content_scr(tabid) {
    var codeload = await load_js(tabid, "./content_src/content_linkcl.js");
}
async function whilefunctionwork() {
    try {
        if (DEBUGGING1) { console.warn("Testing Line 115"); }
        var tabexists = await doestabegxists(EXTENSION_TAB_ID);
        if (!tabexists) {
            EXTENSION_TAB_ID = 0;
        }

        LINK = "";
        LEVEL = "";
        SITE_ID = "";
        SAVE_TRAFFIC = "";
        clearTimeout(TIMEOUT_OF_PAGE);
        LEVELS_ARRAY = [];
        PROXY_ID = "";
        W.AUTH.PASS = "";
        W.AUTH.USER = "";
        TRACK_OR_CLICK = false;
        
        //await clearproxysettings();
        if (DEBUGGING1) { console.warn("Testing Line 131"); }
        if (DEBUGGING) { console.log("Starting new session."); }
        if (!WORKINPROGRESS) {
            WORKINPROGRESS = true;
            var loadsites = await load_all_sites();
            if (DEBUGGING) { console.log("Loaded all sites from API call. "); }
            if (DEBUGGING) { console.log("Api returned list of >> " + parseInt(loadsites.sites.length) + " sites."); }
            if (DEBUGGING1) { console.warn("Testing Line 138"); }
            if (loadsites != null && loadsites != "false" && loadsites.sites != null) {
                if (loadsites.sites.length != null && parseInt(loadsites.sites.length) > 0) {
                    //get random element from array
                    var randomint = Math.floor(Math.random() * parseInt(loadsites.sites.length));
                    if (randomint != null
                        && parseInt(randomint) >= 0
                        && loadsites.sites[randomint] != null
                        && loadsites.sites[randomint].id != null
                        && loadsites.sites[randomint].id != ""
                        && loadsites.sites[randomint].proxy != null
                        && loadsites.sites[randomint].proxy.id != null
                        && loadsites.sites[randomint].proxy.ip != null
                        && loadsites.sites[randomint].proxy.login != null
                        && loadsites.sites[randomint].proxy.pass != null
                        && loadsites.sites[randomint].proxy.port != null
                        && loadsites.sites[randomint].proxy.id != ""
                        && loadsites.sites[randomint].proxy.ip != ""
                        && loadsites.sites[randomint].proxy.login != ""
                        && loadsites.sites[randomint].proxy.pass != ""
                        && loadsites.sites[randomint].proxy.port != "") {
                        SITE_ID = loadsites.sites[randomint].id;
                        SAVE_TRAFFIC = loadsites.sites[randomint].savetraffic;
                        PROXY_ID = loadsites.sites[randomint].proxy.id;
                        USER_AGENT = getRandomUserAgent();
                        var proxysetup = await setup_proxy(loadsites.sites[randomint].proxy.ip,
                            loadsites.sites[randomint].proxy.login,
                            loadsites.sites[randomint].proxy.pass,
                            loadsites.sites[randomint].proxy.port); if (DEBUGGING1) { console.warn("Testing Line 164"); }
                        if (proxysetup != null && proxysetup != "false") {
                            var ip_store_fun = await store_ip_api_call(); if (DEBUGGING1) { console.warn("Testing Line 166"); }
                            if (ip_store_fun != null && ip_store_fun != "false") {
                                if (DEBUGGING1) { console.warn("Testing Line 167"); }
                                if (loadsites.sites[randomint].url != null && loadsites.sites[randomint].url != "") {
                                    if (loadsites.sites[randomint].levels != null
                                        && Array.isArray(loadsites.sites[randomint].levels)
                                        && parseInt(loadsites.sites[randomint].levels.length) > 0) {
                                        try {
                                            if (DEBUGGING1) { console.warn("Testing Line 172"); }
                                            for (var i = 0, l = parseInt(loadsites.sites[randomint].levels.length);
                                                i < l;
                                                i++) {
                                                    if (DEBUGGING1) { console.warn("Testing Line 175"); }
                                                if (loadsites.sites[randomint].levels[i] != null
                                                    && loadsites.sites[randomint].levels[i].id != null
                                                    && loadsites.sites[randomint].levels[i].level != null
                                                    && loadsites.sites[randomint].levels[i].linkPattern != null
                                                    && loadsites.sites[randomint].levels[i].linkPattern != ""
                                                    && loadsites.sites[randomint].levels[i].id != ""
                                                    && loadsites.sites[randomint].levels[i].level != "") {
                                                    LEVELS_ARRAY.push([
                                                        loadsites.sites[randomint].levels[i].id,
                                                        loadsites.sites[randomint].levels[i].level,
                                                        loadsites.sites[randomint].levels[i].linkPattern,
                                                        ""
                                                    ]);
                                                    if (DEBUGGING1) { console.warn("Testing Line 189"); }
                                                }
                                            }
                                            if (LEVELS_ARRAY.length > 0) {
                                                if (DEBUGGING1) { console.warn("Testing Line 193"); }
                                                if (EXTENSION_TAB_ID == 0) {
                                                    var newtab = await tabs_createnew(loadsites.sites[randomint].url);
                                                    if (DEBUGGING1) { console.warn("Testing Line 196"); }
                                                } else {
                                                    var newtab = await tabs_updatenew(EXTENSION_TAB_ID, loadsites.sites[randomint].url);
                                                    if (DEBUGGING1) { console.warn("Testing Line 199"); }
                                                }

                                                if (DEBUGGING) { console.log("Created new tab with links " + loadsites.sites[randomint].url.substring(0, 20)); }
                                                if (newtab != null && newtab != "false") {
                                                    if (EXTENSION_TAB_ID == 0 && parseInt(newtab) > 0) {
                                                        EXTENSION_TAB_ID = newtab;
                                                    }
                                                    if (DEBUGGING1) { console.warn("Testing Line 207"); }
                                                    TIMEOUT_OF_PAGE = setTimeout(clean_all, W.TIMEOUTS.LINKSNOTLOADAFTER, false); // if page not load after 55 secs
                                                    W.TIMEOUTS.LINKSPAGETIMEOUTRAND = randomNumber(W.TIMEOUTS.LINKSPAGETIMEOUT, W.TIMEOUTS.LINKSPAGETIMEOUTMAX);
                                                    setTimeout(async function () {
                                                        if (DEBUGGING1) { console.warn("Testing Line 210"); }
                                                        var codeload = await load_js(EXTENSION_TAB_ID, "./content_src/content.js");
                                                        if (codeload == "true") {
                                                            codeload = await load_js_code(EXTENSION_TAB_ID, "all_from_patters_return_msg(\"" + window.btoa(JSON.stringify([LEVELS_ARRAY[0]])) + "\");");
                                                            if (DEBUGGING1) { console.warn("Testing Line 214"); }
                                                            if (codeload == "true") {
                                                            } else { clean_all(false); return false; }
                                                        } else { clean_all(false); return false; }
                                                        if (DEBUGGING1) { console.warn("Testing Line 216"); }
                                                    }, W.TIMEOUTS.LINKSPAGETIMEOUTRAND);
                                                } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 220"); } return false; }
                                            } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 221"); } return false; }
                                        } catch (ex) { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 222"); } return false; }
                                    } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 223"); } return false; }
                                } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 224"); } return false; }
                            } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 225"); } return false; }
                        } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 226"); } return false; }
                    } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 227"); } return false; }
                } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 228"); } return false; }
            } else { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 229"); } return false; }
        }
    } catch (ex) { clean_all(false); if (DEBUGGING1) { console.warn("Testing Line 231"); } return false; }
}

function doestabegxists(tabid) {
    if (DEBUGGING1) { console.warn("Testing Line 235"); }
    return new Promise(function (resolve) {
        chrome.tabs.get(parseInt(tabid), function (data) {
            if (chrome.runtime.lastError) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

function randomNumber(min, max) {  
    return Math.random() * (max - min) + min; 
}

async function clean_all(data) {
    if (DEBUGGING1) { console.warn("Testing Line 248"); }
    SITE_ID = "";
    SAVE_TRAFFIC = "";
    /*if(data){*/
    var tabexists = await doestabegxists(EXTENSION_TAB_ID);
    if (!tabexists) {
        EXTENSION_TAB_ID = 0;
    }

    var isIncognito = await is_incognito_allowed();
    if(isIncognito && INCOGNITO_WINDOW_ID > 0 && data) {
        await tabs_removenew(null);
        EXTENSION_TAB_ID = 0;
        INCOGNITO_WINDOW_ID = 0;
    }

    clearTimeout(TIMEOUT_OF_PAGE);
    /*}*/
    //if(!data){
    //await tabs_removenew(EXTENSION_TAB_ID);
    //}
    LINK = "";
    LEVEL = "";
    //if(!data){
    //EXTENSION_TAB_ID = 0;
    //}
    WORKINPROGRESS = false;
    LEVELS_ARRAY = [];
    PROXY_ID = "";
    W.AUTH.PASS = "";
    W.AUTH.USER = "";
    await clearproxysettings();
    await clearproxysettings();
    //LOAD AFTER ALL DONE
    if(data) {
        loadbrowseraction();
    }
}
async function loadinit() {

    /* clean all */
    SITE_ID = "";
    SAVE_TRAFFIC = "";
    var tabexists = await doestabegxists(EXTENSION_TAB_ID);
    if (!tabexists) {
        EXTENSION_TAB_ID = 0;
    }
    var alltabs = await load_all_tabs();

    /*remove unnesesarry tabs on each pass if there is some*/
    if (alltabs != null && alltabs.length != null && parseInt(alltabs.length) > 0) {
        var length = alltabs.length;
        var removed = null;
        var newone = null;
        for (var i = 0, l = length; i < l; i++) {
            if (alltabs != null && alltabs[i] != null && alltabs[i].id != null && parseInt(alltabs[i].id) > 0 && alltabs[i].id != EXTENSION_TAB_ID) {
                length--;
                if (length > 1) {
                    removed = await tabs_removenew(alltabs[i].id);
                }
            }
        }
    }
    /*remove unnesesarry tabs on each pass if there is some*/
    clearTimeout(TIMEOUT_OF_PAGE);
    LINK = "";
    LEVEL = "";
    WORKINPROGRESS = false;
    LEVELS_ARRAY = [];
    PROXY_ID = "";
    W.AUTH.PASS = "";
    W.AUTH.USER = "";
    await clearproxysettings();
    await clearproxysettings();

    /*clean all*/
    if (DEBUGGING1) { console.warn("Testing Line 278"); }
    var login_status = await if_user_is_logged_in();
    if (login_status != null && login_status != "" && login_status == "true") {
        if (DEBUGGING1) { console.warn("Testing Line 281"); }
        chrome.browserAction.setBadgeText({ "text": "" });
        whilefunctionwork();
    } else {
        if (DEBUGGING1) { console.warn("Testing Line 285"); }
        chrome.browserAction.setBadgeBackgroundColor({ "color": "#ff0000" });
        chrome.browserAction.setBadgeText({ "text": "IN" });
    }
}
function loadbrowseraction() {
    if (DEBUGGING1) { console.warn("Testing Line 291"); }
    clearInterval(INTERVAL_TIMEOUT);
    INTERVAL_TIMEOUT = false;
    INTERVAL_TIMEOUT = setInterval(loadinit, W.TIMEOUTS.INTERVALTIME);
    loadinit();
}


// Get random user agent string from config array.
function getRandomUserAgent() {
    var ua = W.USER_AGENTS[Math.floor(Math.random() * W.USER_AGENTS.length)]
    return ua;
}
// Given a UserAgent object, will replace the "User-Agent" header in the
// map provided as requestHeaders.
function replaceHeader(user_agent, requestHeaders) {
    // if (!user_agent)
    //     return requestHeaders;
    var newHeaders = [];
    for (var i = 0; i < requestHeaders.length; i++) {
        if (requestHeaders[i].name != "User-Agent") {
            newHeaders.push(requestHeaders[i]);
        } else {
            var new_value = requestHeaders[i].value;
            if (user_agent != "")
                new_value = user_agent;
            newHeaders.push({
                "name": "User-Agent",
                "value": new_value
            });
        }
    }
    newHeaders.push({
        "name": "X-Device-MR",
        "value": "0"
    });
    console.log(newHeaders)
    return newHeaders;
}
// Adds listeners that handle modifying headers on any request that comes through.
// Really only needs to be called once.
// The Listener can *not* be a callback.  It *must* be blocking.
function updateListeners() {
    if (!listener) {
        console.log("Adding Listeners for modifying requests")
        listener = function(details) {
            console.log(details)
            console.log(USER_AGENT)
            // We only want to modify requests that have a URL, and that have headers.
            // Any others are not interesting enough to have their headers modified.
            var header_map = {
                requestHeaders: details.requestHeaders
            };
            if (details && details.url && details.requestHeaders && details.requestHeaders.length > 0) {
                header_map = {
                    requestHeaders: replaceHeader(USER_AGENT, details.requestHeaders)
                };
            }
            return header_map;
        };
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(listener, {
            "urls": ["http://*/*", "https://*/*"]
        },
        ["requestHeaders", "blocking"]);
}

// Content blocker - block images without parameters in URL (non-tracking)
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (SAVE_TRAFFIC == 1) {
      var checkUrl = details.url.toLowerCase();
      for (var i = 0; i < W.SKIP.length; i++) {
        if (checkUrl.endsWith(W.SKIP[i]) && checkUrl.indexOf('google') < 0) {
          // console.log(details);
          return { cancel: true };
        }
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

updateListeners();
loadbrowseraction();