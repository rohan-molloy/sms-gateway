
var g_wlan_basicData = null;    //xml list of basic settings
var g_wlan_securityData = null; // xml list of security settings

var WIFIAUTHMODE_AUTO = 'AUTO';
var WIFIAUTHMODE_OPEN = 'OPEN';
var WIFIAUTHMODE_SHARE = 'SHARE';
var WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var WIFIADVENCRYPMODE_AES = 'AES';
var WIFIADVENCRYPMODE_TKIP = 'TKIP';
var WIFIADVENCRYPMODE_MIX = 'MIX';
var WIFIBASICENCRYPMODE_NONE = 'NONE';
var WIFIBASICENCRYPMODE_WEP = 'WEP';
var WIFIBASICENCRYPMODE_WEP64 = 'WEP64';
var WIFIBASICENCRYPMODE_WEP128 = 'WEP128';
var g_WifiFeature = null;

function wlanbasicsettings_networkKey(key, ssid) {
    var keyData = g_wlan_securityData;
    var anotherSSID = null;
    if (g_module.multi_ssid_enabled)
    {
        var idx = ssid.charAt(ssid.length - 1) - 1;
        keyData = g_wlan_basicData[idx];
        anotherSSID = (ssid == 'ssid1') ? 'ssid2' : 'ssid1';
    }

    $('#' + ssid + '_neworkKey1').val(keyData.WifiWepKey1);
    $('#' + ssid + '_neworkKey2').val(keyData.WifiWepKey2);
    $('#' + ssid + '_neworkKey3').val(keyData.WifiWepKey3);
    $('#' + ssid + '_neworkKey4').val(keyData.WifiWepKey4);

    if (key == WIFIBASICENCRYPMODE_NONE)
    {

        $('#' + ssid + '_network_key').hide();
        if (!g_module.multi_ssid_enabled ||
            ($('#' + anotherSSID + '_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE &&
                $('#' + anotherSSID + '_authentication').val() == WIFIAUTHMODE_OPEN))
        {
            $('#checkbox_password').hide();
        }
    }
    else if (key == WIFIBASICENCRYPMODE_WEP)
    {
        $('#' + ssid + '_network_key').show();

        $('#' + ssid + '_current_network_key').val(keyData.WifiWepKeyIndex);
        $('#checkbox_password').show();
    }
    else
    {
    }
}

function wlanbasicsettings_initPage() {
   if (typeof(g_PageUrlTree.settings.wlan.wps) != 'undefined'){
        $('#wpsbasic_p').html( IDS_wlan_message_encryption_catuion );                
    } else {
        $('#wpsbasic_p').html(setting_IDS_wlan_message_encryption_catuion_nowps);
    }
   getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_basicData = ret.response;
        $('#ssid1_wifiName').val(g_wlan_basicData.WifiSsid);
        $("input[name='mode'][value=" + g_wlan_basicData.WifiEnable + ']').attr('checked', true);
        $("input[name='ssid1_wifiBroadcast']").get(g_wlan_basicData.WifiHide).checked = true;
    });

    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_securityData = ret.response;
        var authMode = g_wlan_securityData.WifiAuthmode;

		setTimeout(function() {
			$('#ssid1_authentication').val(authMode);
		}, 1);
        

        $('#ssid1_encryption_mode_basic').val(g_wlan_securityData.WifiBasicencryptionmodes);
        $('#ssid1_encryption_mode_wpa').val(g_wlan_securityData.WifiWpaencryptionmodes);
        $('#ssid1_current_network_key').val(g_wlan_securityData.WifiWepKeyIndex);
        $('#ssid1_wpa_key').val(g_wlan_securityData.WifiWpapsk);

    if (WIFIAUTHMODE_AUTO == authMode ||
        WIFIAUTHMODE_OPEN == authMode ||
        WIFIAUTHMODE_SHARE == authMode)
    {
            $('#div_ssid1_encrypt_way1').show();
            $('#div_ssid1_encrypt_way2').hide();

            if (WIFIAUTHMODE_SHARE == authMode ||
            WIFIAUTHMODE_AUTO == authMode)
            {
                $("#ssid1_encryption_mode_basic option[value='NONE']").remove();
            }
            else
            {
                if ($("#ssid1_encryption_mode_basic option[value='NONE']").length == 0)
                {
                    $('#ssid1_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                }
            }

            $('#ssid1_encryption_mode_basic').val(g_wlan_securityData.WifiBasicencryptionmodes);

            wlanbasicsettings_networkKey($('#ssid1_encryption_mode_basic').val(), 'ssid1');
            $('#ssid1_caution').show();
        }
        else
        {
            $('#div_ssid1_encrypt_way2').show();
            $('#div_ssid1_encrypt_way1').hide();
        }
    });

}


