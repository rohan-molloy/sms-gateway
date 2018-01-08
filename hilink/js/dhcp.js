// JavaScript Document
/***********************************************dhcp (start)**********************/

var dhcp_value = null;
var g_DHCP_SERVER_ENABLE = 1;
var g_DHCP_SERVER_DISABLE = 0;
var DHCP_PING_INTERVA = 50000;
var DHCP_MIN_LEASE_TIME = 86400;
var DHCP_MAX_LEASE_TIME = 604800;
var DHCP_DEFAULT_LEASE_TIME = 86400;

function enableDHCP() {
    var dhcpStartIPAddressTmp = '';
    var dhcpEndIPAddressTmp = '';
    var dhcpLeaseTimeTmp = '';
    if ('' != dhcp_value.DhcpStartIPAddress && '0' != dhcp_value.DhcpStartIPAddress && '0.0.0.0' != dhcp_value.DhcpStartIPAddress)
    {
        dhcpStartIPAddressTmp = dhcp_value.DhcpStartIPAddress;
    }
    else
    {
       dhcpStartIPAddressTmp = dhcp_value.DhcpIPAddress.slice(0, dhcp_value.DhcpIPAddress.lastIndexOf('.')) + '.100';
    }
    if ('' != dhcp_value.DhcpEndIPAddress && '0' != dhcp_value.DhcpEndIPAddress && '0.0.0.0' != dhcp_value.DhcpEndIPAddress)
    {
        dhcpEndIPAddressTmp = dhcp_value.DhcpEndIPAddress;
    }
    else
    {
       dhcpEndIPAddressTmp = dhcp_value.DhcpIPAddress.slice(0, dhcp_value.DhcpIPAddress.lastIndexOf('.')) + '.200';
    }
    if ('' != dhcp_value.DhcpLeaseTime && '0' != dhcp_value.DhcpLeaseTime)
    {
        dhcpLeaseTimeTmp = dhcp_value.DhcpLeaseTime;
    }
    else
    {
        dhcpLeaseTimeTmp = 'DHCP_DEFAULT_LEASE_TIME';
    }
    $('#input_dhcp_startip').val(dhcpStartIPAddressTmp).attr('disabled', false);
    $('#input_dhcp_endip').val(dhcpEndIPAddressTmp).attr('disabled', false);
    $('#input_dhcp_leasetime').val(dhcpLeaseTimeTmp).attr('disabled', false);
    $('#input_dhcp_startip').val(dhcp_value.DhcpStartIPAddress);
    $('#input_dhcp_endip').val(dhcp_value.DhcpEndIPAddress);
    $('#input_dhcp_leasetime').val(dhcp_value.DhcpLeaseTime);
}

function disabledDHCP() {
    $('#input_dhcp_startip').val('').attr('disabled', true);
    $('#input_dhcp_endip').val('').attr('disabled', true);
    $('#input_dhcp_leasetime').val('').attr('disabled', true);
}

function initPageData() {
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret;
        ret = xml2object($xml);
        log.debug('type= ' + ret.type);
        if (ret.type == 'response')
        {
            dhcp_value = ret.response;
            dhcp_value.DhcpStatus = parseInt(dhcp_value.DhcpStatus, 10);
            $('#input_dhcp_ipaddr').val(dhcp_value.DhcpIPAddress);
            $('#input_dhcp_submark').val(dhcp_value.DhcpLanNetmask);
            $("input[name='radio_dhcp_status'][value=" + dhcp_value.DhcpStatus + ']').attr('checked', true);
            if (g_DHCP_SERVER_ENABLE == dhcp_value.DhcpStatus)
            {
                enableDHCP();
            }
            else
            {
                disabledDHCP();
            }
        }
    });
}

function postData() {
    dhcp_value.DhcpIPAddress = $('#input_dhcp_ipaddr').val();
    dhcp_value.DhcpLanNetmask = $('#input_dhcp_submark').val();
    dhcp_value.DhcpStatus = $("input[name='radio_dhcp_status']:checked").val();
    dhcp_value.DhcpStartIPAddress = $('#input_dhcp_startip').val();
    dhcp_value.DhcpEndIPAddress = $('#input_dhcp_endip').val();
    dhcp_value.DhcpLeaseTime = $.trim($('#input_dhcp_leasetime').val());
    dhcp_value.PrimaryDns = '0.0.0.0';
    dhcp_value.SecondaryDns = '0.0.0.0';

    var xmlstr = object2xml('request', dhcp_value);
    saveAjaxData('api/dhcp/settings', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {
            });
             ping_setPingAddress(dhcp_value.DhcpIPAddress);
             setTimeout(startPing, DHCP_PING_INTERVA);
        }
        else
        {
            initPageData();
        }
    });
}

