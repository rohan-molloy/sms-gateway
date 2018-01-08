/*
Index page for hilink
Author cxcai
Initialization connection status.
Jugdment which page will be redirected follow pin, sim and connection status.
Load main menu
*/
// JavaScript Document

//
var CURRENT_NETWORK_NO_SERVICE = 0;
var SERVICE_DOMAIN_NO_SERVICE = 0;
var SERVICE_STATUS_AVAIABLE = 2;
//Signal status
var MACRO_EVDO_LEVEL_ZERO = "0";
var MACRO_EVDO_LEVEL_ONE = "1";
var MACRO_EVDO_LEVEL_TWO = "2";
var MACRO_EVDO_LEVEL_THREE = "3";
var MACRO_EVDO_LEVEL_FOUR = "4";
var MACRO_EVDO_LEVEL_FIVE = "5";

var g_index_wlan_basic_settings = null;
var g_wlan_security_settings = null;
var g_connection_status = null;
var g_isAutoConnect = false;
var g_dialup_action = {
    Action: '1'
};

var g_current_roamingStatus = '';
var g_handover_setting = {
    Handover: '1'
};


var WIFI_PREFER = 2;
var g_stationInformation = null;
var g_mouse_on_out_event = 0;
var g_msisdn = '';
/*
 g_connectionStatus_S1: previous connection status.
 g_connectionStatus_S2: present connection status.
 */
var g_connectionStatus_S1 = null;
var g_connectionStatus_S2 = null;

/*
 when the user clicks connect/disconnect button, UI should stop updating
 connection
 status for just one cycle interval(default 3s).
 */
var g_freezeConnectionUpdate = false;

//Button connection or disconnection click effect
function index_clickDisconnectBtn() {
    g_is_connect_clicked = false;
    $('#disconnect_btn').removeClass('mouse_on');
    button_enable('disconnect_btn', '0');
    setConnectionLink(dialup_label_disconnecting);
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function index_clickConnectBtn() {
    g_is_disconnect_clicked = false;
    setConnectionLink(dialup_label_connecting);
    $('#connect_btn').removeClass('mouse_on');
    button_enable('connect_btn', '0');
    g_dialup_action.Action = '1';
    index_sendConnectionAction();
}

function index_clickCancelBtn() {
    g_dialup_action.Action = '0';
    index_sendConnectionAction();
}

function index_sendConnectionAction() {

    var dialup_xml = object2xml('request', g_dialup_action);
    g_freezeConnectionUpdate = true;
    saveAjaxData('api/dialup/dial', dialup_xml, function($xml) {
        var dialup_ret = xml2object($xml);
        if (isAjaxReturnOK(dialup_ret)) {
            log.debug('api/dialup/dial ok');
        }
        else {
            log.debug('api/dialup/dial error');
        }
    });
}

function SetHotlinks() {
    var hotlinksHtml = '';
    var hasItem = false;

    var hotlinksurl = [];
    hotlinksurl = g_feature.hotlinks.items.item;

    if (typeof(hotlinksurl) == 'undefined') {
        return;
    }

    hotlinksHtml = '<table>';
    hotlinksHtml += " <tr  id = 'hotlink_hide'>";

    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            if (hotlinksurl[n] != "") {
                hotlinksHtml += '<td>';
                hotlinksHtml += '<span>';
                hotlinksHtml += "   <a id='hotlinks_" + n + "' href='" + value + "'>";
                hotlinksHtml += '   </a>';
                hotlinksHtml += '</span>';
                hotlinksHtml += '</td>';
                hasItem = true;
            }
        });
    }
    else {
        hotlinksHtml += '<td>';
        hotlinksHtml += '<span>';
        hotlinksHtml += "   <a id='hotlinks_0' href='" + hotlinksurl + "'></a>";
        hotlinksHtml += '</span>';
        hotlinksHtml += '</td>';
    }

    if(!hasItem)
    {
        $('.hot_links').attr('style', 'border-top:0px;');
    }
    
    hotlinksHtml += '  </tr>';
    hotlinksHtml += '</table>';

    $('.hotlinks').html(hotlinksHtml);

    /*
     * show hotlinks icon
     */
    if (jQuery.isArray(hotlinksurl)) {
        $.each(hotlinksurl, function(n, value) {
            var temp = '#hotlinks_' + n;
            $(temp).css({
                background: 'url(../res/hotlinks_' + n + '.gif) center 0 no-repeat'
            });
        });
    }
    else {
        $('#hotlinks_0').css({
            background: 'url(../res/hotlinks_0.gif) center 0 no-repeat'
        });
    }

}

/*function enable_connection_button(button_id, enable_status)
 {
 var parent = $("#" + button_id);
 if (enable_status == "1")
 {
 parent.removeClass("button_connecting");
 }
 else if(enable_status == "0")
 {
 parent.addClass("button_connecting");
 }
 }*/