function wlanbasicsettings_multiSSID_initPage() {
    if (typeof(g_PageUrlTree.settings.wlan.wps) != 'undefined'){
        $('#wpsbasic_p').html( IDS_wlan_message_encryption_catuion );                
    } else {
        $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_nowps);
    }
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_securityData = ret.response;
        $("input[name='mode'][value=" + g_wlan_securityData.WifiEnable + ']').attr('checked', true);
    });

    var ssids = ['ssid1', 'ssid2'];

    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_basicData = ret.response.Ssids.Ssid;

        //SSID1,2 Initialization
        var i = 0;
        for (i = 0; i < ssids.length; i++)
        {
            var wbs = 'input[name=' + ssids[i] + '_wifiBroadcast]';
            $('input[name=' + ssids[i] + '_wifiBroadcast][value=' + g_wlan_basicData[i].WifiBroadcast + ']').attr('checked', true);
            $('#' + ssids[i] + '_wifiIsolate').val(g_wlan_basicData[i].WifiIsolate);

            var authMode = g_wlan_basicData[i].WifiAuthmode;

            $('#' + ssids[i] + '_wifiName').val(g_wlan_basicData[i].WifiSsid);
			setTimeout(function() {
				$('#' + ssids[i] + '_authentication').val(authMode);
			}, 1);

            $('#' + ssids[i] + '_encryption_mode_basic').val(g_wlan_basicData[i].WifiBasicencryptionmodes);
            $('#' + ssids[i] + '_encryption_mode_wpa').val(g_wlan_basicData[i].WifiWpaencryptionmodes);
            $('#' + ssids[i] + '_current_network_key').val(g_wlan_basicData[i].WifiWepKeyIndex);
            $('#' + ssids[i] + '_wpa_key').val(g_wlan_basicData[i].WifiWpapsk);

        if (WIFIAUTHMODE_AUTO == authMode ||
            WIFIAUTHMODE_OPEN == authMode ||
            WIFIAUTHMODE_SHARE == authMode)
            {
                $('#div_' + ssids[i] + '_encrypt_way1').show();
                $('#div_' + ssids[i] + '_encrypt_way2').hide();

                if (WIFIAUTHMODE_SHARE == authMode ||
                WIFIAUTHMODE_AUTO == authMode)
                {
                    $('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").remove();
                }
                else
                {
                    if ($('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").length == 0)
                    {
                        $('#' + ssids[i] + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                    }
                }

                $('#' + ssids[i] + '_encryption_mode_basic').val(g_wlan_basicData[i].WifiBasicencryptionmodes);

                wlanbasicsettings_networkKey($('#' + ssids[i] + '_encryption_mode_basic').val(), ssids[i]);
                $('#' + ssids[i] + '_caution').show();
            }
            else
            {
                $('#div_' + ssids[i] + '_encrypt_way2').show();
                $('#div_' + ssids[i] + '_encrypt_way1').hide();
            }
        }
    });

}

function wlanbasicsettings_authentication(lable, ssid) {
    if (lable == WIFIAUTHMODE_AUTO || lable == WIFIAUTHMODE_OPEN || lable == WIFIAUTHMODE_SHARE)
    {
        $('#div_' + ssid + '_encrypt_way1').show();
        $('#div_' + ssid + '_encrypt_way2').hide();

        if (WIFIAUTHMODE_SHARE == lable || WIFIAUTHMODE_AUTO == lable)
        {
            $('#' + ssid + "_encryption_mode_basic option[value='NONE']").remove();
        }
        else
        {
            if ($('#' + ssid + "_encryption_mode_basic option[value='NONE']").length == 0)
            {
                $('#' + ssid + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
            }

            $('#' + ssid + '_encryption_mode_basic').val(WIFIBASICENCRYPMODE_WEP);
        }

        wlanbasicsettings_networkKey($('#' + ssid + '_encryption_mode_basic').val(), ssid);

        if ('ssid1' == ssid)
        {
            $('#ssid1_caution').show();
        }
        else
        {
            $('#ssid2_caution').show();
        }
    }
    else if (lable == WIFIAUTHMODE_WPA_PSK ||
    lable == WIFIAUTHMODE_WPA2_PSK ||
    lable == WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        $('#checkbox_password').show();
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        //
        if ('ssid1' == ssid)
        {
            $('#ssid1_caution').hide();
        }
        else
        {
            $('#ssid2_caution').hide();
        }
        $('#' + ssid + '_encryption_mode_wpa').val(WIFIADVENCRYPMODE_MIX);
    }
    else
    {
    }
}

function wlanbasicsettings_multiSSID_postData()
{
    var postData = {};
    var ssids = ['ssid1', 'ssid2'];
    var i = 0;

    for (i = 0; i < ssids.length; i++)
    {
        g_wlan_basicData[i].WifiSsid = $('#' + ssids[i] + '_wifiName').val();

        g_wlan_basicData[i].WifiBroadcast = $('[name=' + ssids[i] + '_wifiBroadcast]:checked').val();
        g_wlan_basicData[i].WifiIsolate = (common_on == $('#' + ssids[i] + '_wifiIsolate').val()) ? 1 : 0;

        var wifiAuthMode = $('#' + ssids[i] + '_authentication').val();
        g_wlan_basicData[i].WifiAuthmode = wlanbasicsettings_getWifiAuthVal(wifiAuthMode);

        if (wifiAuthMode == WIFIAUTHMODE_WPA_PSK ||
            wifiAuthMode == WIFIAUTHMODE_WPA2_PSK ||
            wifiAuthMode == WIFIAUTHMODE_WPA_WPA2_PSK)
        {

            g_wlan_basicData[i].WifiWpaencryptionmodes = $('#' + ssids[i] + '_encryption_mode_wpa').val();
            g_wlan_basicData[i].WifiWpapsk = $('#' + ssids[i] + '_wpa_key').val();
        }
        else if (wifiAuthMode == WIFIAUTHMODE_AUTO ||
            wifiAuthMode == WIFIAUTHMODE_OPEN ||
            wifiAuthMode == WIFIAUTHMODE_SHARE)
        {
            var bem = $('#' + ssids[i] + '_encryption_mode_basic').val();

            if (WIFIBASICENCRYPMODE_WEP == bem)
            {
                g_wlan_basicData[i].WifiWepKey1 = $('#' + ssids[i] + '_neworkKey1').val();
                g_wlan_basicData[i].WifiWepKey2 = $('#' + ssids[i] + '_neworkKey2').val();
                g_wlan_basicData[i].WifiWepKey3 = $('#' + ssids[i] + '_neworkKey3').val();
                g_wlan_basicData[i].WifiWepKey4 = $('#' + ssids[i] + '_neworkKey4').val();
            }

            g_wlan_basicData[i].WifiWepKeyIndex = $('#' + ssids[i] + '_current_network_key').val();
            g_wlan_basicData[i].WifiBasicencryptionmodes = bem;

        }
        else
        {
        }
    }

    button_enable('apply_button', '0');
    $(':input').attr('disabled', 'disabled');
    postData = {
        Ssids: {
            Ssid: g_wlan_basicData
        },
        WifiRestart: 0
    };

    var xmlStr = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        $(':input').attr('disabled', '');
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_multiSSID_initPage();
        }
    });

    g_wlan_securityData.WifiEnable = $("[name='mode']:checked").val();
    g_wlan_securityData.WifiRestart = 1;
    xmlStr = object2xml('request', g_wlan_securityData);
    saveAjaxData('api/wlan/multi-security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').attr('disabled', '');
        if (isAjaxReturnOK(ret))
        {
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_multiSSID_initPage();
        }
    });
}

