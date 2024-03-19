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