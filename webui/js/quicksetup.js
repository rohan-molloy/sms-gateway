var g_quicksetup_currentProfileIndex;
var g_quicksetup_profileData;
var g_profile_list = [];
var g_quicksetup_currentProfileData;
var g_quicksetup_wifiSecurityData;
var g_quicksetup_wifiBasicData;
var g_quicksetup_connectionData;
var g_AuFeature = null;
var g_WifiFeature = null;
var quicksetup_autoAPN = null;
var g_quicksetup_saveDataOK = false;
var g_connect_config = '';
var MACRO_DISPLAY = 1;
var CONNECTMODE_AUTO = 0;
var CONNECTMODE_MANUAL = 1;
var QUICKSETUP_WIFIAUTHMODE_AUTO = 'AUTO';
var QUICKSETUP_WIFIAUTHMODE_OPEN = 'OPEN';
var QUICKSETUP_WIFIAUTHMODE_SHARE = 'SHARE';
var QUICKSETUP_WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var QUICKSETUP_WIFIADVENCRYPMODE_AES = 'AES';
var QUICKSETUP_WIFIADVENCRYPMODE_TKIP = 'TKIP';
var QUICKSETUP_WIFIADVENCRYPMODE_MIX = 'MIX';
var QUICKSETUP_WIFIBASICENCRYPMODE_NONE = 'NONE';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP = 'WEP';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP64 = 'WEP64';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP128 = 'WEP128';

function quicksetup_initPage_connection()
{   // get dialup connection
	   getConfigData('config/dialup/connectmode.xml', function($xml) {
        var ret = xml2object($xml);
        if ('config' == ret.type) {         
            g_connect_config = ret.config.ConnectMode;  
        }
    }, {
        sync: true
    });
   if (1 == g_connect_config.Auto) { 
               $('#select_connection_mode').append("<option value='0'>" + common_auto + '</option>');
               $('#authentication_select').append("<option value='0'>" + common_auto + '</option>');  
            }
   if (1 == g_connect_config.Mannual) {        
                $('#select_connection_mode').append("<option value='1'>" + common_manual + '</option>');
                $('#authentication_select').append("<option value='1'>" + common_manual + '</option>');
            }          
    getAjaxData('api/dialup/connection', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_quicksetup_connectionData = ret.response;
			if(MACRO_DISPLAY == g_connect_config.Auto) {
				if(MACRO_DISPLAY == g_connect_config.Mannual) {					
					$('#authentication_select').val(g_quicksetup_connectionData.ConnectMode);
					$('#select_connection_mode').val(g_quicksetup_connectionData.ConnectMode);
					
				} else {					
					$('#authentication_select').val(CONNECTMODE_AUTO);	
					$('#select_connection_mode').val(CONNECTMODE_AUTO);					
				}
			}else{
				if(MACRO_DISPLAY == g_connect_config.Mannual) {
					$('#authentication_select').val(CONNECTMODE_MANUAL);
					$('#select_connection_mode').val(CONNECTMODE_MANUAL);
				} else {
					$('#authentication_select').attr('disabled', 'disabled');
					$('#select_connection_mode').attr('disabled', 'disabled');
				}
			}			
        }      
       } 
    , {
        sync: true
    });
}

function quicksetup_disableIpInput() {
    $('#ipAddress').attr('disabled', 'disabled');
}

function quicksetup_enableIpInput() {
    $('#ipAddress').attr('disabled', '');
}

function quicksetup_disableAPNInput() {
    $('#apn').attr('disabled', 'disabled');
}

function quicksetup_enableAPNInput() {
    $('#apn').attr('disabled', '');
}

function quicksetup_disableProfileInput()
{
    $('#profile_void_caution').html('');
    quicksetup_disableIpInput();
    quicksetup_disableAPNInput();

    $('#profileName').attr('disabled', 'disabled');
    $('#dialupNumber').attr('disabled', 'disabled');
    $('#userName').attr('disabled', 'disabled');
    $('#commonPassword').attr('disabled', 'disabled');
    $('#authentication').attr('disabled', 'disabled');

    $.each($('input[name=wlan_apn]'), function() {
        $(this).attr('disabled', 'disabled');
    });
    $.each($('input[name=wlan_ipAddress]'), function() {
        $(this).attr('disabled', 'disabled');
    });
}

function quicksetup_enableProfileInput()
{
    $('#profile_void_caution').html('');
    quicksetup_disableIpInput();
    quicksetup_disableAPNInput();

    $('#profileName').attr('disabled', '');
    $('#dialupNumber').attr('disabled', '');
    $('#userName').attr('disabled', '');
    $('#commonPassword').attr('disabled', '');
    $('#authentication').attr('disabled', '');

    $.each($('input[name=wlan_apn]'), function() {
        $(this).attr('disabled', '');
    });
    $.each($('input[name=wlan_ipAddress]'), function() {
        $(this).attr('disabled', '');
    });
}