function wlanbasicsettings_postData()
{
    g_wlan_basicData.WifiSsid = $.trim($('#ssid1_wifiName').val());
    g_wlan_basicData.WifiEnable = $("[name='mode']:checked").val();
    g_wlan_basicData.WifiHide = $("[name='ssid1_wifiBroadcast']:checked").val();
    g_wlan_basicData.WifiRestart = 0;

    var xmlStr = object2xml('request', g_wlan_basicData);
    $(':input').attr('disabled', 'disabled');
    saveAjaxData('api/wlan/basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').attr('disabled', '');
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_initPage();
        }
    });

    // save authentication and encryption
    g_wlan_securityData.WifiAuthmode = $('#ssid1_authentication').val();
    g_wlan_securityData.WifiRestart = 1;
    var wifiAuthmode = g_wlan_securityData.WifiAuthmode;
    if (wifiAuthmode == WIFIAUTHMODE_WPA_PSK ||
    wifiAuthmode == WIFIAUTHMODE_WPA2_PSK ||
    wifiAuthmode == WIFIAUTHMODE_WPA_WPA2_PSK)
    {

        g_wlan_securityData.WifiWpaencryptionmodes = $('#ssid1_encryption_mode_wpa').val();
        g_wlan_securityData.WifiWpapsk = $('#ssid1_wpa_key').val();
    }
    else if (wifiAuthmode == WIFIAUTHMODE_AUTO ||
    wifiAuthmode == WIFIAUTHMODE_OPEN ||
    wifiAuthmode == WIFIAUTHMODE_SHARE)
    {
        g_wlan_securityData.WifiWepKey1 = $('#ssid1_neworkKey1').val();
        g_wlan_securityData.WifiWepKey2 = $('#ssid1_neworkKey2').val();
        g_wlan_securityData.WifiWepKey3 = $('#ssid1_neworkKey3').val();
        g_wlan_securityData.WifiWepKey4 = $('#ssid1_neworkKey4').val();
        g_wlan_securityData.WifiWepKeyIndex = $('#ssid1_current_network_key').val();
        g_wlan_securityData.WifiBasicencryptionmodes = $('#ssid1_encryption_mode_basic').val();
    }
    else
    {
    }

    button_enable('apply_button', '0');

    xmlStr = object2xml('request', g_wlan_securityData);
    saveAjaxData('api/wlan/security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').attr('disabled', '');
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_initPage();
        }
    });
}

