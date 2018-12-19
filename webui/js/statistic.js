// JavaScript Document
var g_monitoring_traffic_statistics = null;
var g_monitoring_status = null;
var g_wlan_security_settings = null;
var g_wlan_basic_settings = null;
var g_connection_trafficresponse = null;
//Prefix string of ssid2 of Multi-SSID
var g_prefixWifiSsid = "ssid2_";

function getTrafficInfo(bit) {
    var final_number = 0;
    var final_str = "";
    if(g_monitoring_dumeter_kb > bit) {
        final_number = formatFloat(parseFloat(bit), 2);
        final_str = final_number + " B";
    }
    else if(g_monitoring_dumeter_kb <= bit && g_monitoring_dumeter_mb > bit) {
        final_number = formatFloat(parseFloat(bit) / g_monitoring_dumeter_kb, 2);
        final_str = final_number + " KB";
    }
    else if(g_monitoring_dumeter_mb <= bit && g_monitoring_dumeter_gb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_mb), 2);
        final_str = final_number + " MB";
    }
    else if(g_monitoring_dumeter_gb <= bit && g_monitoring_dumeter_tb > bit) {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_gb), 2);
        final_str = final_number + " GB";
    }
    else {
        final_number = formatFloat((parseFloat(bit) / g_monitoring_dumeter_tb), 2);
        final_str = final_number + " TB";
    }
    return final_str;
}

function setTrafficHTML() {
    g_connection_trafficresponse = g_monitoring_traffic_statistics;
    if(g_connection_trafficresponse != "") {
        //profile table info
        $("#current_upload").html(getTrafficInfo(g_connection_trafficresponse.CurrentUpload));
        $("#current_download").html(getTrafficInfo(g_connection_trafficresponse.CurrentDownload));
        $("#total_current").html(getTrafficInfo(parseInt(g_connection_trafficresponse.CurrentUpload, 10) + parseInt(g_connection_trafficresponse.CurrentDownload, 10)));
        var trafficTimesString = getCurrentTime(g_connection_trafficresponse.CurrentConnectTime);
        $("#current_duration").html(trafficTimesString);

        //total table info
        $("#history_upload").html(getTrafficInfo(g_connection_trafficresponse.TotalUpload));
        $("#history_download").html(getTrafficInfo(g_connection_trafficresponse.TotalDownload));
        $("#total_history").html(getTrafficInfo((parseInt(g_connection_trafficresponse.TotalUpload, 10) + parseInt(g_connection_trafficresponse.TotalDownload, 10))));
        var totalTimesString = getCurrentTime(g_connection_trafficresponse.TotalConnectTime, 10);
        $("#history_duration").html(totalTimesString);
    }
    //ap station info
    if(g_feature.ap_station_enabled && G_StationStatus != null) {

        $("#wifi_current_download").html(getTrafficInfo(G_StationStatus.response.RxFlux));
        $("#wifi_current_upload").html(getTrafficInfo(G_StationStatus.response.TxFlux));
        $("#wifi_total_current").html(getTrafficInfo(parseInt(G_StationStatus.response.TxFlux, 10) + parseInt(G_StationStatus.response.RxFlux, 10)));
        $("#wifi_history_download").html(getTrafficInfo(G_StationStatus.response.TotalRxFlux));
        $("#wifi_history_upload").html(getTrafficInfo(G_StationStatus.response.TotalTxFlux));
        $("#wifi_total_history").html(getTrafficInfo(parseInt(G_StationStatus.response.TotalTxFlux, 10) + parseInt(G_StationStatus.response.TotalRxFlux, 10)));

        var wifi_trafficTimesString = getCurrentTime(G_StationStatus.response.CurrentTime);
        var wifi_totalTimesString = getCurrentTime(G_StationStatus.response.TotalTime);
        $("#wifi_current_duration").html(wifi_trafficTimesString);
        $("#wifi_history_duration").html(wifi_totalTimesString);
    }
}

function setCurrrentUserHTML() {
    var settings = g_wlan_basic_settings;
    var ssids = [""];

    if(g_feature.multi_ssid_enabled) {
        settings = g_wlan_security_settings;
        ssids.push(g_prefixWifiSsid);
    }
    var i = 0;
    for(i; i < ssids.length; ++i) {
        if(settings && settings.WifiEnable == 1) {
            
            $("#"+ssids[i]+"table_wifiClient").show();
        }
        else {
            
            $("#"+ssids[i]+"table_wifiClient").hide();
        }

    }
}

function getTrafficStatus() {
    getAjaxData("api/monitoring/traffic-statistics", function($xml) {
        var traffic_ret = xml2object($xml);
        if(traffic_ret.type == "response") {
            g_monitoring_traffic_statistics = traffic_ret.response;
            setTrafficHTML();
        }
    });
}

function getWlanStatus() {
    getAjaxData("api/monitoring/status", function($xml) {
        var wlan_ret = xml2object($xml);
        if(wlan_ret.type == "response") {
            g_monitoring_status = wlan_ret.response;
            setCurrrentUserHTML();
        }
    });
}

function getWlanBasicStatus() {
    getAjaxData("api/wlan/basic-settings", function($xml) {
        var basic_ret = xml2object($xml);
        if(basic_ret.type == "response") {
            g_wlan_basic_settings = basic_ret.response;
            setCurrrentUserHTML();
        }
    });
}

function getWlanSecurityStatusMultiSSID() {
    getAjaxData("api/wlan/multi-security-settings", function($xml) {
        var security_ret = xml2object($xml);
        if(security_ret.type == "response") {
            g_wlan_security_settings = security_ret.response;
            setCurrrentUserHTML();
        }
    });
}

