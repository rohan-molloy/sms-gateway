var g_dmzData;
var g_dhcpData;
/*global common_success,isAjaxReturnOK,saveAjaxData,object2xml,isButtonEnable,clearAllErrorLabel,firewall_label_dmz_ip_address_invalid,dialup_hint_ip_address_empty,showErrorUnderTextbox,$,button_enable,onRadioChange,getAjaxData,xml2object,isValidIpAddress,showErrorUnderTextbox,showInfoDialog*/

function updateDmzRadioStatus() {
    if ($("[name='dmz_status']:checked").val() == 0) {
        $('#dmz_ip_address').attr('disabled', 'disabled');
          $('#dmz_ip_address').val(g_dmzData.DmzIPAddress);
    }
    else {
        $('#dmz_ip_address').attr('disabled', '');
    }
}

function initPage() {
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_dhcpData = ret.response;
        }
    });

    getAjaxData('api/security/dmz', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_dmzData = ret.response;
            $("input[name='dmz_status'][value=" + g_dmzData.DmzStatus + ']').attr('checked', true);
            $('#dmz_ip_address').val(g_dmzData.DmzIPAddress);
            updateDmzRadioStatus();
        }
    });
}

function isSameBeforThreeAddrs(ip1,ip2){
    var addrParts1 = ip1.split(".");
    var addrParts2 = ip2.split(".");
    for (i = 0; i < 3; i++) 
    {
        if ((Number(addrParts1[i]))  != (Number(addrParts2[i])) ) 
        {
            return false;
        }
    }
    return true;
}
function validateDmz() {
    var dmzIP = $('#dmz_ip_address').val();
    var checkIPResult = isValidIpAddress(dmzIP);
    if (false == checkIPResult) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (false == isSameBeforThreeAddrs(dmzIP, g_dhcpData.DhcpIPAddress))
    {
        showErrorUnderTextbox('dmz_ip_address', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (false == isBroadcastOrNetworkAddress(dmzIP, g_dhcpData.DhcpLanNetmask)) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    if (dmzIP == g_dhcpData.DhcpIPAddress) {
        showErrorUnderTextbox('dmz_error', dialup_hint_ip_address_empty);
        $('#dmz_ip_address').focus();
        return false;
    }
    return true;
}

function apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    if (validateDmz()) {
        g_dmzData.DmzStatus = $("[name='dmz_status']:checked").val();
        g_dmzData.DmzIPAddress = $('#dmz_ip_address').val();
        var xmlstr = object2xml('request', g_dmzData);
        button_enable('apply_button', '0');
        saveAjaxData('api/security/dmz', xmlstr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(common_success);
            }
            else {
                button_enable('apply_button', '1');
                initPage();
            }
        });
    }
}
$(document).ready(function() {
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });
    $("[name='dmz_status']").click(function() {
        updateDmzRadioStatus();
    });
    button_enable('apply_button', '0');

    initPage();
});