function isBetweenStartIPAndEndIP(ipAddress, startIP, endIP) {
    var num = 0;
    var numStart = 0;
    var numEnd = 0;
    var maskParts = ipAddress.split('.');
    var maskStartIPParts = startIP.split('.');
    var maskEndIPParts = endIP.split('.');

    num = parseInt(maskParts[3], 10);
    numStart = parseInt(maskStartIPParts[3], 10);
    numEnd = parseInt(maskEndIPParts[3], 10);
    if ((num >= numStart) && (num <= numEnd))
    {
        return true;
    }
        else
    {
        return false;
    }
}

function verifyUserInput() {
    var dhcpIPAddresss = $('#input_dhcp_ipaddr').val();
    var dhcpLanNetmask = $('#input_dhcp_submark').val();
    var dhcpStatus = $("input[name='radio_dhcp_status']:checked").val();
    var dhcpStartIPAddress = $('#input_dhcp_startip').val();
    var dhcpEndIPAddress = $('#input_dhcp_endip').val();
    var dhcpLeaseTime = $('#input_dhcp_leasetime').val();

    clearAllErrorLabel();
    if (!isValidIpAddress(dhcpIPAddresss))
    {
        showErrorUnderTextbox('input_dhcp_ipaddr', dialup_hint_ip_address_empty);
        $('#input_dhcp_ipaddr').focus();
        return false;
    }

	if (!isValidSubnetMask(dhcpLanNetmask))
    {
        showErrorUnderTextbox('input_dhcp_submark', dhcp_hint_subnet_mask_invalid);
        $('#input_dhcp_submark').focus();
        return false;
    }

    if (!isBroadcastOrNetworkAddress(dhcpIPAddresss, dhcpLanNetmask))
    {
        showErrorUnderTextbox('input_dhcp_ipaddr', dialup_hint_ip_address_empty);
        $('#input_dhcp_ipaddr').focus();
        return false;
    }
//enable DHCP server
    if (1 == dhcpStatus)
    {
        if ((!isValidIpAddress(dhcpStartIPAddress)) || (dhcpIPAddresss == dhcpStartIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_startip', dhcp_hint_start_ip_address_invalid);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if (!isBroadcastOrNetworkAddress(dhcpStartIPAddress, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_startip', dhcp_hint_start_ip_address_invalid);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if ((!isValidIpAddress(dhcpEndIPAddress)) || (dhcpIPAddresss == dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_endip', dhcp_hint_end_ip_address_invalid);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!isBroadcastOrNetworkAddress(dhcpEndIPAddress, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_endip', dhcp_hint_end_ip_address_invalid);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!isSameSubnetAddrs(dhcpStartIPAddress, dhcpIPAddresss, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_startip', dhcp_hint_start_ip_address_same_subnet);
            $('#input_dhcp_startip').focus();
            return false;
        }
        if (!isSameSubnetAddrs(dhcpEndIPAddress, dhcpIPAddresss, dhcpLanNetmask))
        {
            showErrorUnderTextbox('input_dhcp_endip', dhcp_hint_end_ip_address_same_subnet);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (!compareStartIpAndEndIp(dhcpStartIPAddress, dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_endip', dhcp_hint_end_ip_greater_start_ip);
            $('#input_dhcp_endip').focus();
            return false;
        }
        if (-1 != dhcpLeaseTime.indexOf('.'))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_integer);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if (true == isNaN(dhcpLeaseTime))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_number);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if ((0 == dhcpLeaseTime.indexOf('0')) && (0 != dhcpLeaseTime))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_invalid);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if ((dhcpLeaseTime < DHCP_MIN_LEASE_TIME) || (dhcpLeaseTime > DHCP_MAX_LEASE_TIME))
        {
            showErrorUnderTextbox('input_dhcp_leasetime', dhcp_hint_dhcp_lease_time_range);
            $('#input_dhcp_leasetime').focus();
            return false;
        }
        else if (isBetweenStartIPAndEndIP(dhcpIPAddresss, dhcpStartIPAddress, dhcpEndIPAddress))
        {
            showErrorUnderTextbox('input_dhcp_ipaddr', dhcp_message_ip_address_in_start_end);
            $('#input_dhcp_ipaddr').focus();
            return false;
        }
    }
    return true;
}

function onApply() {
    if (!isButtonEnable('apply'))
    {
        return;
    }
    if (verifyUserInput())
    {
		showConfirmDialog(dhcp_hint_operation_restart_device, postData, function() {});
    }
}


$(document).ready(function() {
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply', '1');
    });
    button_enable('apply', '0');

    $('#apply').click(function() {
        onApply();
    });

    initPageData();
});
