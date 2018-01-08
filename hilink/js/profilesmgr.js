// JavaScript Document
/****************************************************profilesmgr
 * (start)************************************/
var PROFILE_MAX_NUM = 100;
var PRO_AUTHMODE_AUTO = '0';
var PRO_AUTHMODE_PAP = '1';
var PRO_AUTHMODE_CHAP = '2';
var PRO_DEFAULT_IP_ADDRESS = '0.0.0.0';
var PRO_DEFAULT_APN_NAME = '';

var g_currentProfileAuthMode = '0';

var g_promag_info = null;
var g_promag_index = 0;
var g_promag_default_index = 0;
var g_promag_array_index = 0;
var g_promag_currentProfileName = '';
var g_promag_operation_btnID = null;
//Indicates one of  buttons ["new_profile", "edit_profile", "delete_profile"]
var g_clear_dialog = false;
var g_promag_autoAPN = false;
var g_dialupFeature = null;
//Content of popup window
var g_promag_dialogContent = "<table width='570' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
g_promag_dialogContent += "<tr id='popup_name'>";
g_promag_dialogContent += "<td width='200' height='32'>" + dialup_label_profile_name + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' id='pro_name' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_apn'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_apn + common_colon + '</td>';
g_promag_dialogContent += "<td ><input type='text' value='' id='pro_apn' maxlength='32'></td>";
g_promag_dialogContent += '</td>';
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_dialup_number'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_dialup_number + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' id='pro_number' maxlength='16' disabled='disabled'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_username'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_user_name + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' id='pro_username' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_password'>";
g_promag_dialogContent += "<td height='32'>" + common_password + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='password' value='' id='pro_password' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_authen'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_authentication + common_colon + '</td>';
g_promag_dialogContent += "<td colspan='2' class='radio'>";
g_promag_dialogContent += "<select name='authentication_mode' id='pop_authmode'>";
g_promag_dialogContent += "<option value='0'>" + common_auto + '</option>';
g_promag_dialogContent += "<option value='1'>" + dialup_label_pap + '</option>';
g_promag_dialogContent += "<option value='2'>" + dialup_label_chap + '</option>';
g_promag_dialogContent += '</select>';
g_promag_dialogContent += '</td>';
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += '</table>';

function promag_deleteProfile(event) {
    var delIndex = $('#profilelist').val();
    var minIndex = 0;

    //Reset default profile to a minimum valid one, only if the deleting profile
    // is defualt
    if (delIndex == g_promag_default_index) {
        if ($.isArray(g_promag_info)) {
            minIndex = g_promag_info[0].Index;
            if (delIndex == minIndex) {
                minIndex = g_promag_info[1].Index;
            }
        }
    }
    var request = {
        'Delete' : delIndex,
        'SetDefault' : minIndex,
        'Modify' : 0
    };

    var delProfile = object2xml('request', request);

    saveAjaxData('api/dialup/profiles', delProfile, function($xml) {
        var delRet = xml2object($xml);
        if (isAjaxReturnOK(delRet)) {
            log.debug('Delete profile' + delIndex + 'successful!');
            showInfoDialog(common_success);
            setTimeout(function() {
                refresh();
                return false;
            }, g_feature.dialogdisapear);
        }
        else {
            log.error('Delete profile failed');
            showInfoDialog(common_failed);
        }
    });
}

function promag_cancelDelete() {
    $('#div_wrapper').remove();
    $('.dialog').remove();
}

function promag_changePositionOfAPN() {
    var apn_tr_content = "<td height='32'>" + dialup_label_apn + common_colon + "</td><td class='display_info_rows'><pre></pre></td><td></td>";
    var apn_tr = "<tr id='apn_name'>" + apn_tr_content + '</tr>';
    //$("tr").remove("#apn_name");
    //$("#profile_username").before(apn_tr);
    $('#apn_name').html(apn_tr_content);
}

function promag_switchRadio(name) {
    $('input[name=radio_' + name + ']').live('click', function() {
        if ($(this).val() == '1') {
            $('input[id=pro_' + name + ']').attr('disabled', '');
        }
        else {
            $('input[id=pro_' + name + ']').attr('disabled', 'disabled');
            if ('ipaddress' == name) {
                $('input[id=pro_' + name + ']').val(PRO_DEFAULT_IP_ADDRESS);
            }
            else {
                $('input[id=pro_' + name + ']').val(PRO_DEFAULT_APN_NAME);
            }
        }
    });
}

