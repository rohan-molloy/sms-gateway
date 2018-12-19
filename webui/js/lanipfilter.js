var LAN_IP_FILTER_NUM = 16;
var ok_flag = 0;
var add_flag = 0;

var protocolStatusArray = [
    [PROTOCOL_BOTH, firewall_label_tcp_or_udp],
    [PROTOCOL_TCP, firewall_label_tcp],
    [PROTOCOL_UDP, firewall_label_udp],
    [PROTOCOL_IMCP, firewall_label_imcp]
];

var filterStatusArray = [
    [FILTER_DISABLED, common_off],
    [FILTER_ENABLED, common_on]
];

var g_source_num = 0;
var firewall_status = null;
function addLanipFilter(insertNode){
    var addLine = null;
    var i = 1;
    addLine = "<tr class=\"user_add_line\">";
    for ( i = 1; i < arguments.length; i++ ) 
    {
        addLine += "<td>" + arguments[i] + "</td>";
    }
    addLine += "<td class='user_options'><span class=\"button_edit_list\">" + common_edit + "</span>&nbsp;&nbsp;<span class=\"button_ipfilter_delete_list\">" + common_delete + "</span></td></tr>";
    
    var currentTrTotal = $(insertNode).size();
    $(insertNode).eq(currentTrTotal - 2).after(addLine);
}
function ipTranApply(ipaddr)
{
    var ipout = [];
    var ipoutstring = '';
    var idx = 0;
    if (ipaddr == null || ipaddr == undefined || ipaddr == '')
    {
        return '';
    }

    ipout = ipaddr.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (idx = 3; idx >= 0; idx--)
        {
            if (ipout[idx] == '*')
            {
                ipout[idx] = '0';
            }
            else
            {
                break;
            }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}

function ipTranGet(ipAddress, num)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    if (null == ipAddress || undefined == ipAddress || '' == ipAddress)
    {
        return '';
    }

    ipout = ipAddress.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
            if ('0' == ipout[i])
            {
                if (num > 0)
                {
                    ipout[i] = '*';
                    num--;
                }
                else
                {
                    break;
                }
            }
            else
            {
                break;
            }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}


function ipGetMaskNum(ipAddress)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    var ipaddNum = 0;
    if (null == ipAddress || undefined == ipAddress || '' == ipAddress)
    {
        return '';
    }

    ipout = ipAddress.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
            if (ipout[i] == '*')
            {
                ipaddNum++;
            }
            else
            {
                break;
            }
        }
    }
    return ipaddNum;
}

function sourceIpTranApplyValid(ipaddr)
{
    var ipout = [];
    var ipoutstring = '';
    var i = 0;
    if (ipaddr == null || ipaddr == undefined || ipaddr == '')
    {
        return '';
    }

    ipout = ipaddr.split('.');
    if (ipout.length != 4)
    {
        return '';
    }
    else
    {
        for (i = 3; i > -1; i--)
        {
        if (ipout[i] == '*')
        {
                    ipout[i] = '0';
        }
        else
        {
            break;
        }
        }
    }
    ipoutstring = ipoutstring.concat(ipout[0], '.', ipout[1], '.', ipout[2], '.', ipout[3]);
    return ipoutstring;
}

function isValidIpAddressForIPFilter(address) 
{
    var addrParts = address.split('.');
    if (addrParts.length != 4)
    {
        return false;
    }

    for (i = 0; i < 4; i++)
    {
        if ((addrParts[i] == '*') && (i != 3))
        {
        if (addrParts[i + 1] != '*')
        {
            return false;
        }
        }
        if (true == (isNaN(addrParts[i])) && (addrParts[i] != '*'))
        {
            return false;
        }

        if ('' == addrParts[i])
        {
            return false;
        }

        if (addrParts[i].indexOf(' ') != -1)
        {
            return false;
        }

        if ((0 == addrParts[i].indexOf('0')) && (1 != addrParts[i].length))
        {
            return false;
        }
    }

    if ((addrParts[0] <= 0 || addrParts[0] == 127 || addrParts[0] > 223) ||
    (addrParts[1] < 0 || addrParts[1] > 255) ||
    (addrParts[2] < 0 || addrParts[2] > 255) ||
    (addrParts[3] < 0 || addrParts[3] >= 255))
    {
        return false;
    }

    return true;
}

