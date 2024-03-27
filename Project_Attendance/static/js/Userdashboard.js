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
                    dataHTMLformat+='<button id="myBtn" value="check-out" class="red_btn roboto-medium" type="submit" onclick="check('+response.user_id+')">Check Out</button>'

                } else if (response.status === "check-out") {
                    dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn roboto-medium" type="submit" onclick="check('+response.user_id+')">Check In</button>'
                } else {
                    dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn roboto-medium" type="submit" onclick="check('+response.user_id+')">Check In</button>'
                }
                btn_div.innerHTML=dataHTMLformat;
            } catch (error) {
                console.log("Error parsing JSON:", error);
            }
        }
    };
    xhttp.open("POST", "/btnDisplay", true);
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
                console.log(msg)
                dataHTMLformat+='<button id="myBtn" value="check-out" class="red_btn roboto-medium" type="submit" onclick="check('+user_id+')">Check Out</button>'
                msg="You are checking in at "
                msg+=getCurrentDateTimeString()
                msg+="."
                alert_info(msg)   
            }
            else if(msg="updated"){
                console.log(msg)
                dataHTMLformat+='<button id="myBtn" value="check-in" class="green_btn roboto-medium" type="submit" onclick="check('+user_id+')">Check In</button>'
                msg="You are checking out at "
                msg+=getCurrentDateTimeString()
                msg+="."
                alert_info(msg)
            }
            else{
                alert("error")
            }
            btn_div.innerHTML=dataHTMLformat;
            console.log(this.response);
        }
    };
    xhttp.open("POST", "/check", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("user_id=" + Number(user_id) + "&status=" + status);
}

function getCookie(name) {
    var cookieArray = document.cookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i].trim();
        
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function alert_error(msg){
    console.log("error")
    const newDiv = document.createElement("div");
        newDiv.className="alert alert-danger roboto-medium";
        newDiv.id="div"
        newDiv.style.textAlign="center";
        newDiv.role="alert";
        newDiv.textContent=msg;
        const parent = document.getElementById("row");
        console.log("row"+parent);
        parent.appendChild(newDiv);
        setTimeout(() => {
            $("#div").delay(5000).fadeOut(500);
    }, 1000);
  }
  
  function alert_info(msg){
    console.log("success")
    const newDiv = document.createElement("div");
    newDiv.className="alert alert-warning roboto-medium";
    newDiv.id="div"
    newDiv.style.textAlign="center";
    newDiv.role="alert";
    newDiv.textContent=msg;
    const parent = document.getElementById("row");
    console.log("row"+parent);
    parent.appendChild(newDiv);
    setTimeout(() => {
        $("#div").delay(3000).fadeOut(500);
}, 1000);
  }

  let alertCount = 0; 
  function alert_success(msg) {
      console.log("success")
      const newDiv = document.createElement("div");
      const alertId = "div" + alertCount; 
      newDiv.className = "alert alert-success roboto-medium";
      newDiv.id = alertId;
      newDiv.style.textAlign = "center";
      newDiv.role = "alert";
      newDiv.textContent = msg;
      const parent = document.getElementById("row");
      console.log("row" + parent);
      parent.appendChild(newDiv);
      
      setTimeout(function() {
        newDiv.style.display = 'none';
        newDiv.remove();
    }, 5000);
      
      alertCount++; 
  }
  
  function getCurrentDateTimeString() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    var day = String(currentDate.getDate()).padStart(2, '0');
    var hour = String(currentDate.getHours() % 12 || 12).padStart(2, '0');
    var minute = String(currentDate.getMinutes()).padStart(2, '0');
    var second = String(currentDate.getSeconds()).padStart(2, '0');
    var amOrPm = currentDate.getHours() < 12 ? 'AM' : 'PM'; 
    var currentDateTimeString = day + '-' + month + '-' + year + ' ' + hour + ':' + minute + ':' + second + ' ' + amOrPm;
    return currentDateTimeString;
}