function wlanbasicsettings_checkName(ssid) {
    var name = $.trim($('#' + ssid + '_wifiName').val());
    var errMsg = common_ok;
    var i = 0;

    if (0 == name.length)
    {
        errMsg = wlan_hint_ssid_empty;
    }
    else if (hasSpaceOrTabAtHead(name))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (32 < name.length)
    {
        errMsg = wizard_help_name_ssid;
    }
    else
    {
        for (i = 0; i < name.length; i++)
        {
            var c = name.charCodeAt(i);
            if ((c >= CHARCODE_0 && c <= CHARCODE_9) ||
            (c >= CHARCODE_A && c <= CHARCODE_Z) ||
            (c >= CHARCODE_a && c <= CHARCODE_z) ||
            c == CHARCODE_DASH ||
            c == CHARCODE_UNDERLINE ||
            c == CHARCODE_DOT ||
            c == CHARCODE_SPACE
            )
            {
                continue;
            }
            else
            {
                errMsg = wlan_hint_ssid_valid_char;
                break;
            }
        }
    }

    if (common_ok != errMsg)
    {
        showErrorUnderTextbox(ssid + '_wifiName', errMsg);
        $('#' + ssid + '_wifiName').focus();
        $('#' + ssid + '_wifiName').select();
        return false;
    }
    else
    {
        return true;
    }
}

