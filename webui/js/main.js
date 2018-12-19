// JavaScript Document
/***************************the common var******************/
// Global Features
var g_feature = null;

var g_moduleswitch = null;
var g_module = {};
var g_dailup = null;
var g_destnation = null;
var g_nav = null;
var g_otafeature = null;
var g_isReady = false;
var LOGOUT_TIMEOUT_MAIN = 300000;
var g_logoutTimer = '';
var g_pin_status_SimPukTimes = '';
//Language list scroll control
var g_LANGUAGE_COUNT = 13;
var g_LANGUAGE_LIST_HEIGHT = '300px';
// constant variable
var G_MonitoringStatus = null;
var G_NotificationsStatus = null;
var G_StationStatus = null;
var MACRO_SHOW_POPUP = 1;
//PUK times 0
var PUK_TIMES_ZERO = '0';
//Pin status
var MACRO_NO_SIM_CARD = '255';
var MACRO_CPIN_FAIL = '256';
var MACRO_PIN_READY = '257';
var MACRO_PIN_DISABLE = '258';
var MACRO_PIN_VALIDATE = '259';
var MACRO_PIN_REQUIRED = '260';
var MACRO_PUK_REQUIRED = '261';
//Connection status
var MACRO_CONNECTION_CONNECTING = '900';
var MACRO_CONNECTION_CONNECTED = '901';
var MACRO_CONNECTION_DISCONNECTED = '902';
var MACRO_CONNECTION_DISCONNECTING = '903';
//wifi Connection status
var WIFI_CONNECTING = '900';
var WIFI_CONNECTED= '901';
var WIFI_DISCONNECTED = '902';
var WIFI_DISCONNECTING = '903';

var FORBID_AUTO_CONNECT_OPEN_DEVICE = '112';
var FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING = '113';
var FORBID_RE_CONNECT_DROPLINE = '114';
var FORBID_RE_CONNECT_DROPLINE_ROAMING = '115';
//SIM status
var MACRO_SIM_STATUS_USIM_N = '0';
var MACRO_SIM_STATUS_USIM_Y = '1';
var MACRO_SIM_STATUS_USIM_CS_N = '2';
var MACRO_SIM_STATUS_USIM_PS_N = '3';
var MACRO_SIM_STATUS_USIM_PS_CS_N = '4';
var MACRO_SIM_STATUS_ROMSIM = '240';
var MACRO_SIM_STATUS_USIM_NE = '255';
//Battery status
var MACRO_BATTERY_STATUS_NORMAL = '0';
var MACRO_BATTERY_STATUS_ELECT = '1';
var MACRO_BATTERY_STATUS_LOW = '-1';
//Battery level
var MACRO_BATTERY_LEVEL_ZERO = '0';
var MACRO_BATTERY_LEVEL_ONE = '1';
var MACRO_BATTERY_LEVEL_TWO = '2';
var MACRO_BATTERY_LEVEL_THREE = '3';
var MACRO_BATTERY_LEVEL_FOUR = '4';
//Signal status
var MACRO_EVDO_LEVEL_ZERO = '0';
var MACRO_EVDO_LEVEL_ONE = '1';
var MACRO_EVDO_LEVEL_TWO = '2';
var MACRO_EVDO_LEVEL_THREE = '3';
var MACRO_EVDO_LEVEL_FOUR = '4';
var MACRO_EVDO_LEVEL_FIVE = '5';

//CurrentPlmn
var MACRO_CURRENT_NETWOORK_2G = '0';
var MACRO_CURRENT_NETWOORK_3G = '2';
var MACRO_CURRENT_NETWOORK_H = '5';
var MACRO_CURRENT_NETWOORK_4G = '7';

//CurrentNetworkType
var MACRO_NET_WORK_TYPE_NOSERVICE         = '0';          /* 无服务            */

var MACRO_NET_WORK_TYPE_GSM               = '1';          /* GSM模式           */
var MACRO_NET_WORK_TYPE_GPRS              = '2';          /* GPRS模式          */
var MACRO_NET_WORK_TYPE_EDGE              = '3';          /* EDGE模式          */

var MACRO_NET_WORK_TYPE_WCDMA             = '4';          /* WCDMA模式         */
var MACRO_NET_WORK_TYPE_HSDPA             = '5';          /* HSDPA模式         */
var MACRO_NET_WORK_TYPE_HSUPA             = '6';          /* HSUPA模式         */
var MACRO_NET_WORK_TYPE_HSPA              = '7';          /* HSPA模式          */
var MACRO_NET_WORK_TYPE_TDSCDMA           = '8';          /* TDSCDMA模式       */
var MACRO_NET_WORK_TYPE_HSPA_PLUS         = '9';          /* HSPA_PLUS模式     */
var MACRO_NET_WORK_TYPE_EVDO_REV_0        = '10';         /* EVDO_REV_0模式    */
var MACRO_NET_WORK_TYPE_EVDO_REV_A        = '11';         /* EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_EVDO_REV_B        = '12';         /* EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_1xRTT             = '13';         /* 1xRTT模式         */
var MACRO_NET_WORK_TYPE_UMB               = '14';         /* UMB模式           */
var MACRO_NET_WORK_TYPE_1xEVDV            = '15';         /* 1xEVDV模式        */
var MACRO_NET_WORK_TYPE_3xRTT             = '16';         /* 3xRTT模式         */
var MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM   = '17';         /* HSPA+64QAM模式    */
var MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO    = '18';          /* HSPA+MIMO模式     */

var MACRO_NET_WORK_TYPE_LTE               = '19';          /*LTE 模式*/


var MACRO_NET_WORK_TYPE_EX_NOSERVICE         = '0';          /* 无服务                   */
var MACRO_NET_WORK_TYPE_EX_GSM               = '1';          /* GSM模式                  */
var MACRO_NET_WORK_TYPE_EX_GPRS              = '2';          /* GPRS模式                 */
var MACRO_NET_WORK_TYPE_EX_EDGE              = '3';          /* EDGE模式                 */

var MACRO_NET_WORK_TYPE_EX_IS95A             = '21';         /* IS95A模式                */
var MACRO_NET_WORK_TYPE_EX_IS95B             = '22';         /* IS95B模式                */
var MACRO_NET_WORK_TYPE_EX_CDMA_1x           = '23';         /* CDMA1x模式               */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_0        = '24';         /* EVDO_REV_0模式           */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_A        = '25';         /* EVDO_REV_A模式           */
var MACRO_NET_WORK_TYPE_EX_EVDO_REV_B        = '26';         /* EVDO_REV_A模式           */
var MACRO_NET_WORK_TYPE_EX_HYBRID_CDMA_1x    = '27';         /* HYBRID_CDMA1x模式        */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0 = '28';         /* HYBRID_EVDO_REV_0模式    */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A = '29';         /* HYBRID_EVDO_REV_A模式    */
var MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B = '30';         /* HYBRID_EVDO_REV_A模式    */

var MACRO_NET_WORK_TYPE_EX_WCDMA             = '41';         /* WCDMA模式                */
var MACRO_NET_WORK_TYPE_EX_HSDPA             = '42';         /* HSDPA模式                */
var MACRO_NET_WORK_TYPE_EX_HSUPA             = '43';         /* HSUPA模式                */
var MACRO_NET_WORK_TYPE_EX_HSPA              = '44';         /* HSPA模式                 */
var MACRO_NET_WORK_TYPE_EX_HSPA_PLUS         = '45';         /* HSPA_PLUS模式            */
var MACRO_NET_WORK_TYPE_EX_DC_HSPA_PLUS      = '46';         /* DC_HSPA_PLUS模式         */

var MACRO_NET_WORK_TYPE_EX_TD_SCDMA          = '61';         /* TD_SCDMA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSDPA          = '62';         /* TD_HSDPA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSUPA          = '63';         /* TD_HSUPA模式             */
var MACRO_NET_WORK_TYPE_EX_TD_HSPA           = '64';         /* TD_HSPA模式              */
var MACRO_NET_WORK_TYPE_EX_TD_HSPA_PLUS      = '65';         /* TD_HSPA_PLUS模式         */

var MACRO_NET_WORK_TYPE_EX_802_16E           = '81';         /* 802.16E模式              */

var MACRO_NET_WORK_TYPE_EX_LTE               = '101';        /* LTE 模式                 */

var g_wifioffload_enable = '';

//Wifi status
var MACRO_WIFI_OFF = '0';
var MACRO_WIFI_ON = '1';

var AJAX_HEADER = '../';
var AJAX_TAIL = '';

var AJAX_TIMEOUT = 30000;
var LOGIN_STATES_SUCCEED = '0';
var LOGIN_STATES_FAIL = '-1';
var LOGIN_STATES_REPEAT = '-2';
var g_needToLogin = '';
var g_needHelp = '';
var g_needFooter = '';
var g_isTrunOffWlanChecked = false;

var ERROR_LOGIN_USERNAME_WRONG = 108001;
var ERROR_LOGIN_PASSWORD_WRONG = 108002;
var ERROR_LOGIN_ALREADY_LOGIN = 108003;
var MACRO_LOGIN = '1';
var MACRO_LOGOUT = '2';
var MACRO_NEWVERSIONFOUND = '12';
var MACRO_READYTOUPDATE = '50';

var g_monitoring_dumeter_kb = 1024;
var g_monitoring_dumeter_mb = 1024 * 1024;
var g_monitoring_dumeter_gb = 1024 * 1024 * 1024;
var g_monitoring_dumeter_tb = 1024 * 1024 * 1024 * 1024;

var plmn_rat_index = {
    0 : 2,
    2 : 3
};

var g_is_connect_clicked = false;
var g_is_disconnect_clicked = false;
var g_base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

var g_is_login_opened = false;
// Aim to take all the prompt displaying on a page as a stack.
var g_main_displayingPromptStack = new Array();

var DATA_READY = {
    statusReady: false,
    apStationReady: false,
    notificationsReady: false
};
var USER_MANUAL_PATH = 'usermanual';
var USER_MANUAL_FILE_NAME = 'web_content_concept_00001.html';
var g_user_manual_url = '';
//If remove when show confirm dialog
var DIALOG_UNREMOVE = 0;
//Constant for initialization tooltip
var STATUS_BAR_ICON_STATUS = {
    sim_tooltip_state: '',
    plmn_tooltip_state: '',
    station_tooltip_state: '',
    wan_tooltip_state: '',
    wifi_tooltip_state: '',
    battery_tooltip_state: ''
};

var STATUS_LISTENER_FUN_LIST = new Array();
var g_lastBatteryStatus = null;
//
var header_icon_status = {
    ConnectionStatus: ' ',
    SignalStrength: ' ',
    BatteryStatus: ' ',
    BatteryLevel: ' ',
    SimStatus: ' ',
    WifiStatus: ' ',
    ServiceStatus: ' ',
    CurrentNetworkType: ' '
};

//Wifi station connection status
var WIFI_STATION_DISCONNECTED = '0';
var WIFI_STATION_CONNECTING = '1';
var WIFI_STATION_CONNECTED = '2';
var WIFI_STATION_DISCONNECTING = '3';
//URL to home page
var HOME_PAGE_URL = 'home.html';

/*invialid page*/
var g_PageUrlTree = null;

/* ------------------------ Language ----------------------------------- */
var LANGUAGE_DATA = {
    current_language: 'en_us',
    supportted_languages: new Array()
};
var current_href = window.location.href;
var TOPMENU = {
    nav: new Array(),
    have: false
};
var log = log4javascript.getNullLogger();
var _logEnable = getQueryStringByName('log');
var g_main_convergedStatus = null;
var g_plmn_rat = '';

