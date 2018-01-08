var g_sipData;
/*global firewall_hint_port_number_valid_char,firewall_hint_port_empty,common_success,isAjaxReturnOK,saveAjaxData,object2xml,isButtonEnable,clearAllErrorLabel,firewall_label_dmz_ip_address_invalid,dialup_hint_ip_address_empty,showErrorUnderTextbox,$,button_enable,onRadioChange,getAjaxData,xml2object,isValidIpAddress,showErrorUnderTextbox,showInfoDialog*/

function checked_ck() {
    if ($('#enable_sip_alg').get(0).checked == true) {
        $('#sip_port').attr('disabled', '');
    }
    else if ($('#enable_sip_alg').get(0).checked == false) {
        $('#sip_port').attr('disabled', 'disabled');
        $('#sip_port').val(g_sipData.SipPort);
    }
}

function initPage() {
    getAjaxData('api/security/sip', function($xml) {
        var ret = xml2object($xml);
        g_sipData = ret.response;
        $('#enable_sip_alg').get(0).checked = (g_sipData.SipStatus == 1) ? true : false;
        $('#sip_port').val(g_sipData.SipPort);
        checked_ck();
    });
}

function validateSIP() {
    var ret = true;
    var sipEnable = $('#enable_sip_alg').get(0).checked ? 1 : 0;
    var sipPort = $('#sip_port').val();
    if (sipEnable == 1) {
        if (isNaN(sipPort) || $.trim($('#sip_port').val()) == ''||$.trim($('#sip_port').val()).indexOf('.')>-1) {
            showErrorUnderTextbox('sip_port', firewall_hint_port_empty);
            $('#sip_port').focus();
            ret = false;
        }
        else if ((sipPort < 1) || (sipPort > 65535)) {
            showErrorUnderTextbox('sip_port', firewall_hint_port_number_valid_char);
            $('#sip_port').focus();
            ret = false;
        }
    }
    return ret;
}

function apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button')) {
        return;
    }

    if (validateSIP() == true) {
        g_sipData.SipStatus = $('#enable_sip_alg').get(0).checked ? 1 : 0;
        g_sipData.SipPort = $.trim($('#sip_port').val());
        var xmlstr_sip = object2xml('request', g_sipData);
        saveAjaxData('api/security/sip', xmlstr_sip, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                button_enable('apply_button', '0');
                $('#sip_port').val($.trim($('#sip_port').val()));
                showInfoDialog(common_success);
            }
            else
            {
                showInfoDialog(common_failed);
                setTimeout('initPage()', 3000);
            }
        });
    }
}

$(document).ready(function() {

    initPage();
    button_enable('apply_button', '0');

    $('#apply_button').click(function() {
        apply();
    });
    $('#enable_sip_alg').click(function() {
        checked_ck();
    });
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });
});
