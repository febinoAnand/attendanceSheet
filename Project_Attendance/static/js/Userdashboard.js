btnDisplay()

function btnDisplay(){
    let btn_div=document.getElementById("btn")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response)
            try {
                
                let response;
                response = JSON.parse(this.response);
                console.log(response.status);
                var dataHTMLformat=''
                if (response.status === "check-in") {
                    dataHTMLformat+='<button id="myBtn" value="check-out" class="red_btn" type="submit" onclick="check('+response.user_id+')">Check Out</button>'

                } else if (response.status === "check-out") {
                    dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn" type="submit" onclick="check('+response.user_id+')">Check In</button>'
                } else {
                    dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn" type="submit" onclick="check('+response.user_id+')">Check In</button>'
                }
                btn_div.innerHTML=dataHTMLformat;
            } catch (error) {
                console.log("Error parsing JSON:", error);
            }
        }
    };
    xhttp.open("POST", "/btnDisplay/", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("send");
}


function check(user_id) {
    var status = document.getElementById("myBtn").value
    let btn_div=document.getElementById("btn")
    console.log("btn value",status);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        var dataHTMLformat=''
        if (this.readyState == 4 && this.status == 200) {
            var msg=this.response;
            if(msg=="Saved"){
                dataHTMLformat+='<button id="myBtn" value="check-out" class="red_btn" type="submit" onclick="check('+user_id+')">Check Out</button>'
            }
            else if(msg="updated"){
                dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn" type="submit" onclick="check('+user_id+')">Check In</button>'
            }
            else{
                alert("error")
            }
            btn_div.innerHTML=dataHTMLformat;
            console.log(this.response);
        }
    };
    xhttp.open("POST", "/check/", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("user_id=" + Number(user_id) + "&status=" + status);
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