/******************************** DHCP ***************************************/
var DHCP_IP_ADDRESS_DEFAULT = '192.168.1.1';
var DHCP_START_IP_ADDRESS_DEFAULT = '192.168.1.100';
var DHCP_END_IP_ADDRESS_DEFAULT = '192.168.1.200';
var DHCP_STATUS_DEFAULT = '1';
var DHCP_STATUS_DISABLED = '0';
var DHCP_LAN_NET_MASK_DEFAULT = '255.255.255.0';
var DHCP_LEASE_TIME_DEFAULT = '0';
var dhcpLanIPAddress;
var dhcpLanNetmask;
var dhcpEnable;
var dhcpLanStartIP;
var dhcpLanEndIP;
var dhcpLeaseTime;
var dhcpPageVar = {
    DhcpIPAddress: DHCP_IP_ADDRESS_DEFAULT,
    DhcpLanNetmask: DHCP_LAN_NET_MASK_DEFAULT,
    DhcpStatus: DHCP_STATUS_DEFAULT,
    DhcpStartIPAddress: DHCP_START_IP_ADDRESS_DEFAULT,
    DhcpEndIPAddress: DHCP_END_IP_ADDRESS_DEFAULT,
    DHCPLeaseTime: DHCP_LEASE_TIME_DEFAULT
};
function initDhcp() {
    dhcpLanIPAddress = dhcpPageVar.DhcpIPAddress;
    dhcpLanNetmask = dhcpPageVar.DhcpLanNetmask;
    dhcpEnable = dhcpPageVar.DhcpStatus;
    dhcpLanStartIP = dhcpPageVar.DhcpStartIPAddress;
    dhcpLanEndIP = dhcpPageVar.DhcpEndIPAddress;
    dhcpLeaseTime = dhcpPageVar.DHCPLeaseTime;
}

/********************************function***************************************/

function matchLanguageExist(current_lang, lang_list_arr) {
    if ($.isArray(lang_list_arr)) {
        var lang_exsit = 0;
        $.each(lang_list_arr, function(i, v) {
            if (v.replace(/-/, '_') == current_lang.replace(/-/, '_')) {
                lang_exsit = i;
                return false;
            }
        });
        LANGUAGE_DATA.current_language = lang_list_arr[lang_exsit].replace(/-/, '_');
    }
    else if ('undefined' != typeof (lang_list_arr)) {
        LANGUAGE_DATA.current_language = lang_list_arr.replace(/-/, '_');
    }
    else {
        LANGUAGE_DATA.current_language = 'en_us';
    }
}

function reloadLeftMenu() {
    log.debug('start reloadLeftMenu');
    //reload left menu
    if($(".content").children().first().is(".main_left")) {
        if ($('.main_left').children().is('#settings_menu')) {
            log.debug('checking setting menu');
            if($.trim($('#settings_menu').html()) == '' || $('#settings_menu').html() == null)
            {
                log.debug('setting menu is null');
                showleftMenu();
            }
        }
        else if ($('.main_left').children().is('#sms_menu')) {
                log.debug('checking sms menu');
                if($.trim($('#sms_menu').html()) == '' || $('#sms_menu').html() == null)
                {
                    log.debug('sms menu is null');
                    showleftMenu();
                }
        }
    }
   
    //reLoad footer
    if (g_needFooter) {
        if($.trim($('#footer').html()) == '' || $('#footer').html() == null) {
            log.debug('footer is null');
            showFooter();
        }
        
    }
    
}
// load lang file

function loadLangFile() {
    var langFile = '../language/lang_' + LANGUAGE_DATA.current_language + '.js';

    $.ajax({
        async: false,
        //cache: false,
        type: 'GET',
        timeout: '3000',
        url: langFile,
        dataType: 'script',
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            try {
                log.error('MAIN : loadLangFile() error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus' + textStatus);
                log.error('MAIN : errorThrown' + errorThrown);
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : loadLangFile() success.');
        }
    });
}

/*
 For page load optimize, we use one request instead of 3 request
 api/monitoring/converged-status = api/pin/status + api/pin/simlock +
 api/language/current-language
 */
function main_getConvergedStatus() {
    getAjaxData('api/monitoring/converged-status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_main_convergedStatus = ret.response;
            matchLanguageExist(g_main_convergedStatus.CurrentLanguage, LANGUAGE_DATA.supportted_languages);

            // get language file
            loadLangFile();
        }
    }, {
        sync: true
    });

    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il') {
        $('link').attr('href', '../css/main_Arabic.css');
    }

    $(document).ready(function() {
        $('#login_wrapper').show();
    });
}

function getLangList() {
    getConfigData('config/global/languagelist.xml', function($xml) {
        var lang_list_ret = xml2object($xml);
        if (lang_list_ret.type == 'config') {
            LANGUAGE_DATA.supportted_languages = lang_list_ret.config.languages.language;
        }
        else {
            log.error('Load language data failed');
        }
    }, {
        sync: true
    });
}

function initLanguage() {
    getLangList();
    main_getConvergedStatus();
}

function main_executeBeforeDocumentReady() {
    // initial logger
    if (_logEnable == 'debug') {
        log.setLevel(log4javascript.Level.DEBUG);
    }
    else if (_logEnable == 'trace') {
        log.setLevel(log4javascript.Level.TRACE);
    }
    log.debug('MAIN : entered ' + window.location.href);

    getGlobalFeatures();

    // get converged status to initial
    initLanguage();

    if ($.browser.msie && ($.browser.version == '6.0')) {
        try {
            document.execCommand('BackgroundImageCache', false, true);
        }
        catch (e) {
        }
    }

    //var temp = current_href;
    if (current_href.indexOf('?url') > 0) {
        current_href = current_href.substring(0, current_href.indexOf('?url'));
        current_href = current_href.substring(current_href.lastIndexOf('/') + 1);
        current_href = current_href.substring(0, current_href.indexOf('.'));

    }
    else {
        current_href = current_href.substring(current_href.lastIndexOf('/') + 1);
        if (current_href.lastIndexOf('?') > 0) {
            current_href = current_href.substring(0, current_href.lastIndexOf('?'));
            current_href = current_href.substring(0, current_href.indexOf('.'));
            if (current_href == 'smsinbox') {
                current_href = location.search.substring(1);
            }
        }
        else {
            current_href = current_href.substring(0, current_href.lastIndexOf('.'));
        }
    }

    selectCur(g_PageUrlTree);

    if (navigator.userAgent.indexOf('MSIE 6.') > -1) {
        window.attachEvent('onload', correctPNG);
    }

}

// document.write
function dw(text) {
    document.write(text);
}

// jquery  cookie
function newCookie(name, value, options) {
    if (typeof value != 'undefined') {// name and value given, set cookie
        options = options || {};
        if (value == null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            }
            else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
            // use expires
            // attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    }
    else {// only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            var i = 0;
            for (i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
}

// change lang
function changeLang(key, val) {
    key = false;
    if (key) {
        newCookie(key, val);
        window.location.reload();
    }
    else {
        var langObj = {
            CurrentLanguage: val
        };
        langObj.CurrentLanguage = langObj.CurrentLanguage.replace(/_/, '-');
        var res = object2xml('request', langObj);
        saveAjaxData('api/language/current-language', res, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                refresh();
            }
        });
    }
}

function setMainMenu() {
    if (current_href == 'pincoderequired' || current_href == 'pukrequired' || current_href == 'simlockrequired' || current_href == 'nocard' || current_href == 'connectionless' || current_href == 'opennewwindow') {
        $('#union_main_menu').hide();
        $('#logout_span').hide();
    }
    else {
        $('#home').children().text(common_home);

        if (g_module.statistic_enabled) {
            $('#statistic').children().text(connection_hilink_label_traffic_statistics);

        }
        else {
            $('#menu_statistic').remove();
        }

        if (g_module.sms_enabled) {
            $('#sms').children().text(sms_lable_sms);
        }
        else {
            $('#menu_sms').remove();
        }

        if (g_module.pb_enabled) {
            $('#pb').children().text(pb_label_phonebook);
        }
        else {
            $('#menu_pb').remove();
        }
        if (g_module.sdcard_enabled) {
            $('#sharing').children().text(sharing_label_sharing);
        }
        else {
            $('#menu_sharing').remove();
        }

        if (g_module.ussd_enabled) {
            $('#ussd').children().text(ussd_label_ussd);
        }
        else {
            $('#menu_ussd').remove();
        }

        if (g_module.online_update_enabled) {
            $('#update').children().text(common_updates);
        }
        else {
            $('#menu_update').remove();
        }
        if (g_module.stk_enabled) {
            $('#stk').children().text(stk_label_stk);
        }
        else {
            $('#menu_stk').remove();
        }
		if (g_otafeature != null && g_otafeature.enable){
			$('#ota').children().text(common_ota);
		}else {
			$('#menu_ota').remove();
		}
		if (g_module.dlna_enabled) {
			$('#dlna').children().text(common_dlna);
		} else {
			$('#menu_dlna').remove();
		}

        $('#settings').children().text(common_settings);

        $('#union_main_menu').show();
    }
}

function selectCur(obj) {
    $.each(obj, function(i, n) {
        if (!TOPMENU.have) {
            TOPMENU.nav.push(i);
        }
        if (typeof n == 'object') {
            selectCur(n);
        }
        else if (typeof n == 'string') {
            if (n == current_href) {
                TOPMENU.nav.push(n);
                TOPMENU.have = true;
            }
        }
        if (!TOPMENU.have) {
            TOPMENU.nav.pop();
        }
    });
}

function showCur(noSubMenu) {
    if (noSubMenu) {
        $('#' + TOPMENU.nav[0]).addClass('active');
    }
    else {
        $('#' + TOPMENU.nav[1]).addClass('click');
        var cName = ($('#' + TOPMENU.nav[1]).get(0)).className;
        if (cName.indexOf('nosub') > -1) {
            cName = cName.replace('nosub ', 'nosub');
        }
        $('#' + TOPMENU.nav[1])[0].className = cName;
        //$("#" + TOPMENU.nav[1] + " ul li:eq(" + TOPMENU.nav[2] +
        // ")").addClass("subClick");
        $('#' + TOPMENU.nav[2]).addClass('subClick');
    }
}

// new log object for debug page
function getQueryStringByName(item) {
    var svalue = location.search.match(new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
    return svalue ? svalue[1] : svalue;
}

//Set defferent menu for each device type
function showleftMenu() {
    log.debug('showleftMenu');
    if ($('.main_left').children().is('#sms_menu')) {
        $('.main_left').load('leftmenu.html #sms_menu', function() {
            log.debug('MAIN : Load left sms menu successful1');
            clickMenu('menu_sms');
            $('#lable_sms').text(sms_lable_sms);
            //$("#label_new_message").text(sms_label_new_message);
            $('#label_inbox').text(sms_label_inbox);
            $('#label_sent').text(sms_label_sent);
            $('#label_drafts').text(sms_label_drafts);
            if (typeof(g_PageUrlTree.sms.sms_center_number) != 'undefined') {
                $('#label_sms_center_number').text(sms_label_sms_settings);
            }else{
            	$('#sms_center_number').remove();
            }
            showCur(false);
            $('#label_inbox_status').text(g_sms_inbox_store_status);
            $('#label_sent_status').text(g_sms_outbox_store_status);
            $('#label_drafts_status').text(g_sms_draftbox_store_status);
            // for IE
        });
    }

    if ($('.main_left').children().is('#settings_menu')) {
        log.debug('MAIN : Loading  leftmenu');
        $('.main_left').load('leftmenu.html #settings_menu', function() {
            log.debug('MAIN : Load left settings menu successfull');
            clickMenu('menu_settings');
            
            //quicksetup
            if (typeof(g_PageUrlTree.settings.quick_setup) != 'undefined') {
                $('#label_quick_setup').text(wizard_label_quick_setup);
            }else{
            	$('#quick_setup').remove();
            }
            
            //wifinetworks
            if (typeof(g_PageUrlTree.settings.wifinetworks) != 'undefined') {
                $('#wifi_label_networks_settings').text(wlan_lable_Interntet_wlan);
            }else{
                $('#wifinetworks').remove();
            }

            //dialup
            if (typeof(g_PageUrlTree.settings.dialup) != 'undefined') {
                $('#label_dialup').text(dialup_label_dialup);

                if (typeof(g_PageUrlTree.settings.dialup.mobileconnection) != 'undefined') {
                    $('#label_mobile_connection').text(dialup_label_mobile_connection);
                }else{
                	$('#mobileconnection').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.dialup.mobilenetworksettings) != 'undefined') {
                    $('#label_mobile_network_settings').text(dialup_label_mobile_network_settings);
                }else{
                	$('#mobilenetworksettings').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.dialup.profilesmgr) != 'undefined') {
                    $('#label_profile_management').text(dialup_label_profile_management);
                }else{
                	$('#profilesmgr').remove();
                }
                
            }else{
            	$('#dialup').remove();
            }
            
            //wlan
            if (typeof(g_PageUrlTree.settings.wlan) != 'undefined') {
                $('#label_wlan').text(wlan_label_wlan);
                if (typeof(g_PageUrlTree.settings.wlan.wlanbasicsettings) != 'undefined') {
                    $('#label_wlan_basic_settings').text(wlan_label_wlan_basic_settings);
                }else{
                	$('#wlanbasicsettings').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.wlan.wlanadvanced) != 'undefined') {
                    $('#label_wlan_advanced_settings').text(wlan_label_wlan_advanced_settings);
                }else{
                	$('#wlanadvanced').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.wlan.wlanmacfilter) != 'undefined') {
                    $('#label_wlan_mac_filter').text(wlan_label_wlan_mac_filter);
                }else{
                	$('#wlanmacfilter').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.wlan.wps) != 'undefined') {
                    $('#wlan_label_wps_settings').text(wlan_label_wps_settings);
                }else{
                	$('#wps').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.wlan.dhcp) != 'undefined') {
                    $('#label_dhcp').text(dhcp_label_dhcp);
                }else{
                	$('#dhcp').remove();
                }
                
            }else{
            	$('#wlan').remove();
            }

            //security
            if (typeof(g_PageUrlTree.settings.security) != 'undefined') {
                if (typeof(g_PageUrlTree.settings.security.pincodeautovalidate) != 'undefined') {
                    $('#label_pin_auto_validation').text(dialup_label_pin_auto_validation);
                }else{
                    $('#pincodeautovalidate').remove();
                }
                // G_MonitoringStatus.response. SimStatus 为240则将ID pincodemanagement取消掉,不能进入PIN码管理页面。
                getAjaxData('api/monitoring/status', function($xml) {
                    log.debug('MAIN : getDeviceStatus() get monitoring success');
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        G_MonitoringStatus = ret;
                    }
                    if (typeof(g_PageUrlTree.settings.security.pincodemanagement) != 'undefined' && G_MonitoringStatus != null && MACRO_SIM_STATUS_ROMSIM != G_MonitoringStatus.response.SimStatus) {
                        $('#label_pin_code_management').text(dialup_label_pin_code_management);
                    }else{
                        $('#pincodemanagement').remove();
                    }

                });
                $('#label_security').text(firewall_label_security);
                if (typeof(g_PageUrlTree.settings.security.firewallswitch) != 'undefined') {
                    $('#label_firewall_switch').text(firewall_label_firewall_switch);
                }else{
                	$('#firewallswitch').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.lanipfilter) != 'undefined') {
                    $('#label_lan_ip_filter').text(firewall_label_lan_ip_filter);
                }else{
                	$('#lanipfilter').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.virtualserver) != 'undefined') {
                    $('#label_virtual_server').text(firewall_label_virtual_server);
                }else{
                	$('#virtualserver').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.specialapplication) != 'undefined') {
                    $('#label_special_application').text(firewall_label_special_application);
                }else{
                	$('#specialapplication').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.dmzsettings) != 'undefined') {
                    $('#label_dmz_settings').text(firewall_label_dmz_settings);
                }else{
                	$('#dmzsettings').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.sipalgsettings) != 'undefined') {
                    $('#label_sip_alg_settings').text(firewall_label_sip_alg_settings);
                }else{
                	$('#sipalgsettings').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.upnp) != 'undefined') {
                    $('#label_upnp_setting').text(firewall_label_upnp_setting);
                }else{
                	$('#upnp').remove();
                }
                
                if (typeof(g_PageUrlTree.settings.security.nat) != 'undefined') {
                    $('#label_nat_settings').text(IDS_wlan_title_nat_settings);
                }else{
                	$('#nat').remove();
                }
            }else{
            	$('#security').remove();
            }
             //sntp
             if (typeof(g_PageUrlTree.settings.sntp) != 'undefined') {
                $('#label_sntp').text(system_label_sntp);
            	}
            else{
            	$('#sntp').remove();
            }
            //system
            if (typeof(g_PageUrlTree.settings.system) != 'undefined') {
                $('#label_system').text(system_label_system);

                if (typeof(g_PageUrlTree.settings.system.deviceinformation) != 'undefined') {
                    $('#label_device_information').text(system_label_device_information);
                }else{
            		$('#deviceinformation').remove();
            	}
            	
                if (typeof(g_PageUrlTree.settings.system.diagnosis) != 'undefined') {
                    $('#label_diagnosis').text(system_label_diagnosis);
                }else{
            		$('#diagnosis').remove();
            	}
            	
                if (typeof(g_PageUrlTree.settings.system.configuration) != 'undefined') {
                    $('#label_configuration').text(system_label_backup_restore);
                }else{
            		$('#configuration').remove();
            	}
            	
                if (typeof(g_PageUrlTree.settings.system.modifypassword) != 'undefined') {
                    $('#label_modify_password').text(system_label_modify_password);
                }else{
            		$('#modifypassword').remove();
            	}
            	
                if (typeof(g_PageUrlTree.settings.system.restore) != 'undefined') {
                    $('#label_restore_defaults').text(system_label_restore_defaults);
                }else{
            		$('#restore').remove();
            	}
            	
                if (typeof(g_PageUrlTree.settings.system.reboot) != 'undefined') {
                    $('#label_reboot').text(system_label_reboot);
                }else{
            		$('#reboot').remove();
            	}
            }else{
            	$('#system').remove();
            }

            showCur(false);
        });
    }
}