function getApStationTrafficStatus() {
    getAjaxData("api/wlan/station-information", function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            G_StationStatus = ret;
            setTrafficHTML();
        }
    });
}

function getAuthenInfo() {
    getAjaxData("api/wlan/host-list", function($xml) {
        var wlan_ret = xml2object($xml);
        var wlanTimeArray = [];
        var listHosts = [];
        var new_line = "";
        var numSsid1Hosts = 0;
        var numSsid2Hosts = 0;

        if(wlan_ret.type == "response") {
            $("#table_wifiClient > tbody > tr:gt(0)").remove();
            if(g_feature.multi_ssid_enabled) {
                $("#"+g_prefixWifiSsid+"table_wifiClient > tbody > tr").remove();
            }
            if(wlan_ret.response.Hosts.Host) {
                if($.isArray(wlan_ret.response.Hosts.Host)) {
                    listHosts = wlan_ret.response.Hosts.Host;

                    //Count number of hosts in ssid1 and ssid2 respectivity
                    var i = 0;
                    for(i; i < listHosts.length; i++) {
                        if("SSID1" == listHosts[i].AssociatedSsid) {
                            numSsid1Hosts++;
                        }

                        if("SSID2" == listHosts[i].AssociatedSsid) {
                            numSsid2Hosts++;
                        }
                    }

                    if(g_feature.multi_ssid_enabled) {
                        new_line = "<tr><td colspan='5' class='tr_bg'>" + wlan_label_multi_ssid_clients + "1" + common_colon + " " + numSsid1Hosts + "</td></tr>";
                        $("#table_wifiClient").append(new_line);
                        new_line = "<tr><td colspan='5' class='tr_bg'>" + wlan_label_multi_ssid_clients + "2" + common_colon + " " + numSsid2Hosts + "</td></tr>";
                        $("#"+g_prefixWifiSsid+"table_wifiClient").append(new_line);
                    }
                }
                else {
                    listHosts.push(wlan_ret.response.Hosts.Host);

                    if(g_feature.multi_ssid_enabled) {
                        if("SSID1" == listHosts[0].AssociatedSsid) {
                            new_line = "<tr><td colspan='5' class='tr_bg'>" + wlan_label_multi_ssid_clients + "1" + common_colon + " " + "1" + "</td></tr>";
                            $("#table_wifiClient").append(new_line);
                        }

                        if("SSID2" == listHosts[0].AssociatedSsid) {
                            new_line = "<tr><td colspan='5' class='tr_bg'>" + wlan_label_multi_ssid_clients + "2" + common_colon + " " + "1" + "</td></tr>";
                            $("#"+g_prefixWifiSsid+"table_wifiClient").append(new_line);
                        }
                    }
                }
            }

            $.each(listHosts, function(n, value) {
                
                var connectionDuration = getCurrentTime(value.AssociatedTime);
                new_line = "<tr><td class='bottom_id'>" + value.ID + "</td>";
                new_line += "<td class='bottom_ip'>" + value.IpAddress + "</td>";
                new_line += "<td class='bottom_host'>" + value.HostName + "</td>";
                new_line += "<td class='bottom_mac'>" + value.MacAddress + "</td>";
                new_line += "<td class='bottom_associat'>" + connectionDuration + "</td></tr>";

                if("SSID2" != value.AssociatedSsid) {
                    $("#table_wifiClient").append(new_line);
                }
                else if(g_feature.multi_ssid_enabled && ("SSID2" == value.AssociatedSsid)) {
                    $("#"+g_prefixWifiSsid+"table_wifiClient").append(new_line);
                }
            });
        }
        else {
            log.error("Load host-list data failed");
        }
    });
}

function getAllInfo() {
    //getWlanStatus();
    getTrafficStatus();

    if(g_module.wifi_enabled) {
        if(g_feature.multi_ssid_enabled) {
            //getWlanBasicStatusMultiSSID();
            getWlanSecurityStatusMultiSSID();
        }
        else {
            getWlanBasicStatus();
            //getWlanSecurityStatus();
        }
        getAuthenInfo();
    }

    setTimeout(getAllInfo, g_feature.update_interval);
}

function refreshTraffic() {
    var request = {
        ClearTraffic : 1
    };
    var xmlstr = object2xml("request", request);
    log.debug(xmlstr);
    saveAjaxData("api/monitoring/clear-traffic", xmlstr, function($xml) {
        var ret = xml2object($xml);
        if(ret.type == "response") {
            getTrafficStatus();
            if(g_feature.ap_station_enabled) {
                getApStationTrafficStatus();
            }
        }
        else {
            log.error("code = " + ret.error.code);
            log.error("message = " + ret.error.message);
        }
    });
}

function cancel_RefreshTraffic() {
    $("#div_wrapper").remove();
    $(".dialog").remove();
}

$(document).ready( function() {

    // ap station open
    if(g_feature.ap_station_enabled) {
        $(".no_station").remove();
        $(".have_station").show();
    }
    else {
        $(".no_station").show();
        $(".have_station").remove();
    }

    if (!g_module.wifi_enabled) {
        $(".status_title").remove();
        $(".wifi_table").remove();
    }
    
    $("#table_wifiClient").hide(); 
    $("#" + g_prefixWifiSsid + "table_wifiClient").hide();
    
    getAllInfo();

    //Clear History
    $("#button_clear_history").click( function() {
        showConfirmDialog(dialup_hint_reset_data_counter, refreshTraffic, cancel_RefreshTraffic);
    });
});