/*
 update connection status, signal strength, connect button text ,etc
 */
function index_updateConnectionStatus() {
    /*
     when the user clicks connect/disconnect button, UI should stop updating
     connection
     status for just one cycle interval(default 3s).
     */
    if (g_freezeConnectionUpdate) {
        g_freezeConnectionUpdate = false;
        return;
    }
    var currentStatus = G_MonitoringStatus.response;
    var signal_strength = '';
    if (typeof(currentStatus.SignalIcon) != 'undefined' ||
    currentStatus.SignalIcon != null) {
        signal_strength = '0' + currentStatus.SignalIcon;
    }
    else {
        signal_strength = '0' + parseInt(currentStatus.SignalStrength / 20, 10).toString();
    }
    if(currentStatus.WifiConnectionStatus != WIFI_CONNECTED) {
        /*
         * singal strength
         */
        $('#status_img').css({
            background: 'url(../res/icon_signal_' + signal_strength + '.gif) 0 0 no-repeat'
        });
        log.debug('INDEX : index_updateConnectionStatus(' + currentStatus.ConnectionStatus + ')');
        switch (currentStatus.ConnectionStatus) {
        case '2':
        case '3':
        case '5':
        case '8':
        case '20':
        case '21':
        case '23':
        case '27':
        case '28':
        case '29':
        case '30':
        case '31':
        case '32':
        case '33':
            // Connection failed. The profile is invalid, please contact your
            // Service Provider.
            $('#index_connection_status').html(dialup_label_connection_fail_wrong_param + ' ' + "<div id='profile_settings'><a href='profilesmgr.html'>" + dialup_label_profile_management + '</a></div>');
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '7':
        case '11':
        case '14':
        case '37':
            // Connection failed. Network access not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_network_unvisitable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '12':
        case '13':
            // Connection failed. Roaming not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_roaming_unallowable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case MACRO_CONNECTION_CONNECTING:
            // connecting
            if ($('#connect_btn').size() == 0) {
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                
            }
            setConnectionLink(dialup_label_connecting);
            button_enable('connect_btn', '0');
            $('#connect_btn').removeClass('mouse_on');
           
            break;
        case MACRO_CONNECTION_DISCONNECTING:
            // disconnecting
            setConnectionLink(dialup_label_disconnecting);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            button_enable('disconnect_btn', '0');
            break;
        case MACRO_CONNECTION_CONNECTED:
            // connected
            setConnectionLink(dialup_label_connected);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            break;
        case MACRO_CONNECTION_DISCONNECTED:
            var connect_type = '';
            if (typeof(currentStatus.CurrentNetworkTypeEx) != 'undefined' &&
            currentStatus.CurrentNetworkTypeEx != '') 
            {
                connect_type = currentStatus.CurrentNetworkTypeEx;
            }
            else
            {
                connect_type = currentStatus.CurrentNetworkType;
            }
            if (connect_type == CURRENT_NETWORK_NO_SERVICE ||
            currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
            currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE
            ) {
                // no coverage
                $('#index_plmn_name').html(dialup_hint_no_network);
                setConnectionLink(hilink_label_connect_failed);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                // disconnected
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE:
        case FORBID_RE_CONNECT_DROPLINE:
            // disconnected
            setConnectionLink(dialup_label_disconnected);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING:
        case FORBID_RE_CONNECT_DROPLINE_ROAMING:
            // Automation connect is disabled for roaming network.
            // You will have to manually connect the network.
            if (parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1) {
                setConnectionLink(hilink_label_roaming_auto_connection_forbid);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                //roaming status is 0
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            setConnectionLink(hilink_label_connect_failed_common_tip);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
    }
        
    }
    else {       
        getAjaxData("api/wlan/station-information", function($xml) {
                var ret = xml2object($xml);
                 if (ret.type == "response") {
                     g_stationInformation = ret.response;
                     var wifi_Signal = setWifiSignal(g_stationInformation.SignalStrength);
                     $('#status_img').css({
                         background: 'url(../res/wifi_station_' + wifi_Signal + '.gif) 0 0 no-repeat'
                    });
                 }
            }, 
            {
                sync: true
            }
         );
         
         setConnectionLink(dialup_label_connected);
                          
    }
    
    /*log.debug('INDEX : index_updateConnectionStatus(' + currentStatus.ConnectionStatus + ')');
    switch (currentStatus.ConnectionStatus) {
        case '2':
        case '3':
        case '5':
        case '8':
        case '20':
        case '21':
        case '23':
        case '27':
        case '28':
        case '29':
        case '30':
        case '31':
        case '32':
        case '33':
            // Connection failed. The profile is invalid, please contact your
            // Service Provider.
            $('#index_connection_status').html(dialup_label_connection_fail_wrong_param + ' ' + "<div id='profile_settings'><a href='profilesmgr.html'>" + dialup_label_profile_management + '</a></div>');
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '7':
        case '11':
        case '14':
        case '37':
            // Connection failed. Network access not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_network_unvisitable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case '12':
        case '13':
            // Connection failed. Roaming not allowed, please contact your
            // Service Provider.
            setConnectionLink(dialup_label_connection_fail_roaming_unallowable);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case MACRO_CONNECTION_CONNECTING:
            // connecting
            if ($('#connect_btn').size() == 0) {
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
                
            }
            setConnectionLink(dialup_label_connecting);
            button_enable('connect_btn', '0');
            $('#connect_btn').removeClass('mouse_on');
           
            break;
        case MACRO_CONNECTION_DISCONNECTING:
            // disconnecting
            setConnectionLink(dialup_label_disconnecting);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            button_enable('disconnect_btn', '0');
            break;
        case MACRO_CONNECTION_CONNECTED:
            // connected
            setConnectionLink(dialup_label_connected);
            $('#index_connection_button').html(createConnectionButton(common_disconnect, 'disconnect_btn'));
            break;
        case MACRO_CONNECTION_DISCONNECTED:
            var connect_type = '';
            if (typeof(currentStatus.CurrentNetworkTypeEx) != 'undefined' &&
            currentStatus.CurrentNetworkTypeEx != '') 
            {
                connect_type = currentStatus.CurrentNetworkTypeEx;
            }
            else
            {
                connect_type = currentStatus.CurrentNetworkType;
            }
            if (connect_type == CURRENT_NETWORK_NO_SERVICE ||
            currentStatus.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
            currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE
            ) {
                // no coverage
                $('#index_plmn_name').html(dialup_hint_no_network);
                setConnectionLink(hilink_label_connect_failed);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                // disconnected
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE:
        case FORBID_RE_CONNECT_DROPLINE:
            // disconnected
            setConnectionLink(dialup_label_disconnected);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
        case FORBID_AUTO_CONNECT_OPEN_DEVICE_ROAMING:
        case FORBID_RE_CONNECT_DROPLINE_ROAMING:
            // Automation connect is disabled for roaming network.
            // You will have to manually connect the network.
            if (parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1) {
                setConnectionLink(hilink_label_roaming_auto_connection_forbid);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            else {
                //roaming status is 0
                setConnectionLink(dialup_label_disconnected);
                $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            }
            break;
        default:
            // Connection failed. Please try again later. If the problem
            // persists, please contact your Service Provider.
            setConnectionLink(hilink_label_connect_failed_common_tip);
            $('#index_connection_button').html(createConnectionButton(common_connect, 'connect_btn'));
            break;
    }
    */

    // while ServiceStatus is not available, user can not click Connect Button
    if (currentStatus.ServiceStatus != SERVICE_STATUS_AVAIABLE) {
        button_enable('connect_btn', '0');
    }
}

function createConnectionButton(button_dis, button_id) {
    getConnectionStautes();
    if (1 == g_mouse_on_out_event) {
        $('#index_connection_button').html(create_button_html(button_dis, button_id, 'mouse_on'));
    }
    else {
        $('#index_connection_button').html(create_button_html(button_dis, button_id));
    }
    if (!g_isAutoConnect) {
        $('#index_connection_button').css("display","");
    }
    else {
        $('#index_connection_button').css("display","none");
        $('.trun_off_waln').css("margin-left","0px");
    }   
    
}

function index_checkConnectionStatusChange() {
    var currentStatus = G_MonitoringStatus.response;

    if (g_connectionStatus_S2 == null) {
        g_connectionStatus_S1 = currentStatus.ConnectionStatus;
        if (currentStatus.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
            main_getAdvertisement();
        }
    }
    else {
        g_connectionStatus_S1 = g_connectionStatus_S2;
    }
    g_connectionStatus_S2 = currentStatus.ConnectionStatus;

    if (g_connectionStatus_S1 != MACRO_CONNECTION_CONNECTED &&
    g_connectionStatus_S2 == MACRO_CONNECTION_CONNECTED) {
        index_gotoOperatorHomePage(true);
        main_getAdvertisement();
    }
}

/*
 show new update available while new version come.
 */
function index_checkUpdate() {
    if (typeof(G_NotificationsStatus.OnlineUpdateStatus) == 'undefined' ||
    G_NotificationsStatus.OnlineUpdateStatus == null) {
        return;
    }

    if (G_NotificationsStatus.OnlineUpdateStatus == '12' ||
    G_NotificationsStatus.OnlineUpdateStatus == '50') {
        $('#new_version_notice').html(common_new_version);
        return false;
    }
    else {
        $('#new_version_notice').html('');
    }
}

/*
 update message icon depends on sms unread count
 */
function index_updateUnreadMessages() {
    if (G_NotificationsStatus != null) {
        var localUnRead = G_NotificationsStatus.UnreadMessage;
        var smsStorageFull = G_NotificationsStatus.SmsStorageFull;
        if (0 < localUnRead) {
            $('#new_messages').html(localUnRead);
            $('#new_messages').show();
        }
        else {
            $('#new_messages').html('');
            $('#new_messages').hide();
        }
        if (smsStorageFull == '1') {
            $('#sms_store_full_tip').html(sms_message_full);
        }
        else {
            $('#sms_store_full_tip').html('');
        }
    }
}

function GetPLMN() {
    var plmn_name = '';
    var connect_type = '';
    if (typeof(G_MonitoringStatus.response.CurrentNetworkTypeEx) != 'undefined' &&
    G_MonitoringStatus.response.CurrentNetworkTypeEx != '') 
    {
        connect_type = G_MonitoringStatus.response.CurrentNetworkTypeEx;
    }
    else
    {
        connect_type = G_MonitoringStatus.response.CurrentNetworkType;
    }
    if (
        !(connect_type == CURRENT_NETWORK_NO_SERVICE ||
           G_MonitoringStatus.response.CurrentServiceDomain == SERVICE_DOMAIN_NO_SERVICE ||
           G_MonitoringStatus.response.ServiceStatus != SERVICE_STATUS_AVAIABLE) &&  
           G_MonitoringStatus.response.WifiConnectionStatus != WIFI_CONNECTED
       ) {
            getAjaxData('api/net/current-plmn', function($xml) {
                var plmn_ret = xml2object($xml);
                if ('response' == plmn_ret.type) {
                    if (null == plmn_ret ||
                    '' == plmn_ret.response.State ||
                    ' ' == plmn_ret.response.State ||
                    null == plmn_ret.response.State) {
                        plmn_name = '';
                    }
                    else {
                        if (typeof(plmn_ret.response.ShortName) != 'undefined' &&
                        plmn_ret.response.ShortName.length > 0) {
        
                            plmn_name = replaceSpace(plmn_ret.response.ShortName);
                                                        
                            $('#index_plmn_name').html(plmn_name);
                        }
                        else if (typeof(plmn_ret.response.FullName) != 'undefined' &&
                            plmn_ret.response.FullName.length > 0) {
                            
                            plmn_name = replaceSpace(plmn_ret.response.FullName);
                                    
                            $('#index_plmn_name').html(plmn_name);
                        }
                        else {
                            plmn_name = '';
                        }
                    }
                    if (G_MonitoringStatus != null &&
                            typeof(G_MonitoringStatus.response) != 'undefined' &&
                            parseInt(G_MonitoringStatus.response.RoamingStatus, 10) == 1 &&
                            parseInt(G_MonitoringStatus.response.ServiceStatus, 10) == SERVICE_STATUS_AVAIABLE) {
                                plmn_name += ' ';
                                plmn_name += IDS_dialup_label_roaming;
                        } 
                        $('#index_plmn_name').html(plmn_name);
                }
            });
    }
    
    var rat = '';
    if(G_MonitoringStatus.response.WifiConnectionStatus != WIFI_CONNECTED) {
        if (g_plmn_rat != 'undefined' && g_plmn_rat != "") {
            //plmn Status
            switch (g_plmn_rat) {
                case MACRO_CURRENT_NETWOORK_2G:
                    rat = plmn_label_2g;
                    break;
                case MACRO_CURRENT_NETWOORK_3G:
                    rat = plmn_label_3g;    
                    break;
                case MACRO_CURRENT_NETWOORK_H:
                    rat = plmn_label_h;
                    break;
                 case MACRO_CURRENT_NETWOORK_4G:
                    rat = plmn_label_4g;
                    break;
                default:
                    rat = "";
                    break;
            }
        }
    }
    else {
        plmn_name = replaceSpace(g_stationInformation.NetworkName);
        $('#index_plmn_name').html(plmn_name);
        rat = dialup_label_wifi;
    }
    
    
    $('#status_img').html('<p>' + rat + '</p>');
}

/*
 update current operator name and generation
 */
function index_updatePLMN() {
    /*
     * if no signal, no need to get PLMN
     */

     GetPLMN();

}

function getWiFiStatusAndMyNumber() {
    if('1' == g_msisdn) {
    var mynumber = common_unknown;
    getAjaxData('api/device/information', function($xml) {
        var ret = xml2object($xml);
        if (('response' == ret.type) && (ret.response.Msisdn != '')) {
            mynumber = ret.response.Msisdn;
        }
    }, {
        sync: true
    });

        $('#my_number').show();
        $('#ConnectionStatus').text(mynumber);
    }
    else {
        $('#my_number').hide();
    }
    
    if (g_module.multi_ssid_enabled) {
        getWlanBasicStatusMultiSSID();
    }
    else {
        setHTMLByWlanBasicSetting();
    }
}

/*
 update signal, new message icon, new update icon repeatly.
 */
function index_updatePageStatusListener() {
    index_updateUnreadMessages();
    index_updateConnectionStatus();
    index_checkConnectionStatusChange();
    index_checkUpdate();
    initConnectionStatus();
    getWiFiStatusAndMyNumber();
    index_updatePLMN();
}

function getWlanBasicStatus() {
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response') {
            g_index_wlan_basic_settings = basic_ret.response;
        }
        setHTMLByWlanBasicSetting();
    });
}