function promag_setTrDisplay() {

    g_dialupFeature.dialup_number_enabled ? $('#tr_dialup_number').show() : $('#tr_dialup_number').hide();

    g_dialupFeature.authentication_info_enabled ? $('#authentication_info').show() : $('#authentication_info').hide();

    g_dialupFeature.apn_enabled ? $('#apn_name').show() : $('#apn_name').hide();
}

function Profilesmgr_getCurrentProfileArrayIndex(profileArray, index) {
    var ArrayLength = profileArray.length;
    var i = 0;
    for (; i < profileArray.length; i++) {
        if (profileArray[i].Index == index) {
            return i;
        }
    }
    return 0;
}

function promag_trasfalPassword(oriPassword) {
    var profile_array_password = oriPassword.split('');
    var profile_show_password = '';
    $.each(profile_array_password, function(i) {
        profile_show_password += '*';
    });
    return profile_show_password;
}

function promag_setDefaultPor(set_default_request) {
    var default_pro_xml = object2xml('request', set_default_request);
    saveAjaxData('api/dialup/profiles', default_pro_xml, function($xml) {
        var delRet = xml2object($xml);
        if (isAjaxReturnOK(delRet)) {
            g_promag_default_index = set_default_request.SetDefault;
            refresh();
        }
    });
}

function promag_ifDiffrentProfileName(currentProfileName) {
    var flag = false;
    if ($.isArray(g_promag_info)) {
        $.each(g_promag_info, function(i) {
            if (g_promag_info[i].Name == currentProfileName) {
                flag = false;
                return false;
            }
            else {
                flag = true;
            }
        });
    }
    else if (typeof (g_promag_info) != 'undefined') {
        //if there is no profile
        if (g_promag_info == null) {
            flag = true;
            return true;
        }

        //if there is only one profile
        if (g_promag_info.Name == currentProfileName) {
            flag = false;
            return false;
        }
        else {
            flag = true;
        }
    }
    else {
        flag = true;
    }
    return flag;
}

