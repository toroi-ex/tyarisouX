let timer = document.getElementById("timer");
let start = document.getElementById("start");
let reset = document.getElementById("reset");

let timerId;

//更新用の変数
let updateTime = 0;

let startTime;

let stopTime = 0;

function timerCount(){
    let min = Math.floor(updateTime/60000);
    let sec = Math.floor(updateTime%60000/1000);
    let ms = updateTime%1000;

    min = ("0"+min).slice(-2);
    sec = ("0"+sec).slice(-2);
    ms = ("0"+ms).slice(-2);

    timer.textContent = min+":"+sec+":"+ms;
}

function countUp(){
    cnt += 1;
    updateTime = Date.now() - startTime;
    timerCount();
        if(!playing){
        clearInterval(timerId);
    }
}

start.addEventListener('click',function(){
    startTime = Date.now();
    timerId = setInterval("countUp()",10);
})

reset.addEventListener('click', function(){
    location.reload();
})