function quicksetup_networkKey(key, ssid) {
    var idx = ssid.charAt(ssid.length - 1) - 1;
    var keyData = g_quicksetup_wifiSecurityData;

    if (g_module.multi_ssid_enabled)
    {
        keyData = g_quicksetup_wifiBasicData[idx];
    }

    if (key == QUICKSETUP_WIFIBASICENCRYPMODE_NONE)
    {
        $('#' + ssid + '_network_key').hide();
    }
    else if (key == QUICKSETUP_WIFIBASICENCRYPMODE_WEP)
    {
        $('#' + ssid + '_network_key').show();
        $('#' + ssid + '_neworkKey1').val(keyData.WifiWepKey1);
    }
    else
    {
    }

    $('#' + ssid + '_encryption_mode_basic').val(key);

}

function quicksetup_initPage_profile()
{
    getAjaxData('api/dialup/profiles', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            //bind item for profile
            g_quicksetup_currentProfileIndex = ret.response.CurrentProfile;
            g_quicksetup_profileData = ret.response.Profiles.Profile;

            if (g_quicksetup_profileData)
            {
                if ($.isArray(g_quicksetup_profileData))
                {
                    g_profile_list = g_quicksetup_profileData;
                }
                else
                {
                    g_profile_list.push(g_quicksetup_profileData);
                }
            }

            $(g_profile_list).each(function(k, v)
            {
                var defaultName = $.trim(v.Name) ;
                while (defaultName.indexOf(' ') >= 0) {    
                    defaultName = defaultName.replace(' ', '&nbsp;');
                }
                $('#profileName').append('<option value=' + v.Index + '>' + defaultName + '</option>');
            });

            function initCurrentProfile(index)
            {

                $.each(g_profile_list, function(ind, current_profile) {
                    if (current_profile.Index == index)
                    {
                        g_quicksetup_currentProfileData = current_profile;
                        return;
                    }
                });

                $('#profileName').val(g_quicksetup_currentProfileData.Index);
                $("#profileName option[text='g_quicksetup_currentProfileData.Name']").attr('selected', true);
                $('#dialupNumber').val(g_quicksetup_currentProfileData.DialupNum);
                $('#userName').val(g_quicksetup_currentProfileData.Username);
                $('#commonPassword').val(g_quicksetup_currentProfileData.Password);
                $("input[name='wlan_apn'][value=" + g_quicksetup_currentProfileData.ApnIsStatic + ']').attr('checked', true);
                $('#apn').val(g_quicksetup_currentProfileData.ApnName);
                $("input[name='wlan_ipAddress'][value=" + g_quicksetup_currentProfileData.IpIsStatic + ']').attr('checked', true);
                $('#authentication').val(g_quicksetup_currentProfileData.AuthMode);

                if (g_quicksetup_currentProfileData.ReadOnly == 0)
                {
                    $('.profile_input').attr('disabled', '');
                    $('#dialupNumber').attr('disabled', 'disabled');

                    // cannot modify APN while apn is dynamic
                    if (g_quicksetup_currentProfileData.ApnIsStatic == 0)
                    {
                        $('#apn').attr('disabled', 'disabled');
                    }
                    // cannot modify IP Address whil ip address is dynamic
                    if (g_quicksetup_currentProfileData.IpIsStatic == 0)
                    {
                        $('#ipAddress').attr('disabled', 'disabled');
                    }

                    if (g_quicksetup_currentProfileData.IpAddress != 0)
                    {
                        $('#ipAddress').val(g_quicksetup_currentProfileData.IpAddress);
                    }
                    else
                    {
                        $('#ipAddress').val('');
                    }

                }
                else
                {
                    if (g_quicksetup_currentProfileData.IpAddress != 0)
                    {
                        $('#ipAddress').val(g_quicksetup_currentProfileData.IpAddress);
                    }
                    else
                    {
                        $('#ipAddress').val('');
                    }

                    $('.profile_input').attr('disabled', 'disabled');
                }

                quicksetup_disableProfileInput();

                if (!(g_module.autoapn_enabled) || (1 != quicksetup_autoAPN))
                {
                    $('#profileName').attr('disabled', '');
                }
            }

            if (g_profile_list.length > 0 && g_quicksetup_currentProfileIndex >= 0)
            {
                initCurrentProfile(g_quicksetup_currentProfileIndex);
                $('#profileName').change(function()
                {
                    initCurrentProfile(this.value);
                });
            }
            else
            {
                quicksetup_disableProfileInput();
                $('#profile_void_caution').html("<a href='profilesmgr.html'>" + dialup_label_profile_management + '</a>');

            }

        }
        button_enable('step2_back', '1');
        button_enable('step2_next', '1');
    });
}

function quicksetup_initPage_autoApn()
{
    getAjaxData('api/dialup/auto-apn', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            quicksetup_autoAPN = parseInt(ret.response.AutoAPN, 10);
        }
        if (0 == quicksetup_autoAPN)
        {
            $('#checkbox_profile_autoapn').get(0).checked = false;
        }
        else
        {
            quicksetup_autoAPN = 1;
            $('#checkbox_profile_autoapn').get(0).checked = true;
        }
        quicksetup_initPage_profile();
    });
}

