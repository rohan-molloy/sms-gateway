var MIN_IDLE_TIME = 30;
var MAX_IDLE_TIME = 7200;
var MACRO_DISPLAY = 1;
var g_connectionData = null;
var g_profileData = null;

var CONNECTMODE_AUTO = 0;
var CONNECTMODE_MANUAL = 1;
var CONNECTMODE_ONDEMAND = 2;

var IDLE_TIME_ENABLE = 1;
var IDLE_TIME_DISABLE = 0;

var g_connect_config = '';
var g_idle_time_enable = 0;
var g_quicksetup_saveDataOK = false;

redirectOnCondition(null, 'mobileconnection');

function setConnectionStatus() {
    if (CONNECTMODE_MANUAL == $('#select_connection_mode').val()) {
        $('#roam_open').hide();
        $('#ondemand_connect').hide();
        $('#input_max_idle_time').attr('disabled', 'disabled');
        $('input[name=enable_roam_startup]').attr('disabled', 'disabled');
        $('#input_max_idle_time').val(g_connectionData.MaxIdelTime);
        if (1 == g_connectionData.RoamAutoConnectEnable) {
            $('input[name=enable_roam_startup]').attr('checked', 'checked');
        }
        else
        {
             $('input[name=enable_roam_startup]').attr('checked', '');
        }
    } else if (CONNECTMODE_ONDEMAND == $('#select_connection_mode').val()) {
        $('#input_max_idle_time').removeAttr('disabled');
        $('input[name=enable_roam_startup]').removeAttr('disabled');
        $('#roam_open').show();
        $('#ondemand_connect').show();
        $('#input_max_idle_time').val(g_connectionData.MaxIdelTime);
        if (1 == g_connectionData.RoamAutoConnectEnable) {
            $('input[name=enable_roam_startup]').attr('checked', 'checked');
        }
        else
        {
             $('input[name=enable_roam_startup]').attr('checked', '');
        }
    } else if (CONNECTMODE_AUTO == $('#select_connection_mode').val()) {
        /*
        $('#roam_open').show();
        $('#ondemand_connect').hide();
        $('#input_max_idle_time').attr('disabled', 'disabled');
        $('input[name=enable_roam_startup]').removeAttr('disabled');
        $('#input_max_idle_time').val(g_connectionData.MaxIdelTime);
        if (1 == g_connectionData.RoamAutoConnectEnable) {
            $('input[name=enable_roam_startup]').attr('checked', 'checked');
        }
        else
        {
             $('input[name=enable_roam_startup]').attr('checked', '');
        }
        */
        $('#input_max_idle_time').removeAttr('disabled');
        $('input[name=enable_roam_startup]').removeAttr('disabled');
        $('#roam_open').show();
        if(IDLE_TIME_ENABLE == g_idle_time_enable)
        {
            $('#ondemand_connect').show();
        }
        else
        {
            $('#ondemand_connect').hide();
        }
        $('#input_max_idle_time').val(g_connectionData.MaxIdelTime);
        if (1 == g_connectionData.RoamAutoConnectEnable) {
            $('input[name=enable_roam_startup]').attr('checked', 'checked');
        }
        else
        {
             $('input[name=enable_roam_startup]').attr('checked', '');
        }
    }
}

//function for set auto connection roam visibility
function setRoamStatus(_enable) {
    if (1 == _enable) {
        $('input[name=enable_roam_startup]').attr('checked', 'checked');
    }
    setConnectionStatus();
}

function initPage() {
    getConfigData('config/dialup/connectmode.xml', function($xml) {
        var ret = xml2object($xml);
        if ('config' == ret.type) {
            $('#select_connection_mode').empty();
            g_idle_time_enable = ret.config.idle_time_enabled;
            g_connect_config = ret.config.ConnectMode;
            if (1 == g_connect_config.Auto) {
                $('#select_connection_mode').append("<option value='0'><li><a href='javascript:void(0);'>" + common_auto + '</a></li></option>');
            }
            if (1 == g_connect_config.Mannual) {
                $('#select_connection_mode').append("<option value='1'><li><a href='javascript:void(0);'>" + common_manual + '</a></li></option>');
            }
            /*
            if (1 == g_connect_config.AsRequired) {
                $('#select_connection_mode').append("<option value='2'><li><a href='javascript:void(0);'>" + dailup_option_on_demand + '</a></li></option>');
            }
            */
        }
    }, {
        sync: true
    });

    // get dialup connection
    getAjaxData('api/dialup/connection', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_connectionData = ret.response;
			if(MACRO_DISPLAY == g_connect_config.Auto) {
				if(MACRO_DISPLAY == g_connect_config.Mannual) {					
					$('#select_connection_mode').val(g_connectionData.ConnectMode);
				} else {					
					$('#select_connection_mode').val(CONNECTMODE_AUTO);					
				}
			}else{
				if(MACRO_DISPLAY == g_connect_config.Mannual) {
					$('#select_connection_mode').val(CONNECTMODE_MANUAL);
				} else {
					$('#select_connection_mode').attr('disabled', 'disabled');
				}
			}			
        }       
        
        $('#input_max_idle_time').val(g_connectionData.MaxIdelTime);
        setRoamStatus(g_connectionData.RoamAutoConnectEnable);
        $(document).ready(function() {
            //Judgement if the profile can be edit
            $('#select_connection_mode li').click(function() {
                button_enable('apply', '1');
            });
            $('#auto_connection').click(function() {
                button_enable('apply', '1');
            });
            $('input,select').bind('change input paste cut keydown', function() {
                button_enable('apply', '1');
            });
        });
    }, {
        sync: true
    });
    $('#select_connection_mode').bind('change', function() {
        setConnectionStatus();
    });
}

