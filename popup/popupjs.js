var HIDE_POPUP = false;
jQuery.ajax({
    url: W.URL.LOGIN_CHECK,
    cache: false,
    method: "GET",
    dataType: "text",
    success: function(data){
        if (data == null || data == ""){
            data = {};
        }else{
            try{
                data = JSON.parse(data);
            }catch(err){
                data = {};
            }	
        }
        $("#traflist").val(WL.TRAFLIST);
        if(data != null && data.isAuthenticated != null && data.isAuthenticated == true){
            HIDE_POPUP = true;
            chrome.runtime.sendMessage({"type":"login_check"});
            window.close();
        }else{
            
        }
    },
    error: function(){
    }
});


$( document ).ready(function() {
    $("body").hide();
    jQuery.ajax({
        url: W.URL.LOGIN_CHECK,
        cache: false,
        method: "GET",
        dataType: "text",
        success: function(data){
            if(HIDE_POPUP == true){
                return false;
            }
            if (data == null || data == ""){
                data = {};
            }else{
                try{
                    data = JSON.parse(data);
                }catch(err){
                    data = {};
                }	
            }
            if(data != null && data.isAuthenticated != null && data.isAuthenticated == true){
                chrome.runtime.sendMessage({"type":"login_check"});
                window.close();
            }else{
                $("body").show();
            }
        },
        error: function(){
            $("body").show();
        }
    });
    $("#email, #password").on("change paste keyup input propertychange", function(){
        var name, pass = "";
        name =  $("#email").val();
        pass =  $("#password").val();
        if(name != null && name.trim() != ""){
          localStorage.setItem("name", name.trim());
        }
        if(pass != null && pass.trim() != ""){
          localStorage.setItem("pass", pass.trim());
        }
    });
    if(localStorage.getItem("name") != null && localStorage.getItem("name") != ""){
        $("#email").val(localStorage.getItem("name"));
    }
    if(localStorage.getItem("pass") != null && localStorage.getItem("pass") != ""){
        $("#password").val(localStorage.getItem("pass"));
    }
    $("#formio").submit(function(e){
        e.preventDefault();
        var name, pass = "";
        name =  $("#email").val();
        pass =  $("#password").val();
        $("#email").val("");
        $("#password").val("");
        localStorage.clear();
        chrome.runtime.sendMessage({"type":"login_app","name":name,"pass":pass});
    });
});