function quicksetup_initPage_wifi() {
    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_quicksetup_wifiSecurityData = ret.response;
            $('#ssid1_authentication').val(g_quicksetup_wifiSecurityData.WifiAuthmode);
            var wifiAuthmode = g_quicksetup_wifiSecurityData.WifiAuthmode;

            $('#ssid1_neworkKey1').val(g_quicksetup_wifiSecurityData.WifiWepKey1);
            $('#ssid1_encryption_mode_basic').val(g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes);

            $('#ssid1_wpa_key').val(g_quicksetup_wifiSecurityData.WifiWpapsk);
            $('#ssid1_encryption_mode_wpa').val(g_quicksetup_wifiSecurityData.WifiWpaencryptionmodes);

            if (wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_AUTO ||
            wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_OPEN ||
            wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_SHARE)
            {
                $('#div_ssid1_encrypt_way1').show();
                $('#div_ssid1_encrypt_way2').hide();

                if (QUICKSETUP_WIFIAUTHMODE_SHARE == wifiAuthmode ||
                QUICKSETUP_WIFIAUTHMODE_AUTO == wifiAuthmode)
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

                quicksetup_networkKey(g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes, 'ssid1');
            }
            else
            {
                $('#div_ssid1_encrypt_way2').show();
                $('#div_ssid1_encrypt_way1').hide();
            }
        }
    });

    getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_quicksetup_wifiBasicData = ret.response;
            $('#ssid1_wifiName').val(g_quicksetup_wifiBasicData.WifiSsid);
            $('#ssid1_broadcast_select').val(g_quicksetup_wifiBasicData.WifiHide);
        }
    });

}

function quicksetup_initPage_wifiMultiSSID() {
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var ret = xml2object($xml);
        g_quicksetup_wifiSecurityData = ret.response;
    });

    var ssids = ['ssid1', 'ssid2'];

    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_quicksetup_wifiBasicData = ret.response.Ssids.Ssid;

        //SSID1,2 Initialization
        var i = 0;
        for (i = 0; i < ssids.length; i++)
        {
            $('#' + ssids[i] + '_wifiName').val(g_quicksetup_wifiBasicData.WifiSsid);
            $('#' + ssids[i] + '_broadcast_select').val(g_quicksetup_wifiBasicData.WifiBroadcast);

            var authMode = g_quicksetup_wifiBasicData[i].WifiAuthmode;

            $('#' + ssids[i] + '_wifiName').val(g_quicksetup_wifiBasicData[i].WifiSsid);
            $('#' + ssids[i] + '_authentication').val(authMode);

            $('#' + ssids[i] + '_neworkKey1').val(g_quicksetup_wifiBasicData[i].WifiWepKey1);

            $('#' + ssids[i] + '_encryption_mode_basic').val(g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes);
            $('#' + ssids[i] + '_encryption_mode_wpa').val(g_quicksetup_wifiBasicData[i].WifiWpaencryptionmodes);
            $('#' + ssids[i] + '_wpa_key').val(g_quicksetup_wifiBasicData[i].WifiWpapsk);

            if (QUICKSETUP_WIFIAUTHMODE_AUTO == authMode ||
            QUICKSETUP_WIFIAUTHMODE_OPEN == authMode ||
            QUICKSETUP_WIFIAUTHMODE_SHARE == authMode)
            {
                $('#div_' + ssids[i] + '_encrypt_way1').show();
                $('#div_' + ssids[i] + '_encrypt_way2').hide();

                    if (QUICKSETUP_WIFIAUTHMODE_AUTO == authMode ||
                    QUICKSETUP_WIFIAUTHMODE_SHARE == authMode)
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

                quicksetup_networkKey($('#' + ssids[i] + '_encryption_mode_basic').val(), ssids[i]);
            }
            else
            {
                $('#div_' + ssids[i] + '_encrypt_way2').show();
                $('#div_' + ssids[i] + '_encrypt_way1').hide();
            }
        }
    });
}

function quicksetup_initPageData() {

    quicksetup_initPage_connection();
    if (g_module.autoapn_enabled)
    {
        quicksetup_initPage_autoApn();
    }
    else
    {
       $('#tr_profile_autoapn').remove();
       $('#auto_apn_finish').remove();
       quicksetup_initPage_profile();
    }

    if (!g_module.multi_ssid_enabled)
    {
        $('#SSID2').hide();
        $('#ssid2_settings_base').hide();
        $('#id_ssid1_label_name').hide();
        $('#id_ssid1_h3_name').hide();
        $('#id_ssid1_tr_name').hide();
        quicksetup_initPage_wifi();
    }
    else
    {
        quicksetup_initPage_wifiMultiSSID();
    }
}

function quicksetup_onChangeAutoAPN()
{
    button_enable('step2_back', '0');
    button_enable('step2_next', '0');
    quicksetup_autoAPN = $('#checkbox_profile_autoapn').get(0).checked;
    var request = {
        AutoAPN: quicksetup_autoAPN ? 1 : 0
    };
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/dialup/auto-apn', xmlstr, function($xml) {
        quicksetup_initPage_autoApn();
    });
}

