var LOGOUT_TIMEOUT = 300000;
var g_stateLogin = false;
var g_logoutTimer = null;
function checklogin() {
    var myurl = '../api/user/state-login';

    $.ajax({
        async: false,
        //cache: false,
        type: 'GET',
        timeout: 3000,
        url: myurl,
        dataType: 'text',
        success: function(data) {
            var xml;
            if (typeof data == 'string' || typeof data == 'number')
            {
                if (!window.ActiveXObject)
                {
                    var parser = new DOMParser();
                    xml = parser.parseFromString(data, 'text/xml');
                }
                else
                {
                    //IE
                    xml = new ActiveXObject('Microsoft.XMLDOM');
                    xml.async = false;
                    xml.loadXML(data);
                }
            }
            else
            {
                xml = data;
            }
            var $xml = $(xml);
            var $state = $xml.find('State');
            if ($state)
            {
                g_stateLogin = (parseInt($state.text(), 10) == 0) ? true : false;
                if (!g_stateLogin)
                {
                    window.location.replace('home.html');
                }
            }
        }
    });
}

function logout()
{
    var request = {
        'Logout' : 1
    };

    var logoutXml = object2xml('request', request);
    saveAjaxData('api/user/logout', logoutXml, function($xml) {
        gotoPageWithoutHistory('home.html');
    });
}
/*function startLogoutTimer()
{
    clearTimeout(g_logoutTimer);
    g_logoutTimer = setTimeout('logout()', LOGOUT_TIMEOUT);
}

function cancelLogoutTimer()
{
    clearTimeout(g_logoutTimer);
}*/

startLogoutTimer();

