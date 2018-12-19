// JavaScript Document
var g_device_array = [];
var g_device_config = {};
var g_device_info = {};

function getDeviceInfo() {
        getAjaxData('api/monitoring/status', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            G_MonitoringStatus = ret;
        }
    }, {
        sync: true
    });
    getAjaxData('api/device/information', function($xml) {
        var device_ret = xml2object($xml);
        if (device_ret.type == 'response') {
            g_device_info = device_ret.response;
            g_device_info.WanIPAddress = G_MonitoringStatus.response.WanIPAddress;
            g_device_info.WanIPv6Address = G_MonitoringStatus.response.WanIPv6Address;
        } else {
            log.error('Error, no data');
        }
    }, {
        sync: true
    });
}

function getDeviceConfig() {
    getConfigData('config/deviceinformation/config.xml', function($xml) {
        var config_ret = _xml2feature($xml);
        if ('undefined' !== config_ret && null !== config_ret)
        {
            g_device_config = config_ret;
        }
    }, {
        sync: true
    });
}

function createListForDevice(_name, _value) {
    var tdName = '';
    var values = common_unknown;
    var row = '';
    switch (_name) {
        case 'DeviceName':
            tdName = system_label_device_name;
            break;

        case 'SerialNumber':
            tdName = system_label_serial_number;
            break;

        case 'Imei':
            tdName = system_label_imei;
            break;

        case 'Imsi':
            tdName = device_information_imsi;
            break;

        case 'HardwareVersion':
            tdName = system_label_hardware_version;
            break;

        case 'SoftwareVersion':
            tdName = system_label_software_version;
            break;

        case 'WebUIVersion':
            tdName = system_label_webui_version;
            break;
        case 'MacAddress1':
        if (g_device_info.MacAddress2 == '') {
            tdName = wlan_label_mac_address;

           } else {
                  tdName = IDS_common_mac_address_x.replace('%d', 1);
          }
            break;
        case 'MacAddress2':
        if (g_device_info.MacAddress2 != '') {
                tdName = IDS_common_mac_address_x.replace('%d', 2);

            } else {
                   return row;
            }
            break;
        case 'Iccid':
            tdName = system_label_iccid;
            break;
        case 'Msisdn':
            tdName = system_label_my_number;
            break;
        case 'ProductFamily':
            tdName = system_label_product_family;
            break;
        case 'Classify':
            tdName = system_label_classify;
            break;
        case 'WanIPAddress':
            tdName = system_label_wanip_address;
            break;
        case 'Esn' :
            tdName = system_label_esn;
            break;
        case 'Meid' :
            if(g_device_info.Esn.charAt(0) == '8' && g_device_info.Esn.charAt(1) == '0' )
            {
                tdName = system_label_meid;
                break;
            }
            else
            {
                return row;
            }
        case 'WanIPv6Address':
            tdName = system_label_wan_IPv6_addr;
            break;

        default:
            break;
    }
    if (tdName == system_label_my_number)
    {
        row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value success_phone_number'>" + (_value == '' ? values : _value) + '</td></tr>';    
    }
    else
    {
        row = '<tr><td>' + tdName + common_colon + "</td><td class='info_value'>" + (_value == '' ? values : _value) + '</td></tr>';
    }
    return row;
}
//Switch device info to display refrence device configuration xml
function setDeviceDisplay(_device_config, _device_info) {
    var list_content = '';
    var p = '';
    for (p in _device_info) {
        if (_device_config[p.toLowerCase()]) {
            if (typeof(_device_info[p]) != 'undefinded') {
                list_content += createListForDevice(p, _device_info[p]);
            }
            else {
                log.error("device dosen't exsited");
            }
        }
    }
    $('.diviceInfo_table').html(list_content);
}

getDeviceConfig();

$(document).ready(function() {
    getDeviceInfo(); 
    setDeviceDisplay(g_device_config, g_device_info);
});