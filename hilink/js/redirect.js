// JavaScript Document
/**************Constant for check SIM card, PIN, [PUK]***************/
//sim
var MACRO_SAVE_PIN_ENABLED = "1";
var MACRO_SAVE_PIN_DISABLED = "0";
var SIM_PIN_TIMES_DEFAULT = "3";
var SIM_SAVE_PIN_SCID = "0";
var SIM_SAVE_PIN_DEFAULT = "0";
var SIM_PUK_TIMES_DEFAULT = "10";
var MACRO_SIM_LOCK_ENABLE = "1";
var MACRO_SIM_REMAIN_TIMES = "10";
var MACRO_SIM_PLOCK_ENABLE = "0";
var MACRO_NETOWRK_SERVICE_AVAILABILITY = 2;
var g_config_ota = null;
var OTA_STATUS_DISABLED = 0;
/***********************/

//Create object for store the Ajax response from simcard and pincode
var simlock_status = {
    SimLockEnable: "",
    SimLockRemainTimes: "",
    pSimLockEnable: "",
    pSimLockRemainTimes: ""
};

var pin_status = {
    SimState: "",
    PinOptState: "",
    SimPinTimes: "",
    SimPukTimes: ""
};

function redirectOnCondition(prefix, postfix) {
    //get SIM status
    var ret = false;
    var url_prefix = "";
    var g_special_redirect = "0";
    if ("string" == typeof(prefix)) {
        url_prefix = prefix;
    }
    if("string" == typeof(postfix)) {
        postfix = "?" + postfix;
    }
    else {
        postfix="";
    }
      getAjaxData("config/global/config.xml", function($xml) {
      	  var config_ret = xml2object($xml);  	
          g_special_redirect = config_ret.config.special_redirect;      	    
      }
      	, {
        sync : true
    }
    );
    if("0" === g_special_redirect ){  
	return ret;
	}
    //get PIN status
    getAjaxData("api/pin/status", function($xml) {
        var pinstatus_ret = xml2object($xml);
        if ("response" == pinstatus_ret.type) {
            pin_status.SimState = pinstatus_ret.response.SimState;
            pin_status.PinOptState = pinstatus_ret.response.PinOptState;
            pin_status.SimPinTimes = pinstatus_ret.response.SimPinTimes;
            pin_status.SimPukTimes = pinstatus_ret.response.SimPukTimes;

            log.debug("REDIRECT : SimState is " + pin_status.SimState);
            //Judgement pin status
            if (MACRO_NO_SIM_CARD == pin_status.SimState) {
                log.debug("REDIRECT : SimState == MACRO_NO_SIM_CARD, redirect to nocard.html");
                gotoPageWithoutHistory(url_prefix + "nocard.html" + postfix);
                ret = true;
            }
            else if (MACRO_CPIN_FAIL == pin_status.SimState) {
                log.debug("REDIRECT : SimState == MACRO_CPIN_FAIL, redirect to nocard.html");
                gotoPageWithoutHistory(url_prefix + "nocard.html");
                ret = true;

            }
            else if (MACRO_PIN_REQUIRED == pin_status.SimState) {
                log.debug("REDIRECT : SimState == MACRO_PIN_REQUIRED, redirect to pincoderequired.html");

                if ((typeof(G_StateLogin)!="undefined") && G_StateLogin) {
                    gotoPageWithoutHistory(url_prefix + "pincodemanagement.html");
                    ret = true;
                }
                else {
                    gotoPageWithoutHistory(url_prefix + "pincoderequired.html" + postfix);
                    ret = true;
                }
            }
            else if (MACRO_PUK_REQUIRED == pin_status.SimState) {
                log.debug("REDIRECT : SimState == MACRO_PUK_REQUIRED, redirect to pukrequired.html");

                if ((typeof(G_StateLogin)!="undefined") && G_StateLogin) {
                    gotoPageWithHistory(url_prefix + "pukrequired_login.html");
                    ret = true;
                }
                else {
                    gotoPageWithoutHistory(url_prefix + "pukrequired.html" + postfix);
                    ret = true;
                }
            }
        }
        else {
            log.error("REDIRECT : Load api/pin/status file failed");
        }
    }, {
        sync : true
    }
    );

    if (ret) {
        return true;
    }
    // get simlock
    getAjaxData("api/pin/simlock", function($xml) {
        var simlock_ret = xml2object($xml);
        if (simlock_ret.type == "response") {
            simlock_status.SimLockEnable = simlock_ret.response.SimLockEnable;
            simlock_status.SimLockRemainTimes = simlock_ret.response.SimLockRemainTimes;
            simlock_status.pSimLockEnable = simlock_ret.response.pSimLockEnable;
            simlock_status.pSimLockRemainTimes = simlock_ret.response.pSimLockRemainTimes;
            //Judgement sim status
            log.debug("REDIRECT : SimLockEnable is " + simlock_status.SimLockEnable);
            if (MACRO_SIM_LOCK_ENABLE == simlock_status.SimLockEnable) {
                log.debug("REDIRECT : redirect to simlock page.");
                gotoPageWithoutHistory(url_prefix + "simlockrequired.html" + postfix);
                ret = true;
            }
        }
        else {
            log.error("REDIRECT : get api/pin/simlock failed");
        }
    }, {
        sync : true
    }
    );
    if (ret) {
        return true;
    }
    getConfigData('config/ota/config.xml', function($xml) {
        g_config_ota = xml2object($xml);
    }, {
        sync: true
    });
    if (g_config_ota == null || g_config_ota.type == "unknown")
    {
        return ret;
    }
    if (g_config_ota != null && parseInt(g_config_ota.config.enable,10) && postfix != '?ota') {
    	//get ota status
	    getAjaxData("api/ota/status", function($xml) {
	        var ota_ret = xml2object($xml);
	        if (ota_ret.type == "response") {
	            ota_status = ota_ret.response;
	            if (OTA_STATUS_DISABLED ==ota_status.OtaStatus) {
	                gotoPageWithoutHistory('ota.html');
	                ret = true;
	            }
	        } else {
	            log.error("REDIRECT : api/ota/status failed");
	        }
	    }, {
	        sync : true
	    }
	    );
    };
    return ret;
}

//redirectOnCondition();