function setHTMLByWlanBasicSetting() {

    var monitoring_status = G_MonitoringStatus;
    if(null != monitoring_status) {
        if(monitoring_status.response.WifiStatus == 1){
            $('#CurrentWifiStatus').text(common_on);
            $('#CurrentWifiUser').html(monitoring_status.response.CurrentWifiUser + '/' + monitoring_status.response.TotalWifiUser);
        }
        else{
            $('#CurrentWifiStatus').text(common_off); 
            $('#CurrentWifiUser').html(wlan_label_no_users);
        }
    }
}

function getWlanBasicStatusMultiSSID() {
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var basic_ret = xml2object($xml);
        if (basic_ret.type == 'response' && 'undefined' != typeof(basic_ret.response.Ssids.Ssid)) {
            g_index_wlan_basic_settings = basic_ret.response.Ssids.Ssid;
        }
        getWlanSecurityStatusMultiSSID();
    });
}

function getWlanSecurityStatusMultiSSID() {
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        security_ret = xml2object($xml);
        if (security_ret.type == 'response') {
            g_wlan_security_settings = security_ret.response;
        }
        setHTMLByWlanSecuritySetting();
    });
}

function setHTMLByWlanSecuritySetting() {
    var settings = g_wlan_security_settings;

    //Wlan status
    if (settings && settings.WifiEnable == 1) {
        $('#CurrentWifiStatus').text(common_on);
        $('#CurrentWifiUser').hide();
        $("#wlan_status_single_or_multi > tbody > tr:gt(1)").remove();
        var ssid_list_index = '';
        $.each(g_index_wlan_basic_settings, function() {
            ssid_list_index += '<tr>';
            ssid_list_index += '<td>' + this.WifiSsid + '</td>';
            ssid_list_index += "<td><label class='list_right'>" + this.WifiAssociatedStationNum + '</label></td>';
            ssid_list_index += '</tr>';
        });
        $('#wlan_status_single_or_multi').append(ssid_list_index);
    }
    else {
        $('#CurrentWifiStatus').text(common_off);
        $('#CurrentWifiUser').html(wlan_label_no_users);
    }
}