function promag_getProfileInfo() {
    promag_setTrDisplay();
    getAjaxData('api/dialup/profiles', function($xml) {
        var profile_ret = xml2object($xml);
        if (profile_ret.type == 'response') {
            g_promag_info = profile_ret.response.Profiles.Profile;
            g_promag_index = parseInt(profile_ret.response.CurrentProfile, 10);

            if (1 > g_promag_index) {
                g_promag_index = 1;
            }
            g_promag_default_index = g_promag_index;

            var profile_password_mark = '';
            if ($.isArray(g_promag_info)) {
                g_promag_array_index = Profilesmgr_getCurrentProfileArrayIndex(g_promag_info, g_promag_index);
                //g_promag_index-1;
                //$("#profile_index").val(g_promag_index);
                $('#dprofile_name').html('<pre>' + g_promag_info[g_promag_array_index].Name + '</pre>');
                $('#ddialup_number').html(g_promag_info[g_promag_array_index].DialupNum);
                $('#duser_name').html('<pre>' + g_promag_info[g_promag_array_index].Username + '</pre>');
                if ('' != g_promag_info[g_promag_array_index].Password && ' ' != g_promag_info[g_promag_array_index].Password && null != g_promag_info[g_promag_array_index].Password) {
                    profile_password_mark = promag_trasfalPassword(g_promag_info[g_promag_array_index].Password);
                    $('#dpassword').html(profile_password_mark);
                }
                else {
                    $('#dpassword').html('');
                }

                if (PRO_AUTHMODE_PAP == g_promag_info[g_promag_array_index].AuthMode) {
                    $('#dauthentication').html(dialup_label_pap);
                }
                else if (PRO_AUTHMODE_CHAP == g_promag_info[g_promag_array_index].AuthMode) {
                    $('#dauthentication').html(dialup_label_chap);
                }
                else {
                    $('#dauthentication').html(common_auto);
                }

                //promag_checkIfStatic(g_promag_info[g_promag_array_index]);
                if (g_promag_info[g_promag_array_index].ApnIsStatic == '0') {
                    $('#dapn').html('<pre>' + dialup_label_dynamic + '</pre>');
                }
                else {
                    $('#dapn').html('<pre>' + g_promag_info[g_promag_array_index].ApnName + '</pre>');
                }

                var promag_names = [];
                $.each(g_promag_info, function(n, value) {
                    g_promag_info[n].Name = $.trim(g_promag_info[n].Name);
                    var defaultName = g_promag_info[n].Name;
                    while (defaultName.indexOf(' ') >= 0) {
                        defaultName = defaultName.replace(' ', '&nbsp;');
                    }

                    defaultName = defaultName + (g_promag_info[n].Index == g_promag_default_index ? common_default : '');
                    promag_names.push([g_promag_info[n].Index, defaultName]);

                    var varItem = '<option value = ' + g_promag_info[n].Index + '\>' + defaultName + '</option>';
                    $('#profilelist').append(varItem);

                });
                setTimeout(function() {
                    $('#profilelist').val(g_promag_index);
                }, 1);
                //$("#profilelist").addclass("selecter_select");

                //$("#select_service").createOptions(promag_names);
                //$("#select_service").sVal(g_promag_default_index);
                if (g_promag_info[g_promag_array_index].ReadOnly == '0' && !g_promag_autoAPN) {
                    button_enable('edit_profile', '1');
                    button_enable('delete_profile', '1');
                }
                else {
                    button_enable('edit_profile', '0');
                    button_enable('delete_profile', '0');
                }
                // button_enable("delete_profile", "0");

            }
            else if (typeof g_promag_info != 'undefined') {
                // button_enable("delete_profile", "0");
                $('#profile_index').val(g_promag_index);
                $('#dprofile_name').html('<pre>' + g_promag_info.Name + '</pre>');
                $('#ddialup_number').html(g_promag_info.DialupNum);
                $('#duser_name').html('<pre>' + g_promag_info.Username + '</pre>');
                if ('' != g_promag_info.Password && ' ' != g_promag_info.Password && null != g_promag_info.Password) {
                    profile_password_mark = promag_trasfalPassword(g_promag_info.Password);
                    $('#dpassword').html(profile_password_mark);
                }
                else {
                    $('#dpassword').html('');
                }

                if (PRO_AUTHMODE_PAP == g_promag_info.AuthMode) {
                    $('#dauthentication').html(dialup_label_pap);
                }
                else if (PRO_AUTHMODE_CHAP == g_promag_info.AuthMode) {
                    $('#dauthentication').html(dialup_label_chap);
                }
                else {
                    $('#dauthentication').html(common_auto);
                }

                //promag_checkIfStatic(g_promag_info);
                if (g_promag_info.ApnIsStatic == '0') {
                    $('#dapn').html('<pre>' + dialup_label_dynamic + '</pre>');
                }
                else {
                    $('#dapn').html('<pre>' + g_promag_info.ApnName + '</pre>');
                }
                //$("#select_service").createOptions([[g_promag_info.Index,
                // g_promag_info.Name+common_default]]);
                //$("#select_service").sVal(g_promag_default_index);
                g_promag_info.Name = $.trim(g_promag_info.Name);
                var defaultName = g_promag_info.Name;
                while (defaultName.indexOf(' ') >= 0) {
                    defaultName = defaultName.replace(' ', '&nbsp;');
                }
                defaultName = defaultName + (g_promag_info.Index == g_promag_default_index ? common_default : '');
                var varItem = '<option value = ' + g_promag_info.Index + '\>' + defaultName + '</option>';
                $('#profilelist').append(varItem);

                setTimeout(function() {
                    $('#profilelist').val(g_promag_info.Index);
                }, 1);
                $('#profilelist').change(function() {
                    if (profile_ret.response.CurrentProfile != g_promag_index) {
                        var request = {
                            'Delete' : 0,
                            'SetDefault' : g_promag_index,
                            'Modify' : 0
                        };
                        promag_setDefaultPor(request);
                    }
                    else {
                        return false;
                    }
                });
                if (g_promag_info.ReadOnly == '0' && !g_promag_autoAPN) {
                    button_enable('edit_profile', '1');
                    button_enable('delete_profile', '1');
                }
                else {
                    button_enable('edit_profile', '0');
                    button_enable('delete_profile', '0');
                }
            }
            else {
                $('#profilelist').val('');
                $('#profilelist').attr('disabled', 'disabled');
                button_enable('edit_profile', '0');
                button_enable('delete_profile', '0');
            }
        }
        else {
            log.error('Load profiles data failed');
            $('#profilelist').attr('disabled', 'disabled');
        }
        if (g_clear_dialog) {
            setTimeout(function() {
                clearDialog();
            }, 1700);
            g_clear_dialog = false;
        }
    });
}

