document.getElementById("My_form").addEventListener("submit", (e) => {
    e.preventDefault();
});
console.log("testing..");


function form_input() {
    let inputs = document.getElementById("My_form");
    let table_tr = document.getElementById("tbody");
    let from_date = inputs.elements[0].value;
    let to_date = inputs.elements[1].value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response);
            let responseData = JSON.parse(this.response);
            let data = responseData.checkinout_data;
            var dataHTMLformat = '';
            data.forEach(function(item) {
                let checkOutTime = item.check_out_time ? convertTimeFormat(item.check_out_time) : 'Not Checkout';
                dataHTMLformat += '<tr><td>.</td><td>' + item.user + '</td><td>' + item.employee_id + '</td><td>' + item.date + '</td><td>' + item.check_in_time + '</td><td>' + checkOutTime + '</td></tr>';
            });
            table_tr.innerHTML = dataHTMLformat;
        }
    };
    xhttp.open("POST", "/AdminHistoryTable", true);
    xhttp.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("From_date=" + from_date + "&To_date=" + to_date);
}
function convertTimeFormat(timeString) {
    let date = new Date('2000-01-01T' + timeString);
    let formattedTime = formatDate(date);
    return formattedTime;
}
function formatDate(date) {
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let meridiem = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    let formattedTime = `${hour}:${padZero(minute)} ${meridiem}`;
    return formattedTime;
}
function padZero(number) {
    return number < 10 ? '0' + number : number;
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