function getLoginUitl(login_id, loginTrafficxml) {
    if (loginTrafficxml >= g_monitoring_dumeter_tb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_tb, 2) + ' TB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_tb && loginTrafficxml >= g_monitoring_dumeter_gb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_gb, 2) + ' GB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_gb && loginTrafficxml >= g_monitoring_dumeter_mb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_mb, 2) + ' MB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_mb && loginTrafficxml >= g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml) / g_monitoring_dumeter_kb, 2) + ' KB');
    }
    else if (loginTrafficxml < g_monitoring_dumeter_kb) {
        $('#' + login_id).text(formatFloat(parseFloat(loginTrafficxml), 2) + ' B');
    }
    }
function initConnectionStatus() {
    if (g_module.ap_station_enabled &&
    G_StationStatus != null &&
    WIFI_STATION_CONNECTED == G_StationStatus.response.ConnectStatus) {
        var totalTimesArray = getCurrentTime(G_StationStatus.response.CurrentTime);
        getLoginUitl('TotalDownload', G_StationStatus.response.RxFlux);
        getLoginUitl('TotalUpload', G_StationStatus.response.TxFlux);
        $('#TotalConnectTime').text(totalTimesArray);
    }
    else {
        getAjaxData('api/monitoring/traffic-statistics', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_login_function = ret.response;
                if (G_MonitoringStatus == null || G_MonitoringStatus.response.ConnectionStatus != 901) {
                    g_login_function.CurrentConnectTime = 0;
                    g_login_function.CurrentDownload = 0;
                    g_login_function.CurrentUpload = 0;
                }
                var totalTimesArray = getCurrentTime(g_login_function.CurrentConnectTime);
                getLoginUitl('TotalDownload', g_login_function.CurrentDownload);
                getLoginUitl('TotalUpload', g_login_function.CurrentUpload);
                $('#TotalConnectTime').text(totalTimesArray);
            }
            else {
                log.error('Load traffic-statistics data failed');
            }
        });
    }
}