function setLangList() {
    if (!jQuery.isArray(LANGUAGE_DATA.supportted_languages))
    {
        $('#lang').hide();
        return;
    }
    $('#lang').append(g_langList);
    $('#lang').show();

    $('#lang').change(function() {
        changeLang('lang', $('#lang').val());
    });
}

function showCurrentLanguage() {
    //show the current lang to the lang inputBox
    var lang = LANGUAGE_DATA.current_language.replace(/-/, '_');
    $('#lang').val(lang);
}
function showFooter()
{
    //Load footer
    if (g_needFooter) {
        $('#footer').load('footer.html img, span, rightcorner', function() {
            $('#footer span').html('&nbsp;' + common_copyright + "<div class='rightcorner'></div>");
            log.debug('MAIN : Load footer successful');
        });
    }
}
main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready(function() {
    //Display Title
    document.title = g_feature.title;

    // hide right mouse click menu
    document.oncontextmenu = new Function('return false');

    $('.hotlinkstring').show();
    //load header,
    loadHeader();
    getSimPukTimes();
    //load left menu
    if($(".content").children().first().is(".main_left")) {
        showleftMenu();
    }


    getDeviceStatus();

    showFooter();
    
    //Button effect when mouseover and out
    $('.button_wrapper:not(#login_btn,#connect_btn,#disconnect_btn,#cancel_btn)').live('mouseover', function() {
        $(this).addClass('mouse_on');
    });
    $('.button_wrapper').live('mouseout', function() {
        $(this).removeClass('mouse_on');
    });
    //Button effect when mousedown and mouseout
    $('.button_wrapper:not(#login_btn)').mousedown(function() {
        $(this).addClass('mouse_down');
    });
    $('.button_wrapper').mouseup(function() {
        $(this).removeClass('mouse_down');
    });
    //Drop down select, if there hasn't any drop down select, it won't work
    /*
    if ($("#lang").size() > 0) {
    drop_down_select($("#lang"), $(".lang_option").eq(0));//index page
    }
    */

    /******* Customlized dialog of which a button ID is "pop_OK" *****/
    $('#pop_OK').live('click', function() {
        if ('pop_OK' == g_main_displayingPromptStack[g_main_displayingPromptStack.length - 1]) {
            g_main_displayingPromptStack.pop();
        }
        enableTabKey();
    });
    /*************Function for close dialog**************/
    $('.dialog_close_btn, .pop_Cancel').live('click', function() {
        if (g_nav != null) {
            g_nav.children().first().attr('href', g_destnation);
            g_nav = null;
        }
        if(g_isTrunOffWlanChecked) {
            g_isTrunOffWlanChecked = false;
            $('#trun_off_waln_check').click();
        }
        clearDialog();
        g_main_displayingPromptStack.pop();
        enableTabKey();
    });
    /*************Function for close dialog**************/
    /*$(window).resize(function(){
    windowResize($(".dialog"));
    });
    $("#div_wrapper").css({
    height: $(document).height()
    });*/

    /************* Key Event Handler **************/
    $(document).keyup(onKeyup);
    g_main_displayingPromptStack.length = 0;
});

function setSettingMenu(obj) {

    $.each(obj, function(i, n) {
        if (typeof n == 'object' && !g_isReady) {
            setSettingMenu(n);
        }
        else if ((typeof n === 'string') && !g_isReady  && n != '') {

                $("#settings").attr('href', n + '.html' );
                g_isReady = true;
                log.debug('MAIN : setSettingMenu successful');
           
        }
    });
}

$(window).load(function() {

    $("#all_content").show();
    log.debug("MAIN : all_content show");
    
    var login_status_items = $('.login_info > div:visible');
    if (login_status_items.size() > 2) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '33.3%'
            });
        });
        $('#hilink_connection').remove();   
    }
    else if(login_status_items.size() == 2) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '50%'
            });
        });
        $('#hilink_connection').remove();
    }
    else if(login_status_items.size() == 1 && g_feature.connection.connectionstatus == 1){
          $.each(login_status_items, function(i) {
          $('.login_box_info .connection').attr('style','background:none;width:100%;');
          $('.login_box_info h2').attr('style','width:95%;');
        	
        });
          $('#mobile_connection').remove();       	
          $('#hilink_connection').show();   
    }
    else{
        $.each(login_status_items, function(i) {
           $(this).css({
                width: '50%'
           });
        });
        $('#hilink_connection').remove();
    }	
    
    setTimeout(function() {
                reloadLeftMenu();
            }, 1500);
    setTimeout(function() {
                loadHeader();
            }, 2000);
    
});

function loadHeader () {
    //reload left menu
    log.debug('checking header');
    if($.trim($('#header').html()) == '' || $('#header').html() == null)
    {
        log.debug('header is null');
        $('#header').load('header.html', function() {
            showCur(true);
    
            setMainMenu();
    
            if (g_needHelp) {
                $('#help_span').text(common_help);
            }
            else {
                $('#help_span').remove();
                $('#help_url').remove();
            }
    
            if (g_needToLogin) {
                $('#logout_span').show();
                /*
                 * display login status(login or logout) after check login state
                 */
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (ret.response.State != 0) { //logout
                            $('#username_span').hide();
                            $('#logout_span').text(common_login);
                            cancelLogoutTimer();
                            
                        }
                        else //login
                        {
                            $('#username_span').text(ret.response.Username);
                            $('#username_span').show();
                            $('#logout_span').text(common_logout);
                            if ('home' == current_href) {
                                startLogoutTimer();
                            }
                           
                        }
    
                    }
                }, {
                    sync: true
                });
    
            }
            else {
                $('#logout_span').hide();
            }
    
            if (!g_module.wifi_enabled) {
                $('#wifi_gif').remove();
            }
            if (!g_module.sms_enabled) {
                $('#sms_gif').remove();
            }
    
            if (!g_module.online_update_enabled) {
                $('#update_gif').remove();
            }
    
            if (!g_feature.battery_enabled) {
                $('#battery_gif').remove();
            }
            initialStatusIcon();
    
            /*
             * show language list
             */

            setLangList();

            showCurrentLanguage();

           
    
            /*
             * login logout
             */
            $('#logout_span').live('click', function() {
                g_destnation = null;
                loginout();
            });
            $('#pop_login').live('click', function() {
                if ((null == g_destnation) && ('sdcardsharing' == current_href)) {
                    login(current_href + '.html');
                }
                else {
                    login(g_destnation);
                }
            });
            $('#menu_statistic,#menu_sms,#menu_connection_settings,#menu_ussd,#menu_update,#menu_settings,.nav01,.nav02,#profile_settings,#menu_pb,#menu_stk, #wifi_turnOff_button').live('click', function() {
                if (!g_needToLogin) {
                    return;
                }
                g_nav = $(this);
    
                getAjaxData('api/user/state-login', function($xml) {
                    var ret = xml2object($xml);
                    if (ret.type == 'response') {
                        if (ret.response.State != '0') { //logout
                            g_destnation = g_nav.children().first().attr('href');
                            g_nav.children().first().attr('href', 'javascript:void(0);');
                            showloginDialog();
                        }
    
                    }
                }, {
                    sync: true
                });
    
            });
             setSettingMenu(g_PageUrlTree.settings);
        });
    }
}