//Display radio button
function promag_checkIfStatic(ifIPStatic) {
    if (ifIPStatic.ApnIsStatic == '0') {
        $('#dapn').html('<pre>' + dialup_label_dynamic + '</pre>');
    }
    else {
        $('#dapn').html('<pre>' + ifIPStatic.ApnName + '</pre>');
    }
}

function promag_saveRequest(obj) {
    var profile_xml = object2xml('request', obj);
    saveAjaxData('api/dialup/profiles', profile_xml, function($xml) {
        var return_ret = xml2object($xml);
        if (return_ret.response == 'OK') {
            window.location.reload();
        }
        else {
            log.error('Save data failed');
            showInfoDialog(common_failed);
            g_clear_dialog = true;
            window.location.reload();
        }
        promag_getProfileInfo();
    });
}

function promag_saveProfile() {

    //getModifyInfo
    var request = '';
    var profile_index = g_promag_index;
    var isvalid;
    var dnsstatus;
    var primary_dns;
    var seconde_dns;
    var ipaddress_status;
    var ipaddress;
 
    var profile_name = $.trim($('#pro_name').val());
    var dialup_number = $('#pro_number').val();
    var username = $.trim($('#pro_username').val());
    var password = $.trim($('#pro_password').val());
    var authen = PRO_AUTHMODE_AUTO;
    var apn_status = 0;
    var apn_name = $.trim($('#pro_apn').val());

    if ('' == apn_name || null == apn_name || '' == $.trim(apn_name)) {
        apn_name = PRO_DEFAULT_APN_NAME;
        apn_status = 0;
    }
    else {
        apn_status = 1;
    }

    var validElement = {
        'profile_name' : profile_name,
        'username' : username,
        'password' : password,
        'apn_name' : apn_name
    };

    var be_valid = promag_validInput(validElement);

    if (be_valid) {
        //Get the method which currently used
        var function_name = $('.dialog_header_left').html();

        if (null == g_promag_operation_btnID) {
            return;
        }
        else if ('new_profile' == g_promag_operation_btnID) {
            if (!g_dialupFeature.authentication_info_enabled) {
                authen = PRO_AUTHMODE_AUTO;
            }
            else {
                authen = $('#pop_authmode').val();
            }
            //New object for create new profile
            request = {
                'Delete' : 0,
                'SetDefault' : (('undefined' == typeof (g_promag_info)) ? 1 : 0),
                'Modify' : 1,
                'Profile' : {
                    'Index' : '',  //original is new_index
                    'IsValid' : 1,
                    'Name' : profile_name,
                    'ApnIsStatic' : apn_status,
                    'ApnName' : apn_name,
                    'DialupNum' : dialup_number,
                    'Username' : username,
                    'Password' : password,
                    'AuthMode' : authen,
                    'IpIsStatic' : '',
                    'IpAddress' : '',
                    'DnsIsStatic' : '',
                    'PrimaryDns' : '',
                    'SecondaryDns' : '',
                    'ReadOnly' : '0'
                }
            };
        }
        else if ('edit_profile' == g_promag_operation_btnID) {
            if ($.isArray(g_promag_info)) {
                isvalid = g_promag_info[g_promag_array_index].IsValid;
                dnsstatus = g_promag_info[g_promag_array_index].DnsIsStatic;
                primary_dns = g_promag_info[g_promag_array_index].PrimaryDns;
                seconde_dns = g_promag_info[g_promag_array_index].SecondaryDns;
                ipaddress_status = g_promag_info[g_promag_array_index].IpIsStatic;
                ipaddress = g_promag_info[g_promag_array_index].IpAddress;
            }
            else if (typeof g_promag_info != 'undefined' && null != g_promag_info) {
                isvalid = g_promag_info.IsValid;
                dnsstatus = g_promag_info.DnsIsStatic;
                primary_dns = g_promag_info.PrimaryDns;
                seconde_dns = g_promag_info.SecondaryDns;
                ipaddress_status = g_promag_info.IpIsStatic;
                ipaddress = g_promag_info.IpAddress;
            }
            else {
                isvalid = 1;
                dnsstatus = '';
                primary_dns = '';
                seconde_dns = '';
                ipaddress_status = '';
                ipaddress = '';
            }
            
            if (!g_dialupFeature.authentication_info_enabled) {
                authen = g_currentProfileAuthMode;
            }
            else {
                authen = $('#pop_authmode').val();
            }
            //Create an object for modify profile
            request = {
                'Delete' : 0,
                'SetDefault' : ((profile_index == g_promag_default_index) ? profile_index : 0),
                'Modify' : 2,
                'Profile' : {
                    'Index' : profile_index,
                    'IsValid' : isvalid,
                    'Name' : profile_name,
                    'ApnIsStatic' : apn_status,
                    'ApnName' : apn_name,
                    'DialupNum' : dialup_number,
                    'Username' : username,
                    'Password' : password,
                    'AuthMode' : authen,
                    'IpIsStatic' : ipaddress_status,
                    'IpAddress' : ipaddress,
                    'DnsIsStatic' : dnsstatus,
                    'PrimaryDns' : primary_dns,
                    'SecondaryDns' : seconde_dns,
                    'ReadOnly' : '0'
                }
            };
        }

        promag_saveRequest(request);
    }
    else {
        log.error('Some of input box invalid');
    }
}

