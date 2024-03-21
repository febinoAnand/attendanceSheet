document.getElementById("My_form").addEventListener("submit", (e) => {
  e.preventDefault();
});
function del(user_id){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response)
        }
    };
    xhttp.open("POST", "/deleteUser", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("user_id="+user_id);
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
function edit(user_id){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let responseData = JSON.parse(this.response)

        if (responseData.length > 0) {
          let user = responseData[0];

          user_id=user.id;
          var a = document.getElementsByName("username");
          var b = document.getElementsByName("employee_id");
          var c = document.getElementsByName("email");

          if (a.length > 0) a[0].value = user.username;
          if (b.length > 0) b[0].value = user.employee_id;
          if (c.length > 0) c[0].value = user.email;
        }
      }
  };
  xhttp.open("POST", "/editUser", true);
  xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("user_id="+user_id);
}

function saveEdit(){
  let inputs = document.getElementById("My_form");
  var username=inputs.elements[0].value;
  var employee_id=inputs.elements[1].value;
  var email=inputs.elements[2].value;
  var password=inputs.elements[3].value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("response==>",this.response)
        }
      
  };
  xhttp.open("POST", "/saveEditUser", true);
  xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+username+"&employee_id="+employee_id+"&email="+email+"&password="+password);
}
function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        var cell = td[j];
        if (cell) {
          txtValue = cell.textContent || cell.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
            break; 
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }
function addUser() {
  let inputs = document.getElementById("My_form");
  var username=inputs.elements[0].value;
  var employee_id=inputs.elements[1].value;
  var email=inputs.elements[2].value;
  var password=inputs.elements[3].value;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log("response==>",this.response)
        }
  };
  xhttp.open("POST", "/userManagement", true);
  xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+username+"&employee_id="+employee_id+"&email="+email+"&password="+password);
}
function activeId(id,userId,currentIsActive) {

  var button = document.getElementById(userId);

  var newIsActive = currentIsActive === 'True' ? 'False' : 'True';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
          if (this.status == 200) {
              var responseData = JSON.parse(this.responseText);
              if (responseData.hasOwnProperty('is_active')) {
   
                  if(responseData.is_active == "True"){
         
                    button.innerText = "Active";
                    button.className="isActive_true"
                    button.onclick = function() {
                      var newIsActive = 'True';
                      activeId(id,userId, newIsActive);
                  };
                  }
                  else if(responseData.is_active == "False"){
        
                    button.innerText = "Inactive";
                    button.className="isActive_false"
                    button.onclick = function() {
                      var newIsActive = 'False';
                      activeId(id,userId, newIsActive);
                  }
              } 
              }
          } else {
              console.error("Error:", this.statusText);
          }
      }
  };
  xhttp.open("POST", "/updateIsActive", true);
  xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("userId=" + id + "&isActive=" + newIsActive);
}



