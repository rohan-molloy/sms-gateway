var g_wanlmacfilter_dataVlaue;
var WANLMACFILTER_FILTER_STATUS_DISABLED = 0;
var WANLMACFILTER_FILTER_STATUS_ALLOW = 1;
var WANLMACFILTER_FILTER_STATUS_DENY = 2;

var g_wlanmacfilert_filterStatusArray = [
[0, common_disable],
[1, wlan_label_allow],
[2, wlan_label_deny]
];

$(document).ready(function() {
	var i;
    button_enable('apply', '0');
    // init macfilter status options
    var options1 = document.getElementById('ssid1_select_service').options;
    var options2 = document.getElementById('ssid2_select_service').options;
    for (i = 0; i < g_wlanmacfilert_filterStatusArray.length; i++) {
        var curStatus = g_wlanmacfilert_filterStatusArray[i];
        options1.add(new Option(curStatus[1], curStatus[0]));
        options2.add(new Option(curStatus[1], curStatus[0]));
    }
    // Judgement if the mac filter can be edit
    $('#ssid1_mac_list :input').bind('input change cut paste keydown', function() {
        button_enable('apply', '1');

    });

    $('#ssid1_select_service').bind('change', function() {
        var ssids = ['ssid1'];
        var selectedStatus = $('#ssid1_select_service').val();
        wlanmacfilter_ssid1_setDisabled();
        $('.error_message').remove();

        if (selectedStatus == g_wanlmacfilter_dataVlaue[0].WifiMacFilterStatus)
        {
            setData(ssids);
            button_enable('apply', '0');
        }
        else
        {
            clearData(ssids);
            button_enable('apply', '1');
        }
    });
    $('#apply').click(function() {
        if (!isButtonEnable('apply')) {
            return;
        }
        wlanmacfilert_onApply();
    });
    // MULTI SSID
    if (g_module.multi_ssid_enabled) {
        $('#ssid1_name').show();
        $('#ssid2').show();
        $('#ssid2_select_service').bind('change', function() {
            var ssids = ['ssid2'];
            var selectedStatus = $('#ssid2_select_service').val();
            wlanmacfilter_ssid2_setDisabled();
            button_enable('apply', '1');
            $('.error_message').remove();

            if (selectedStatus == g_wanlmacfilter_dataVlaue[1].WifiMacFilterStatus)
            {
                setData(ssids);
                button_enable('apply', '0');
            }
            else
            {
                clearData(ssids);
                button_enable('apply', '1');
            }
        });
        $('#ssid2_mac_list :input').bind('input change cut paste keydown', function() {
            button_enable('apply', '1');
        });
        wlanmacfilter_multissid_initPage();
    }
    else {
        wlanmacfilter_initPage();
    }
});
// disable/enable MAC address FOR SSID1
function wlanmacfilter_ssid1_setDisabled() {
    var selectedStatus = $('#ssid1_select_service').val();
    if (selectedStatus == WANLMACFILTER_FILTER_STATUS_DISABLED) {
        $('#ssid1_mac_list :input').attr('disabled', 'disabled');
    }
    else {
        $('#ssid1_mac_list :input').removeAttr('disabled');
    }
}

// disable/enable MAC address FOR SSID2
function wlanmacfilter_ssid2_setDisabled() {
    var selectedStatus = $('#ssid2_select_service').val();
    if (selectedStatus == WANLMACFILTER_FILTER_STATUS_DISABLED) {
        $('#ssid2_mac_list :input').attr('disabled', 'disabled');
    }
    else {
        $('#ssid2_mac_list :input').removeAttr('disabled');
    }
}
function clearData(ssids)
{
    var i;
	for (i = 0; i < ssids.length; i++) {
		$('#'+ ssids[i] + '_input_WifiMacFilterMac0').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac1').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac2').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac3').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac4').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac5').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac6').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac7').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac8').val('');
		$('#'+ ssids[i] + '_input_WifiMacFilterMac9').val('');
	}
}

function setData(ssids)
{
    var i;
    for (i = 0; i < ssids.length; i++) {
        $('#'+ ssids[i] + '_input_WifiMacFilterMac0').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac0);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac1').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac1);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac2').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac2);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac3').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac3);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac4').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac4);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac5').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac5);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac6').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac6);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac7').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac7);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac8').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac8);
        $('#'+ ssids[i] + '_input_WifiMacFilterMac9').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac9);

        //bind selected item for filter status
	if(($.browser.msie) && ($.browser.version == 6.0))
	{
	    if(i == 0)
		{
			setTimeout(function() {
				$('#'+ ssids[0] + '_select_service').val(g_wanlmacfilter_dataVlaue[0].WifiMacFilterStatus);
			}, 1);
		}
		else
		{
			setTimeout(function() {
				$('#'+ ssids[1] + '_select_service').val(g_wanlmacfilter_dataVlaue[1].WifiMacFilterStatus);
			}, 1);
		}
	}
    else
	{
		$('#'+ ssids[i] + '_select_service').val(g_wanlmacfilter_dataVlaue[i].WifiMacFilterStatus); 
	}	
    }
}
function wlanmacfilter_initPage() {
	var ssids = ['ssid1'];
	var temp = [];
    getAjaxData('api/wlan/mac-filter', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type) {
		    temp.push(ret.response);
            g_wanlmacfilter_dataVlaue = temp;
			setData(ssids);
			if(($.browser.msie) && ($.browser.version == 6.0))
			{
				setTimeout(function() {
					wlanmacfilter_ssid1_setDisabled();
				}, 1);
			}
			else
			{
			    wlanmacfilter_ssid1_setDisabled();
			}
        }
    });
}