function promag_setPopupTrDisplay() {
    g_dialupFeature.dialup_number_enabled ? $('#popup_dialup_number').show() : $('#popup_dialup_number').hide();

    g_dialupFeature.authentication_info_enabled ? $('#popup_authen').show() : $('#popup_authen').hide();
    g_dialupFeature.apn_enabled ? $('#popup_apn').show() : $('#popup_apn').hide();

    reputPosition($('.dialog'), $('#div_wrapper'));
}

function promag_validInput(obj) {
    $.each($('.pro_wrong'), function(i) {
        $(this).remove();
    });
    $.each($('input'), function() {
        $(this).blur();
    });
    var flag = true;
    var wrongHtml = "<tr class='pro_wrong'>";
    wrongHtml += '<td>&nbsp;</td>';
    wrongHtml += "<td colspan='2' class='pro_wrong_td' id='temp_wrong'>&nbsp;</td>";
    wrongHtml += '</tr>';
    //Valid profile name
    if (obj.profile_name == '' || obj.profile_name == null) {
        flag = false;
        $('#pro_name').focus();
        $('#popup_name').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_name_wrong');
        $('#pro_name_wrong').html('*' + IDS_dialup_hint_profile_name_null);
    }
    else if ('' == $.trim(obj.profile_name)) {
        flag = false;
        $('#pro_name').focus();
        $('#popup_name').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_name_wrong');
        $('#pro_name_wrong').html('*' + IDS_dialup_hint_profile_name_null);
    }
    else if (!checkInputChar(obj.profile_name)) {
        flag = false;
        $('#pro_name').focus();
        $('#popup_name').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_name_wrong');
        $('#pro_name_wrong').html('*' + dialup_hilink_hint_profile_name_invalidate);
    }
    else {
        if ('new_profile' == g_promag_operation_btnID) {
            if (!promag_ifDiffrentProfileName(obj.profile_name)) {
                flag = false;
            }

        }
        else if ('edit_profile' == g_promag_operation_btnID) {
            if (obj.profile_name != g_promag_currentProfileName) {
                if (!promag_ifDiffrentProfileName(obj.profile_name)) {
                    flag = false;
                }
            }
            else {
                $('#pro_name_wrong').html('');
            }
        }

        if (!flag) {
            flag = false;
            $('#pro_name').focus();
            $('#popup_name').after(wrongHtml);
            $('#temp_wrong').attr('id', 'pro_name_wrong');
            $('#pro_name_wrong').html('*' + dialup_hint_profile_name_has_exist);
        }
        else {

            $('#pro_name_wrong').html('');
        }
    }

    //Valid apn name
    if ('' != obj.apn_name && false == checkInputChar(obj.apn_name)) {
        flag = false;
        $('#pro_apn').focus();
        $('#popup_apn').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_apn_wrong');
        $('#pro_apn_wrong').html('*' + dialup_hilink_hint_apn_name_invalidate);
    }
    else {
        $('#pro_apn_wrong').html('');
    }

    //Valid Username
    if ('' != obj.username && false == checkInputChar(obj.username)) {
        flag = false;
        $('#pro_username').focus();
        $('#popup_username').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_username_wrong');
        $('#pro_username_wrong').html('*' + dialup_hilink_hint_username_invalidate);
    }
    else {
        $('#pro_username_wrong').html('');
    }

    //Vaild user password
    if ('' != obj.password && false == checkInputChar(obj.password)) {
        flag = false;
        $('#pro_password').focus();
        $('#popup_password').after(wrongHtml);
        $('#temp_wrong').attr('id', 'pro_password_wrong');
        $('#pro_password_wrong').html('*' + dialup_hilink_hint_password_invalidate);

    }
    else {
        $('#pro_password_wrong').html('');
    }

    return flag;
}