/********************Use Function  (end)************************/
/***********Function for create button*************/
function create_button(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        button = "<span class='button_wrapper " + buttonClassName + "' id='" + button_id + "'>";
    }
    else {
        button = "<span class='button_wrapper' id='" + button_id + "'>";
    }
    button += "<span class='button_left'>" + "<span class='button_right'>" + "<span class='button_center'>" + content + '</span></span></span></span>';
    document.write(button);
}

function create_button_html(content, button_id, buttonClassName) {
    if (buttonClassName != '' && buttonClassName != ' ' && buttonClassName != null) {
        button = "<span class='button_wrapper " + buttonClassName + "' id='" + button_id + "'>";
    }
    else {
        button = "<span class='button_wrapper' id='" + button_id + "'>";
    }
    button += "<span class='button_left'>" + "<span class='button_right'>" + "<span class='button_center'>" + content + '</span></span></span></span>';
    return button;
}

function isButtonEnable(button_id) {
    var disable = true;
    var $button = $('#' + button_id);
    if ($button) {
        if ($button.children()) {
            disable = $button.hasClass('disable_btn');
            //enable = $button.children().hasClass("button_left");
        }
    }
    return !disable;
}

/*************Function for append dialog**************/
function call_dialog(dialogTitle, content, button1_text, button1_id, button2_text, button2_id) {
    $('#div_wrapper').remove();
    $('.dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog' id='sms_dialog'>";
    dialogHtml += "    <div class='sms_dialog_top'></div>";
    dialogHtml += "    <div class='sms_dialog_content'>";
    dialogHtml += "        <div class='sms_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left'>" + dialogTitle + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='close' class='dialog_close_btn'><img src='../res/dialog_close_btn.gif' alt='' /></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='sms_dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='sms_dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";

    dialogHtml += "              <span class='button_wrapper " + button1_id + "' id='" + button1_id + "'>";
    dialogHtml += "                  <span class='button_left'>";
    dialogHtml += "                      <span class='button_right'>";
    dialogHtml += "                            <span class='button_center'><a href='javascript:void(0);' title=''>" + button1_text + '</a></span>';
    dialogHtml += '                      </span></span></span>';

    if (button2_text != '' && button2_text != ' ' && button2_text != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper " + button2_id + "' id='" + button2_id + "'>";
        dialogHtml += "                  <span class='button_left'>";
        dialogHtml += "                      <span class='button_right'>";
        dialogHtml += "                            <span class='button_center'><a href='javascript:void(0);' title=''>" + button2_text + '</a></span>';
        dialogHtml += '                      </span></span></span>';
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += "    <div class='sms_dialog_bottom'></div>";
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push(button1_id);

    $('a').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');
}

function showloginDialog() {
    $('#div_wrapper').remove();
    $('.login_dialog').remove();

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='login_dialog' id='dialog'>";
    dialogHtml += "    <div class='login_dialog_top'></div>";
    dialogHtml += "    <div class='login_dialog_content'>";
    dialogHtml += "        <div class='login_dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left'>" + common_login + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a class='dialog_close_btn' title='' href='javascript:void(0);'><img src='../res/dialog_close_btn.gif' title='' alt='' /></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table'>";
    dialogHtml += "               <div class='login'>";
    dialogHtml += "               <div id='username_wrapper'>";
    dialogHtml += '                   <p>' + dialup_label_user_name + common_colon + '</p>';
    dialogHtml += "                   <span><input type='text' class='input' id='username' maxlength='15' value='admin'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += "               <div id='password_wrapper'>";
    dialogHtml += '               <p>' + common_password + common_colon + '</p>';
    dialogHtml += "                   <span><input type='password'  class='input' id='password' maxlength='15'/></span>";
    dialogHtml += '               </div>';
    dialogHtml += '               </div>';
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='login_dialog_table_bottom'>";
    dialogHtml += "              <span class='button_wrapper pop_login' id='pop_login'>";
    dialogHtml += "                  <span class='button_left'>";
    dialogHtml += "                      <span class='button_right'>";
    dialogHtml += "                            <span class='button_center'><a href='javascript:void(0);' title=''>" + common_login + '</a></span>';
    dialogHtml += '                      </span></span></span>';
    dialogHtml += '            </div>';
    dialogHtml += '    </div>';
    dialogHtml += "    <div class='login_dialog_bottom'></div>";
    dialogHtml += '</div>';

    $('.body_bg').before(dialogHtml);

    reputPosition($('#dialog'), $('#div_wrapper'));
    g_main_displayingPromptStack.push('pop_login');

    $('#password').focus();
    g_is_login_opened = true;

    disableTabKey();
}

function showConfirmDialog(content, okFunc, cancelFunc, removeable) {
    if (DIALOG_UNREMOVE != removeable) {
        $('#div_wrapper').remove();
        $('.dialog').remove();
    }

    var dialogHtml = '';
    if ($('#div_wrapper').size() < 1) {
        dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
    }
    dialogHtml += "<div class='dialog'>";
    dialogHtml += "    <div class='dialog_top'></div>";
    dialogHtml += "    <div class='dialog_content'>";
    dialogHtml += "        <div class='dialog_header'>";
    dialogHtml += "            <span class='dialog_header_left'>" + common_confirm + '</span>';
    dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='dialog_close_btn'><img src='../res/dialog_close_btn.gif' title='' alt='' /></a></span>";
    dialogHtml += '        </div>';
    dialogHtml += "        <div class='dialog_table'>" + content + '</div>';
    dialogHtml += "        <div class='dialog_table_bottom'>";
    dialogHtml += "            <div class='dialog_table_r'>";
    dialogHtml += "              <span class='button_wrapper pop_confirm' id='pop_confirm'>";
    dialogHtml += "                  <span class='button_left'>";
    dialogHtml += "                      <span class='button_right'>";
    dialogHtml += "                            <span class='button_center'><a href='javascript:void(0);' title=''>" + common_ok + '</a></span>';
    dialogHtml += '                      </span></span></span>';
    if (cancelFunc != '' && cancelFunc != ' ' && cancelFunc != null) {
        dialogHtml += "&nbsp;&nbsp;&nbsp;&nbsp;<span class='button_wrapper pop_Cancel' id='pop_Cancel'>";
        dialogHtml += "                  <span class='button_left'>";
        dialogHtml += "                      <span class='button_right'>";
        dialogHtml += "                            <span class='button_center'><a href='javascript:void(0);' title=''>" + common_cancel + '</a></span>';
        dialogHtml += '                      </span></span></span>';
    }
    dialogHtml += '            </div>';
    dialogHtml += '        </div>';
    dialogHtml += '    </div>';
    dialogHtml += "    <div class='dialog_bottom'></div>";
    dialogHtml += '</div>';

    $('#pop_confirm').live('click', function() {
        clearDialog();

        if (typeof (okFunc) == 'function') {
            okFunc();
        }
        okFunc = null;
        cancelFunc = null;
        g_main_displayingPromptStack.pop();
        return false;
    });
    $('#pop_Cancel').live('click', function() {
        if (typeof (cancelFunc) == 'function') {
            cancelFunc();
        }
        okFunc = null;
        cancelFunc = null;
        g_main_displayingPromptStack.pop();
        return false;
    });
    $('.body_bg').before(dialogHtml);

    reputPosition($('.dialog'), $('#div_wrapper'));

    g_main_displayingPromptStack.push('pop_confirm');

    disableTabKey();
}

//show info dialog
function showInfoDialog(tipsContent) {

    if ($('.info_dialog').size() == 0) {
        var hideInfo;
        clearTimeout(hideInfo);
        var dialogHtml = '';
        if ($('#div_wrapper').size() < 1) {
            dialogHtml += "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; position:absolute; width:100%; height:100%; z-index:-1; display: block;'> </iframe></div>";
        }
        dialogHtml += "<div class='info_dialog'>";
        dialogHtml += "    <div class='info_dialog_top'></div>";
        dialogHtml += "    <div class='info_dialog_content'>";
        dialogHtml += "        <div class='info_dialog_header'>";
        dialogHtml += "            <span class='dialog_header_left'>" + common_note + '</span>';
        dialogHtml += "            <span class='dialog_header_right'><a href='javascript:void(0);' title='' class='info_dialog_close_btn'><img src='../res/dialog_close_btn.gif' title='' alt='' /></a></span>";
        dialogHtml += '        </div>';
        dialogHtml += "        <div class='info_dialog_table'><div class='info_content'>" + tipsContent + '</div></div>';
        dialogHtml += '    </div>';
        dialogHtml += "    <div class='info_dialog_bottom'></div>";
        dialogHtml += '</div>';

        $('.body_bg').before(dialogHtml);

        $('.info_dialog_close_btn').bind('click', function() {
            clearTimeout(hideInfo);
            $('.info_dialog').remove();
            $('#div_wrapper').remove();
        });

        reputPosition($('.info_dialog'), $('#div_wrapper'));
        disableTabKey();
        hideInfo = setTimeout(function() {
            $('.info_dialog').remove();
            $('#div_wrapper').remove();
        }, g_feature.dialogdisapear);
    }
}

//function for show jquery qtip
function showQtip(showTarget, content, delay) {
    var $showTarget = $('#' + showTarget);
    if ($showTarget) {
        $showTarget.qtip({
            content: content,
            position: {
                corner: {
                    tooltip: 'topMiddle',
                    target: 'bottomMiddle'
                }
            },
            show: {
                when: false,
                ready: true
            }
        });
        if (delay) {
            setTimeout(function() {
                $showTarget.qtip('destroy');
            }, delay);
        }
        else {
            setTimeout(function() {
                $showTarget.qtip('destroy');
            }, g_feature.tip_disapear);
        }
    }
    $showTarget.focus();
}

function clearDialog() {
    $('.dialog:not(#upload_dialog), .info_dialog, .login_dialog, #div_wrapper').remove();
    enableTabKey();
    if (g_is_login_opened) {
        g_is_login_opened = false;
        getDeviceStatus();
    }
}

/*************Function for ie6 png**************/
function correctPNG() {
    var i = 0;
    for (i = 0; i < document.images.length; i++) {
        var img = document.images[i];
        var imgName = img.src.toUpperCase();
        if (imgName.substring(imgName.length - 3, imgName.length) == 'PNG') {
            var imgID = (img.id) ? "id='" + img.id + "' " : '';
            var imgClass = (img.className) ? "class='" + img.className + "' " : '';
            var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
            var imgStyle = 'display:inline-block;' + img.style.cssText;
            if (img.align == 'left') {
                imgStyle = 'float:left;' + imgStyle;
            }

            if (img.align == 'right') {
                imgStyle = 'float:right;' + imgStyle;
            }

            if (img.parentNode.href) {
                imgStyle = 'cursor:hand;' + imgStyle;
            }

            var strNewHTML = '<span ' + imgID + imgClass + imgTitle + ' style=\"' + 'width:' + img.width + 'px; height:' + img.height + 'px;' + imgStyle + ';' + 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader' + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
            img.outerHTML = strNewHTML;
            i = i - 1;
        }
    }
}

/***********************Function list (begin)***********************/

/***********Get and save data (begin)**********/
// internal use only
function _createNodeStr(nodeName, nodeValue) {
    return '<' + nodeName + '>' + nodeValue + '</' + nodeName + '>';
}

// internal use only
function _recursiveObject2Xml(name, obj) {
    var xmlstr = '';
    if (typeof (obj) == 'string' || typeof (obj) == 'number') {
        xmlstr = _createNodeStr(name, obj);
    }
    else if (jQuery.isArray(obj)) {
        jQuery.each(obj, function(idx, item) {
            xmlstr += _recursiveObject2Xml(name, item);
        });
    }
    else if (typeof (obj) == 'object') {
        xmlstr += '<' + name + '>';
        jQuery.each(obj, function(propName, propVal) {
            xmlstr += _recursiveObject2Xml(propName, propVal);
        });
        xmlstr += '</' + name + '>';
    }
    return xmlstr;
}

// convert an object to xml string.
// name: root tag name of XML
// obj:  object which is to be convert to XML
function object2xml(name, obj) {
    var xmlstr = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlstr += _recursiveObject2Xml(name, obj);
    return xmlstr;
}

// internal use only
function _recursiveXml2Object($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each(function() {
            var _childObj = ($(this).children().size() > 0) ? _recursiveXml2Object($(this)) : $(this).text();
            if ($(this).siblings().size() > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            }
            else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    }
    else {
        return $xml.text();
    }
}

// convert XML string to an Object.
// $xml, which is an jQuery xml object.
function xml2object($xml) {
    var obj = new Object();
    if ($xml.find('response').size() > 0) {
        var _response = _recursiveXml2Object($xml.find('response'));
        obj.type = 'response';
        obj.response = _response;
    }
    else if ($xml.find('error').size() > 0) {
        var _code = $xml.find('code').text();
        var _message = $xml.find('message').text();
        log.warn('MAIN : error code = ' + _code);
        log.warn('MAIN : error msg = ' + _message);
        obj.type = 'error';
        obj.error = {
            code: _code,
            message: _message
        };
    }
    else if ($xml.find('config').size() > 0) {
        var _config = _recursiveXml2Object($xml.find('config'));
        obj.type = 'config';
        obj.config = _config;
    }
    else {
        obj.type = 'unknown';
    }
    return obj;
}

/*************Get and save data (end)**************/
/***************Get and save data (begin)******/

// urlstr : URL of the Restful interface.
// callback_func : Callback function to handle response, this callback function
// have one parameter
// callback_func($xml) - $xml : a jQuery XML object which is successfully get
// from getAjaxData.
// options.sync
// options.timout
// options.errorCB
function getAjaxData(urlstr, callback_func, options) {
    var myurl = AJAX_HEADER + urlstr + AJAX_TAIL;
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }

        }
        errorCallback = options.errorCB;
    }

    $.ajax({
        async: isAsync,
        //cache: false,
        type: 'GET',
        timeout: nTimeout,
        url: myurl,
        //dataType: ($.browser.msie) ? "text" : "xml",
        error: function(XMLHttpRequest, textStatus) {
            try {
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
                log.error('MAIN : getAjaxData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus ' + textStatus);
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : getAjaxData(' + myurl + ') sucess.');
            log.trace(data);
            var xml;
            if (typeof data == 'string' || typeof data == 'number') {
                if (-1 != this.url.indexOf('/api/sdcard/sdcard')) {
                    data = sdResolveCannotParseChar(data);
                }
                if((-1 != this.url.indexOf('/api/ussd/get') )&&( -1 != data.indexOf("content"))){            	
            	    data = smsContentDeleteWrongChar(data);            
                   }
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                }
                else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            }
            else {
                xml = data;
            }
            if (typeof callback_func == 'function') {
                callback_func($(xml));
            }
            else {
                log.error('callback_func is undefined or not a function');
            }
        }
    });
}

