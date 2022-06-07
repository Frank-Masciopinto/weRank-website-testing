
function store_ip_api_call() {
    return new Promise(function (resolve) {
        jQuery.ajax({
            url: W.URL.MY_IP,
            cache: false,
            method: "GET",
            dataType: "text",
            success: function (data) {
                if (data == null || data == "") {
                    data = {};
                } else {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        data = {};
                    }
                }
                if (data != null && data.ip != null && data.ip != "") {
                    if (data.ip == MY_IP_STORE) {
                        resolve("false");
                        clean_all(false);
                        return false;
                    } else {
                        if (DEBUGGING) {
                            console.log("Data IP >> " + data.ip);
                        }
                        MY_IP_STORE = data.ip;
                        chrome.storage.local.set({ "last_stored_ip": data.ip });
                        resolve(data.ip);
                        return false;
                    }
                } else {
                    resolve("false");
                    clean_all(false);
                    return false;
                }
            },
            error: function (data, statustxt) {
                resolve("false");
            }
        });
    });
}

function get_ip_latest() {
    return new Promise(function (resolve) {
        chrome.storage.local.get(["last_stored_ip"], function (result) {
            if (result != null && result.last_stored_ip != null && result.last_stored_ip != "") {
                MY_IP_STORE = result.last_stored_ip;
            } else {
                MY_IP_STORE = "";
            }
            resolve("true");
        });
    });
}


function if_user_is_logged_in() {
    return new Promise(function (resolve) {
        jQuery.ajax({
            url: W.URL.LOGIN_CHECK,
            cache: false,
            method: "GET",
            dataType: "text",
            success: function (data) {
                if (data == null || data == "") {
                    data = {};
                } else {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        data = {};
                    }
                }
                if (data != null && data.isAuthenticated != null && data.isAuthenticated == true) {
                    resolve("true");
                } else {
                    resolve("false");
                    clean_all(false);
                }
            },
            error: function (data, statustxt) {
                resolve("false");
                clean_all(false);
            }
        });
    });
}
function setup_proxy(ip, login, pass, port) {
    return new Promise(function (resolve) {
        if (login == null || login == "" || pass == null || pass == "" || port == null || parseInt(port) <= 0 || ip == null || ip == "") {
            resolve("false");
            return false;
        }

        if (login.indexOf('lum') >= 0)
            login += '-session-' + SESSION++;

        W.AUTH.PASS = pass;
        W.AUTH.USER = login;
        var config = {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "http",
                    host: ip,
                    port: parseInt(port)
                }
            }
        };
        try {
            chrome.proxy.settings.set(
                { value: config, scope: "regular" },
                function (data) {
                    if (chrome.runtime.lastError) {
                        W.AUTH.PASS = "";
                        W.AUTH.USER = "";
                        resolve("false");
                    } else {
                        resolve("true");
                    }
                });
        } catch (ex) {
            W.AUTH.PASS = "";
            W.AUTH.USER = "";
            resolve("false");
        }
    });
}
function load_all_sites() {
    return new Promise(function (resolve) {
        jQuery.ajax({
            url: W.URL.SITE_LIST + WL.TRAFLIST,
            cache: false,
            method: "GET",
            dataType: "text",
            success: function (data) {
                if (data == null || data == "") {
                    data = {};
                } else {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        data = {};
                    }
                }
                if (data != null && data.sites != null) {
                    resolve(data);
                } else {
                    resolve("false");
                    clean_all(false);
                }
            },
            error: function (data, statustxt) {
                resolve("false");
                clean_all(false);
            }
        });
    });
}

function login_api_call(user, pass) {
    return new Promise(function (resolve) {
        if (user == null || !(typeof user === "string" || user instanceof String) || user == "") {
            resolve("false");
            return false;
        }
        if (pass == null || !(typeof pass === "string" || pass instanceof String) || pass == "") {
            resolve("false");
            return false;
        }

        var formdataurl = new URLSearchParams();
        formdataurl.set("api", "1");
        formdataurl.set("AdminLoginForm[email]", user);
        formdataurl.set("AdminLoginForm[password]", pass);
        formdataurl.set("AdminLoginForm[rememberMe]", "1");

        jQuery.ajax({
            url: W.URL.LOGIN,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1"
            },
            data: formdataurl.toString(),
            cache: false,
            contentType: false,
            processData: false,
            method: "POST",
            dataType: "text",
            success: function (data) {
                if (data == null || data == "") {
                    data = {};
                } else {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        data = {};
                    }
                }
                if (data != null && data.authenticated != null && data.authenticated == true) {
                    resolve("true");
                    return false;
                } else {
                    resolve("false");
                    clean_all(false);
                    return false;
                }
            },
            error: function (data, statustxt) {
                resolve("false");
                clean_all(false);
                return false;
            }
        });
    });
}

