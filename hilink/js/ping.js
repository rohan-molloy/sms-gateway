// JavaScript Document
var PING_TIMEOUT = 2000;

var ping_bolIsTimeout;
var ping_intStartTime;
var ping_intTimerID;
var ping_objIMG = new Image();
var ping_ipAddress = 0;

function ping_timeout()
{
    ping_bolIsTimeout = true;
    var strEnd = ping_objIMG.src.lastIndexOf("/");
    ping_objIMG.src = ping_objIMG.src.substring(0, strEnd);
    ping();
}

function ping()
{
    /*
    * 发送请求
    */
    ping_intStartTime = +new Date();

    ping_objIMG.src = ping_objIMG.src + ping_intStartTime;
    ping_bolIsTimeout = false;

    /*
    * 超时计时
    */
    ping_intTimerID = setTimeout(ping_timeout, PING_TIMEOUT);
}

function startPing()
{
    ping_objIMG.src = "http://" + ping_ipAddress + "/";
    ping_objIMG.onload = 
    ping_objIMG.onerror =
    function()
    {
        /*
        * 有回应,取消超时计时
        */
        clearTimeout(ping_intTimerID);

        if(ping_bolIsTimeout)
        {
            return;
        }
        gotoPageWithoutHistory("http://" +  ping_ipAddress + "/html/index.html");
    }
    ping();
}

function ping_setPingAddress(ipAddress)
{
    ping_ipAddress = ipAddress;
}