function main_executeBeforeDocumentReady() {
    index_redirectPage();
    
    
    getConfigData('config/deviceinformation/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret)
        {
            g_msisdn = config_ret.msisdn;
        }
    }, {
        sync: true
    });
    
    

}

main_executeBeforeDocumentReady();
/*
 invoke while document is ready
 */
$(document).ready(function() {
    if (LANGUAGE_DATA.current_language == 'ar_sa' || LANGUAGE_DATA.current_language == 'he_il') {
        $('.revicedsent').text(common_sent + '/' + dialup_label_received + common_colon);
    }
    else {
        $('.revicedsent').text(dialup_label_received + '/' + common_sent + common_colon);
    }

    if('1' == g_wifioffload_enable) {
         getHandoverSetting();
    }
   
    
    index_setPcHostInfo();
    addStatusListener('index_updatePageStatusListener()');

    index_getPcAssistant();

    if (g_module.ussd_enabled) {
        $('.index_appicon_ussd').show();
    }

    if (!g_feature.connection.enable) {
        $('.login_box_info').css({
            display: 'none'
        });
    }

    if (!g_feature.connection.connectionstatus) {
        $('.connection').css({
            display: 'none'
        });
    }
    if (g_module.sdcard_enabled) {
        $('#login_sharing_div').show();
        $('#view_SDCard_btn').bind('click', function() {
            window.location.href = 'sdcardsharing.html';
        });
    }

    if (!g_module.wifi_enabled) {
        $('.wlan_status').css({
            display: 'none'
        });
    }

    if (g_module.multi_ssid_enabled) {
        getWlanBasicStatusMultiSSID();
    }
    else {
        getWlanBasicStatus();
    }

    if (typeof(g_feature.hotlinks.enable) != 'undefined') {
        if (g_feature.hotlinks.enable) {
            SetHotlinks();
        }
        else {
            $('.hot_links').hide();
        }
    }

    var login_status_items = $('.login_info > div:visible');
    if (login_status_items.size() > 2) {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '33.3%'
            });
        });
    }
    else {
        $.each(login_status_items, function(i) {
            $(this).css({
                width: '50%'
            });
        });
    }

    //Button effect when mouseover and out
    $('#connect_btn, #disconnect_btn').live('mouseover', function() {

        if (!isButtonEnable('connect_btn') || !isButtonEnable('disconnect_btn')) {
            return;
        }
        else {
            $(this).addClass('mouse_on');
        }
        g_mouse_on_out_event = 1;
    });
    $('#connect_btn, #disconnect_btn').live('mouseout', function() {
        $(this).removeClass('mouse_on');
        g_mouse_on_out_event = 2;
    });
    $('#notification_tray').click(function() {
        if (!isButtonEnable('notification_tray')) {
            return;
        }
        else {
            gotoPageWithHistory('installsoftware.html');
        }
    });
    

    $('#trun_off_waln_check').live('click', function() {
      
        if (g_needToLogin) {
           getAjaxData('api/user/state-login', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                if (ret.response.State != '0') { //logout
                    g_isTrunOffWlanChecked = true;
                    showloginDialog();
                }
                else {
                    if($('.trun_on_off_waln :checked').size() > 0) {
                        g_handover_setting.Handover = '2';
                    }
                    else {
                        g_handover_setting.Handover = '0';
                    }
                    setHandoverSetting();
                }
            }
            }, {
                sync: true
            });
        }
        else {
            if($('.trun_on_off_waln :checked').size() > 0) {
                g_handover_setting.Handover = '2';
            }
            else {
                g_handover_setting.Handover = '0';
            }
            setHandoverSetting();
        }
  
    });
    
    $('#connect_btn').live('click', function() {
        if (!isButtonEnable('connect_btn')) {
            return;
        }
        g_is_connect_clicked = true;
        if (g_needToLogin) {
            //g_nav = $(this);
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                        g_destnation = null;
                        //g_nav.children().first().attr("href",
                        // "javascript:void(0);");
                        showloginDialog();
                        return;
                    }
                    else {
                        index_clickConnectBtn();
                    }

                }
                else {
                    index_clickConnectBtn();
                }
            }, {
                sync: true
            });
        }
        else {
            index_clickConnectBtn();
        }

    });
    $('#cancel_btn').live('click', function() {
        if (!isButtonEnable('cancel_btn')) {
            return;
        }
        g_is_disconnect_clicked = false;
        g_is_connect_clicked = false;
        $('#cancel_btn').removeClass('mouse_on');
        button_enable('cancel_btn', '0');
        
        setConnectionLink(dialup_label_connecting);
        index_clickCancelBtn();
    });
    $('#disconnect_btn').live('click', function() {
        if (!isButtonEnable('disconnect_btn')) {
            return;
        }
        g_is_disconnect_clicked = true;
        if (g_needToLogin) {
            //g_nav = $(this);
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.State != '0') { //logout
                        g_destnation = null;
                        //g_nav.children().first().attr("href",
                        // "javascript:void(0);");
                        showloginDialog();
                        return;
                    }
                    else {
                        index_clickDisconnectBtn();
                    }

                }
                else {
                    index_clickDisconnectBtn();
                }
            }, {
                sync: true
            });
        }
        else {
            index_clickDisconnectBtn();
        }
    });
});
/*
 goto autorun download page when found new autorun version on device.
 goto operator homepage according to /api/redirection/homepage
 */