function promag_getNewIndex() {
    var index_array = [];
    var new_index = '';

    //Get all indexs.
    if ('undefined' == typeof (g_promag_info)) {
        index_array.push(0);
    }
    else {
        $('.list').each(function(k) {
            index_array.push(parseInt($(this).attr('id'), 10));
        });
    }

    //Make an new g_promag_index according to currently g_promag_index
    var i = 0;
    for (i; i < index_array.length; i++) {
        if (index_array[i + 1] - index_array[i] == 1) {
            new_index = parseInt(index_array[i + 1], 10) + 1;
        }
        else {
            new_index = parseInt(index_array[i], 10) + 1;
            break;
        }
    }
    return new_index;
}

function promag_getAutoAPN() {
    getAjaxData('api/dialup/auto-apn', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_promag_autoAPN = parseInt(ret.response.AutoAPN, 10) == 1;
        }
        if (g_promag_autoAPN) {
            $('input[name=redio_autoapn]').eq(0).attr('checked', 'checked');
            button_enable('edit_profile', '0');
            button_enable('delete_profile', '0');
            button_enable('new_profile', '1');
            $('#profilelist').attr('disabled', 'disabled');
            $('#profiles_info tr:gt(0) td').css({
                color: '#BFBFBF'
            });
        }
        else {
            $('input[name=redio_autoapn]').eq(1).attr('checked', 'checked');
            button_enable('new_profile', '1');
            $('#profilelist').attr('disabled', '');
            $('#profiles_info tr:gt(0) td').css({
                color: 'black'
            });
            var aProfile = null;
            if (g_promag_info) {
                if ($.isArray(g_promag_info)) {
                    aProfile = g_promag_info[g_promag_array_index];
                }
                else {
                    aProfile = g_promag_info;
                }
                if (aProfile.ReadOnly == '0') {
                    button_enable('edit_profile', '1');
                    button_enable('delete_profile', '1');
                }
                else {
                    button_enable('edit_profile', '0');
                    button_enable('delete_profile', '0');
                }
            }
            else {
                button_enable('edit_profile', '0');
                button_enable('delete_profile', '0');
            }
            // $("#select_service").attr("disabled","");
            // $("#select_service").addClass("input_select");
        }
    });
}

function promag_onChangeAutoAPN() {
    g_promag_autoAPN = $(this).get(0).value == '0';
    var request = {
        AutoAPN: g_promag_autoAPN ? 1 : 0
    };
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/dialup/auto-apn', xmlstr, function($xml) {
        promag_getAutoAPN();
    });
}