function quicksetup_authentication(lable, ssid) {
    if (lable == QUICKSETUP_WIFIAUTHMODE_AUTO ||
    lable == QUICKSETUP_WIFIAUTHMODE_OPEN ||
    lable == QUICKSETUP_WIFIAUTHMODE_SHARE)
    {
        $('#div_' + ssid + '_encrypt_way1').show();
        $('#div_' + ssid + '_encrypt_way2').hide();

        if (QUICKSETUP_WIFIAUTHMODE_AUTO == lable ||
        QUICKSETUP_WIFIAUTHMODE_SHARE == lable)
        {
            $('#' + ssid + "_encryption_mode_basic option[value='NONE']").remove();
            $('#' + ssid + '_encryption_mode_basic').val(QUICKSETUP_WIFIBASICENCRYPMODE_WEP);
        }
        else
        {
            if ($('#' + ssid + "_encryption_mode_basic option[value='NONE']").length == 0)
            {
                $('#' + ssid + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
            }
        }

        quicksetup_networkKey($('#' + ssid + '_encryption_mode_basic').val(), ssid);
    }
    else if (lable == QUICKSETUP_WIFIAUTHMODE_WPA_PSK ||
    lable == QUICKSETUP_WIFIAUTHMODE_WPA2_PSK ||
    lable == QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        $('#checkbox_password').show();
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        $('#' + ssid + '_encryption_mode_wpa').val(QUICKSETUP_WIFIADVENCRYPMODE_MIX);
    }
    else
    {
    }
}

function quicksetup_validateSsid(ssid) {
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

function quicksetup_validateProfile() {
    if (g_profile_list.length == 0)
    {
        $('#profile_void_caution').html("<a href='profilesmgr.html'>" + dialup_label_profile_management + '</a>');
        return false;
    }

    if (g_quicksetup_currentProfileData.ReadOnly == 1)
    {
        // readonly profile, not able to modify, no need to validate
        return true;
    }

    var profileName = $('#profileName').val();
    var dialupNumber = $('#dialupNumber').val();
    var username = $('#userName').val();
    var password = $('#commonPassword').val();
    var apn = $('#apn').val();
    var ipaddress = $('#ipAddress').val();
    var isApnStatic = $("input[name='wlan_apn']:checked").val();
    var isIpStatic = $("input[name='wlan_ipAddress']:checked").val();

    // check profile name
    if (profileName.length > 32 || profileName.length < 1)
    {
        showErrorUnderTextbox('profileName', dialup_hint_profile_name_valid_char);
        $('#profileName').focus();
        $('#profile_input').select();
        return false;
    }
    if (!checkInputChar(profileName))
    {
        showErrorUnderTextbox('profileName', dialup_hint_profile_name_valid_char);
        $('#profileName').focus();
        $('#profileName').select();
        return false;
    }

    /*
    // check dialup number
    if (dialupNumber.Length > 15 || dialupNumber.Length < 1)
    {
        showErrorUnderTextbox("dialupNumber", profile_lable_dialupNumber_length);
        $("#dialupNumber").focus();
        $("#dialupNumber").select();
        return false;
    }
    */

    // check username
    if (username != '' && false == checkInputChar(username)) {
        if (username.length > 32 || username.length < 1)
        {
            showErrorUnderTextbox('userName', dialup_hint_user_name_valid_char);
            $('#userName').focus();
            $('#userName').select();
            return false;
        }
        if (!checkInputChar(username))
        {
            showErrorUnderTextbox('userName', dialup_hint_user_name_valid_char);
            $('#userName').focus();
            $('#userName').select();
            return false;
        }
    }
    // check password
    if (password != '' && false == checkInputChar(password)) {
            if (password.length > 32 || password.length < 1)
            {
                showErrorUnderTextbox('commonPassword', dialup_hint_password_valid_char);
                $('#commonPassword').focus();
                $('#commonPassword').select();
                return false;
            }

        if (!checkInputChar(password))
        {
            showErrorUnderTextbox('commonPassword', dialup_hint_password_valid_char);
            $('#commonPassword').focus();
            $('#commonPassword').select();
            return false;
        }
    }
    // check apn
    if (isApnStatic == '1' && apn.length != 0 && apn != ' ')
    {

        if (apn.length > 32 || apn.length < 1)
        {
            showErrorUnderTextbox('apn', dialup_hint_apn_valid_char);
            $('#apn').focus();
            $('#apn').select();
            return false;
        }
        if (!checkInputChar(apn))
        {
            showErrorUnderTextbox('apn', dialup_hint_apn_valid_char);
            $('#apn').focus();
            $('#apn').select();
            return false;
        }
    }

    // check ip address
    if (isIpStatic == '1')
    {
        if (!isValidIpAddress(ipaddress))
        {
            showErrorUnderTextbox('ipAddress', dialup_hint_ip_address_empty);
            $('#ipAddress').focus();
            $('#ipAddress').select();
            return false;
        }
    }

    return true;
}

function quicksetup_validateNeworkKeyPwd(password) {
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

function quicksetup_validateWepPwd(password) {
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

function quicksetup_ValidateWifiSecurity(ssid) {
    var ifw = $('#' + ssid + '_authentication').val();
    if (ifw == QUICKSETUP_WIFIAUTHMODE_WPA_PSK ||
    ifw == QUICKSETUP_WIFIAUTHMODE_WPA2_PSK ||
    ifw == QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        if (!quicksetup_validateWepPwd(ssid + '_wpa_key'))
        {
            return false;
        }
    }
    else if (ifw == QUICKSETUP_WIFIAUTHMODE_AUTO ||
    ifw == QUICKSETUP_WIFIAUTHMODE_OPEN ||
    ifw == QUICKSETUP_WIFIAUTHMODE_SHARE)
    {
        if ($('#' + ssid + '_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE)
        {
            return true;
        }
        else
        {
            if (!quicksetup_validateNeworkKeyPwd(ssid + '_neworkKey1'))
            {
                return false;
            }
        }
    }

    return true;
}

function quicksetup_showStepLast() {
    var i = 0;
    var ssids = ['ssid1'];

    if (g_module.multi_ssid_enabled)
    {
        ssids.push('ssid2');
        $('#ssid2_settings_final').show();
    }
    else
    {
        $('#ssid2_settings_final').hide();
    }

    for (i = 0; i < ssids.length; ++i)
    {
        var wifiName = '';
        var authMode = $('#' + ssids[i] + '_authentication option:selected').text();
        var authVal = $('#' + ssids[i] + '_authentication').val();
        wifiName = $.trim($('#' + ssids[i] + '_wifiName').val() );
        $('#' + ssids[i] + '_label_name').html('<pre>' + wifiName + '</pre>');
        $('#' + ssids[i] + '_label_authentication').html(authMode);

        if (QUICKSETUP_WIFIAUTHMODE_WPA_PSK == authVal ||
        QUICKSETUP_WIFIAUTHMODE_WPA2_PSK == authVal ||
        QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK == authVal)
        {
             $('#' + ssids[i] + '_label_encryption_mode').html($('#' + ssids[i] + '_encryption_mode_wpa  option:selected').text());
        }
        else
        {
             $('#' + ssids[i] + '_label_encryption_mode').html($('#' + ssids[i] + '_encryption_mode_basic  option:selected').text());
        }

        $('#' + ssids[i] + '_label_ssid_broadcast').html($('#' + ssids[i] + '_broadcast_select option:selected').text());
    }

    if (g_module.ap_station_enabled)
    {
        $('#label_data_connection').html($('#select_data_connecion option:selected').text());
    }

    if (g_module.autoapn_enabled)
    {
        $('#label_auto_apn').html((1 == quicksetup_autoAPN) ? common_enable : common_disable);
    }

    $('#label_connection').html($('#authentication_select option:selected').text());
    $('#label_authentication').html($('#authentication option:selected').text());
    if('' == $('#apn').val())
    {
        $('#label_apn').html(dialup_label_dynamic_numeric);
    } 
    else
    {
    $('#label_apn').html($('#apn').val());
    }
    $('#label_profile_name').html($('#profileName option:selected').text());
    $('#label_dialup_number').html($('#dialupNumber').val());
    $('#label_user_name').html('<pre>' + $('#userName').val() + '</pre>');
    $('#label_ip_address').html($('#ipAddress').val());

    for (i = 0; i <= 5; i++)
    {
        $('#quicksetup' + i).css('display', 'none');
    }

    $('#quicksetup' + 5).css('display', 'block');
}

function quicksetup_settings(step) {
    startLogoutTimer();
    clearAllErrorLabel();
    var isValid = true;
    var i = 0;
    var ssids = ['ssid1'];

    if (step == 0)
    {
        isValid = true;
    }
    else if (step == 1)
    {
        isValid = true;
        if($('#profileName').text() == '' || $('#profileName').val() == null)
        {
            button_enable('step2_next', '0');
        }
    }
    else if (step == 2)
    {
    if (g_module.ap_station_enabled)
    {
        isValid = true;
    }
    else
    {
        if ((g_module.autoapn_enabled && 1 == quicksetup_autoAPN) ||
        quicksetup_validateProfile())
        {
            isValid = true;
        }
        else
        {
            isValid = false;
            return;
        }
    }
    }
    else if (step == 3)
    {
        if (g_module.ap_station_enabled)
        {
            if ((g_module.autoapn_enabled && 1 == quicksetup_autoAPN) ||
            quicksetup_validateProfile())
            {
                isValid = true;
            }
            else
            {
                isValid = false;
                return;
            }
        }
        else
        {
            isValid = true;
        }
    }
    else if (step == 4)
    {
        isValid = true;
        ssids = ['ssid1'];

        if (g_module.multi_ssid_enabled)
        {
            ssids.push('ssid2');
        }

        for (i = 0; i < ssids.length; ++i)
        {
            if (!quicksetup_validateSsid(ssids[i]))
            {
                isValid = false;
                return;
            }
        }

    }
    else if (step == 5)
    {
        ssids = ['ssid1'];

        if (g_module.multi_ssid_enabled)
        {
            ssids.push('ssid2');
        }

        for (i = 0; i < ssids.length; ++i)
        {
            if (!quicksetup_ValidateWifiSecurity(ssids[i]))
            {
                isValid = false;
                return;
            }
        }

        if (!g_module.multi_ssid_enabled)
        {
            var auth = $('#ssid1_authentication').val();

            if (QUICKSETUP_WIFIAUTHMODE_AUTO == auth ||
            QUICKSETUP_WIFIAUTHMODE_OPEN == auth ||
            QUICKSETUP_WIFIAUTHMODE_SHARE == auth)
            {
                if ($('#ssid1_encryption_mode_basic').val() == QUICKSETUP_WIFIAUTHMODE_AUTO)
                {
                    showConfirmDialog(wlan_hint_use_encryption, quicksetup_showStepLast);
                    return;
                }
                else
                {
                    quicksetup_showStepLast();
                }
            }
            else
            {
                quicksetup_showStepLast();
            }

        }
        else
        {
            var auth1 = $('#ssid1_authentication').val();
            var auth2 = $('#ssid2_authentication').val();

            if ((QUICKSETUP_WIFIAUTHMODE_AUTO == auth1 ||
            QUICKSETUP_WIFIAUTHMODE_OPEN == auth1 ||
            QUICKSETUP_WIFIAUTHMODE_SHARE == auth1) ||
            (QUICKSETUP_WIFIAUTHMODE_AUTO == auth2 ||
            QUICKSETUP_WIFIAUTHMODE_OPEN == auth2 ||
            QUICKSETUP_WIFIAUTHMODE_SHARE == auth2)
            )
            {
                if ($('#ssid1_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE ||
                $('#ssid2_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE)
                {
                    showConfirmDialog(wlan_hint_use_encryption, quicksetup_showStepLast);
                    return;
                }
                else
                {
                    quicksetup_showStepLast();
                }
            }
            else
            {
                quicksetup_showStepLast();
            }
        }
    }


    if (isValid == true)
    {
        for (i = 0; i <= 5; i++)
        {
            $('#quicksetup' + i).css('display', 'none');
        }
        $('#quicksetup' + step).css('display', 'block');
    }

}

function quicksetup_postData_wifi() {
    g_quicksetup_wifiBasicData.WifiSsid = $.trim($('#ssid1_wifiName').val());
    g_quicksetup_wifiBasicData.WifiHide = $('#ssid1_broadcast_select').val();
    g_quicksetup_wifiBasicData.WifiRestart = 0;
    var xmlstr_settings = object2xml('request', g_quicksetup_wifiBasicData);
    saveAjaxData('api/wlan/basic-settings', xmlstr_settings, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret))
        {
            g_quicksetup_saveDataOK = false;
        }
    });

    // wifi authentication
    g_quicksetup_wifiSecurityData.WifiAuthmode = $('#ssid1_authentication').val();
    g_quicksetup_wifiSecurityData.WifiWpaencryptionmodes = $('#ssid1_encryption_mode_wpa').val();
    g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes = $('#ssid1_encryption_mode_basic').val();
    g_quicksetup_wifiSecurityData.WifiRestart = 1;
    if(("AUTO" == g_quicksetup_wifiSecurityData.WifiAuthmode
        || "OPEN" == g_quicksetup_wifiSecurityData.WifiAuthmode
        || "SHARE" == g_quicksetup_wifiSecurityData.WifiAuthmode)
       && ("WEP" == g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes))
    {
        g_quicksetup_wifiSecurityData.WifiWepKey1 = $("#ssid1_neworkKey1").val();
        g_quicksetup_wifiSecurityData.WifiWepKeyIndex = "1";
    }
    else
    {
        g_quicksetup_wifiSecurityData.WifiWpapsk = $("#ssid1_wpa_key").val();
    }
    var xmlstr_security = object2xml('request', g_quicksetup_wifiSecurityData);
    saveAjaxData('api/wlan/security-settings', xmlstr_security, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret))
        {
            g_quicksetup_saveDataOK = false;
        }
    });
}

function quicksetup_postData_wifiMultiSSID() {
    var postData = {};
    var ssids = ['ssid1', 'ssid2'];
    var i = 0;
    for (i = 0; i < ssids.length; i++)
    {
        g_quicksetup_wifiBasicData[i].WifiSsid = $.trim($('#' + ssids[i] + '_wifiName').val());
        g_quicksetup_wifiBasicData[i].WifiBroadcast = $('#' + ssids[i] + '_broadcast_select').val();
        g_quicksetup_wifiBasicData[i].WifiAuthmode = $('#' + ssids[i] + '_authentication').val();
        g_quicksetup_wifiBasicData[i].WifiWpaencryptionmodes = $('#' + ssids[i] + '_encryption_mode_wpa').val();
        g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes = $('#' + ssids[i] + '_encryption_mode_basic').val();

        if(("AUTO" == g_quicksetup_wifiBasicData[i].WifiAuthmode
            || "OPEN" == g_quicksetup_wifiBasicData[i].WifiAuthmode
            || "SHARE" == g_quicksetup_wifiBasicData[i].WifiAuthmode)
           && (wlan_label_wep == g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes))
        {
            g_quicksetup_wifiBasicData[i].WifiWepKey1 = $("#"+ssids[i]+"_neworkKey1").val();
            g_quicksetup_wifiBasicData[i].WifiWepKeyIndex = "1";
        }
        else
        {
            g_quicksetup_wifiBasicData[i].WifiWpapsk = $("#"+ssids[i]+"_wpa_key").val();
        }
    }

    button_enable('apply_button', '0');

    postData = {
        Ssids: {
            Ssid: g_quicksetup_wifiBasicData
        },
        WifiRestart: 0
    };

    var xmlStr = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret))
        {
            g_quicksetup_saveDataOK = false;
        }
    });

    g_quicksetup_wifiSecurityData.WifiEnable = $("[name='mode']:checked").val();
    g_quicksetup_wifiSecurityData.WifiRestart = 1;
    xmlStr = object2xml('request', g_quicksetup_wifiSecurityData);
    saveAjaxData('api/wlan/multi-security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret))
        {
            g_quicksetup_saveDataOK = false;
        }
    });
}