function index_redirectPage() {
    var deviceVersion = '';
    var pcVersion = window.name;

    // get pc autorun version
    if (pcVersion == null || pcVersion.length <= 0 || pcVersion == 'null') {
        return;
    }
    window.name = null;
    // get device autorun version
    getAjaxData('api/device/autorun-version', function($xml) {
        var autorun_ver = xml2object($xml);
        if ('response' == autorun_ver.type) {
            deviceVersion = autorun_ver.response.Version;
        }
    }, {
        sync: true
    });

    var string1list = pcVersion.split('.');
    var string2list = deviceVersion.split('.');
    var isNewVersionFound = false;
    var isValidVersion = false;
    if(string1list.length == string2list.length)
    {
        var count;
        for(count = 0;count < string1list.length; count++)
        {
            if(isNaN(string1list[count]) || isNaN(string2list[count]))
            {
                break;
            }
        }
        if(string1list.length == count)
        {
            isValidVersion = true;
        }
    }
    if(isValidVersion)
    {
        if (parseInt(string1list[4], 10) != parseInt(string2list[4], 10)) {
            isNewVersionFound = true;
        }
        var i = 0;
        for (i; i < 4; i++) {
            if (string1list[i] < string2list[i]) {
                isNewVersionFound = true;
            }
            else if (string1list[i] > string2list[i]) {
                break;
            }
        }
    }
    if (isNewVersionFound) {
        gotoPageWithoutHistory('update_autorun.html');
    }
    else {
        /*
         redirect to carrier homepage when connected to internet
         */
        getAjaxData('api/monitoring/status', function($xml) {
            var status = xml2object($xml);
            if ('response' == status.type) {
                g_connectionStatus_S2 = status.response.ConnectionStatus;
                if (status.response.ConnectionStatus == MACRO_CONNECTION_CONNECTED) {
                    index_gotoOperatorHomePage(false);
                }
            }
        }, {
            sync: true
        });
        if (null == g_connectionStatus_S2) {
            g_connectionStatus_S2 = MACRO_CONNECTION_DISCONNECTED;
        }
    }
}

