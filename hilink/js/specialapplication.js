// JavaScript Document
var SPECIAL_APP_NUM = 16;
var ok_flag = 0;
var add_flag = 0;

var filterStatusArray = [
    [FILTER_DISABLED, common_off],
    [FILTER_ENABLED, common_on]
];

var protocolStatusArray = [
    [PROTOCOL_BOTH, firewall_label_tcp_or_udp],
    [PROTOCOL_TCP, firewall_label_tcp],
    [PROTOCOL_UDP, firewall_label_udp]
];

function initInput() {
    $('#sa_trigger_status').val(FILTER_DISABLED);
    $('#sa_trigger_protocol').val(PROTOCOL_BOTH);
    $('#sa_open_protocol').val(PROTOCOL_BOTH);
}

function initPage() {
    SPECIAL_APP_NUM = parseInt(g_config_firewall.specialapplication.number,10);
    button_enable('apply', '0');
    $('.user_add_line').remove();
    initInput();
    getAjaxData('api/security/special-applications', function($xml) {
        var ret = xml2object($xml);
        ret = ret.response.LanPorts.LanPort;
		var lastSpecial;
		var lastSpecialOpenPort;
        if (ret) {
            var openPort = [];

            if (ret.length >= SPECIAL_APP_NUM)
            {
                button_enable('add_item', '0');
            }

            if ($.isArray(ret)) {

                $(ret).each(function(i) {

                    if (ret[i].SpecialApplicationStartOpenPort0.length > 0 && '0' != ret[i].SpecialApplicationStartOpenPort0)
                    {
                        openPort.push(portJoin(ret[i].SpecialApplicationStartOpenPort0, ret[i].SpecialApplicationEndOpenPort0));
                    }
                    if (ret[i].SpecialApplicationStartOpenPort1.length > 0 && '0' != ret[i].SpecialApplicationStartOpenPort1)
                    {
                        openPort.push(portJoin(ret[i].SpecialApplicationStartOpenPort1, ret[i].SpecialApplicationEndOpenPort1));
                    }
                    if (ret[i].SpecialApplicationStartOpenPort2.length > 0 && '0' != ret[i].SpecialApplicationStartOpenPort2)
                    {
                        openPort.push(portJoin(ret[i].SpecialApplicationStartOpenPort2, ret[i].SpecialApplicationEndOpenPort2));
                    }
                    if (ret[i].SpecialApplicationStartOpenPort3.length > 0 && '0' != ret[i].SpecialApplicationStartOpenPort3)
                    {
                        openPort.push(portJoin(ret[i].SpecialApplicationStartOpenPort3, ret[i].SpecialApplicationEndOpenPort3));
                    }
                    if (ret[i].SpecialApplicationStartOpenPort4.length > 0 && '0' != ret[i].SpecialApplicationStartOpenPort4)
                    {
                        openPort.push(portJoin(ret[i].SpecialApplicationStartOpenPort4, ret[i].SpecialApplicationEndOpenPort4));
                    }

                    addFilter(
                        $('#service_list tr'),
                        ret[i].SpecialApplicationTriggerName,
                        getDArrayElement(filterStatusArray, ret[i].SpecialApplicationTriggerStatus, 'value'),
                        ret[i].SpecialApplicationTriggerPort,
                        getDArrayElement(protocolStatusArray, ret[i].SpecialApplicationTriggerProtocol, 'value'),
                        getDArrayElement(protocolStatusArray, ret[i].SpecialApplicationOpenProtocol, 'value'),
                        openPort.join(';')
                    );
                    if((ret.length - 1) == i )
					{
					    lastSpecialOpenPort = openPort.join(';');
					}
                    openPort = [];
                });
				lastSpecial = ret[ret.length-1];
            }
            else
            {
                if (ret.SpecialApplicationStartOpenPort0.length > 0 && '0' != ret.SpecialApplicationStartOpenPort0)
                {
                    openPort.push(portJoin(ret.SpecialApplicationStartOpenPort0, ret.SpecialApplicationEndOpenPort0));
                }
                if (ret.SpecialApplicationStartOpenPort1.length > 0 && '0' != ret.SpecialApplicationStartOpenPort1)
                {
                    openPort.push(portJoin(ret.SpecialApplicationStartOpenPort1, ret.SpecialApplicationEndOpenPort1));
                }
                if (ret.SpecialApplicationStartOpenPort2.length > 0 && '0' != ret.SpecialApplicationStartOpenPort2)
                {
                    openPort.push(portJoin(ret.SpecialApplicationStartOpenPort2, ret.SpecialApplicationEndOpenPort2));
                }
                if (ret.SpecialApplicationStartOpenPort3.length > 0 && '0' != ret.SpecialApplicationStartOpenPort3)
                {
                    openPort.push(portJoin(ret.SpecialApplicationStartOpenPort3, ret.SpecialApplicationEndOpenPort3));
                }
                if (ret.SpecialApplicationStartOpenPort4.length > 0 && '0' != ret.SpecialApplicationStartOpenPort4)
                {
                    openPort.push(portJoin(ret.SpecialApplicationStartOpenPort4, ret.SpecialApplicationEndOpenPort4));
                }
                addFilter(
                    $('#service_list tr'),
                    ret.SpecialApplicationTriggerName,
                    getDArrayElement(filterStatusArray, ret.SpecialApplicationTriggerStatus, 'value'),
                    ret.SpecialApplicationTriggerPort,
                    getDArrayElement(protocolStatusArray, ret.SpecialApplicationTriggerProtocol, 'value'),
                    getDArrayElement(protocolStatusArray, ret.SpecialApplicationOpenProtocol, 'value'),
                    openPort.join(';')
                );
                lastSpecial = ret;
				lastSpecialOpenPort = openPort.join(';');
            }

			$('#sa_trigger_name').val(lastSpecial.SpecialApplicationTriggerName);
            $('#sa_trigger_port').val(lastSpecial.SpecialApplicationTriggerPort);
            $('#sa_open_port').val(lastSpecialOpenPort);		
        }
    });
}