function checkIpPort(value, name)
{
	if ('' == value )
	{
		showQtip(name, firewall_hint_port_empty);
		return false;
	}
	else if (!(isVaildPortForIPFilter(value, name)))
	{
		return false;
	}
	return true;
}
function isVaildValue()
{
    $.each($('.qtip-defaults'), function() {
        $(this).remove();
    });

    var lanIPFilterLanAddress = $.trim($('#input_lan_ip_address').val());
    var lanIPFilterLanPort = $.trim($('#input_lan_ip_port').val());
    var lanIPFilterWanAddress = $.trim($('#input_wan_ip_address').val());
    var lanIPFilterWanPort = $.trim($('#input_wan_ip_port').val());
    if ('0' != g_config_firewall.lanipfilter.lan_enable)
    {
        if ('' == lanIPFilterLanAddress ||
        !isValidIpAddressForIPFilter(lanIPFilterLanAddress) ||
        lanIPFilterLanAddress == dhcpLanIPAddress ||
        !isSameSubnetAddrs(sourceIpTranApplyValid(lanIPFilterLanAddress), dhcpLanIPAddress, dhcpLanNetmask)
        )
        {
            showQtip('input_lan_ip_address', dialup_hint_ip_address_empty);
            return false;
        }
    
        if(!($('#select_protocol_status').val()==1)){
			if(!(checkIpPort(lanIPFilterLanPort, 'input_lan_ip_port')))
			{
				return false;
			}
	}
    }
    if ('0' != g_config_firewall.lanipfilter.wan)
    {
        if ('' == lanIPFilterWanAddress ||
        !isValidIpAddressForIPFilter(lanIPFilterWanAddress)
        )
        {
            showQtip('input_wan_ip_address', dialup_hint_ip_address_empty);
            return false;
        }
        if(!($('#select_protocol_status').val()==1)){
			if(!(checkIpPort(lanIPFilterWanPort, 'input_wan_ip_port')))
			{
				return false;
			}
	}
    }

    return true;
}

function initPage() {
    button_enable('apply', '0');

    $('.user_add_line').remove();
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            firewall_status = ret.response;
        }
    }, {
        sync: true
    });
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            dhcpPageVar = ret.response;
            initDhcp();
        }
    });
    getAjaxData('api/security/lan-ip-filter', function($xml) {
        var ret = xml2object($xml);
        var filters = ret.response.IPFilters.IPFilter;
        var lanPort;
        var wanPort;
        var protocolStatus;
        var filterStatus;
        var lastFilter;

        if (filters) {
            if (filters.length >= LAN_IP_FILTER_NUM)
            {
                button_enable('add_item', '0');
            }

            if ($.isArray(filters)) {
                $(filters).each(function(i) {
                    lanPort = portJoin(filters[i].LanIPFilterLanStartPort, filters[i].LanIPFilterLanEndPort);
                    wanPort = portJoin(filters[i].LanIPFilterWanStartPort, filters[i].LanIPFilterWanEndPort);

                    protocolStatus = getDArrayElement(protocolStatusArray, filters[i].LanIPFilterProtocol, 'value');
                    filterStatus = getDArrayElement(filterStatusArray, filters[i].LanIPFilterStatus, 'value');

                    if ('0' == g_config_firewall.lanipfilter.wan)
                    {
                        addLanipFilter(
                            $('#service_list tr'),
                            ipTranGet(filters[i].LanIPFilterLanStartAddress, filters[i].LanIPFilterSrcStartIPMask),
                            lanPort,
                            protocolStatus,
                            filterStatus
                        );
                    }
                    else if ('0' == g_config_firewall.lanipfilter.lan_enable)
                    {
                        addLanipFilter(
                            $('#service_list tr'),
                            ipTranGet(filters[i].LanIPFilterWanStartAddress, filters[i].LanIPFilterDestStartIPMask),
                            wanPort,
                            protocolStatus,
                            filterStatus
                        );
                    }
                    else
                    {
                        addLanipFilter(
                            $('#service_list tr'),
                            ipTranGet(filters[i].LanIPFilterLanStartAddress, filters[i].LanIPFilterSrcStartIPMask),
                            lanPort,
                            ipTranGet(filters[i].LanIPFilterWanStartAddress, filters[i].LanIPFilterDestStartIPMask),
                            wanPort,
                            protocolStatus,
                            filterStatus
                        );
                    }
                });

                lastFilter = filters[filters.length - 1];

            }
            else
            {
                lanPort = portJoin(filters.LanIPFilterLanStartPort, filters.LanIPFilterLanEndPort);
                wanPort = portJoin(filters.LanIPFilterWanStartPort, filters.LanIPFilterWanEndPort);

                protocolStatus = getDArrayElement(protocolStatusArray, filters.LanIPFilterProtocol, 'value');
                filterStatus = getDArrayElement(filterStatusArray, filters.LanIPFilterStatus, 'value');

                if ('0' == g_config_firewall.lanipfilter.wan)
                {
                    addLanipFilter(
                        $('#service_list tr'),
                        ipTranGet(filters.LanIPFilterLanStartAddress, filters.LanIPFilterSrcStartIPMask),
                        lanPort,
                        protocolStatus,
                        filterStatus
                    );
                }
                else if ('0' == g_config_firewall.lanipfilter.lan_enable)
                {
                    addLanipFilter(
                        $('#service_list tr'),
                        ipTranGet(filters.LanIPFilterWanStartAddress, filters.LanIPFilterDestStartIPMask),
                        wanPort,
                        protocolStatus,
                        filterStatus
                    );
                }
                else
                {
                    addLanipFilter(
                        $('#service_list tr'),
                        ipTranGet(filters.LanIPFilterLanStartAddress, filters.LanIPFilterSrcStartIPMask),
                        lanPort,
                        ipTranGet(filters.LanIPFilterWanStartAddress, filters.LanIPFilterDestStartIPMask),
                        wanPort,
                        protocolStatus,
                        filterStatus
                    );
                }

                lastFilter = filters;
            }

            $('#input_lan_ip_address').val(lastFilter.LanIPFilterLanStartAddress);
            $('#input_lan_ip_port').val(lanPort);
            $('#input_wan_ip_address').val(lastFilter.LanIPFilterWanStartAddress);
            $('#input_wan_ip_port').val(wanPort);
        }
        if (firewall_status != null && firewall_status.FirewallMainSwitch == 0) {
            button_enable('add_item', '0');
            $('#service_list').attr('disabled', true);
            showInfoDialog(IDS_security_message_firewall_disabled);
            return false;
        }
        if (firewall_status != null &&
        firewall_status.FirewallIPFilterSwitch == 0) {
            button_enable('add_item', '0');
            $('#service_list').attr('disabled', true);
            showInfoDialog(IDS_security_message_ip_address_disabled);
        }
    });
}