/*
 goto operator homepage
 */
function index_gotoOperatorHomePage(bNewWindow) {
    getAjaxData('api/redirection/homepage', function($xml) {
        var homepage_ret = xml2object($xml);
        if ('response' == homepage_ret.type) {
            /*
             EnableRedirection -- whether need to do the redirection.
             1 : yes      0 : no
             */
            if ('1' == homepage_ret.response.EnableRedirection) {
                /*
                 if carrier homepage url is begin with "http", just redirect to
                 this url
                 otherwise UI should insert "http://" prefix to this url before
                 redirection
                 */
                var homepage_url = null;
                if (homepage_ret.response.Homepage.length > 4 &&
                homepage_ret.response.Homepage.toLowerCase().substring(0, 4) == 'http') {
                    homepage_url = homepage_ret.response.Homepage;
                }
                else {
                    homepage_url = 'http://' + homepage_ret.response.Homepage;
                }

                if (bNewWindow) {
                    gotoPageWithHistory(homepage_url);
                }
                else {
                    gotoPageWithoutHistory(homepage_url);
                }
            }
        }
    }, {
        sync: true
    });
}

function index_setPcHostInfo() {
    // get Time
    var now = new Date();
    var str_year = now.getFullYear();
    var str_month = now.getMonth() + 1;
    if (str_month < 10) {
        str_month = '0' + str_month;
    }
    var str_day = now.getDate();
    if (str_day < 10) {
        str_day = '0' + str_day;
    }
    var str_hour = now.getHours();
    if (str_hour < 10) {
        str_hour = '0' + str_hour;
    }
    var str_min = now.getMinutes();
    if (str_min < 10) {
        str_min = '0' + str_min;
    }
    var str_sec = now.getSeconds();
    if (str_sec < 10) {
        str_sec = '0' + str_sec;
    }
    var str_time = str_year.toString() + str_month.toString() + str_day.toString() + str_hour.toString() + str_min.toString() + str_sec.toString();

    // get Platform
    var host_info = {
        Time: str_time,
        Platform: navigator.platform,
        PlatformVer: navigator.userAgent,
        Navigator: navigator.appVersion,
        NavigatorVer: navigator.userAgent
    };
    var str_xml = object2xml('request', host_info);
    saveAjaxData('api/host/info', str_xml);
}