function sdResolveCannotParseChar(xmlStr) {
    return xmlStr.replace(/(\&|\')/g, function($0, $1) {
        return {
            '&' : '&amp;' ,
            "'" : '&#39;'
        }[$1];
    }
    );
}

function smsContentDeleteWrongChar(smsStr) {
    return smsStr.replace(/([\x00-\x08]|\x0b|\x0c|[\x0e-\x1f])/g, ' ');
}

// urlstr : URL of the Restful interface.
// xml: xml string to be submit to server.
// callback_func : Callback function to handle response, this callback function
// have one parameter
// callback_func($xml) - $xml : a jQuery XML object which is successfully get
// from getAjaxData.
// options.sync
// options.timout
// options.errorCB
function saveAjaxData(urlstr, xml, callback_func, options) {
    var myurl = AJAX_HEADER + urlstr + AJAX_TAIL;
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }
        }
        errorCallback = options.errorCB;
    }

    $.ajax({
        async: isAsync,
        //cache: false,
        type: 'POST',
        timeout: nTimeout,
        url: myurl,
        // dataType: ($.browser.msie) ? "text" : "xml",
        data: xml,
        error: function(XMLHttpRequest, textStatus) {
            try {
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
                log.error('MAIN : saveAjaxData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus' + textStatus);
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : saveAjaxData(' + myurl + ') success.');
            log.trace(data);
            var xml;
            if (typeof data == 'string') {
                if (-1 != this.url.indexOf('/api/sms/sms-list') && -1 != data.indexOf('Messages')) {
                    data = smsContentDeleteWrongChar(data);
                }
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                }
                else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            }
            else {
                xml = data;
            }
            if (typeof callback_func == 'function') {
                callback_func($(xml));
            }
            else {
                log.error('callback_func is undefined or not a function');
            }
        }
    });
}

// return true if the AJAX response from server is <response>OK</response>
// obj: object came from $xml
function isAjaxReturnOK(obj) {
    var ret = false;
    if (obj) {
        if (typeof (obj.response) == 'string') {
            if (obj.response.toLowerCase() == 'ok') {
                ret = true;
            }
        }
    }
    return ret;
}

// options.sync
// options.timout
// options.errorCB
function getConfigData(urlstr, callback_func, options) {
    var myurl = '../' + urlstr + '';
    //var myurl = urlstr + "";
    var isAsync = true;
    var nTimeout = AJAX_TIMEOUT;
    var errorCallback = null;

    if (options) {
        if (options.sync) {
            isAsync = (options.sync == true) ? false : true;
        }
        if (options.timeout) {
            nTimeout = parseInt(options.timeout, 10);
            if (isNaN(nTimeout)) {
                nTimeout = AJAX_TIMEOUT;
            }
        }
        errorCallback = options.errorCB;
    }

    $.ajax({
        async: isAsync,
        //cache: false,
        type: 'GET',
        timeout: nTimeout,
        url: myurl,
        //dataType: ($.browser.msie) ? "text" : "xml",
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            try {
                log.debug('MAIN : getConfigData(' + myurl + ') error.');
                log.error('MAIN : XMLHttpRequest.readyState = ' + XMLHttpRequest.readyState);
                log.error('MAIN : XMLHttpRequest.status = ' + XMLHttpRequest.status);
                log.error('MAIN : textStatus ' + textStatus);
                if (jQuery.isFunction(errorCallback)) {
                    errorCallback(XMLHttpRequest, textStatus);
                }
            }
            catch (exception) {
                log.error(exception);
            }
        },
        success: function(data) {
            log.debug('MAIN : getConfigData(' + myurl + ') success.');
            log.trace(data);
            var xml;
            if (typeof data == 'string' || typeof data == 'number') {
                if (!window.ActiveXObject) {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                }
                else {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            }
            else {
                xml = data;
            }
            if (typeof callback_func == 'function') {
                callback_func($(xml));
            }
            else {
                log.error('callback_func is undefined or not a function');
            }
        }
    });
}

/*************Get and save data (end)**************/
function _createFeatureNode(str) {
    if (typeof (str) == 'undefined' || str == null) {
        return null;
    }
	
    var isEmpt = $.trim(str);
    if(isEmpt == "")
    {
        return isEmpt;
    }
    if (isNaN(str)) {
        // not a number
            return str;
    }
    else {
        // is a number
		var value = parseInt(str, 10);
        return value;
    }
}

function _recursiveXml2Feature($xml) {
    if ($xml.children().size() > 0) {
        var _obj = {};
        $xml.children().each(function() {
            var _childObj = ($(this).children().size() > 0) ? _recursiveXml2Feature($(this)) : _createFeatureNode($(this).text());
            if ($(this).siblings().size() > 0 && $(this).siblings().get(0).tagName == this.tagName) {
                if (_obj[this.tagName] == null) {
                    _obj[this.tagName] = [];
                }
                _obj[this.tagName].push(_childObj);
            }
            else {
                _obj[this.tagName] = _childObj;
            }
        });
        return _obj;
    }
    else {
        return _createFeatureNode($xml.text());
    }
}

// convert XML string to an Object.
// $xml, which is an jQuery xml object.
function _xml2feature($xml) {
    var obj = null;
    if ($xml.find('config').size() > 0) {
        var _config = _recursiveXml2Feature($xml.find('config'));
        obj = _config;
    }
    return obj;
}

/*
 POST api/global/module-switch HTTP/1.1
 返回报文：
 <?xml version="1.0" encoding="UTF-8"?>
 <response>
 <ussd-enabled>0</ussd-enabled>
 <online-update-enabled>1</online-update-enabled>
 <sms-enabled>1</sms-enabled>
 <sdcard-enabled >0</sdcard-enabled>
 <wifi-enabled>1</wifi-enabled>
 </response>
 */
function getGlobalFeatures() {

    getConfigData('config/global/config.xml', function($xml) {
        g_feature = _xml2feature($xml);
        g_PageUrlTree = g_feature.menu;
        g_needToLogin = g_feature.login;
        g_needFooter = g_feature.footer;
    }, {
        sync: true
    });

    getAjaxData('api/global/module-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_moduleswitch = ret.response;
            g_module = {
                'ussd_enabled' : g_moduleswitch.ussd_enabled == '1' ? true : false,
                'sdcard_enabled' : g_moduleswitch.sdcard_enabled == '1' ? true : false,
                'online_update_enabled' : g_moduleswitch.bbou_enabled == '1' ? true : false,
                'wifi_enabled' : g_moduleswitch.wifi_enabled == '1' ? true : false,
                'sms_enabled' : g_moduleswitch.sms_enabled == '1' ? true : false,
                'pb_enabled' : g_moduleswitch.pb_enabled == '1' ? true : false,
                'autoapn_enabled' : g_feature.autoapn_enabled == '1' ? true : false,
                'statistic_enabled' : g_moduleswitch.statistic_enabled == '1' ? true : false,
                'checklogin_enabled' : g_feature.login == '1' ? true : false,
                'help_enabled' : g_moduleswitch.help_enabled == '1' ? true : false,
                'ap_station_enabled' : g_feature.ap_station_enabled == '1' ? true : false,
                'multi_ssid_enabled' : g_feature.multi_ssid_enabled == '1' ? true : false,
                'dlna_enabled' : g_moduleswitch.dlna_enabled == '1' ? true : false,
                'stk_enabled' : g_moduleswitch.stk_enabled == '1' ? true : false
            };

            g_needHelp = g_module.help_enabled;
        }
    }, {
        sync: true
    });
    
    getConfigData('config/ota/config.xml', function($xml) {
        g_otafeature = _xml2feature($xml);
    }, {
        sync: true
    });
    
    getConfigData('config/wifistation/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret)
        {
            g_wifioffload_enable = (config_ret.enable == '1' ? true : false);
        }
    }, {
        sync: true
    });

}

