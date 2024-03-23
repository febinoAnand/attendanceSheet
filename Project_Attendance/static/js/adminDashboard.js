let ampm=document.getElementById("ampm")
function displayTime(){
    let dateTime=new Date();
    let hr=dateTime.getHours();
    let minutes=padZero(dateTime.getMinutes());
    let sec=dateTime.getSeconds();
    let date=dateTime.getDate();
    let month=dateTime.getMonth()+1;
    let year=dateTime.getFullYear();
    let day=dateTime.getDay();
    var myDate = new Date();
    switch(day){
        case 1:
            day="Monday"
            break;
        case 2:
            day="Tuesday"
            break;
        case 3:
            day="Wednesday"
            break;
        case 4:
            day="Thursday"
            break;
        case 5:
            day="Friday"
            break;
        case 6:
            day="Saturday"
            break;
        case 7:
            day="Sunday"
            break;
    }
    if(hr>12){
        hr=hr-12;
        ampm.innerHTML='PM'
    }
    document.getElementById("hr").innerHTML=padZero(hr);
    document.getElementById("minutes").innerHTML=minutes;
    document.getElementById("seconds").innerHTML=padZero(sec);
    document.getElementById("date").innerHTML=`${date}-${padZero(month)}-${year}`;
    document.getElementById("day").innerHTML=day;
}
function padZero(num){
    return num <10?"0"+num:num;
}
setInterval(displayTime,1000)

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
  