function index_getPcAssistant() {
    getAjaxData('config/pcassistant/config.xml', function($xml) {
        var assistant_ret = xml2object($xml);

        if ('1' == assistant_ret.config.enable) {
            var ua = navigator.userAgent.toLowerCase();
            g_index_is_windows = (ua.indexOf('windows') != -1 || ua.indexOf('win32') != -1);
            // //Window operate
            g_index_is_mac = (ua.indexOf('macintosh') != -1 || ua.indexOf('mac os x') != -1);
            // //Mac operate
            g_index_is_linux = (ua.indexOf('linux') != -1);
            if (g_index_is_mac) {
                if ('' != assistant_ret.config.macpath &&
                ' ' != assistant_ret.config.macpath &&
                null != assistant_ret.config.macpath &&
                'undefind' != assistant_ret.config.macpath) {
                    $('.new_msg').show();
                    $('#notification_tray').show();
                }
            }
            else if (g_index_is_windows) {
                if ('' != assistant_ret.config.winpath &&
                ' ' != assistant_ret.config.winpath &&
                null != assistant_ret.config.winpath &&
                'undefind' != assistant_ret.config.winpath) {
                    $('.new_msg').show();
                    $('#notification_tray').show();
                }
            }
        }
        else {
            $('.new_msg').hide();
            $('#notification_tray').hide();

        }
    });
}

function main_getAdvertisement() {
    if (g_feature.adcontent_enable) {
        $('#ad_div').show();
        $('#ad_iframe').get(0).src = 'adcontent.html';
    }
}

function setConnectionLink(connectType) {
    if(G_MonitoringStatus.response.WifiConnectionStatus != WIFI_CONNECTED) {
        $('#index_connection_status').html(connectType + "<div id='menu_connection_settings'><a href='mobileconnection.html'>" + hilink_label_auto_connection_link + '</a></div>');
    }
    else {
        $('#index_connection_status').html(dialup_label_connected + "<div id='menu_connection_settings'><a href='wifinetworks.html'>" + hilink_label_auto_connection_link + '</a></div>');
    }
}
function getConnectionStautes() {
    if(typeof(g_connection_status) == 'undefined' || g_connection_status == null || g_current_roamingStatus != G_MonitoringStatus.response.RoamingStatus) {
        getAjaxData('api/dialup/connection', function($xml) {
            var ret = xml2object($xml);
            if ('response' == ret.type) {
                g_connection_status = ret;
                g_current_roamingStatus = G_MonitoringStatus.response.RoamingStatus;
                if(('1' == g_connection_status.response.ConnectMode || 
                   ('0' == g_connection_status.response.ConnectMode &&
                    '0' == g_connection_status.response.RoamAutoConnectEnable && 
                    '1' == G_MonitoringStatus.response.RoamingStatus)) && 
                     G_MonitoringStatus.response.WifiConnectionStatus != WIFI_CONNECTED) {
                     g_isAutoConnect = false;
                } 
                else {
                    g_isAutoConnect = true;
                }               
            }
        }, {
            sync: true
        });
    }
    

}


function getHandoverSetting() {
    getAjaxData("api/wlan/handover-setting", function($xml) {
        var ret = xml2object($xml);
        if (ret.type == "response") {
            $('.trun_on_off_waln').show();
            if(WIFI_PREFER == ret.response.Handover) {
                $('input[name=trun_off_waln]').attr('checked', 'checked');
            }
            else {
                $('input[name=trun_off_waln]').attr('checked', '');
            }
        } else {
            log.error("WiFi network: get api/wlan/handover-setting data error");
        }
    });
}

function setHandoverSetting() {
    var handDover_xml = object2xml('request', g_handover_setting);
    saveAjaxData('api/wlan/handover-setting', handDover_xml, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            log.debug('api/wlan/handover-setting ok');
            
            if(WIFI_PREFER == g_handover_setting.Handover) {  
                $('input[name=trun_off_waln]').attr('checked', 'checked');
            }
            else {
                $('input[name=trun_off_waln]').attr('checked', '');
            }
        }
        else {
            log.debug('api/wlan/handover-setting error');
        }
    });
}

//Button connection or disconnection click effect
function index_clickTrunOnBtn() {
     
    $('#wifi_connection_button').html(create_button_html( common_turn_off + " " +wlan_label_wlan,"wifi_turnOff_button"));
    
    
   
}

function index_clickTurnOffBtn() {
    
     $('#wifi_connection_button').html(create_button_html(common_turn_on + " " +wlan_label_wlan,"wifi_turnOn_button"));

   
}