function login() {
    var username = $('#username').val();
    var password = $('#password').val();
    $.ajax({
        url: "signin/" + username,
        type: "GET",
        async: false,
        success: function (data, textStatus, jqXHR) {
            $("#login-message").html('<div class="alert alert-success">Login successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                location.href='/shop.html';
                //location.reload();
            }, 1500); 
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#login-message").html('<div class="alert alert-danger">Invalid login credentials.</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        }
    });
    return false;
}


function signup() {

    var username    = $("[name='username']").val();
    var password    = $("[name='password']").val();
    var repeatedPassword = $("[name='repeatedPassword']").val();
    var firstname   = $("[name='account.firstName']").val();
    var lastname    = $("[name='account.lastName']").val();
    var email       = $("[name='account.email']").val();
    var phone       = $("[name='account.phone']").val();
    var address1    = $("[name='account.address1']").val();
    var address2    = $("[name='account.address2']").val();
    var city        = $("[name='account.city']").val();
    var state       = $("[name='account.state']").val();
    var zip         = $("[name='account.zip']").val();
    var country     = $("[name='account.country']").val();
    

    var language = $("select[name='account.languagePreference']").val(); 
    var favourite =  $("select[name='account.favouriteCategoryId']").val(); 
    
    var mylistopt = $("[name='account.listOption']").prop("checked") == true ? true:false;
    var banneropt = $("[name='account.bannerOption']").prop("checked") == true ? true:false;

    var profile = {
        "userid": username,
        "langpref": language,
        "favcategory": favourite,
        "mylistopt": mylistopt,
        "banneropt": banneropt
    }

    var signon = {
        "username": username,
        "password": password,
        "role": "USER",
        "enabled:": "true"
    }

    var postvals = JSON.stringify({
        "userid": username, 
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "status": "OK",
        "addr1": address1,
        "addr2": address2,
        "city": city,
        "state": state,
        "zip": zip,
        "country": country,
        "phone": phone,
        "signon": signon,
        "profile": profile
    });
    console.log(postvals);
    $.ajax({
        url: "signup",
        type: "POST",
        async: false,
    data: postvals,
        success: function (data, textStatus, jqXHR) {
            $("#registration-message").html('<div class="alert alert-success">Registration successful.</div>');
            console.log('posted: ' + textStatus);
            console.log("logged_in cookie: " + $.cookie('logged_in'));
            setTimeout(function(){
                //location.reload();
                location.href ='/signon.html';
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#registration-message").html('<div class="alert alert-danger">There was a problem with your registration: ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function username(id, callback) {
    console.log("Requesting user account information " + id);
    $.ajax({
        url: "customer/" + id,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            json = JSON.parse(data);
            if (json.status_code !== 500) {   
                callback(json.firstname + " " + json.lastname);
            } else {
                console.error('Could not get user information: ' + id + ', due to: ' + json.status_text + ' | ' + json.error);
                return callback(undefined);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not get user information: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
        }
    });
}

function accounts(id){
     
    console.log("Requesting user account information " + id);

    $.ajax({
        url: "customer/" + id,
        type: "GET",
        success: function (data, textStatus, jqXHR) {
            json = JSON.parse(data); 
            $('#userid').text(json.userid);
            $("[name='username']").val(json.userid);
            $("[name='account.firstName']").val(json.firstname);
            $("[name='account.lastName']").val(json.lastname);
            $("[name='account.email']").val(json.email);
            $("[name='account.phone']").val(json.phone);
            $("[name='account.address1']").val(json.addr1);
            $("[name='account.address2']").val(json.addr2);
            $("[name='account.city']").val(json.city);
            $("[name='account.state']").val(json.state);
            $("[name='account.zip']").val(json.zip);
            $("[name='account.country']").val(json.country); 
            
            $("select[name='account.languagePreference']").val(json.profile.langpref).prop("selected", true);
            $("select[name='account.favouriteCategoryId']").val(json.profile.favcategory).prop("selected", true);
            
            if(json.profile.mylistopt == true) $("[name='account.listOption']").prop("checked", true);
            if(json.profile.banneropt == true) $("[name='account.bannerOption']").prop("checked", true); 
            
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Could not get user information: ' + id + ', due to: ' + textStatus + ' | ' + errorThrown);
        }
    }); 
}

function edit() {

    var username    = $("[name='username']").val();
    var password    = $("[name='password']").val();
    var repeatedPassword = $("[name='repeatedPassword']").val();
    var firstname   = $("[name='account.firstName']").val();
    var lastname    = $("[name='account.lastName']").val();
    var email       = $("[name='account.email']").val();
    var phone       = $("[name='account.phone']").val();
    var address1    = $("[name='account.address1']").val();
    var address2    = $("[name='account.address2']").val();
    var city        = $("[name='account.city']").val();
    var state       = $("[name='account.state']").val();
    var zip         = $("[name='account.zip']").val();
    var country     = $("[name='account.country']").val();
     
    var language = $("select[name='account.languagePreference']").val(); 
    var favourite =  $("select[name='account.favouriteCategoryId']").val(); 
    
    var mylistopt = $("[name='account.listOption']").prop("checked") == true ? true:false;
    var banneropt = $("[name='account.bannerOption']").prop("checked") == true ? true:false;

    var profile = {
        "userid": username,
        "langpref": language,
        "favcategory": favourite,
        "mylistopt": mylistopt,
        "banneropt": banneropt
    }

    console.log(password);
    if(password != ""){
        var signon = {
            "username": username,
            "password": password,
            "role": "USER",
            "enabled:": "true"
        }
    }

    var postvals = JSON.stringify({
        "userid": username, 
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "status": "OK",
        "addr1": address1,
        "addr2": address2,
        "city": city,
        "state": state,
        "zip": zip,
        "country": country,
        "phone": phone,
        "signon": signon,
        "profile": profile
    });

    console.log(postvals); 
    $.ajax({
        url: "signup/" + username,
        type: "POST",
        async: false,
        data: postvals,
        success: function (data, textStatus, jqXHR) {
            $("#registration-message").html('<div class="alert alert-success">Registration and login successful.</div>');
            console.log('posted: ' + textStatus); 
            setTimeout(function(){
                location.reload(); 
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#registration-message").html('<div class="alert alert-danger">There was a problem with your registration: ' + errorThrown + '</div>');
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });
    return false;
}

function addItemToCart(itemId){

    var postvals = JSON.stringify({
        "itemId": itemId, 
        "quantity": 1
    });
    
    console.log(postvals);
    
    $.ajax({
        url: "carts",
        type: "POST",
        async: false,
        data: postvals, 
        success: function (data, textStatus, jqXHR) {  
            setTimeout(function(){
                location.href='/cart.html'
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) { 
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });     
}


function deleteItem(itemId){
    $.ajax({
        url: "carts/" + itemId + "/item",
        type: "DELETE",
        async: false, 
        success: function (data, textStatus, jqXHR) {  
            setTimeout(function(){
                location.reload(); 
            }, 1500);
        },
        error: function (jqXHR, textStatus, errorThrown) { 
            console.log('error: ' + JSON.stringify(jqXHR));
            console.log('error: ' + textStatus);
            console.log('error: ' + errorThrown);
        },
    });     
}

function logout() {
    $.removeCookie('logged_in');
    location.href = '/shop.html';
    //location.reload();
}
