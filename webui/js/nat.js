// JavaScript Document
/****************************************************nat (start)************************************/

var natStatus;
var new_status;

$(document).ready(function(){
     button_enable("apply", "0");
    $("#ck_enable").click(function(){
        onRadioChange();
    });
    $("#ck_disable").click(function(){
        onRadioChange();
    });
    $("#button_apply").click(function(){
        onApply();
    });
    initPageData();
});

function initPageData()
{   
    getAjaxData("api/security/nat", function($xml){
        var upnp_ret = xml2object($xml);
        natStatus = parseInt(upnp_ret.response.NATType, 10);
        if (natStatus == 0)
        {
            $("#ck_disable").get(0).checked = true;
            $("#ck_enable").get(0).checked = false;
        }
        else
        {
            $("#ck_disable").get(0).checked = false;
            $("#ck_enable").get(0).checked = true;
        }
    });
}


function onRadioChange()
{
    if ($("#ck_enable").get(0).checked)
    {
        new_status = 1;
    }
    else
    {
        new_status = 0;
    }
    if (new_status == natStatus)
    {
        button_enable("apply", "0");
    }
    else
    {
        button_enable("apply", "1");
    }
}

function onApply()
{
    if (!isButtonEnable("apply")){
        return;
    }

    natStatus = new_status;
    var request = {
        NATType: natStatus
    };
    var xmlstr = object2xml("request", request);
    saveAjaxData("api/security/nat", xmlstr, function($xml){
        var rsp = xml2object($xml);
        if(isAjaxReturnOK(rsp))
        {
            button_enable("apply", "0");
            showInfoDialog(common_success);
        }
        else
        {
            initPageData();
        }
    });
}
    


/****************************************************nat (end)************************************/