/********************Function formatFloat*********************/
function formatFloat(src, pos) {
    return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

/*************************Function for current connection time in connection
 * page******************************/
function getCurrentTime(time) {
    var final_time = '';
    var times = parseInt(time, 10);

    //format time like : 02:15:38

    var hours = parseInt((times / 3600), 10);
    if (hours > 9) {
        final_time += hours + common_colon;
    }
    else if (hours >= 0) {
        final_time += '0' + hours + common_colon;
    }

    times = times - hours * 3600;

    var minutes = parseInt(times / 60, 10);
    if (minutes > 9) {
        final_time += minutes + common_colon;
    }
    else if (minutes > 0) {
        final_time += '0' + minutes + common_colon;
    }
    else if (minutes == 0) {
        final_time += '00' + common_colon;
    }
    times = times - minutes * 60;

    //handle second display
    if (times > 9) {
        final_time += times;
    }
    else if (times > 0) {
        final_time += '0' + times;
    }
    else if (times == 0) {
        final_time += '00';
    }

    return final_time;
}

function getCurrentTimeArray(time) {
    var times_array = new Array();
    var times = parseInt(time, 10);
    var days = parseInt((times / 3600) / 24, 10);
    times_array.push(days);
    times = times - days * 3600 * 24;
    var hours = parseInt(times / 3600, 10);
    times_array.push(hours);
    times = times - hours * 3600;
    var minutes = parseInt(times / 60, 10);
    times_array.push(minutes);
    var secondes = times - minutes * 60;
    times_array.push(secondes);
    return times_array;
}

/****************************Function list (end)*******************/

function clickMenu(menu) {
    var getEls = $('.' + menu + ' li ');

    $.each(getEls, function(i) {
        $(this).click(function() {
            if ($(this).hasClass('sub') && $(this).hasClass('click')) {
                $(this).removeClass('click');
            }
            else if ($(this).hasClass('nosub')) {
                return true;
            }
            else {
                $(getEls).removeClass('click');
                $(this).addClass('click');
            }
        });
        if ("menu_pb" != menu)
        {
            $(this).mouseover(function() {
                $(this).addClass('menu_hover');
            });
            $(this).mouseout(function() {
                $(this).removeClass('menu_hover');
            });
        }
    });
}

//Judgement if the profile can be edit
function button_enable(button_id, enable) {
    var parent = $('#' + button_id);

    if (enable == '1') {
        parent.removeClass('disable_btn');

    }
    else if (enable == '0') {
        parent.addClass('disable_btn');

    }
}

// refresh current page
function refresh() {
    window.location.reload();
}

// goto page without history
function gotoPageWithoutHistory(url) {
    log.debug('MAIN : gotoPageWithoutHistory(' + url + ')');
    window.location.replace(url);
}

// goto page with history
function gotoPageWithHistory(url) {
    log.debug('MAIN : gotoPageWithHistory(' + url + ')');
    window.location.href = url;
}

function showErrorUnderTextbox(idOfTextbox, errormsg, label_id) {

    var errorLabel = '';
    if (label_id != null && label_id != '' && label_id != ' ') {
        errorLabel = "<div class='error_message'><label id='" + label_id + "'>" + errormsg + '</label><div>';
    }
    else {
        errorLabel = "<div class='error_message'><label>" + errormsg + '</label><div>';
    }
    $('#' + idOfTextbox).after(errorLabel);
}

function clearAllErrorLabel() {
    $('.error_message').remove();
}

function showWaitingDialog(tipTitle, tipContent, callback_func) {

    $('#div_wrapper').remove();
    var tab = "<table colspacing='0' cellspacing='0' id='wait_table' class='wait_table'>" + "<tr><td class='wait_table_top'></td></tr>" + "<tr><td class='wait_table_header'><label class='wait_title'>" + tipTitle + "</label><span class='wait_dialog_btn' id='wait_dialog_btn' ><img src='../res/dialog_close_btn.gif' alt='' /></span></td></tr>" + "<tr><td class='wait_table_content'><div class='wait_wrapper'><div class='wait_image'><img src='../res/waiting.gif' alt=''/></div><div class='wait_str'>" + tipContent + '</div></div></td></tr>' + "<tr><td class='wait_table_bottom'></td></tr>" + '</table>';
    var wait_div = "<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>" + tab;
    $('body').append(wait_div);
    reputPosition($('#wait_table'), $('#div_wrapper'));
    $('#wait_dialog_btn').bind('click', function() {
        closeWaitingDialog();
    });
    if (typeof (callback_func) == 'function') {
        callback_func();
    }
    disableTabKey();
}

//
function closeWaitingDialog(callback_func) {
    
	if ($('.info_dialog').size() == 0) {
        $('#div_wrapper').remove();
        }
    $('#wait_table').remove();
    enableTabKey();
    if (typeof (callback_func) == 'function') {
        callback_func();
    }
}

/*********************** header ************************/
function getDeviceStatus() {
    log.debug('MAIN : getDeviceStatus()');
    if (g_is_login_opened) {
        return;
    }
    getAjaxData('api/monitoring/status', function($xml) {
        log.debug('MAIN : getDeviceStatus() get monitoring success');
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_MonitoringStatus = ret;
            DATA_READY.statusReady = true;
            execEachFunList();
            getPlmn();
            
            getAjaxData('api/monitoring/check-notifications', function($xml) {
                G_NotificationsStatus = null;
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (g_module.online_update_enabled && ret.response.OnlineUpdateStatus == 30 && g_needToLogin == '0') {
                        if (window.location.href.toLowerCase().indexOf('update.html') < 0) {
                            window.location.href = 'update.html';
                        }
                    }
                    G_NotificationsStatus = ret.response;
                    showNotification();
                    DATA_READY.notificationsReady = true;
                    execEachFunList();
                }
            });
        }
    });
    if (g_wifioffload_enable) {
        getAjaxData('api/wlan/station-information', function($xml) {
            var ret = xml2object($xml);
            G_StationStatus = ret;
            DATA_READY.apStationReady = true;
            execEachFunList();
        });
    }

    function execEachFunList() {
        if ((g_wifioffload_enable && false == DATA_READY.apStationReady) || false == DATA_READY.statusReady || false == DATA_READY.notificationsReady) {
            return;
        }
        log.debug('MAIN : execFunList()');
        execFunList();
        DATA_READY.statusReady = false;
        DATA_READY.notificationsReady = false;
        DATA_READY.apStationReady = false;
    }

    function execFunList() {
        $.each(STATUS_LISTENER_FUN_LIST, function(n, value) {
            log.debug('MAIN : execFunList() execute ' + value);
            eval(value);
        });
    }

    setTimeout(getDeviceStatus, g_feature.update_interval);
}

function getPlmn() {
    g_plmn_rat = "";
    if (typeof(G_MonitoringStatus.response.CurrentNetworkTypeEx) != 'undefined' &&
    G_MonitoringStatus.response.CurrentNetworkTypeEx != '') 
    {
        switch(G_MonitoringStatus.response.CurrentNetworkTypeEx) {
            case MACRO_NET_WORK_TYPE_EX_GSM:     /*GSM模式*/
            case MACRO_NET_WORK_TYPE_EX_GPRS:    /*GPRS模式*/
            case MACRO_NET_WORK_TYPE_EX_EDGE:    /*EDGE模式*/
            case MACRO_NET_WORK_TYPE_EX_IS95A:
            case MACRO_NET_WORK_TYPE_EX_IS95B:
            case MACRO_NET_WORK_TYPE_EX_CDMA_1x:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_CDMA_1x:
                 g_plmn_rat =  MACRO_CURRENT_NETWOORK_2G;
                 break;
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EX_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EX_HYBRID_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_EX_WCDMA:
            case MACRO_NET_WORK_TYPE_EX_HSDPA:
            case MACRO_NET_WORK_TYPE_EX_HSUPA:
            case MACRO_NET_WORK_TYPE_EX_HSPA:
            case MACRO_NET_WORK_TYPE_EX_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_EX_DC_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_EX_TD_SCDMA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSDPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSUPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSPA:
            case MACRO_NET_WORK_TYPE_EX_TD_HSPA_PLUS:
                g_plmn_rat =  MACRO_CURRENT_NETWOORK_3G;
                break;
            case MACRO_NET_WORK_TYPE_EX_LTE:
                g_plmn_rat =  MACRO_CURRENT_NETWOORK_4G;
                break;
            default:
                break;
        }
    }
    else
    {
        switch(G_MonitoringStatus.response.CurrentNetworkType) {
            case MACRO_NET_WORK_TYPE_GSM: /*GSM模式*/
            case MACRO_NET_WORK_TYPE_GPRS: /*GPRS模式*/
            case MACRO_NET_WORK_TYPE_EDGE: /*EDGE模式*/
            case MACRO_NET_WORK_TYPE_1xRTT:
            case MACRO_NET_WORK_TYPE_1xEVDV:
                 g_plmn_rat =  MACRO_CURRENT_NETWOORK_2G;
                 break;
            case MACRO_NET_WORK_TYPE_WCDMA:
            case MACRO_NET_WORK_TYPE_TDSCDMA:
            case MACRO_NET_WORK_TYPE_EVDO_REV_0:
            case MACRO_NET_WORK_TYPE_EVDO_REV_A:
            case MACRO_NET_WORK_TYPE_EVDO_REV_B:
            case MACRO_NET_WORK_TYPE_HSDPA:
            case MACRO_NET_WORK_TYPE_HSUPA:
            case MACRO_NET_WORK_TYPE_HSPA:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_64QAM:
            case MACRO_NET_WORK_TYPE_HSPA_PLUS_MIMO:
                g_plmn_rat =  MACRO_CURRENT_NETWOORK_3G;
                break;
            case MACRO_NET_WORK_TYPE_LTE:
                g_plmn_rat =  MACRO_CURRENT_NETWOORK_4G;
                break;
            default:
                break;
        }
    }
    return g_plmn_rat;
}

function initialStatusIcon() {
	    var corner = '';
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il') {
    	    corner =  {
                    tooltip: 'topLeft',
                    target: 'bottomLeft'
            };
    } else{
    	corner = {
                    tooltip: 'topRight',
                    target: 'bottomLeft'
            };
    	
    }
    addStatusListener('getIconStatus()');
    if (g_module.sms_enabled) {
        $('#tooltip_sms').qtip({
            content: '<b>' + common_new_message + '</b>',
            position: {
                corner:corner
            },
            style: {
                name: 'sms'
            }
        });
    }
    if (g_module.online_update_enabled) {
        $('#tooltip_update').qtip({
            content: '<b>' + common_new_version + '</b>',
            position: {
                corner:corner
            },
            style: {
                name: 'upd'
            }
        });
    }

    $('#tooltip_sim').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'sim'
        }
    });

    $('#tooltip_plmn').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.plmn_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'signal'
        }
    });

    
    $('#tooltip_wan').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.wan_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wan'
        }
    });

    $('#tooltip_wifi').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.wifi_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'wifi'
        }
    });

    $('#tooltip_battery').qtip({
        content: '<b>' + STATUS_BAR_ICON_STATUS.battery_tooltip_state + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'battery'
        }
    });

    //tooltip_sms_full
    $('#tooltip_sms_full').qtip({
        content: '<b>' + sms_message_full + '</b>',
        position: {
            corner: corner
        },
        style: {
            name: 'sms_full'
        }
    });
    
    if (g_wifioffload_enable) {
        $('#tooltip_station').qtip({
            content: '<b>' + STATUS_BAR_ICON_STATUS.station_tooltip_state + '</b>',
            position: {
                corner:corner
            },
            style: {
                name: 'station'
            }
        });
    }

}