function link_level_pass(linkpass, levelpass) {
    if (linkpass == null || !(typeof linkpass === "string" || linkpass instanceof String) || linkpass == "") {
        clean_all(true);
        return false;
    }
    if (levelpass == null || !(typeof levelpass === "string" || levelpass instanceof String) || levelpass == "") {
        clean_all(true);
        return false;
    }
    var formdataurl = new URLSearchParams();
    formdataurl.set("levelId", levelpass);
    formdataurl.set("proxyId", PROXY_ID);
    formdataurl.set("url", linkpass);
    jQuery.ajax({
        url: W.URL.TRACK_CLICK,
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
            if (DEBUGGING) { console.log("TRACK_CLICK Api call, Done >> \n" + linkpass); }
        },
        error: function (data, statustxt) {
            if (DEBUGGING) { console.log("TRACK_CLICK Api call, Fail >> \n" + linkpass); }
            clean_all(false);
        }
    });
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    var extensionid = chrome.runtime.id;
    if (extensionid == sender.id) {
        if (message.type == "login_app") {
            if (message != null && message.name != null && message.pass != null && message.name != "" && message.pass != "") {
                var response = await login_api_call(message.name, message.pass);
                if (response == "true") {
                    await createnotif("", "Login OK.\nWebranks Starting.");
                    loadbrowseraction();
                    //setTimeout(function(){popup_blanko();}, 3000); 
                    //setTimeout(function(){popup_blanko();}, 6000); 
                } else {
                    await createnotif("", "Login Invalid.");
                }
            }
        }
        if (message.type == "login_check") {
            await createnotif("", "\nWebranks is working (" + WL.TRAFLIST + ").");
            loadbrowseraction();
        }
        if (message.type == "page_with_links_return") {
            if (message.data != null) {
                page_with_links_return(message.data);
            }
        }
    }
});

const getRandomResolution = () => {
    const len = resolutions.length;
    const randomResolution = ((Math.random() * len) | 0) % len;
    return W.resolutions[randomResolution].split('x').map(item => item.trim() | 0);
};

const resizeWindowByTab = (tabId) => new Promise((resolve) => {
    getTab(tabId).then((tab) => {
        console.log('resizeWindowByTab', tabId, tab);
        const { windowId } = tab;
        const [ height, width ] = getRandomResolution();
        console.log('\tresizeWindow', height, width);
        chrome.windows.update(
            windowId,
            { height, width },
            resolve
        );
    });
});

function tabs_updatenew(tab_id, tab_url) {
    return new Promise(function (resolve) {
        try {
            //resizeWindowByTab(tabId).then(() => {
                chrome.tabs.update(parseInt(tab_id), { "url": tab_url, "active": true }, function (tab) {
                    if (chrome.runtime.lastError) {
                        resolve("false");
                    } else {
                        if (tab != null && tab.id != null && parseInt(tab.id) > 0) {
                            resolve(parseInt(tab.id));
                        } else {
                            resolve("false");
                        }
                    }
                });
            //})
        } catch (ex) {
            resolve("false");
        }
    });
}

function is_incognito_allowed() {
    return new Promise(function (resolve) {
        chrome.extension.isAllowedIncognitoAccess(function (allowed) {
            resolve(allowed);
        });
    });
}

function tab_created_callback(data, isIncognito, resolve) {
    var tab = isIncognito ? data.tabs[0] : data;

    if (isIncognito) {
        INCOGNITO_WINDOW_ID = data.id;
    }

    if (chrome.runtime.lastError) {
        resolve("false");
    } else {
        if (tab != null && tab.id != null && parseInt(tab.id) > 0) {
            resolve(parseInt(tab.id));
        } else {
            resolve("false");
        }
    }
}

function tabs_createnew(tab_url) {
    return new Promise(function (resolve) {
        try {

            is_incognito_allowed().then(function (isAllowed) {
                if (isAllowed) {
                    chrome.windows.create({ "url": tab_url, "incognito": true, "state": "maximized", "focused": true }, function (win) {
                        tab_created_callback(win, true, resolve);
                    });
                } else {
                    chrome.tabs.create({ "url": tab_url, "active": true }, function (win) {
                        tab_created_callback(win, false, resolve);
                    });
                }
            });
        } catch (ex) {
            resolve("false");
        }
    });
}

function tabs_removenew(tab_id) {
    return new Promise(function (resolve) {
        try {
            if (INCOGNITO_WINDOW_ID && INCOGNITO_WINDOW_ID > 0) {
                chrome.windows.remove(INCOGNITO_WINDOW_ID, function () {
                    if (chrome.runtime.lastError) {
                        resolve("false");
                    } else {
                        INCOGNITO_WINDOW_ID = 0;
                        resolve("true");
                    }
                });
            } else {
                chrome.tabs.remove(parseInt(tab_id), function () {
                    if (chrome.runtime.lastError) {
                        resolve("false");
                    } else {
                        resolve("true");
                    }
                });
            }
        } catch (ex) {
            resolve("false");
        }
    });
}