function validateConnection() {
    //if (CONNECTMODE_ONDEMAND == $('#select_connection_mode').val()) {
    if (CONNECTMODE_AUTO == $('#select_connection_mode').val()) {
        var idletime = $('#input_max_idle_time').val();
        if (true == isNaN(idletime)) {
            showErrorUnderTextbox('input_max_idle_time', dialup_hint_max_idle_time_number);
            $('#input_max_idle_time').focus();
            return false;
        }else if ((idletime.indexOf('0') == 0) && (idletime != 0)) {
            showErrorUnderTextbox('input_max_idle_time', dialup_hint_max_idle_time_invalid);
            $('#input_max_idle_time').focus();
            return false;
        }else if (idletime.indexOf('.') != -1) {
            showErrorUnderTextbox('input_max_idle_time', dialup_hint_max_idle_time_integer);
            $('#input_max_idle_time').focus();
            return false;
        }else if ((idletime < MIN_IDLE_TIME) || (idletime > MAX_IDLE_TIME)) {
            showErrorUnderTextbox('input_max_idle_time', dialup_hint_max_idle_time_range);
            $('#input_max_idle_time').focus();
            return false;
        }
    }
    return true;
}

function postData() {
    g_quicksetup_saveDataOK = true;


    g_connectionData.ConnectMode = $('#select_connection_mode').val();
    g_connectionData.RoamAutoConnectEnable = ($('.auto_connect_roam :checked').size() > 0) ? 1 : 0;
    g_connectionData.MaxIdelTime = $.trim($('#input_max_idle_time').val());
    if (g_module.ap_station_enabled && CONNECTMODE_MANUAL == g_connectionData.ConnectMode) {
        var dataConnection = {
            'Handover': 0
        };
        var newXmlSetString = object2xml('request', dataConnection);
        saveAjaxData('api/wlan/handover-setting', newXmlSetString, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret)) {
                g_quicksetup_saveDataOK = false;
            }
        });
    }
    var newXmlString = object2xml('request', g_connectionData);
    saveAjaxData('api/dialup/connection', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
        }

        if (g_quicksetup_saveDataOK) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        }else {
            initPage();
        }
    });
}

function onApply() {
    if (!isButtonEnable('apply')) {
        return;
    }
    clearAllErrorLabel();

    if (!validateConnection()) {
        return;
    }
    //if ((CONNECTMODE_ONDEMAND == $('#select_connection_mode').val()) && ($('.auto_connect_roam :checked').size() > 0)) {
    if ((CONNECTMODE_AUTO == $('#select_connection_mode').val()) && ($('.auto_connect_roam :checked').size() > 0)) {
        showConfirmDialog(dialup_hint_roam_auto_connect, postData, function() {});
    }else {
        showConfirmDialog(firewall_hint_submit_list_item, postData, function() {});
    }
    $('#pop_confirm').click(function() {
        button_enable('apply', '0');
    });
}

$(document).ready(function() {
    button_enable('apply', '0');

    $('#tooltip_ConnectionMode').qtip({
        content: '<b>' + common_manual + '</b>' + common_colon + dialup_help_connection_mode_manual + '<br /><b>' + common_auto + '</b>' + common_colon + dialup_help_connection_mode_auto,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });

    $('#tooltip_MaxIdleTime').qtip({
        content: dialup_help_max_idle_time,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });
    $('#apply').bind('click', onApply);
    //when enter, dafault it is disabled.
    button_enable('apply', '0');
    initPage();
});