redirectOnCondition(null, 'profilesmgr');
$(document).ready(function() {
    var list = '';
    var wlan_td_content = '';

    getConfigData('config/dialup/config.xml', function($xml) {
        g_dialupFeature = _xml2feature($xml);
    }, {
        sync: true
    });

    if (g_module.autoapn_enabled) {
        promag_getAutoAPN();
        $('#tr_profile_autoapn').show();
    }

    // add tooltips
    promag_getProfileInfo();

    $('#new_profile').click(function(event) {
        if (!isButtonEnable('new_profile')) {
            return;
        }

        if (($.isArray(g_promag_info)) && (g_promag_info.length >= PROFILE_MAX_NUM)) {
            showInfoDialog(dialup_hint_max_profile_number.replace('%d', PROFILE_MAX_NUM));
            return;
        }
        g_promag_operation_btnID = event.currentTarget.id;

        //Load popup window
        call_dialog(dialup_button_newprofile, g_promag_dialogContent, common_save, 'pop_Save', common_cancel, 'pop_Cancel');

        promag_setPopupTrDisplay();

        $('#pro_name').val('');
        $('#pro_number').val('*99#');
        $('#pro_username').val('');
        $('#pro_password').val('');
        $('#pro_authentication').val('');
        $('#pro_apn').val('');

        $('#pro_name').focus();
    });
    $('#edit_profile').click(function(event) {
        if (!isButtonEnable('edit_profile')) {
            return;
        }
        g_promag_operation_btnID = event.currentTarget.id;

        var currentProfileData = null;
        call_dialog(common_edit, g_promag_dialogContent, common_save, 'pop_Save', common_cancel, 'pop_Cancel');

        promag_setPopupTrDisplay();

        var authenmode = $('#dauthentication').text();

        if ($.isArray(g_promag_info)) {
            currentProfileData = g_promag_info[g_promag_array_index];
        }
        else if (typeof (g_promag_info) != 'undefined') {
            currentProfileData = g_promag_info;
        }
        else {
            log.error('no profile to be edit.');
            return;
        }
        g_currentProfileAuthMode = currentProfileData.AuthMode;
        g_promag_currentProfileName = currentProfileData.Name;
        $('#pro_name').val(currentProfileData.Name);
        $('#pro_number').val(currentProfileData.DialupNum);
        $('#pro_username').val(currentProfileData.Username);
        $('#pro_password').val(currentProfileData.Password);

        if (dialup_label_pap == authenmode) {
            $('#pop_authmode').val(PRO_AUTHMODE_PAP);
        }
        else if (dialup_label_chap == authenmode) {
            $('#pop_authmode').val(PRO_AUTHMODE_CHAP);
        }
        else {
            $('#pop_authmode').val(PRO_AUTHMODE_AUTO);
        }

        $('#pro_apn').val(currentProfileData.ApnName);
        $('#pro_ipaddress').val(currentProfileData.IpAddress);
        $('#pro_name').select();
    });
    //Send the status of apn and ipaddress for popup window
    //promag_switchRadio("apn");
    //promag_switchRadio("ipaddress");

    $('#pop_Save').live('click', function() {
        promag_saveProfile();
    });
    $('#delete_profile').click(function(event) {
        if (!isButtonEnable('delete_profile')) {
            return;
        }
        showConfirmDialog(dialup_hilink_confirm_delete, promag_deleteProfile, promag_cancelDelete);
    });
    $('input[name=redio_autoapn]').bind('click', promag_onChangeAutoAPN);

    $('#profilelist').change(function() {
        g_promag_index = $('#profilelist').val();
        g_promag_array_index = Profilesmgr_getCurrentProfileArrayIndex(g_promag_info, g_promag_index);
        //g_promag_index-1;
        $('#dprofile_name').html('<pre>' + g_promag_info[g_promag_array_index].Name + '</pre>');
        $('#ddialup_number').html(g_promag_info[g_promag_array_index].DialupNum);
        $('#duser_name').html('<pre>' + g_promag_info[g_promag_array_index].Username + '</pre>');

        if ('' != g_promag_info[g_promag_array_index].Password && ' ' != g_promag_info[g_promag_array_index].Password && null != g_promag_info[g_promag_array_index].Password) {
            var profile_password_mark = promag_trasfalPassword(g_promag_info[g_promag_array_index].Password);
            $('#dpassword').html(profile_password_mark);
        }
        else {
            $('#dpassword').html('');
        }

        if (PRO_AUTHMODE_PAP == g_promag_info[g_promag_array_index].AuthMode) {
            $('#dauthentication').html(dialup_label_pap);
        }
        else if (PRO_AUTHMODE_CHAP == g_promag_info[g_promag_array_index].AuthMode) {
            $('#dauthentication').html(dialup_label_chap);
        }
        else {
             $('#dauthentication').html(common_auto);
        }

        //promag_checkIfStatic(g_promag_info[g_promag_array_index]);
        if (g_promag_info[g_promag_array_index].ApnIsStatic == '0') {
            $('#dapn').html('<pre>' + dialup_label_dynamic + '</pre>');
        }
        else {
            $('#dapn').html('<pre>' + g_promag_info[g_promag_array_index].ApnName + '</pre>');
        }
        if (g_promag_default_index != g_promag_index) {
            var request = {
                'Delete' : 0,
                'SetDefault' : g_promag_index,
                'Modify' : 0
            };
            promag_setDefaultPor(request);
        }
        else {
            return false;
        }
    });
});
/****************************************************profilesmgr
 * (end)************************************/