function quicksetup_postData() {
    var newXmlString = '';
    g_quicksetup_saveDataOK = true;
    // profile
    if (!g_module.autoapn_enabled || 0 == quicksetup_autoAPN)
    {
        var request_profile = {
            Delete: 0,
            SetDefault: $('#profileName').val(),
            Modify: 0
        };

        var xmlstr_profiles = object2xml('request', request_profile);
        saveAjaxData('api/dialup/profiles', xmlstr_profiles, function($xml) {
            var ret = xml2object($xml);

            var saveState = ret.response;
            if (!isAjaxReturnOK(ret))
            {
                g_quicksetup_saveDataOK = false;
            }
        });
    }

    if (g_module.ap_station_enabled)
    {
        var dataConnection =
        {
            'Handover': 0
        };
        dataConnection.Handover = $('#select_data_connecion').val();
        newXmlString = object2xml('request', dataConnection);
        saveAjaxData('api/wlan/handover-setting', newXmlString, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret))
            {
                g_quicksetup_saveDataOK = false;
            }
        });

        // connection mode
        g_quicksetup_connectionData.ConnectMode = $('#select_connection_mode').val();
        newXmlString = object2xml('request', g_quicksetup_connectionData);
        saveAjaxData('api/dialup/connection', newXmlString, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret))
            {
                g_quicksetup_saveDataOK = false;
            }
        });
    }
    else
    {
        // connection mode
        g_quicksetup_connectionData.ConnectMode = $('#authentication_select').val();

        var xmlstr_connection = object2xml('request', g_quicksetup_connectionData);
        saveAjaxData('api/dialup/connection', xmlstr_connection, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret))
            {
                g_quicksetup_saveDataOK = false;
            }
        });
    }

    // wifi beginning
    if (!g_module.multi_ssid_enabled)
    {
        quicksetup_postData_wifi();
    }
    else
    {
        quicksetup_postData_wifiMultiSSID();
    }
    // wifi ending

    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {
        setTimeout(function() {
            gotoPageWithHistory('home.html');
        }, g_feature.dialogdisapear);
    });
}

