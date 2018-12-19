// JavaScript Document
/****************************************************upnp
 * (start)************************************/
/*global log,firewall_hint_port_number_valid_char,firewall_hint_port_empty,common_success,isAjaxReturnOK,saveAjaxData,object2xml,isButtonEnable,clearAllErrorLabel,firewall_label_dmz_ip_address_invalid,dialup_hint_ip_address_empty,showErrorUnderTextbox,$,button_enable,onRadioChange,getAjaxData,xml2object,isValidIpAddress,showErrorUnderTextbox,showInfoDialog*/
var g_upnpStatus;
var g_new_status;

function initPageData() {
    getAjaxData("api/security/upnp", function($xml) {
        var upnp_ret = xml2object($xml);
        if(upnp_ret.type == "response") {
            g_upnpStatus = parseInt(upnp_ret.response.UpnpStatus, 10);
            if(g_upnpStatus == 0) {
                $("#ck_disable").get(0).checked = true;
                $("#ck_enable").get(0).checked = false;
            }
            else {
                $("#ck_disable").get(0).checked = false;
                $("#ck_enable").get(0).checked = true;
            }
        }
        else {
            log.error("Error, no data");
        }

    });
}

function onRadioChange() {
    if($("#ck_enable").get(0).checked) {
        g_new_status = 1;
    }
    else {
        g_new_status = 0;
    }
    if(g_new_status == g_upnpStatus) {
        button_enable("apply", "0");
    }
    else {
        button_enable("apply", "1");
    }
}

function onApply() {
    if(!isButtonEnable("apply")) {
        return;
    }

    g_upnpStatus = g_new_status;
    var request = {
        UpnpStatus : g_upnpStatus
    };
    var xmlstr = object2xml("request", request);
    saveAjaxData("api/security/upnp", xmlstr, function($xml) {
        var rsp = xml2object($xml);
        if(isAjaxReturnOK(rsp)) {
            button_enable("apply", "0");
            showInfoDialog(common_success);
        }
        else {
            initPageData();
        }
    });
}

$(document).ready( function() {
    button_enable("apply", "0");
    $("#ck_enable").click( function() {
        onRadioChange();
    });
    $("#ck_disable").click( function() {
        onRadioChange();
    });
    $("#apply").click( function() {
        onApply();
    });
    initPageData();
});
/****************************************************upnp
 * (end)************************************/