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

function saveEdit() {
  let inputs = document.getElementById("My_form");
  var username = inputs.elements[0].value;
  var employee_id = inputs.elements[1].value;
  var email = inputs.elements[2].value;
  var password = inputs.elements[3].value;

  
  validation(username, employee_id, email, password, function (isValid) {
      if (isValid) {
          
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                  console.log("response==>", this.response);
                  var msg=this.response;
                  if(msg=="success"){
                    displaySuccessMessage("Successfully Changed Details!!")
                  }
                  else{
                    displayErrorMessage("Failed to changed Details.Try again!!")
                  }
              }
          };
          xhttp.open("POST", "/saveEditUser", true);
          xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send("username=" + username + "&employee_id=" + employee_id + "&email=" + email + "&password=" + password);
      } else {
          console.log("Validation failed");
      }
  });
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


const checkPasswordValidity = (value) => {
  console.log('password!!!')
  const isNonWhiteSpace = /^\S*$/;
  if (!isNonWhiteSpace.test(value)) {
    return "Password must not contain Whitespaces.";
  }

  const isContainsUppercase = /^(?=.*[A-Z]).*$/;
  if (!isContainsUppercase.test(value)) {
    return "Password must have at least one Uppercase Character.";
  }

  const isContainsLowercase = /^(?=.*[a-z]).*$/;
  if (!isContainsLowercase.test(value)) {
    return "Password must have at least one Lowercase Character.";
  }

  const isContainsNumber = /^(?=.*[0-9]).*$/;
  if (!isContainsNumber.test(value)) {
    return "Password must contain at least one Digit.";
  }

  const isContainsSymbol =
    /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;
  if (!isContainsSymbol.test(value)) {
    return "Password must contain at least one Special Symbol.";
  }

  const isValidLength = /^.{10,16}$/;
  if (!isValidLength.test(value)) {
    return "Password must be 10-16 Characters Long.";
  }

  return null;
}

function validation(username, employee_id, email, password, callback) {
  const isWhitespaceString = str => !str.trim().length;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isWhitespaceString(username) || isWhitespaceString(email) || isWhitespaceString(password)) {
      displayErrorMessage("Spaces are not allowed in any field.");
      callback(false); 
  } else if (!re.test(email)) {
      displayErrorMessage("Email format is wrong. Example: ruban@gmail.com.");
      callback(false);
  } else {
      const message = checkPasswordValidity(password);
      if (!message) {
          console.log("Password is okay");
          const xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function () {
              if (this.readyState == 4) {
                  if (this.status == 200) {
                      const responseData = JSON.parse(this.responseText);
                      const max = handleResponse(responseData);
                      console.log(max);
                      callback(max); 
                  } else {
                      displayErrorMessage("An error occurred while processing your request.");
                      callback(false); 
                  }
              }
          };
          xhttp.open("POST", "/checkIfExists", true);
          xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send("username=" + encodeURIComponent(username) + "&email=" + encodeURIComponent(email));
      } else {
          console.log("Password is not okay");
          displayErrorMessage(message);
          callback(false); 
      }
  }
}
function validationEdit(username, employee_id, email, password, callback) {
  const isWhitespaceString = str => !str.trim().length;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (isWhitespaceString(username) || isWhitespaceString(email) || isWhitespaceString(password)) {
      displayErrorMessage("Spaces are not allowed in any field.");
      callback(false); 
  } else if (!re.test(email)) {
      displayErrorMessage("Email format is wrong. Example: ruban@gmail.com.");
      callback(false);
  } else {
      const message = checkPasswordValidity(password);
      if (!message) {
          console.log("Password is okay");
          callback(true);
          
      } else {
          console.log("Password is not okay");
          displayErrorMessage(message);
          callback(false); 
      }
  }
}


function handleResponse(responseData) {
  console.log(responseData)
  for (const data of responseData) {
      if (data.field === 'username' && data.message === 'Username already exists.') {
          displayErrorMessage("Username already exists.");
      } else if (data.field === 'email' && data.message === 'Email already exists.') {
          displayErrorMessage("Email already exists.");
      }
      else{
        return true;
      }
  }
}

function displayErrorMessage(message) {
  const newDiv = document.createElement("div");
  newDiv.className = "alert alert-danger";
  newDiv.id = "div";
  newDiv.style.textAlign = "center";
  newDiv.role = "alert";
  newDiv.textContent = message;
  const parent = document.getElementById("row");
  parent.appendChild(newDiv);
  setTimeout(() => {
      $("#div").delay(5000).fadeOut(500, function () {
          $(this).remove();
      });
  }, 1000);
}
function displaySuccessMessage(message) {
  const newDiv = document.createElement("div");
  newDiv.className = "alert alert-success";
  newDiv.id = "div";
  newDiv.style.textAlign = "center";
  newDiv.role = "alert";
  newDiv.textContent = message;
  const parent = document.getElementById("row");
  parent.appendChild(newDiv);
  setTimeout(() => {
      $("#div").delay(5000).fadeOut(500, function () {
          $(this).remove();
      });
  }, 1000);
}

function addUser() {
  let inputs = document.getElementById("My_form");
  var username = inputs.elements[0].value;
  var employee_id = inputs.elements[1].value;
  var email = inputs.elements[2].value;
  var password = inputs.elements[3].value;
 
  validation(username, employee_id, email, password, function(validated) {
      if (validated) {
          console.log("Validation passed. Proceeding to send AJAX request.");
          
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  var msg = this.response;
                  console.log("Response:", msg);
                  if (msg == "Your account was successfully created.") {
                      displaySuccessMessage(msg);
                  } else {
                      displayErrorMessage(msg);
                  }
              }
          };
          xhttp.open("POST", "/userManagement", true);
          xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send("username=" + encodeURIComponent(username) + "&employee_id=" + encodeURIComponent(employee_id) + "&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));
      } else {
          console.log("Validation failed. Cannot proceed.");
         
      }
  });
}


 
