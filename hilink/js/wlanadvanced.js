// JavaScript Document
/****************************************************wlanadvanced (start)************************************/
var WLAN_CHANNEL_AUTO = '0';
var g_wlan_basicSetting = ''; //Data of WiFi Basic Setting

function wlanadvanced_initChannel(channel_max) {
    $('#select_WifiChannel').unbind('click');
    $('#select_WifiChannel').empty();
    $('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
    var i = 0;
    for (i = 1; i <= channel_max; i++)
    {
        $('#select_WifiChannel').append('<option value=' + i + '>' + i + '</option>');
    }
}

function wifiCountry_channel(country) {
    $.each(countryArray, function(n, value)
    {
       if (value[0] == country)
         {
            wlanadvanced_initChannel(value[1]);
            if ($('#select_WifiChannel').val() > value[1])
            {
                $('#select_WifiChannel').val(WLAN_CHANNEL_AUTO);
            }
            return;
         }
    });
}

function wlanadvanced_initCountry() {
    $('#select_WifiChannel').unbind('click');
    $('#select_WifiCountry').empty();
    var i = 0;
    for (i = 0; i < countryArray.length; i++)
    {
        $('#select_WifiCountry').append('<option value=' + countryArray[i][0] + '>' + countryArray[i][2] + '</option>');
    }
}

function wlanadvanced_initCountry_for_Idevice() {
    var $countryList = $('#select_WifiCountry_for_Idevice')[0].options;
    $.each(countryArray, function(n, value)
    {
        $countryList.add(new Option(value[2], value[0]));
    });
}

function wlanadvanced_ifWifioffenable(enable) {
    var disable = '';
    ('0' == enable) ? disable = 'disabled' : disable = '';
    $('#select_WifiAutooffTime').attr('disabled', disable);
}

function setDataToComponentIE6()
{        	
	// set wifi channel
	setTimeout(function() {
		$('#select_WifiChannel').val( g_wlan_basicSetting.WifiChannel );
	}, 1);

	// set wifi Mode
	setTimeout(function() {
		$('#select_WifiMode').val( g_wlan_basicSetting.WifiMode );
	}, 1);

	// set wifi Isolate        
	if( g_module.multi_ssid_enabled )
	{
		setTimeout(function() {
			$('#select_WifiIsolate_between').val( g_wlan_basicSetting.WifiIsolationBetween );
		}, 1);
	}
	else
	{
		setTimeout(function() {
			$('#select_WifiIsolate_between').val( g_wlan_basicSetting.WifiIsolate );
		}, 1);
	}

	//set wifi wifioffenable
	setTimeout(function() {
		$('#select_WifiAutooffStatus').val( g_wlan_basicSetting.Wifioffenable );
	}, 1);
	setTimeout(function() {
		$('#select_WifiAutooffTime').val( g_wlan_basicSetting.Wifiofftime );
	}, 1);
	setTimeout(function() {
	    wlanadvanced_ifWifioffenable(g_wlan_basicSetting.Wifioffenable);
	}, 1);
}

function wlanadvanced_initPage() {
    if ($.browser.ipad)
    {
        $('#select_WifiCountry_for_Idevice').show();
        wlanadvanced_initCountry_for_Idevice();
    }
    else
    {
        $('#select_WifiCountry').show();
        wlanadvanced_initCountry();
    }
    var strUrl = 'api/wlan/basic-settings';

    if (g_module.multi_ssid_enabled)
    {
        strUrl = 'api/wlan/multi-security-settings';
    }

    getAjaxData(strUrl, function($xml) {
        var ret = xml2object($xml);
        if (ret.type != 'response')
        {
            return;
        }
        g_wlan_basicSetting = ret.response;

        // set country
        if ($.browser.ipad)
        {
        		setTimeout(function() {
					$('#select_WifiCountry_for_Idevice').val(g_wlan_basicSetting.WifiCountry);
				}, 1);
                var country = g_wlan_basicSetting.WifiCountry;

                wifiCountry_channel(country);

                $('#select_WifiCountry_for_Idevice').bind('change', function()
                {
                    country = $('#select_WifiCountry_for_Idevice').val();
                    wifiCountry_channel(country);
                    button_enable('apply_button', '1');
                });
        }
        else
        {
                var i = 0;
                setTimeout(function() {
					$('#select_WifiCountry').val(g_wlan_basicSetting.WifiCountry);
				}, 1);
                for (i = 0; i < countryArray.length; i++)
                {
                    if (countryArray[i][0] == g_wlan_basicSetting.WifiCountry)
                    {
                        wlanadvanced_initChannel(countryArray[i][1]);
                        break;
                    }
                }
        }
		if(($.browser.msie) && ($.browser.version == 6.0))
		{
			setDataToComponentIE6();
		}
		else
		{	
			// set wifi channel
			$('#select_WifiChannel').val(g_wlan_basicSetting.WifiChannel);

			// set wifi Mode
			$('#select_WifiMode').val(g_wlan_basicSetting.WifiMode);

			// set wifi Isolate
			if (g_module.multi_ssid_enabled)
			{
				$('#select_WifiIsolate_between').val(g_wlan_basicSetting.WifiIsolationBetween);
			}
			else
			{
				$('#select_WifiIsolate_between').val(g_wlan_basicSetting.WifiIsolate);
			}

			//set wifi wifioffenable
			$('#select_WifiAutooffStatus').val(g_wlan_basicSetting.Wifioffenable);
			$('#select_WifiAutooffTime').val(g_wlan_basicSetting.Wifiofftime);

			wlanadvanced_ifWifioffenable(g_wlan_basicSetting.Wifioffenable);
		}
    });
}

function wlanadvanced_changeChannel() {
    var i = 0;
    var wifiCountry = $.trim($('#select_WifiCountry').val());
    var channelIndex = 0;
    for (i = 0; i < countryArray.length; i++)
    {
        log.debug('country:' + countryArray[i][2]);
        if (countryArray[i][0] == wifiCountry)
        {
            channelIndex = countryArray[i][1];
            break;
        }
    }

    if ($('#select_WifiChannel').val() > channelIndex)
    {
        $('#select_WifiChannel').val(WLAN_CHANNEL_AUTO);
    }

    wlanadvanced_initChannel(channelIndex);
}

function ifWifioffenable_apply() {
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    // set wifi country
    if ($.browser.ipad)
    {
        g_wlan_basicSetting.WifiCountry = $('#select_WifiCountry_for_Idevice').val();
    }
    else
    {
        g_wlan_basicSetting.WifiCountry = $('#select_WifiCountry').val();
    }

    g_wlan_basicSetting.WifiChannel = $('#select_WifiChannel').val();

    // set wifi mode
    g_wlan_basicSetting.WifiMode = $('#select_WifiMode').val();

    // set wifi auto off enable status
    g_wlan_basicSetting.Wifioffenable = $('#select_WifiAutooffStatus').val();

    // set WiFi AP isolate
    if (g_module.multi_ssid_enabled)
    {
        g_wlan_basicSetting.WifiIsolationBetween = $('#select_WifiIsolate_between').val();
    }
    else
    {
        g_wlan_basicSetting.WifiIsolate = $('#select_WifiIsolate_between').val();
    }

    // set wifi auto off time
    g_wlan_basicSetting.Wifiofftime = $('#select_WifiAutooffTime').val();

    // post data
    var strUrl = 'api/wlan/basic-settings';

    if (g_module.multi_ssid_enabled)
    {
        strUrl = 'api/wlan/multi-security-settings';
    }
    g_wlan_basicSetting.WifiRestart = 1;
    var xmlstr = object2xml('request', g_wlan_basicSetting);
    saveAjaxData(strUrl, xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanadvanced_initPage();
        }
    });
}
function setDisplay () {
  
        if (g_feature.battery_enabled) {
            $('#wifiAutooffStatus').show();
            $('#wifiAutooffTime').show();
        }
        else {
            $('#wifiAutooffStatus').hide();
            $('#wifiAutooffTime').hide();
        }
}
function getStatus(){
    if(G_MonitoringStatus.type=='response')
	{
    	if(G_MonitoringStatus.response.WifiConnectionStatus == '901')
    	{  
    		$('#select_WifiCountry').attr('disabled', 'disabled');
    		$('#select_WifiChannel').attr('disabled', 'disabled');
			$('#select_WifiMode').removeAttr('disabled');
			$('#select_WifiIsolate_between').removeAttr('disabled');
			$('#select_WifiAutooffStatus').removeAttr('disabled');
    	}
		else
		{
		   $('#select_WifiCountry').removeAttr('disabled'); 
		   $('#select_WifiChannel').removeAttr('disabled');
		   $('#select_WifiMode').removeAttr('disabled');
		   $('#select_WifiIsolate_between').removeAttr('disabled');
		   $('#select_WifiAutooffStatus').removeAttr('disabled');
		}
    }
}

$(document).ready(function() {
    wlanadvanced_initPage();
	addStatusListener('getStatus()');
    button_enable('apply_button', '0');
    $('input').bind('change input paste cut keydown', function() {
        button_enable('apply_button', '1');
    });

    $('#select_WifiCountry').change(function() {
        button_enable('apply_button', '1');
        wlanadvanced_changeChannel();
    });

    $('#select_WifiChannel, #select_WifiMode, #select_WifiIsolate_between, #select_WifiAutooffTime, #select_WifiRate').live('change', function() {
        button_enable('apply_button', '1');
    });

    $('#select_WifiAutooffStatus').change(function() {
        button_enable('apply_button', '1');
        wlanadvanced_ifWifioffenable(this.value);
    });
    
    setDisplay();
});