function getIconStatus() {
    var header_ret = G_MonitoringStatus;
    var station_ret = G_StationStatus;
    if (header_ret != null && header_ret.type == 'response') {
        header_icon_status.ConnectionStatus = header_ret.response.ConnectionStatus;
        /*if (header_ret.response.SignalStrength == 0) {
         header_icon_status.SignalStrength = 0;
         }
         else {
         var temp = parseInt(header_ret.response.SignalStrength, 10) / 20;
         header_icon_status.SignalStrength = (temp == 0) ? "1" : temp.toString();
         }*/

        if (typeof(header_ret.response.SignalIcon) != 'undefined' ||
        header_ret.response.SignalIcon != null) {
            header_icon_status.SignalStrength = header_ret.response.SignalIcon;
        }
        else {
            header_icon_status.SignalStrength = parseInt(header_ret.response.SignalStrength / 20, 10).toString();
        }

        header_icon_status.BatteryStatus = header_ret.response.BatteryStatus;
        header_icon_status.BatteryLevel = header_ret.response.BatteryLevel;
        header_icon_status.SimStatus = header_ret.response.SimStatus;
        header_icon_status.WifiStatus = header_ret.response.WifiStatus;

        if (typeof(header_ret.response.CurrentNetworkTypeEx) != 'undefined' &&
        header_ret.response.CurrentNetworkTypeEx != '') {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkTypeEx;
        }
        else {
            header_icon_status.CurrentNetworkType = header_ret.response.CurrentNetworkType;
        }
        //Battery Status
        switch (header_icon_status.BatteryStatus) {
            case MACRO_BATTERY_STATUS_NORMAL:
                getBatteryLevel(header_icon_status.BatteryLevel);
                break;
            case MACRO_BATTERY_STATUS_LOW:
                $('#battery_gif').css({
                    background: 'url(../res/battery_low.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.battery_tooltip_state = battery_prower_low;
                break;

            case MACRO_BATTERY_STATUS_ELECT:

                if (null != g_lastBatteryStatus && MACRO_BATTERY_STATUS_ELECT == g_lastBatteryStatus) {
                    break;
                }
                $('#battery_gif').css({
                    background: 'url(../res/battery_elect.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.battery_tooltip_state = battery_recharging;
                break;
            default:

                $('#battery_gif').css({
                    background: 'url(../res/battery_level_' + header_icon_status.BatteryLevel + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.battery_tooltip_state = common_battery;
                break;
        }
        g_lastBatteryStatus = header_icon_status.BatteryStatus;

        //WiFi Status
        switch (header_icon_status.WifiStatus) {
            case MACRO_WIFI_OFF:
                $('#wifi_gif').css({
                    background: 'url(../res/wifi_' + MACRO_WIFI_OFF + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_off;
                break;
            case MACRO_WIFI_ON:
                $('#wifi_gif').css({
                    background: 'url(../res/wifi_' + MACRO_WIFI_ON + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_on;
                break;
            default:
                $('#wifi_gif').css({
                    background: 'url(../res/wifi_' + MACRO_WIFI_OFF + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wifi_tooltip_state = wlan_label_wlan_off;
                break;
        }

        //wan Status
        switch (header_icon_status.ConnectionStatus) {
            case MACRO_CONNECTION_CONNECTED:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_CONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                break;
            case MACRO_CONNECTION_DISCONNECTED:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_DISCONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_disconnect;
                break;
            default:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_DISCONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_disconnect;
                break;
        }

        //sim card or signal Status
        if (MACRO_PIN_REQUIRED == g_main_convergedStatus.SimState)
        {
            $('#sim_signal_gif').css({background: 'url(../res/sim_disable.gif) 0 0 no-repeat'});
            STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_pin_code_required;
        }
        else if (MACRO_PUK_REQUIRED == g_main_convergedStatus.SimState)
        {
            if (PUK_TIMES_ZERO == g_pin_status_SimPukTimes)
            {
                $('#sim_signal_gif').css({background: 'url(../res/sim_disable.gif) 0 0 no-repeat'});
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_help_puk_locked;
            }
            else
            {
                $('#sim_signal_gif').css({background: 'url(../res/sim_disable.gif) 0 0 no-repeat'});
                STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_puk_code_required;
            }
        }
        else if ((MACRO_SIM_STATUS_USIM_N == header_icon_status.SimStatus) || (MACRO_SIM_STATUS_USIM_NE == header_icon_status.SimStatus)) {
            $('#sim_signal_gif').css({
                background: 'url(../res/sim_disable.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
        }
        else if ('undefined' == header_icon_status.SimStatus) {
            $('#sim_signal_gif').css({
                background: 'url(../res/sim_disable.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
        }
        else if (header_icon_status.SimlockStatus) {
            $('#sim_signal_gif').css({
                background: 'url(../res/sim_disable.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = dialup_label_sim_invalid;
        }
        else {
            switch (header_icon_status.SignalStrength) {
                case MACRO_EVDO_LEVEL_ONE:
                case MACRO_EVDO_LEVEL_TWO:
                case MACRO_EVDO_LEVEL_THREE:
                    $('#sim_signal_gif').css({
                        background: 'url(../res/signal_' + header_icon_status.SignalStrength + '.gif) 0 0 no-repeat'
                    });
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = common_signal_weak;
                    break;

                case MACRO_EVDO_LEVEL_FOUR:
                case MACRO_EVDO_LEVEL_FIVE:
                    $('#sim_signal_gif').css({
                        background: 'url(../res/signal_' + header_icon_status.SignalStrength + '.gif) 0 0 no-repeat'
                    });
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = common_signal_strong;
                    break;
                default:
                    $('#sim_signal_gif').css({
                        background: 'url(../res/signal_' + MACRO_EVDO_LEVEL_ZERO + '.gif) 0 0 no-repeat'
                    });
                    STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state = common_sig_off;
                    break;
            }
        }

    }

    //update Status
    if (g_module.online_update_enabled) {
        if (G_NotificationsStatus.OnlineUpdateStatus == '12' || G_NotificationsStatus.OnlineUpdateStatus == '50') {
            $('#update_gif').css({
                'display' : 'block'
            });
            $('#tooltip_update').html("<img src = '../res/update_enable.gif'>");
        }
        else {
            $('#update_gif').css({
                'display' : 'none'
            });
            $('#tooltip_update').html("<img src = '../res/update_disable.gif'>");
        }
    }

    //plmn Status
    switch (g_plmn_rat) {
        case MACRO_CURRENT_NETWOORK_2G:
            rat = '2';
            $('#plmn_gif').css({
                'display' : 'block'
            });

            $('#plmn_gif').css({
                background: 'url(../res/plmn_' + rat + '.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.CurrentNetworkType = plmn_label_2g;
            break;
        case MACRO_CURRENT_NETWOORK_3G:
            rat = '3';
            $('#plmn_gif').css({
                'display' : 'block'
            });

            $('#plmn_gif').css({
                background: 'url(../res/plmn_' + rat + '.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.CurrentNetworkType = plmn_label_3g;
            break;
        case MACRO_CURRENT_NETWOORK_H:
             rat = "h";
             $("#plmn_gif").css({
             "display" : "block"
             });
    
             $("#plmn_gif").css({
             background : "url(../res/plmn_" + rat + ".gif) 0 0 no-repeat"
             });
             STATUS_BAR_ICON_STATUS.CurrentNetworkType = plmn_label_h;
         break;
         case MACRO_CURRENT_NETWOORK_4G:
             rat = "4";
             $("#plmn_gif").css({
             "display" : "block"
             });
    
             $("#plmn_gif").css({
             background : "url(../res/plmn_" + rat + ".gif) 0 0 no-repeat"
             });
             STATUS_BAR_ICON_STATUS.CurrentNetworkType = plmn_label_4g;
         break;
        default:
            $('#plmn_gif').css({
                'display' : 'none'
            });
            $('#plmn_gif').html('');
            break;
    }

    function ap_station_disabled(){
        //$("#station_gif").hide();
        switch (header_icon_status.ConnectionStatus)
        {
             case MACRO_CONNECTION_CONNECTED:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_CONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
                break;
            case MACRO_CONNECTION_DISCONNECTED:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_DISCONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_disconnect;
                break;
            default:
                $('#wan_gif').css({
                    background: 'url(../res/wan_' + MACRO_CONNECTION_DISCONNECTED + '.gif) 0 0 no-repeat'
                });
                STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_disconnect;
                break;    
        }
        
        
    }
    
    //station
    if (WIFI_CONNECTED == G_MonitoringStatus.response.WifiConnectionStatus && g_wifioffload_enable)
    {         
        if(station_ret != null 
            && station_ret.type == "response" )
        {
            //$("#wan_gif").children().html("<img src='../res/wan_" + MACRO_CONNECTION_CONNECT + ".gif'>");
            $("#wan_gif").css({background:"url(../res/wan_" + MACRO_CONNECTION_CONNECTED + ".gif) 0 0 no-repeat"});
            STATUS_BAR_ICON_STATUS.wan_tooltip_state = dialup_label_wan_connect;
            var apSignal = setWifiSignal(station_ret.response.SignalStrength);
            $("#station_gif").css({background:"url(../res/station_" + wifiSignal + ".gif) 0 0 no-repeat"});
            $("#station_gif").show();
            
        }
        else
        {
            /*$("#station_gif").css({background:"url(../res/station_0.gif) 0 0 no-repeat"});
            STATUS_BAR_ICON_STATUS.station_tooltip_state = common_sig_off;
            ap_station_disabled();*/
            $("#station_gif").hide();
            ap_station_disabled();
        }
    }
    else
    {
        $("#station_gif").hide();
        ap_station_disabled();
    }
        
    changeTooltipContent();
}

function getBatteryLevel(str) {
    switch (str) {
        case MACRO_BATTERY_LEVEL_ZERO:
        case MACRO_BATTERY_LEVEL_ONE:
        case MACRO_BATTERY_LEVEL_TWO:
        case MACRO_BATTERY_LEVEL_THREE:
        case MACRO_BATTERY_LEVEL_FOUR:

            $('#battery_gif').css({
                background: 'url(../res/battery_level_' + str + '.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.battery_tooltip_state = common_battery;
            break;
        default:

            $('#battery_gif').css({
                background: 'url(../res/battery_level_' + str + '.gif) 0 0 no-repeat'
            });
            STATUS_BAR_ICON_STATUS.battery_tooltip_state = common_battery;
            break;
    }
}

function changeTooltipContent() {
    $('.qtip-signal').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.CurrentNetworkType + '</b>');
    $('.qtip-sim').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.sim_signal_tooltip_state + '</b>');
    if (g_wifioffload_enable) {
        $('.qtip-station').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.station_tooltip_state + '</b>');
    }
    $('.qtip-wan').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.wan_tooltip_state + '</b>');
    $('.qtip-wifi').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.wifi_tooltip_state + '</b>');
    $('.qtip-battery').find('.qtip-content').html('<b>' + STATUS_BAR_ICON_STATUS.battery_tooltip_state + '</b>');
}

/******************************************************************************************************/
function addStatusListener(funName) {
    STATUS_LISTENER_FUN_LIST.push(funName);
    log.debug('MAIN : addStatusListener(' + funName + '), currently ' + STATUS_LISTENER_FUN_LIST.length + ' listener.');
    if (DATA_READY.statusReady && DATA_READY.notificationsReady) {
        log.debug('MAIN : DATA is Ready, execute in addStatusListener');
        eval(funName);
    }
}

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += g_base64EncodeChars.charAt(c1 >> 2);
            out += g_base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += '==';
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += g_base64EncodeChars.charAt(c1 >> 2);
            out += g_base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += g_base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += '=';
            break;
        }
        c3 = str.charCodeAt(i++);
        out += g_base64EncodeChars.charAt(c1 >> 2);
        out += g_base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += g_base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += g_base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function validateInput(username, password) {
    clearAllErrorLabel();
    var validate = true;
    if (username == '') {
        showErrorUnderTextbox('username', common_message_name_empty);
        $("#username").focus();
        return false;
    }
      if (!checkInputChar(username)) {
      showErrorUnderTextbox("username", settings_hint_user_name_not_exist);
      $("#username").val("");
      $("#username").focus();
      $("#password").val("");
       return false;	
     } 
    if (password == '' && username != '') {
        showErrorUnderTextbox('password', dialup_hint_password_empty);
        $('#password').focus();
		return false;
    }
    return validate;
}

//
function login(destnation) {
    var name = $.trim($('#username').val());
    var psd = base64encode($('#password').val());
    var request = {
        Username: name,
        Password: psd
    };
    var valid = validateInput(request.Username, request.Password);
    if (valid) {
        var xmlstr = object2xml('request', request);
        log.debug('xmlstr = ' + xmlstr);
        saveAjaxData('api/user/login', xmlstr, function($xml) {
            log.debug('api/user/login successed!');
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                /*
                 * show username when login successfully
                 */
                $('#username_span').text(name);
                $('#username_span').show();
                $('#logout_span').text(common_logout);

                clearDialog();

                if (typeof(destnation) != 'undefined' &&
                destnation != null) {
                    window.location.href = destnation;
                }
                else
                {
                     startLogoutTimer();
                }
                if (g_is_disconnect_clicked) {
                    index_clickDisconnectBtn();
                }
                else if (g_is_connect_clicked) {
                    index_clickConnectBtn();
                }
                if(g_isTrunOffWlanChecked) {
                    if($('.trun_on_off_waln :checked').size() > 0) {
                        g_handover_setting.Handover = '2';
                    }
                    else {
                        g_handover_setting.Handover = '0';
                    }
                    g_isTrunOffWlanChecked = false;
                    setHandoverSetting();
                }
            }
            else {
                if (ret.type == 'error') {
                    clearAllErrorLabel();
                    if (ret.error.code == ERROR_LOGIN_PASSWORD_WRONG) {
                        showErrorUnderTextbox('password', system_hint_wrong_password);
                        $('#password').val('');
                        $('#password').focus();
                    }
                    else if (ret.error.code == ERROR_LOGIN_ALREADY_LOGIN) {
                        showErrorUnderTextbox('password', common_user_login_repeat);
                        $('#username').focus();
                    }
                    else if (ret.error.code == ERROR_LOGIN_USERNAME_WRONG) {
                        showErrorUnderTextbox('username', settings_hint_user_name_not_exist);
                        $('#username').focus();
                        $('#username').val('');
                        $('#password').val('');
                    }
                }
            }
        });
    }
}

function userOut() {
        var logOut = {
            Logout: 1
        };

        var submitData = object2xml('request', logOut);
        saveAjaxData('api/user/logout', submitData, function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (isAjaxReturnOK(ret)) {
                $("#username_span").hide();
                $("#logout_span").text(common_login);
                gotoPageWithoutHistory(HOME_PAGE_URL);
                }
            }
        });
}

function loginout() {
    getAjaxData('api/user/state-login', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            if (ret.response.State != 0) { //logout
                showloginDialog();
            }
            else //login
            {
                showConfirmDialog(common_warning_logout, function() {
                userOut();
                cancelLogoutTimer();
                return false;
                });
            }
        }
    }, {
        sync: true
    });
}

function showNotification() {
    if (G_NotificationsStatus != null) {
        var unreadSmsSize = G_NotificationsStatus.UnreadMessage;
        var smsStorageFull = G_NotificationsStatus.SmsStorageFull;
        var onlineUpdateStatus = G_NotificationsStatus.OnlineUpdateStatus;
        if (g_module.sms_enabled) {

            if (smsStorageFull == '1') {//sms full
                $('#sms_full').css({
                    'display' : 'block'
                });
                $('#tooltip_sms_full').html("<img src = '../res/message.gif' alt='' />");

                $('#sms_gif').css({
                    'display' : 'none'
                });
                $('#tooltip_sms').html('');
            }
            else {
                $('#sms_full').css({
                    'display' : 'none'
                });
                $('#tooltip_sms_full').html('');
                if (unreadSmsSize > 0) { //unread message
                    $('#sms_gif').css({
                        'display': 'block'
                    });
                    $('#tooltip_sms').html("<img src = '../res/unread_message.gif' alt='' />");
                }
                else {
                    $('#sms_gif').css({
                        'display': 'none'
                    });
                    $('#tooltip_sms').html('');
                }
            }
        }
        if (g_module.online_update_enabled) {
            if (onlineUpdateStatus == MACRO_NEWVERSIONFOUND || onlineUpdateStatus == MACRO_READYTOUPDATE) {
                $('#update_gif').css({
                    'display' : 'block'
                });
                $('#tooltip_update').html("<img src = '../res/update_enable.gif'>");
            }
            else {
                $('#update_gif').css({
                    'display' : 'none'
                });
                $('#tooltip_update').html("<img src = '../res/update_disable.gif'>");
            }
        }
    }
}

function getUserManualUrl() {
	if (g_needHelp) {
             var helpUrl = document.getElementById("help_url");
	     var current_language = LANGUAGE_DATA.current_language;
	     current_language = current_language.replace('_', '-');
	     g_user_manual_url = "../" + USER_MANUAL_PATH + "/" + current_language + "/"
	     					+ USER_MANUAL_PATH + "/" + USER_MANUAL_FILE_NAME;
	       	       
	       if( typeof helpUrl != "undefined" && typeof helpUrl != null) {
	           checkUrlValidity(g_user_manual_url, function(isValidity) {
	               if(isValidity) {
                        helpUrl.href = g_user_manual_url;
                   } else {
                        g_user_manual_url = "../" + USER_MANUAL_PATH + "/" + 'en-us' + "/"
                                        + USER_MANUAL_PATH + "/" + USER_MANUAL_FILE_NAME;                  
                        helpUrl.href = g_user_manual_url;
                    }
	           });
           }
           
           
	     
	}
}


function checkUrlValidity(url, callback_func)
{ 
    $.ajax({
      async: true,
      url: url,
      type: 'GET',
      complete: function(response) {
          if (typeof callback_func == 'function') {
              var isValidity = false;
                if(response.status == 200) {
                     log.debug(url + "is validity.");
                     isValidity = true;
                } else {
                 log.debug(url + "is not validity, use en_us manual.");
                     isValidity = false;
                 }
                callback_func(isValidity);
            }
            else {
                log.error('callback_func is undefined or not a function');
            }
        }
 });
}

//for dialog
function reputPosition($dialogElement, $dialogDiv) {
    var newTop = 0, newLeft = 0, scTop = 0, scLeft = 0;
    if ($dialogElement) {
        newTop = (getWindowHeight() - $dialogElement.height()) / 2;
        newLeft = (getWindowWidth() - $dialogElement.width()) / 2;
        scTop = $(document).scrollTop();
        scLeft = $(document).scrollLeft();
        newTop = scTop + newTop > 0 ? scTop + newTop : 0;
        newLeft = scLeft + newLeft;
        $dialogElement.css({
            left: newLeft,
            top: newTop
        }).show();
    }
    window.onscroll = function() {
        scTop = $(document).scrollTop();
        scLeft = $(document).scrollLeft();
    };
    window.onresize = function() {
        if (!$dialogElement.is(':visible')) {
            return;
        }
        else {
            $dialogElement.css({
                left: 0,
                top: 0
            });
            if ($dialogDiv) {
                $dialogDiv.css({
                    'width' : 0,
                    'height' : 0
                });
            }
            $(document).scrollTop(scTop);
            $(document).scrollLeft(scLeft);
            reputPosition($dialogElement.last(), $dialogDiv);
        }
    };
    if ($dialogDiv) {
        var div_width = Math.max(getWindowWidth(), getDocumentWidth());
        var div_height = Math.max(getWindowHeight(), getDocumentHeight());
        $dialogDiv.css({
            'width' : div_width,
            'height' : div_height
        });
        $dialogDiv.show();
    }
    //
    function getWindowHeight() {
        return document.documentElement.clientHeight;
    }

    function getWindowWidth() {
        return document.documentElement.clientWidth;
    }

    //
    function getDocumentHeight() {
        if (!$dialogElement) {
            return document.body.scrollHeight;
        }
        else {
            return Math.max($dialogElement.position().top + $dialogElement.height(), document.documentElement.scrollHeight);
        }
    }

    function getDocumentWidth() {
        if (!$dialogElement) {
            return document.documentElement.scrollWidth;
        }
        else {
            return Math.max($dialogElement.position().left + $dialogElement.width(), document.documentElement.scrollWidth);
        }
    }

}

function onKeyup(evt) {
    if (evt.ctrlKey || evt.altKey)// Exclude key press "CRTL+key" & "ALT+key"
    {
        return;
    }

    if (13 == evt.keyCode)// Enter key
    {
        var targetID = '';
        var stackLen = g_main_displayingPromptStack.length;

        if (stackLen > 0) {
            targetID = g_main_displayingPromptStack[stackLen - 1];
        }
        else {
            if ('autoconnection' == current_href) {
                targetID = 'autocennect_apply';
            }

            if ('mobilenetworksettings' == current_href) {
                targetID = 'mobilensetting_apply';
            }

            if ('pincodemanagement' == current_href) {
                targetID = $('.button_wrapper').attr('id');
            }

            if ('pincoderequired' == current_href) {
                targetID = 'pinrequired_button_apply';
            }

            if ('pukrequired' == current_href) {
                targetID = 'pukrequired_apply';
            }

            if ('simlockrequired' == current_href) {
                targetID = 'simlock_button_apply';
            }

            if ('mobileconnection' == current_href) {
                targetID = 'apply';
            }

            if ('pincodeautovalidate' == current_href) {
                targetID = 'validate_apply';
            }

            if ('modifypassword' == current_href) {
                targetID = 'apply_button';
            }

            if ('wps' == current_href) {
                targetID = 'apply_button';
            }

            if ('dhcp' == current_href) {
                targetID = 'apply';
            }

            if ('sipalgsettings' == current_href) {
                targetID = 'apply_button';
            }

            if ('mobilenetworksettings' == current_href) {
                targetID = 'mobilensetting_apply';
            }

            if ('wlanbasicsettings' == current_href) {
                targetID = 'apply_button';
            }

            if ('wlanadvanced' == current_href) {
                targetID = 'apply_button';
            }

            if ('wlanmacfilter' == current_href) {
                targetID = 'apply';
            }

            if ('firewallswitch' == current_href) {
                targetID = 'apply_button';
            }

            if ('dmzsettings' == current_href) {
                targetID = 'apply_button';
            }

            if ('upnp' == current_href) {
                targetID = 'apply';
            }

            if ('smsinbox' == current_href
                || 'smssent' == current_href
                || 'smsdrafts' == current_href
                ||'phonebook' == current_href) {
                if (!$('#jump_page').is(':hidden')) {
                    if ('' != $('#jump_page').val()) {
                        targetID = 'jump_page';
                    }
                    else if ('jump_page_index' == document.activeElement.id) {
                        targetID = 'jump_page';
                    }
                    else {
                        log.error('targetID error');
                    }
                }
            }

            if ('update' == current_href) {
                if (!$('#success_ok').is(':hidden')) {
                    targetID = 'success_ok';
                }

                if (!$('#pop_Cancel').is(':hidden')) {
                    targetID = 'pop_Cancel';
                }
            }
            
             if ('ota' == current_href) {
                if (!$('#auto_apply').is(':hidden')) {
                    targetID = 'auto_apply';
                }
                if (!$('#ota_manual_otksl').is(':hidden')) {
                    targetID = 'ota_manual_otksl';
                }
                if (!$('#ota_manual_activate').is(':hidden')) {
                    targetID = 'ota_manual_activate';
                }
             }
            
            if ('sdcardsharing' == current_href) {
                targetID = g_sd_mode_id;
            }

        }

        if ('' != targetID) {
            $('#' + targetID).trigger('click');
        }
    }
}

function enableTabKey() {
    $('a').attr('tabindex', '');
    $('input').attr('tabindex', '');
    $('select').attr('tabindex', '');
}

function disableTabKey() {
    $('a').attr('tabindex', '-1');
    $('input').attr('tabindex', '-1');
    $('select').attr('tabindex', '-1');
}

function startLogoutTimer()
{
    if (g_needToLogin)
    {
        clearTimeout(g_logoutTimer);
        g_logoutTimer = setTimeout(userOut, LOGOUT_TIMEOUT_MAIN);
    }
}

function cancelLogoutTimer()
{
    if (g_needToLogin)
    {
        clearTimeout(g_logoutTimer);
    }
}


function regURL ( str )
{
	var reg = "(((https|http|ftp|rtsp|mms):\/\/)|(www\\.)){1}[\41-\176]*";
    var matchURL=new RegExp(reg,"ig");
	while (str.indexOf('<') >= 0) {
                        str = str.replace('<', '&lt;');
                    }
    	while (str.indexOf('>') >= 0) {
                        str = str.replace('>', '&gt;');
                    }
    return str.replace(matchURL,function($1)
    {
        $1_href = $1.indexOf(("//").toLowerCase())==-1?"http://"+$1:$1;
		if($1_href.charAt($1_href.length-1)=="="&&$1_href.charAt($1_href.length-2)!="=")
		{
		$1_href=$1_href.substring(0,$1_href.length-1);
		}
        return "<a href='"+$1_href+"' style='color:blue;text-decoration:underline;' target='_blank' onclick='javascript:stopBubble(event)'>"+$1+"</a>";
    });
}

function stopBubble( e )
{
    if ( e && e.stopPropagation )
    {
        e.stopPropagation();
    }
    else
    {
        window.event.cancelBubble=true;
    }
}


function setWifiSignal(WifiSignal) {
     switch (WifiSignal)
    {
        case MACRO_EVDO_LEVEL_ONE:
            wifiSignal = MACRO_EVDO_LEVEL_ONE;
            STATUS_BAR_ICON_STATUS.station_tooltip_state = common_signal_weak;
            break;
        case MACRO_EVDO_LEVEL_TWO:
        case MACRO_EVDO_LEVEL_THREE:
            wifiSignal = MACRO_EVDO_LEVEL_TWO;
            STATUS_BAR_ICON_STATUS.station_tooltip_state = common_signal_weak;
            break;
        case MACRO_EVDO_LEVEL_FOUR:
            wifiSignal = MACRO_EVDO_LEVEL_THREE;
            STATUS_BAR_ICON_STATUS.station_tooltip_state = common_signal_strong;
            break;
        case MACRO_EVDO_LEVEL_FIVE:
            wifiSignal = MACRO_EVDO_LEVEL_FOUR;
            STATUS_BAR_ICON_STATUS.station_tooltip_state = common_signal_strong;
            break;
        default:
           wifiSignal = MACRO_EVDO_LEVEL_ZERO;
           STATUS_BAR_ICON_STATUS.station_tooltip_state = common_sig_off;
           break;
    }
    
    return wifiSignal;
}

function replaceSpace(str)
{
    var ss="";
    for (var i=0; i < str.length; i++) {
       if(' '==str.charAt(i)){
            str = str.replace(' ','&nbsp;');
       }
    }
    return str;
}

function getSimPukTimes() {
    getAjaxData('api/pin/status', function($xml) {
        var pinstatus_ret = xml2object($xml);
        if (pinstatus_ret.type == 'response')
        {
            g_pin_status_SimPukTimes = pinstatus_ret.response.SimPukTimes;
        }
    });
}
