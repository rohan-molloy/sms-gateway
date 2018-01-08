var g_firewallSwitchData;
var isFirewallwanportpingswitch_enable = false;
$(document).ready(function() {
    button_enable('apply_button', '0');
    $("input[name='firewallswitch']").click(function() {
        button_enable('apply_button', '1');
        checked_ck();
    });
    initPage();
});

function initPage() {
    getAjaxData('api/security/firewall-switch', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response')
        {
            g_firewallSwitchData = ret.response;
            $('#checkbox_FirewallMainSwitch').get(0).checked = (g_firewallSwitchData.FirewallMainSwitch == 1);
            $('#checkbox_FirewallIPFilterSwitch').get(0).checked = (g_firewallSwitchData.FirewallIPFilterSwitch == 1);
            $('#checkbox_FirewallWanPortPingSwitch').get(0).checked = (g_firewallSwitchData.FirewallWanPortPingSwitch == 0);
            checked_ck();
        }
    });
    
    setDisplay();
}
function setDisplay()
{
    getConfigData('config/firewall/config.xml', function($xml) {
        var ret = _xml2feature($xml);      
        if('0' == ret.firewallwanportpingswitch_enable)
        {
            $('#firewallWanPortPingSwitch').hide();
        }
        else {
            $('#firewallWanPortPingSwitch').show();            
        } 
    });
    
    
}
function apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button')) {
        return;
    }
    g_firewallSwitchData.FirewallMainSwitch = $('#checkbox_FirewallMainSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallIPFilterSwitch = $('#checkbox_FirewallIPFilterSwitch').get(0).checked ? 1 : 0;
    g_firewallSwitchData.FirewallWanPortPingSwitch = $('#checkbox_FirewallWanPortPingSwitch').get(0).checked ? 0 : 1;

    var xmlstr_security = object2xml('request', g_firewallSwitchData);
    saveAjaxData('api/security/firewall-switch', xmlstr_security, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            initPage();
        }
    });
}

//
function checked_ck() {
    if ($('#checkbox_FirewallMainSwitch').attr('checked') == true)
    {
        $('#checkbox_FirewallIPFilterSwitch').attr('disabled', '');
        $('#checkbox_FirewallWanPortPingSwitch').attr('disabled', '');
        $('#label_enable').css('color', '#000000');
        $('#label_disable').css('color', '#000000');
    }
    if ($('#checkbox_FirewallMainSwitch').attr('checked') == false)
    {
        $('#checkbox_FirewallIPFilterSwitch').attr('disabled', 'disabled');
        $('#checkbox_FirewallWanPortPingSwitch').attr('disabled', 'disabled');
        $('#label_enable').css('color', '#baaaaa');
        $('#label_disable').css('color', '#baaaaa');
    }

}
