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
                        "Mozilla/5.0 (Linux; Android 12; Pixel 6 Build/SD1A.210817.023; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/94.0.4606.71 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 11; Pixel 5 Build/RQ3A.210805.001.A1; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.159 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 10; Google Pixel 4 Build/QD1A.190821.014.C2; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0; HTC One X10 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.98 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3",
                        "Mozilla/5.0 (iPhone14,6; U; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19E241 Safari/602.1",
                        "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
                        "Mozilla/5.0 (iPhone13,2; U; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
                        "Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
                        "Mozilla/5.0 (iPhone12,1; U; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/15E148 Safari/602.1",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
                        "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1",
                        "Mozilla/5.0 (Apple-iPhone7C2/1202.466; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3",
                        "Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254",
                        "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.1058",
                        "Mozilla/5.0 (Linux; Android 12; SM-X906C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 11; Lenovo YT-J706X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0.1; SGP771 Build/32.2.A.0.253; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 6.0.1; SHIELD Tablet K1 Build/MRA58K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/55.0.2883.91 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 7.0; SM-T827R4 Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.116 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T550 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.3 Chrome/38.0.2125.102 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80 Safari/537.36",
                        "Mozilla/5.0 (Linux; Android 5.0.2; LG-V410/V41020c Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/34.0.1847.118 Safari/537.36",
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
                        "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36",
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
                        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36",
                        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1",
                        "Dalvik/2.1.0 (Linux; U; Android 9; ADT-2 Build/PTT5.181126.002)",
                        "Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36",
                        "Roku4640X/DVP-7.70 (297.70E04154A)",
                        "Mozilla/5.0 (Linux; Android 9; AFTWMST22 Build/PS7233; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.152 Mobile Safari/537.36",
                        "AppleTV11,1/11.1",
                        "AppleTV5,3/9.1.1",
                        "Mozilla/5.0 (PlayStation; PlayStation 5/2.26) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15",
                        "Mozilla/5.0 (PlayStation 4 3.11) AppleWebKit/537.73 (KHTML, like Gecko)",
                        "Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+",
                        "Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US",
                        "Mozilla/5.0 (Nintendo Switch; WifiWebAuthApplet) AppleWebKit/601.6 (KHTML, like Gecko) NF/4.0.0.5.10 NintendoBrowser/5.1.0.13343",
                        "Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/13.10586",
                        "Mozilla/5.0 (PlayStation Vita 3.61) AppleWebKit/537.73 (KHTML, like Gecko) Silk/3.2",
                    ]

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
function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
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
            var new_value = randomChoice(user_agent_list)
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