function openPortToCss() {
    if(($.browser.mozilla) || ($.browser.opera))
	{
		$('#service_list').css
		({
			'table-layout':'fixed',
			'word-break':'break-all',
			'word-wrap':'break-word'
		});
	}
}
$(document).ready(function() {
    initPage();
	openPortToCss();
    var currentAllVal = null;
    var editIndex = null;
    var inputValue = {};
    var portArray = [];

    var selectIDs = ['sa_trigger_protocol', 'sa_open_protocol'];

    initSelectOption('sa_trigger_status', filterStatusArray);
    initSelectOption(selectIDs, protocolStatusArray);
    //hide add item control
    $('#add_item_cancel').live('click', function() {
        hideAddItemControl();
		if((1 == add_flag) || (1 == ok_flag))
		{
			button_enable('apply', '1');
		}
    });

    //show add item control
    $('#add_item').click(function() {
        if (isButtonEnable('add_item'))
        {
            showAddItemControl();
            $('.add_item_control input').eq(0).focus();
			button_enable('apply', '0');
        }
    });

    $('.button_edit_list').live('click', function() {
        if (($(".add_item_control:hidden").size() > 0) && ($('#edit_item_ok').size() < 1)) {
            editIndex = $('.button_edit_list').index(this);

            // save the value before user edit
            currentAllVal = $('.user_add_line').eq(editIndex).html();
            var editSpecialApp = $(this).parent().siblings();
            var SATriggerName = editSpecialApp.eq(0);
            var SATriggerStatus = editSpecialApp.eq(1);
            var SATriggerPort = editSpecialApp.eq(2);
            var SATriggerProtocol = editSpecialApp.eq(3);
            var SAOpenProtocol = editSpecialApp.eq(4);
            var SAOpenPort = editSpecialApp.eq(5);

            var htmlTStatus = SATriggerStatus.html();
            var htmlTProtocol = SATriggerProtocol.html();
            var htmlOProtocol = SAOpenProtocol.html();

            SATriggerName.html('<input type="text" value="' + SATriggerName.html() + '" id="sa_trigger_name" maxlength="30"/></td>');
            SATriggerPort.html('<input type="text" value="' + SATriggerPort.html() + '" id="sa_trigger_port"></td>');
            SAOpenPort.html('<input type="text" value="' + SAOpenPort.html() + '" id="sa_open_port"></td>');

            createSelect(SATriggerStatus, 'sa_trigger_status', filterStatusArray);
            createSelect(SATriggerProtocol, 'sa_trigger_protocol', protocolStatusArray);
            createSelect(SAOpenProtocol, 'sa_open_protocol', protocolStatusArray);

            $('#sa_trigger_status').val(getDArrayElement(filterStatusArray, htmlTStatus, 'key'));
            $('#sa_trigger_protocol').val(getDArrayElement(protocolStatusArray, htmlTProtocol, 'key'));
            $('#sa_open_protocol').val(getDArrayElement(protocolStatusArray, htmlOProtocol, 'key'));

            $(this).parent().html('<a id="edit_item_ok" href="javascript:void(0);">' + common_ok +
                '</a>&nbsp;&nbsp;<a id="edit_item_cancel" href="javascript:void(0);">' + common_cancel + '</a>');

            hideAddItemControl();
            $('.user_add_line input').eq(0).focus();		
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

    function getInputValue() {
        inputValue = {
            SATriggerName: $.trim($('#sa_trigger_name').val()),
            SATriggerStatus: $('#sa_trigger_status option:selected').text(),
            SATriggerPort: $.trim($('#sa_trigger_port').val()),
            SATriggerProtocol: $('#sa_trigger_protocol option:selected').text(),
            SAOpenProtocol: $('#sa_open_protocol option:selected').text(),
            SAOpenPort: $.trim($('#sa_open_port').val())
        };
        return inputValue;
    }

    function splitPortString(_port) {
        portArray = _port.split(';');
        return portArray;
    }

    function checkInputValue() {
		$.each($('.qtip-defaults'), function() {
			$(this).remove();
		});		
        var specialApplicationsName = $.trim($('#sa_trigger_name').val());
        if ('' != specialApplicationsName) {
            if (!checkInputChar(specialApplicationsName)) {
                showQtip('sa_trigger_name', firewall_hint_name_valid_type);
                return false;
            }
        }
        else
        {
            showQtip('sa_trigger_name', common_message_name_empty);
            return false;
        }

        if (!isVaildSpecialPort($.trim($('#sa_trigger_port').val()), 'sa_trigger_port')) {
            return false;
        }

        var szOpenPort = splitPortString($('#sa_open_port').val());

        if (szOpenPort.length > 5)
        {
            showQtip('sa_open_port', setting_hint_special_applications_port_maximum);
            return false;
        }

        var bOPort = true;
        var portCount = 0;
        $(szOpenPort).each(function(i) {
            if (!isVaildPortForIPFilter(portArray[i], 'sa_open_port')) {
                bOPort = false;
                return bOPort;
            }
            var portParts = portArray[i].split('-');
            if (portParts.length == 2 )
            {
                portCount += parseInt(portParts[1], 10) - parseInt(portParts[0], 10) + 1;
            }
            else {
                portCount++;
            }
            
            if(portCount > 200) {
                showQtip("sa_open_port", IDS_Security_open_port_range);
                bOPort = false;
                return bOPort;
            }
        });

        return bOPort;
    }

    function addNewAppItem() {
        getInputValue();
        if (checkInputValue()) {
            hideAddItemControl();
            addFilter($('#service_list tr') ,
                inputValue.SATriggerName,
                inputValue.SATriggerStatus,
                inputValue.SATriggerPort,
                inputValue.SATriggerProtocol,
                inputValue.SAOpenProtocol,
                inputValue.SAOpenPort
            );

            button_enable('apply', '1');
        }
    }
    $('#add_item_ok').live('click', function() {
        addNewAppItem();
        if ($('.user_add_line').length >= SPECIAL_APP_NUM)
        {
            button_enable('add_item', '0');
        }
		add_flag = 1;
    });

    $('#edit_item_ok').live('click', function() {
        if (checkInputValue()) {
            getInputValue();
            hideAddItemControl();
            var editSpecialApp = $(this).parent().siblings();
            editSpecialApp.eq(0).html(inputValue.SATriggerName);
            editSpecialApp.eq(1).html(inputValue.SATriggerStatus);
            editSpecialApp.eq(2).html(inputValue.SATriggerPort);
            editSpecialApp.eq(3).html(inputValue.SATriggerProtocol);
            editSpecialApp.eq(4).html(inputValue.SAOpenProtocol);
            editSpecialApp.eq(5).html(inputValue.SAOpenPort);

            $(this).parent().html('<span class=\"button_edit_list\">' + common_edit +
                '</span>&nbsp;&nbsp;<span class=\"button_delete_list\">' + common_delete + '</span>');

            currentAllVal = $('.user_add_line').eq(editIndex).html();
            button_enable('apply', '1');
			button_enable('add_item', '1');	
			ok_flag = 1;
			if ($('.user_add_line').length >= SPECIAL_APP_NUM)
            {
                button_enable('add_item', '0');
            }			
        }
    });

    function postData() {
        var submitObject = {};
        var lanPortArray = [];

        $('.user_add_line').each(function(i) {
            var openPorts = [['', ''], ['', ''], ['', ''], ['', ''], ['', '']];
            var szOpenPort = splitPortString($(this).children().eq(5).text());

            if ($.isArray(szOpenPort))
            {
                $(szOpenPort).each(function(i) {
                    if (szOpenPort[i].length >= 0) {
                        openPorts[i] = portPartsParse(szOpenPort[i]);
                    }
                });

            }
            else
            {
                openPorts[0] = portPartsParse(szOpenPort);
            }

            var LanPort = {
                SpecialApplicationTriggerName: $(this).children().eq(0).text(),
                SpecialApplicationTriggerStatus: getDArrayElement(filterStatusArray, $(this).children().eq(1).text(), 'key'),
                SpecialApplicationTriggerPort: $(this).children().eq(2).text(),
                SpecialApplicationTriggerProtocol: getDArrayElement(protocolStatusArray, $(this).children().eq(3).text(), 'key'),
                SpecialApplicationOpenProtocol: getDArrayElement(protocolStatusArray, $(this).children().eq(4).text(), 'key'),
                SpecialApplicationStartOpenPort0: openPorts[0][0],
                SpecialApplicationEndOpenPort0: openPorts[0][1],
                SpecialApplicationStartOpenPort1: openPorts[1][0],
                SpecialApplicationEndOpenPort1: openPorts[1][1],
                SpecialApplicationStartOpenPort2: openPorts[2][0],
                SpecialApplicationEndOpenPort2: openPorts[2][1],
                SpecialApplicationStartOpenPort3: openPorts[3][0],
                SpecialApplicationEndOpenPort3: openPorts[3][1],
                SpecialApplicationStartOpenPort4: openPorts[4][0],
                SpecialApplicationEndOpenPort4: openPorts[4][1]
            };
            lanPortArray.push(LanPort);
        });
        submitObject = {
            LanPorts: {
                LanPort: lanPortArray
            }
        };

        var submitData = object2xml('request', submitObject);
        saveAjaxData('api/security/special-applications', submitData, function($xml) {
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
            showConfirmDialog(firewall_hint_submit_list_item, postData);
        }
		ok_flag = 0;
		add_flag = 0;
    });
});
