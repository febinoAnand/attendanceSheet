function del(user_id){
    console.log(user_id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response)
        }
    };
    xhttp.open("POST", "/deleteUser/", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("user_id="+user_id);
}
function getCookie(name) {
    // Split cookies by semicolon
    var cookieArray = document.cookie.split(';');
    
    // Loop through each cookie
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        
        // Check if cookie starts with the given name
        if (cookie.startsWith(name + '=')) {
            // Extract and return the value of the cookie
            return cookie.substring(name.length + 1);
        }
    }
    // Return null if cookie not found
    return null;
}