function wlanbasicsettings_checkNetworkKeyPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (10 == pwdVal.length || 26 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_64_or_128_bit_key;
        }
        else
        {
            ret = true;
        }
    }
    else if (5 == pwdVal.length || 13 == pwdVal.length)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wep_key_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_64_or_128_bit_key;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function wlanbasicsettings_checkWapPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (64 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else if (pwdVal.length >= 8 && pwdVal.length <= 63)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_char;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_wps_psk_valid_type;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function wlanbasicsettings_checkWifiSecurity(ssid) {
    var strNetworkKey = $('#' + ssid + '_current_network_key').val();
    var authMethod = $('#' + ssid + '_authentication').val();
    var bscEncptMode = $('#' + ssid + '_encryption_mode_basic').val();

    if (authMethod == WIFIAUTHMODE_WPA_PSK ||
    authMethod == WIFIAUTHMODE_WPA2_PSK ||
    authMethod == WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        return wlanbasicsettings_checkWapPwd(ssid + '_wpa_key');
    }
    else
    {
        if (WIFIBASICENCRYPMODE_NONE != bscEncptMode)
        {
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey1'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey2'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey3'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey4'))
            {
                return false;
            }
        }
    }

    return true;
}

function wlanbasicsettings_showPassword() {
    var cbValue = $('#check_wpa_psk').attr('checked');
    var strType = cbValue ? 'text' : 'password';
    $.each($('input[name=ssid_key_name]'), function(i) {
        $("<input id='" + $(this).attr('id') + "' name='ssid_key_name' type='" + strType + "' class='input_style' maxlength='"+$(this).attr('maxlength')+"' value='" + $(this).val() + "' />")
            .replaceAll($('#' + $(this).attr('id')));

    });
}