function wlanmacfilter_multissid_initPage() {
    var ssids = ['ssid1', 'ssid2'];
    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wanlmacfilter_dataVlaue = ret.response.Ssids.Ssid;
	    setData(ssids);
		if(($.browser.msie) && ($.browser.version == 6.0))
		{
			setTimeout(function() {
				wlanmacfilter_ssid1_setDisabled();
			}, 1);
			setTimeout(function() {
				wlanmacfilter_ssid2_setDisabled();
			}, 1);
		}
		else
		{
			wlanmacfilter_ssid1_setDisabled();
			wlanmacfilter_ssid2_setDisabled();
		}
    });
}

// validate format of mac address
function wlanmacfilter_isValidMacAddress(macAddress) {
    macAddress = macAddress.toLowerCase();
    var c = 0;
    var i = 0, j = 0;

    if ('ff:ff:ff:ff:ff:ff' == macAddress || '00:00:00:00:00:00' == macAddress) {
        return false;
    }

    var addrParts = macAddress.split(':');
    if (addrParts.length != 6) {
        return false;
    }
    for (i = 0; i < 6; i++) {
        if (addrParts[i].length != 2) {
            return false;
        }

        for (j = 0; j < addrParts[i].length; j++) {
            c = addrParts[i].charAt(j);
            if ((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f')) {
                continue;
            }
            else {
                return false;
            }
        }
    }

    c = parseInt(addrParts[0].charAt(1), 16);
    if (c % 2)/*the first number of mac address must be even*/
    {
        return false;
    }

    return true;
}

function wlanmacfilert_checkAllMac(ssid) {
    var checkResult = true;
    var emptyMacCount = 0;
    $('#'+ ssid + '_mac_list :input').each(function(i) {
        if ((($.trim($(this).val()).length > 0) && (!wlanmacfilter_isValidMacAddress($(this).val())))
        || (0 == $.trim($(this).val()).length && $(this).val().length > 0)) {
            $(this).focus();
            showErrorUnderTextbox(ssid + '_input_WifiMacFilterMac' + i, wlan_hint_mac_address_invalid);
            checkResult = false;
        }
        else if (0 == $(this).val().length) {
            emptyMacCount++;
        }
    });
    if (10 == emptyMacCount) {
        var macFilterStatus = $('#'+ ssid + '_select_service').val();
        if (WANLMACFILTER_FILTER_STATUS_DISABLED != macFilterStatus) {
            showInfoDialog(wlan_hint_mac_address_invalid);
            $('#'+ ssid + '_input_WifiMacFilterMac0').focus();
            checkResult = false;
        }
    }
    return checkResult;
}

function wlanmacfilert_onApply() {
    clearAllErrorLabel();

    //function for check all mac address
    if (wlanmacfilert_checkAllMac('ssid1')) {
        if (g_module.multi_ssid_enabled) {
            if (wlanmacfilert_checkAllMac('ssid2')) {
                showConfirmDialog(firewall_hint_submit_list_item, multissid_postData, function() {
                });
            }
        }
        else {
            showConfirmDialog(firewall_hint_submit_list_item, postData, function() {
            });
        }
    }
}

function getData(ssids) {
   var i = 0;
   for (i = 0; i < ssids.length; i++)
   {
   g_wanlmacfilter_dataVlaue[i].WifiMacFilterStatus = $('#'+ ssids[i] + '_select_service').val();
   if ($('#'+ ssids[i] + '_select_service').val() == WANLMACFILTER_FILTER_STATUS_DISABLED)
	{
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac0 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac1 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac2 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac3 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac4 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac5 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac6 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac7 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac8 = '';
		g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac9 = '';

    }
	else
	{
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac0 = $('#'+ ssids[i] + '_input_WifiMacFilterMac0').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac1 = $('#'+ ssids[i] + '_input_WifiMacFilterMac1').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac2 = $('#'+ ssids[i] + '_input_WifiMacFilterMac2').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac3 = $('#'+ ssids[i] + '_input_WifiMacFilterMac3').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac4 = $('#'+ ssids[i] + '_input_WifiMacFilterMac4').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac5 = $('#'+ ssids[i] + '_input_WifiMacFilterMac5').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac6 = $('#'+ ssids[i] + '_input_WifiMacFilterMac6').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac7 = $('#'+ ssids[i] + '_input_WifiMacFilterMac7').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac8 = $('#'+ ssids[i] + '_input_WifiMacFilterMac8').val();
        g_wanlmacfilter_dataVlaue[i].WifiMacFilterMac9 = $('#'+ ssids[i] + '_input_WifiMacFilterMac9').val();
	}
   }
}

function postData() {
	var ssids = ['ssid1'];
    getData(ssids);
    var newXmlString = object2xml('request', g_wanlmacfilter_dataVlaue[0]);
    saveAjaxData('api/wlan/mac-filter', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        }
        else {
            wlanmacfilter_initPage();
        }
    });
}

function multissid_postData() {
    var ssids = ['ssid1', 'ssid2'];
	getData(ssids);
    var postData = {
        Ssids: {
            Ssid: g_wanlmacfilter_dataVlaue
        },
        WifiRestart: 1
    };
    var newXmlString = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', newXmlString, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            showInfoDialog(common_success);
            button_enable('apply', '0');
        }
        else {
            wlanmacfilter_multissid_initPage();
        }
    });
}