function quicksetup_finish() {
    //showConfirmDialog( wlan_hint_disconnect_wlan, quicksetup_postData );
    quicksetup_postData();
}

function quicksetup_bindButtonClick() {
    $('#step1').click(function() {
        quicksetup_settings(1);
    });

    $('#step2_back').click(function() {
        if (isButtonEnable('step2_back'))
        {
            quicksetup_settings(0);
        }
    });

    $('#step2_next').click(function() {
        if (isButtonEnable('step2_next'))
        {
            quicksetup_settings(2);
        }
    });

    $('#step3_back').click(function() {
        quicksetup_settings(1);
    });

    $('#step3_next').click(function() {
        quicksetup_settings(3);
    });

    $('#step4_back').click(function() {
        quicksetup_settings(2);
    });

    $('#step4_next').click(function() {
        quicksetup_settings(4);
    });

    $('#step5_back').click(function() {
        quicksetup_settings(3);
    });

    $('#step5_next').click(function() {
        quicksetup_settings(5);
    });

    $('#step6_back').click(function() {
        quicksetup_settings(4);
    });

    $('#step_finish').click(function() {
        quicksetup_finish();
    });
}

function configDataDisplay() {
    if(g_AuFeature.authentication_info_enabled =='1')
    {
        $('#tr_authentication').show();
		//$('#last_tr_authentication').show();
    }
    else
    {
        $('#tr_authentication').hide();
		//$('#last_tr_authentication').hide();
    }
    if(g_AuFeature.dialup_number_enabled =='1')
    {
        $('#dialup_number').show();
        $('#last_dialup_number').show();
    }
    else
    {
        $('#dialup_number').hide();
        $('#last_dialup_number').hide();    
    }

    if ('0' == g_AuFeature.apn_enabled)
    {
        $('.menu_apn').hide();
    }
    else
    {
        $('.menu_apn').show();
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
$(document).ready(function() {
    if (g_module.ap_station_enabled)
    {
        $('.no_station').remove();
    }
    else
    {
        $('#quicksetup5_data_connection').remove();
        $('.have_station').remove();
    }

    if (!g_module.autoapn_enabled)
    {
        $('#id_tr_autoapn').remove();
    }
    getConfigData('config/dialup/config.xml', function($xml) {
        g_AuFeature = _xml2feature($xml);
    }, {
        sync: true
    });
    configDataDisplay();
    // init qtip
    $('#tooptips_ssid').qtip({
        content: '<b>' + dialup_label_connection_mode + '</b>:' + common_auto + ',' + common_manual,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });
    $('#tooltips_encryption_mode').qtip({
        content: '<b>' + wlan_label_encryption_mode + '</b>:' + wlan_label_none + ',' + wlan_label_wep,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });

    // init page data
    quicksetup_initPageData();

    //bind button click
    quicksetup_bindButtonClick();

    $('#ssid1_authentication, #ssid2_authentication').change(function() {
        var ssid = 'ssid1';
        if ('ssid2_authentication' == this.id)
        {
            ssid = 'ssid2';
        }
        quicksetup_authentication(this.value, ssid);
    });

    $('#ssid1_encryption_mode_basic, #ssid2_encryption_mode_basic').change(function() {
        var ssid = 'ssid1';
        if ('ssid2_encryption_mode_basic' == this.id)
        {
            ssid = 'ssid2';
        }

        quicksetup_networkKey(this.value, ssid);
    });

    $('#select_data_connecion').append("<option value='0'>" + dialup_label_3g_only + '</option>');
    $('#select_data_connecion').append("<option value='1'>" + setting_label_wifi_only + '</option>');
    $('#select_data_connecion').append("<option value='2'>" + setting_label_wifi_prefer + '</option>');
   
    $('#authentication').append("<option value='0'>" + common_auto + '</option>');
    $('#authentication').append("<option value='1'>" + dialup_label_pap + '</option>');
    $('#authentication').append("<option value='2'>" + dialup_label_chap + '</option>');



    $('#ssid1_broadcast_select').append("<option value='0'>" + common_enable + '</option>');
    $('#ssid1_broadcast_select').append("<option value='1'>" + common_disable + '</option>');

    $('#ssid2_broadcast_select').append("<option value='0'>" + common_enable + '</option>');
    $('#ssid2_broadcast_select').append("<option value='1'>" + common_disable + '</option>');

    $("#ssid1_authentication option[value='AUTO']").text(common_auto);
    $("#ssid1_authentication option[value='OPEN']").text(wlan_label_open);
    $("#ssid1_authentication option[value='SHARE']").text(wlan_label_share);
    $("#ssid1_authentication option[value='WPA-PSK']").text(wlan_label_wpa_psk);
    $("#ssid1_authentication option[value='WPA2-PSK']").text(wlan_label_wpa2_psk);
    $("#ssid1_authentication option[value='WPA/WPA2-PSK']").text(wlan_label_wpa_wpa2_psk);

    $('#ssid2_authentication').append("<option value='AUTO'>" + common_auto + '</option>');
    $('#ssid2_authentication').append("<option value='OPEN'>" + wlan_label_open + '</option>');
    $('#ssid2_authentication').append("<option value='SHARE'>" + wlan_label_share + '</option>');
    $('#ssid2_authentication').append("<option value='WPA-PSK'>" + wlan_label_wpa_psk + '</option>');
    $('#ssid2_authentication').append("<option value='WPA2-PSK'>" + wlan_label_wpa2_psk + '</option>');
    $('#ssid2_authentication').append("<option value='WPA/WPA2-PSK'>" + wlan_label_wpa_wpa2_psk + '</option>');

    var varItem_aes = "<option value='AES'>" + wlan_label_aes + '</option>';
    var varItem_tkip = "<option value='TKIP'>" + wlan_label_tkip + '</option>';
    var varItem_mix =  "<option value='MIX'>" + wlan_label_aes_tkip + '</option>';
    $('#ssid1_encryption_mode_wpa').append(varItem_aes);
    $('#ssid1_encryption_mode_wpa').append(varItem_tkip);
    $('#ssid2_encryption_mode_wpa').append(varItem_aes);
    $('#ssid2_encryption_mode_wpa').append(varItem_tkip);
    if(g_WifiFeature.wifiencryption_mix_enable !='0') {
        $('#ssid1_encryption_mode_wpa').append(varItem_mix);
        $('#ssid2_encryption_mode_wpa').append(varItem_mix);
    }
    $('#ssid1_encryption_mode_basic').append("<option value='WEP'>" + wlan_label_wep + '</option>');
    $('#ssid2_encryption_mode_basic').append("<option value='WEP'>" + wlan_label_wep + '</option>');
});