function wlanbasicsettings_apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    if (!g_module.multi_ssid_enabled)
    {
        var auth = $('#ssid1_authentication').val();

        if (wlanbasicsettings_checkName('ssid1') && wlanbasicsettings_checkWifiSecurity('ssid1'))
        {
            if (WIFIAUTHMODE_AUTO == auth ||
            WIFIAUTHMODE_OPEN == auth ||
            WIFIAUTHMODE_SHARE == auth)
            {
                if ($('#ssid1_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE)
                {
                    showConfirmDialog(wlan_hint_use_encryption, wlanbasicsettings_postData);
                    $('#ssid1_wifiName').val($.trim($('#ssid1_wifiName').val()));
                    return;
                }
            }

            wlanbasicsettings_postData();
            $('#ssid1_wifiName').val($.trim($('#ssid1_wifiName').val()));
        }
    }
    else
    {
        var auth1 = $('#ssid1_authentication').val();
        var auth2 = $('#ssid2_authentication').val();
        var ssid1_encryption_mode = $("#ssid1_encryption_mode_basic").val();
        var ssid2_encryption_mode = $("#ssid2_encryption_mode_basic").val();
        if (wlanbasicsettings_checkName('ssid1') && wlanbasicsettings_checkWifiSecurity('ssid1') &&
        wlanbasicsettings_checkName('ssid2') && wlanbasicsettings_checkWifiSecurity('ssid2'))
        {
            if ((WIFIAUTHMODE_AUTO == auth1 ||
            WIFIAUTHMODE_OPEN == auth1 ||
            WIFIAUTHMODE_SHARE == auth1) ||
            (WIFIAUTHMODE_AUTO == auth2 ||
            WIFIAUTHMODE_OPEN == auth2 ||
            WIFIAUTHMODE_SHARE == auth2)
            )
            {
                if(ssid1_encryption_mode == wlan_label_wep && ssid2_encryption_mode == wlan_label_wep)
                {
                    showInfoDialog(IDS_multi_ssid_message_not_allow_both_wep);
                    setTimeout(refresh,3000);
                    return;
                }
                if ($('#ssid1_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE ||
                $('#ssid2_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE)
                {
                    showConfirmDialog(wlan_hint_use_encryption, wlanbasicsettings_multiSSID_postData);
                    $('#ssid2_wifiName').val($.trim($('#ssid2_wifiName').val()));
                    return;
                }
            }

            wlanbasicsettings_multiSSID_postData();
            $('#ssid2_wifiName').val($.trim($('#ssid2_wifiName').val()));
        }
    }

}

function wifiConfigDataDisplay(){
	if(g_WifiFeature.wifidisplayenable =='1')
	{
	    $('#wlan_module').show();
	}
	else
	{
		$('#wlan_module').hide();
	}
	
	 var varItem_aes = '<option value= ' + WIFIADVENCRYPMODE_AES + '\>' + wlan_label_aes + '</option>';
     var varItem_tkip = '<option value= ' + WIFIADVENCRYPMODE_TKIP + '\>' + wlan_label_tkip + '</option>';
     var varItem_mix = '<option value= ' + WIFIADVENCRYPMODE_MIX + '\>' + wlan_label_aes_tkip + '</option>';
     
     $('#ssid1_encryption_mode_wpa').append(varItem_aes);
     $('#ssid1_encryption_mode_wpa').append(varItem_tkip);
        
     $('#ssid2_encryption_mode_wpa').append(varItem_aes);
     $('#ssid2_encryption_mode_wpa').append(varItem_tkip);
        
	if(g_WifiFeature.wifiencryption_mix_enable !='0')
    {
         $('#ssid1_encryption_mode_wpa').append(varItem_mix);
         $('#ssid2_encryption_mode_wpa').append(varItem_mix);
    }
}
function main_executeBeforeDocumentReady(){
	getConfigData('config/wifi/config.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
    }, {
        sync: true
    });
}
main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready(function() {
    wifiConfigDataDisplay();
    $('#check_wpa_psk').get(0).checked = false;
    $('#tooltips_ico_help').qtip({
        content: '<b>' + wlan_label_encryption_mode + '</b>:' + wlan_label_aes + ',' + wlan_label_tkip + ',' + wlan_label_aes_tkip,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });

    button_enable('apply_button', '0');
    $('input').live('keydown click', function() {//change input paste cut
        button_enable('apply_button', '1');
    });

    $('input:checkbox').click(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_showPassword();
    });

    $('#ssid1_current_network_key').change(function() {
        button_enable('apply_button', '1');
    });

    $('#ssid1_authentication').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_authentication(this.value, 'ssid1');
    });

    $('#ssid1_encryption_mode_basic').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_networkKey(this.value, 'ssid1');
    });

    $('#ssid2_authentication').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_authentication(this.value, 'ssid2');
    });

    $('#ssid2_encryption_mode_basic').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_networkKey(this.value, 'ssid2');
    });

    $('#ssid1_encryption_mode_wpa, #ssid2_encryption_mode_wpa').change(function() {
        button_enable('apply_button', '1');
    });

    if (!g_module.multi_ssid_enabled)
    {
        $('#SSID2').hide();
        $('#id_ssid1_h2_name').hide();
        $('#id_tr_ssid1_wifiIsolate').hide();
        wlanbasicsettings_initPage();
    }
    else
    {
        wlanbasicsettings_multiSSID_initPage();
    }

});