function lanIPFilter_getConfig() {
	LAN_IP_FILTER_NUM = parseInt(g_config_firewall.lanipfilter.number,10);
	if ('0' == g_config_firewall.lanipfilter.wan)
	{
		$('.wan_th').hide();
	}
	else
	{
		$('.wan_th').show();
	}
	
	if ('0' == g_config_firewall.lanipfilter.lan_enable)
	{
		$('.lan_th').hide();
	}
	else
	{
		$('.lan_th').show();
	}
	
	if ('0' == g_config_firewall.lanipfilter.protocol_imcp)
	{
	   
		protocolStatusArray = [ [PROTOCOL_BOTH, firewall_label_tcp_or_udp],
								[PROTOCOL_TCP, firewall_label_tcp],
								[PROTOCOL_UDP, firewall_label_udp]];
	}
}

function checkBeforPostData() {
    var ret = true;
    $('.user_add_line').each(function(i) {
        var wanIp = "";
        if('0' != g_config_firewall.lanipfilter.lan_enable)
        {
            wanIp = ipTranApply($(this).children().eq(2).text());
        }
        else
        {
            wanIp = ipTranApply($(this).children().eq(0).text());
        }
	    
		if("" == wanIp)
		{
			showInfoDialog(dialup_hint_ip_address_empty); 
            ret = false;
		}
	});
	return ret;
}
$(document).ready(function() {
    lanIPFilter_getConfig();
    initPage();
    var currentAllVal = null;
    var editIndex = null;
	var editWanIpAddr = null;
	var editWanPort = null;
	var editProtocol = null;
	var editStatus = null;
    $('.button_edit_list').live('click', function() {
        if ((($(".add_item_control:hidden").size() > 0) && ($('#edit_item_ok').size() < 1)) 
		   && ((firewall_status != null && firewall_status.FirewallMainSwitch == 1) && (firewall_status != null && firewall_status.FirewallIPFilterSwitch == 1))) {
            editIndex = $('.button_edit_list').index(this);
            // save the value before user edit
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            var editLanIpFilter = $(this).parent().siblings();
            if('0' != g_config_firewall.lanipfilter.lan_enable)
            {
                var editLanIpAddr = editLanIpFilter.eq(0);
                var editLanPort = editLanIpFilter.eq(1);
                if('0' != g_config_firewall.lanipfilter.wan)
                {
                    editWanIpAddr = editLanIpFilter.eq(2);
                    editWanPort = editLanIpFilter.eq(3);
                    editProtocol = editLanIpFilter.eq(4);
                    editStatus = editLanIpFilter.eq(5);
                }
                else
                {
                    editProtocol = editLanIpFilter.eq(2);
                    editStatus = editLanIpFilter.eq(3);
                }
                
            }
            else
			{
                editWanIpAddr = editLanIpFilter.eq(0);
                editWanPort = editLanIpFilter.eq(1);
                editProtocol = editLanIpFilter.eq(2);
                editStatus = editLanIpFilter.eq(3);
			}

            var htmlProtocol = editProtocol.html();
            var htmlStatus = editStatus.html();
            if ('0' != g_config_firewall.lanipfilter.lan_enable)
            {
                editLanIpAddr.html('<input type="text" value="' + editLanIpAddr.html() + '" id="input_lan_ip_address"></td>');
                editLanPort.html('<input type="text" value="' + editLanPort.html() + '" id="input_lan_ip_port"></td>');
            }
            if ('0' != g_config_firewall.lanipfilter.wan)
            {
                editWanIpAddr.html('<input type="text" value="' + editWanIpAddr.html() + '" id="input_wan_ip_address"></td>');
                editWanPort.html('<input type="text" value="' + editWanPort.html() + '" id="input_wan_ip_port"></td>');
            }

            createSelect(editProtocol, 'select_protocol_status', protocolStatusArray);
            createSelect(editStatus, 'select_status', filterStatusArray);

            $('#select_protocol_status').val(getDArrayElement(protocolStatusArray, htmlProtocol, 'key'));
            $('#select_status').val(getDArrayElement(filterStatusArray, htmlStatus, 'key'));

            $(this).parent().html('<a id="edit_item_ok" href="javascript:void(0);">' + common_ok +
            '</a>&nbsp;&nbsp;<a id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');

            hideAddItemControl();
            $('.user_add_line input').eq(0).focus();
			if($('#select_protocol_status').val()==1)
		    {
                $('#input_lan_ip_port').val('');
			    $('#input_wan_ip_port').val('');
                $('#input_lan_ip_port').attr('disabled', 'disabled');
                $('#input_wan_ip_port').attr('disabled', 'disabled');
            }
            var a=$(editLanPort.html()).val();
            var b=$(editWanPort.html()).val();
            $('#select_protocol_status').change(function(){
                if($('#select_protocol_status').val()==1)
			    {
                    $('#input_lan_ip_port').val('');
                    $('#input_wan_ip_port').val('');
                    $('#input_lan_ip_port').attr('disabled', 'disabled');
                    $('#input_wan_ip_port').attr('disabled', 'disabled');
                }
                else
			    {
                    $('#input_lan_ip_port').removeAttr('disabled');
                    $('#input_wan_ip_port').removeAttr('disabled');
                    $('#input_lan_ip_port').val(a);
                    $('#input_wan_ip_port').val(b);
                }
               });
            $('#edit_item_cancel').live('click', function() {
                $('.user_add_line').eq(editIndex).html(currentAllVal);
				$('.qtip').qtip('destroy');
				if (!isButtonEnable('add_item'))
				{
		            button_enable('add_item', '1');
					if((1 == ok_flag) || (1 == add_flag))
					{
					    button_enable('apply', '1');
					}
				}
				if ($('.user_add_line').length >= LAN_IP_FILTER_NUM)
				{
					button_enable('add_item', '0');
				}
            });
			$('#add_item').live('click', function() {
				if (isButtonEnable('add_item'))
				{
					$('.user_add_line').eq(editIndex).html(currentAllVal);
					$('.qtip').qtip('destroy');
				}	
            });
       
		button_enable('apply', '0');
		button_enable('add_item', '0');			
        }

    });

    $('#edit_item_ok').live('click', function() {
        if (isVaildValue()) {
            var lanAddress = $.trim($('#input_lan_ip_address').val());
            var lanPort = $.trim($('#input_lan_ip_port').val());
            var wanAddress = $.trim($('#input_wan_ip_address').val());
            var wanPort = $.trim($('#input_wan_ip_port').val());
            var serviceOption = $('#select_protocol_status option:selected').text();
            var statusOption = $('#select_status option:selected').text();
            
            hideAddItemControl();
            var editLanIpFilter = $(this).parent().siblings();
            if ('0' != g_config_firewall.lanipfilter.lan_enable)
            {
                editLanIpFilter.eq(0).html(lanAddress);
                editLanIpFilter.eq(1).html(lanPort);
                if('0' != g_config_firewall.lanipfilter.wan)
                {
                    editLanIpFilter.eq(2).html(wanAddress);
                    editLanIpFilter.eq(3).html(wanPort);
                    editLanIpFilter.eq(4).html(serviceOption);
                    editLanIpFilter.eq(5).html(statusOption);
                }
                else
                {
                    editLanIpFilter.eq(2).html(serviceOption);
                    editLanIpFilter.eq(3).html(statusOption);
                }
                
            }
            else 
            {
                editLanIpFilter.eq(0).html(wanAddress);
                editLanIpFilter.eq(1).html(wanPort);
                editLanIpFilter.eq(2).html(serviceOption);
                editLanIpFilter.eq(3).html(statusOption);
            }
	

            $(this).parent().html('<span class=\"button_edit_list\">' + common_edit +
            '</span>&nbsp;&nbsp;<span class=\"button_ipfilter_delete_list\">' + common_delete + '</span>');

            currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply', '1');
			button_enable('add_item', '1');
			ok_flag = 1;
			if ($('.user_add_line').length >= LAN_IP_FILTER_NUM)
            {
                button_enable('add_item', '0');
            }
        }
    });

    $('#add_item_ok').live('click', function() {
        if (isVaildValue())
        {
            var lanAddress = $.trim($('#input_lan_ip_address').val());
            var lanPort = $.trim($('#input_lan_ip_port').val());
            var wanAddress = $.trim($('#input_wan_ip_address').val());
            var wanPort = $.trim($('#input_wan_ip_port').val());
            var serviceOption = $('#select_protocol_status option:selected').text();
            var statusOption = $('#select_status option:selected').text();

            hideAddItemControl();

        if ('0' == g_config_firewall.lanipfilter.wan)
        {
            addLanipFilter($('#service_list tr'), lanAddress, lanPort, serviceOption, statusOption);
        }
        else if('0' == g_config_firewall.lanipfilter.lan_enable)
        {
            addLanipFilter($('#service_list tr'), wanAddress, wanPort, serviceOption, statusOption);
        }
        else
        {
            addLanipFilter($('#service_list tr'), lanAddress, lanPort, wanAddress, wanPort, serviceOption, statusOption);
        }

            button_enable('apply', '1');

            if ($('.user_add_line').length >= LAN_IP_FILTER_NUM)
            {
                button_enable('add_item', '0');
            }
        add_flag = 1; 
        }
        return false;
    });

    //hide add item control
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
		if((1 == add_flag) || (1 == ok_flag))
		{
			button_enable('apply', '1');
		}
        return false;
    });

    //show add item control
    $('#add_item').click(function() {
        if (isButtonEnable('add_item'))
        {
            showAddItemControl();
            $('.add_item_control input').eq(0).focus();
			button_enable('apply', '0');
			$('#input_lan_ip_address').removeAttr('disabled');
		    $('#input_lan_ip_port').removeAttr('disabled');
		    $('#input_wan_ip_address').removeAttr('disabled');
		    $('#input_wan_ip_port').removeAttr('disabled');
		    $('#input_lan_ip_address').val('');
		    $('#input_lan_ip_port').val('');
		    $('#input_wan_ip_address').val('');
		    $('#input_wan_ip_port').val('');
		    $('#select_protocol_status').val('0');
		    $('#select_status').val('0');
        }
    });
	//if there hasn't any add or delete button it won't work
	$(".button_ipfilter_delete_list").live("click", function(){
		if($(".add_item_control:hidden").size() > 0 && $("#edit_item_ok").size() < 1
		&& ((firewall_status != null && firewall_status.FirewallMainSwitch == 1) && (firewall_status != null && firewall_status.FirewallIPFilterSwitch == 1))){
			var deleteIndex = $(".button_ipfilter_delete_list").index(this);
			call_dialog(common_delete, firewall_hint_delete_list_item, common_ok, "pop_OK", common_cancel, "pop_Cancel");
			$("#pop_OK").click(function(){
				deleteFilter(deleteIndex, $(".user_add_line"));
				clearDialog();
				button_enable("apply", "1");
				button_enable("add_item", "1");
			});
		}
	});
    function postData() {
        var submitObject = {};
        var IPFilterArray = [];

        $('.user_add_line').each(function(i) {
            var lanPort = '';
            var wanPort = ['', ''];
            var lanIp = '';
            var wanIp = '';
            var lanIpMask = '';
            var wanIpMask = '';
            var submitServerProtocol = getDArrayElement(protocolStatusArray, $(this).children().eq(4).text(), 'key');
            var submitServerStatus = getDArrayElement(filterStatusArray, $(this).children().eq(5).text(), 'key');
            if ('0' == g_config_firewall.lanipfilter.lan_enable)
            {
                lanPort = portPartsParse('1-65535');
                lanIp = '0.0.0.0';
                lanIpMask = '4';
                wanPort = portPartsParse($(this).children().eq(1).text());
                wanIp = ipTranApply($(this).children().eq(0).text());
                wanIpMask = ipGetMaskNum($(this).children().eq(0).text());
                submitServerProtocol = getDArrayElement(protocolStatusArray, $(this).children().eq(2).text(), 'key');
                submitServerStatus = getDArrayElement(filterStatusArray, $(this).children().eq(3).text(), 'key');
            }
            else
            {
                lanIp = ipTranApply($(this).children().eq(0).text());
                lanIpMask = ipGetMaskNum($(this).children().eq(0).text());
                lanPort = portPartsParse($(this).children().eq(1).text());
                if('1' == g_config_firewall.lanipfilter.wan)
                {
                    wanIp = ipTranApply($(this).children().eq(2).text());
                    wanIpMask = ipGetMaskNum($(this).children().eq(2).text());
                    wanPort = portPartsParse($(this).children().eq(3).text());
                    submitServerProtocol = getDArrayElement(protocolStatusArray, $(this).children().eq(4).text(), 'key');
                    submitServerStatus = getDArrayElement(filterStatusArray, $(this).children().eq(5).text(), 'key');
                }
                else
                {
                    submitServerProtocol = getDArrayElement(protocolStatusArray, $(this).children().eq(2).text(), 'key');
                    submitServerStatus = getDArrayElement(filterStatusArray, $(this).children().eq(3).text(), 'key');
                }
            }


            var filter = {
                LanIPFilterProtocol: submitServerProtocol,
                LanIPFilterStatus: submitServerStatus,
                LanIPFilterLanStartAddress: lanIp,
                LanIPFilterLanEndAddress: '',
                LanIPFilterLanStartPort: lanPort[0],
                LanIPFilterLanEndPort: lanPort[1],
                LanIPFilterWanStartAddress: wanIp,
                LanIPFilterWanEndAddress: '',
                LanIPFilterWanStartPort: wanPort[0],
                LanIPFilterWanEndPort: wanPort[1],
                LanIPFilterSrcStartIPMask: lanIpMask,
                LanIPFilterDestStartIPMask: wanIpMask,
                LanIPFilterPolicy: '0'
            };
            IPFilterArray.push(filter);
        });

        submitObject = {
            IPFilters: {
                IPFilter: IPFilterArray
            }
        };
        var submitData = object2xml('request', submitObject);

        saveAjaxData('api/security/lan-ip-filter', submitData, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(common_success);
                button_enable('apply', '0');
            }
            else {
                initPage();
            }
        });
    }

    $('#apply').click(function() {
        if (isButtonEnable('apply')) {
		    if ('1' == g_config_firewall.lanipfilter.wan)
			{
				if(checkBeforPostData())
				{
                    showConfirmDialog(firewall_hint_submit_list_item, postData);
                }
				else
				{
					button_enable('apply', '0');
				}
            }
			else
			{
			    showConfirmDialog(firewall_hint_submit_list_item, postData);
			}	
        }			
        ok_flag = 0;
        add_flag = 0;		
    });

    initSelectOption('select_protocol_status', protocolStatusArray);
    initSelectOption('select_status', filterStatusArray);
	$('#select_protocol_status').change(function(){
        if($('#select_protocol_status').val()==1)
		{
        $('#input_lan_ip_port').val('');
        $('#input_wan_ip_port').val('');
        $('#input_lan_ip_port').attr('disabled', 'disabled');
        $('#input_wan_ip_port').attr('disabled', 'disabled');
        }
        else
		{
        $('#input_lan_ip_port').removeAttr('disabled');
        $('#input_wan_ip_port').removeAttr('disabled');
        $('#input_lan_ip_port').val('');
        $('#input_wan_ip_port').val('');
        }
    });
});


