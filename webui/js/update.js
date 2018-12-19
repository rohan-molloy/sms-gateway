var UPDATE_STATUS_IDLE = 10;
var UPDATE_STATUS_QUERYING = 11;
var UPDATE_NEWVERSION_FOUND = 12;
var UPDATE_STATUS_QUERYING_FAILED = 13;
var UPDATE_UP_TO_DATE = 14;
var UPDATE_DOWNLOAD_FAILED = 20;
var UPDATE_DOWNLOAD_PROGRESSING = 30;
var UPDATE_DOWNLOAD_PENDING = 31;
var UPDATE_DOWNLOAD_COMPLETE = 40;
var UPDATE_READYTO_UPDATE = 50;
var UPDATE_PROGRESSING = 60;
var UPDATE_FAILED_HAVEDATA = 70;
var UPDATE_FAILED_NODATA = 80;
var UPDATE_SUCCESSFUL_HAVEDATA = 90;
var UPDATE_SUCCESSFUL_NODATA = 100;
var RELOAD_PAGE_DELAY = 600;
var UPDATE_STATUS_INTERVAL = 3000;

var g_status = null;
var g_update_value = null;
var g_updateComponent = null;
var g_need_checkNewVersion = true;

var g_TB = 1024 * 1024 * 1024 * 1024;
var g_GB = 1024 * 1024 * 1024;
var g_MB = 1024 * 1024;
var g_KB = 1024;

var g_install_processbar_enable = 1;
var g_install_processbar_speed = 1;

var g_install_progress = 0;
var g_install_quick_flag = true;
var g_install_quick_speed = 1;

var g_download_install = true;
var g_install_finshed = false;
var g_progress_interval = null;

var g_updateStatus = 0;
function reloadPage()
{
    setTimeout(function(){window.location.reload();},RELOAD_PAGE_DELAY);
}

function update_displayNoNewVersionInfo()
{
    clearDialog();
    $('#up_content').hide();
    $('#up_version').hide();
    $('#up_system').show();
}

function formatComponentSize(bytes_number) {
    if (bytes_number >= g_TB)
    {
        return formatFloat((parseFloat(bytes_number / (g_TB))) , 2) + ' TB';
    }
    if (bytes_number >= g_GB && bytes_number < g_TB)
    {
        return formatFloat((parseFloat(bytes_number / (g_GB))) , 2) + ' GB';
    }
    else if (bytes_number >= g_MB && bytes_number < g_GB)
    {
        return formatFloat((parseFloat(bytes_number / (g_MB))) , 2) + ' MB';
    }
    else if (bytes_number >= g_KB && bytes_number < g_MB)
    {
        return formatFloat((parseFloat(bytes_number / (g_KB))) , 2) + ' KB';
    }
    else if (bytes_number < g_KB)
    {
        return formatFloat((parseFloat(bytes_number / (1))) , 2) + ' B';
    }
}

function update_showDownloading() {
    //show DownloadProgress
    if(g_download_install)
    {
      var current_progress = g_status.DownloadProgress;
      var persent = formatFloat(parseInt(current_progress, 10) / 100, 2);
      var update_width = $('.graph').width() - 8;
      update_width = parseInt(update_width * persent, 10);
      $('.press').css({'width': update_width + 'px'});
      $('#downloadProcess').html(g_status.DownloadProgress + '%');
	  cancelLogoutTimer();
      if (g_updateComponent)
      {
          // show current component index,name and version
          var downloadProcess = get_label_get + '&nbsp;' + eval(parseInt(g_status.CurrentComponentIndex, 10) + 1) + of_label_of + '&nbsp;' + g_status.TotalComponents + common_colon + '&nbsp;';
          if ($.isArray(g_updateComponent))
          {
              downloadProcess += g_updateComponent[g_status.CurrentComponentIndex].ComponentName + '&nbsp;' + formatComponentSize(g_updateComponent[g_status.CurrentComponentIndex].ComponentSize);
          }
          else
          {
              downloadProcess += g_updateComponent.ComponentName + '&nbsp;' + formatComponentSize(g_updateComponent.ComponentSize);
          }
          $('#update_download .up_get').html(downloadProcess);
      }

      //show Download dialog
      if ($('#div_wrapper').size() < 1) {
          $('.body_bg').before("<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>");
      }
	  else
	  {
	      $('#div_wrapper').remove();
		  $('.body_bg').before("<div id='div_wrapper'><iframe   id='ifream_dialog'  src= '' frameborder= '0' style= 'background:#bcbcbc; width:100%; height:100%; display: block;'> </iframe></div>");
	  }
      reputPosition($('#update_download'), $('#div_wrapper'));
      disableTabKey();
      if(current_progress == UPDATE_SUCCESSFUL_NODATA && g_install_processbar_enable && UPDATE_PROGRESSING == g_updateStatus ){  
		g_install_progress = 0;
		g_download_install = false;	
		g_install_quick_flag = true;
                $('#update_download .dialog_header_left').html(IDS_update_title_installing);
		$('#update_download .up_get').html(IDS_update_label_installing);
		show_install_progress();    	
      }
    }    
}

function show_install_progress(){
	
	 if( g_install_progress < 100){
	    if(!(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA )){
			g_install_progress	+= g_install_processbar_speed;
	    }
	    else{
			g_install_progress	+= g_install_quick_speed;
	    }
	    
	    if(g_updateStatus == UPDATE_PROGRESSING && g_install_progress >= 100){
			g_install_progress = 99;	
	    }
	    else if(!(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA ) && g_install_progress >= 100){
			g_install_progress = 99;	    	
	    }
	    else if(g_install_progress > 100){
			g_install_progress = 100;	
	    }
	    
	    if((g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA ) && g_install_progress < 97 && g_install_quick_flag){
	    	g_install_quick_flag = false;
	    	g_install_quick_speed = (100 - g_install_progress)/3;	    	
	    	g_install_quick_speed =  Math.ceil(g_install_quick_speed);   	
	    }
	 }

	  var persent = formatFloat(parseInt(g_install_progress, 10) / 100, 2);
      var update_width = $('.graph').width() - 8;
      update_width = parseInt(update_width * persent, 10);
      $('.press').css({'width': update_width + 'px'});
      $('#downloadProcess').html(g_install_progress + '%');
      if(g_install_progress < 100 ){
         g_progress_interval = setTimeout(show_install_progress, UPDATE_STATUS_INTERVAL);
         g_install_finshed = false;  
        
      }
      else{
      	 //clearTimeout(g_progress_interval);      	 
      	 g_install_finshed = true;  
      	 setTimeout(update_downloadSuccess, UPDATE_STATUS_INTERVAL); 	
      }
}

function update_displayNewVersionFoundInfo(isShowDownloading)
{
    $('#up_content').hide();
    $('#up_version').show();
    $('#up_system').hide();
    if (g_update_value == null)
    {
        getAjaxData('api/online-update/url-list', function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response')
            {
                g_update_value = update_ret.response;
                g_updateComponent = g_update_value.ComponentList.Component;

                if (g_updateComponent) {
                    var list_info = '';
                    var changeLog = IDS_update_label_features + common_colon;
                    if ($.isArray(g_updateComponent)) {
                        $.each(g_updateComponent, function(i) {
                            list_info += "<tr><td width='100'>" + g_updateComponent[i].ComponentName + common_colon + "</td><td><label class='up_newversion'>" + g_updateComponent[i].Version + '</label></td></tr>' +
                            '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent[i].ComponentSize) + '</label></td></tr>';
                        });
                    }
                    else
                    {
                        list_info += "<tr><td width='100'>" + g_updateComponent.ComponentName + common_colon + "</td><td><label class='up_newversion'>" + g_updateComponent.Version + '</label></td></tr>' +
                        '<tr><td >' + sd_label_size + common_colon + "</td><td class = 'up_size'><label class='up_release'>" + formatComponentSize(g_updateComponent.ComponentSize) + '</label></td></tr>';
                    }
                    var useDefault = true;
                    $($xml.find('language')).each(function() {
                        if ($(this).attr('name') == LANGUAGE_DATA.current_language.replace(/_/, '-'))
                        {
                            useDefault = false;
                            $($(this).find('features').find('feature')).each(function() {
                                changeLog += '\n' + $(this).text();
                            });
                            }
                    });
                    $($xml.find('language')).each(function() {
                        if (useDefault)
                        {
                            var defaultLanguage = $xml.find('default-language').attr('name');
                            if ($(this).attr('name') == defaultLanguage)
                            {
                                $($(this).find('features').find('feature')).each(function() {
                                changeLog += '\n' + $(this).text();
                                });
                            }
                        }
                    });
                    $('.cancel_table').html(list_info);
                    $('.update_textarea').val(changeLog);
                    //when state is UPDATE_DOWNLOAD_PROGRESSING (30)
                    if (isShowDownloading)
                    {
                        update_showDownloading();
                    }
                }
            }
        });
    }
    //only click the Update Now button
    else
    {
        update_showDownloading();
    }
}

function update_downloadSuccess()
{
	if(g_updateStatus == UPDATE_SUCCESSFUL_NODATA || g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA){
		if(!g_install_processbar_enable ||(g_install_processbar_enable && g_install_finshed)){
			$('.update_dialog').hide();
			reputPosition($('#upload_success'), $('#div_wrapper'));
		}
	}
}

function update_clickSuccessCancel()
{
    var dialogLeft = $(window).width() / 2 - $('.update_dialog').outerWidth() / 2;
    $('#success_ok').live('click', function() {
        $('#upload_success,#div_wrapper').hide();
        reloadPage();
    });
}

function update_failed()
{
    $('.update_dialog').hide();
    reputPosition($('#update_failed'), $('#div_wrapper'));
}

function update_checkUpdateStatus() {
    getAjaxData('api/online-update/status',
        function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response')
            {
                g_status = update_ret.response;
                g_updateStatus = parseInt(g_status.CurrentComponentStatus, 10);
                update_processStatus(g_updateStatus);
            }
        },
        {
            errorCB: function() {
                setTimeout(update_checkUpdateStatus, UPDATE_STATUS_INTERVAL);
            }
        }
    );
}

function update_processStatus(CurrentComponentStatus)
{
    $('#online_update h2').show();
    CurrentComponentStatus == UPDATE_DOWNLOAD_PROGRESSING ? button_enable('DownloadProgressing_Cancel', '1') : button_enable('DownloadProgressing_Cancel', '0');
    switch (CurrentComponentStatus)
    {
        //The content in log debug is just for test, it can be ignored.
        case UPDATE_STATUS_IDLE:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_IDLE)');
            $('#online_update').show();
            $('#uploadLocalFile').hide();
            $('#up_system').html('');
            $('#online_update h2').hide();
            update_displayNoNewVersionInfo();//Told user there hasn't new version.
            return;
        case UPDATE_STATUS_QUERYING:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING)');
            break;
        case UPDATE_NEWVERSION_FOUND:
            log.debug('online-update : update_processStatus(UPDATE_NEWVERSION_FOUND)');
			$('#update_download').hide('fast');
            $('#div_wrapper').hide('fast');
            update_displayNewVersionFoundInfo(); //show dialog new feature
            return;
        case UPDATE_STATUS_QUERYING_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_STATUS_QUERYING_FAILED)');
            update_displayNoNewVersionInfo();
            return;
        case UPDATE_UP_TO_DATE:
            log.debug('online-update : update_processStatus(UPDATE_UP_TO_DATE)');
            $('#up_system').html(system_up_to_date);
            $('#online_update h2').hide();
            update_displayNoNewVersionInfo();//Told user there hasn't new version.
            return;
        case UPDATE_DOWNLOAD_FAILED:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_FAILED)');
            update_failed();
			startLogoutTimer();
            return;
        case UPDATE_DOWNLOAD_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PROGRESSING');
            update_displayNewVersionFoundInfo(true);
            break;
        case UPDATE_DOWNLOAD_PENDING:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_PENDING)');
            update_displayNewVersionFoundInfo();
            return;
        case UPDATE_DOWNLOAD_COMPLETE:
            log.debug('online-update : update_processStatus(UPDATE_DOWNLOAD_COMPLETE)');
            break;
        case UPDATE_READYTO_UPDATE:
            log.debug('online-update : update_processStatus(UPDATE_READYTO_UPDATE)');
            break;
        case UPDATE_PROGRESSING:
            log.debug('online-update : update_processStatus(UPDATE_PROGRESSING)');
            update_displayNewVersionFoundInfo();
            break;
        case UPDATE_FAILED_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_HAVEDATA)');
            update_failed();
			startLogoutTimer();
            return;
        case UPDATE_FAILED_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_FAILED_NODATA)');
            update_failed();
			startLogoutTimer();
            return;
        case UPDATE_SUCCESSFUL_HAVEDATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_HAVEDATA)');
            update_downloadSuccess();
            update_clickSuccessCancel();
			startLogoutTimer();
            return;
        case UPDATE_SUCCESSFUL_NODATA:
            log.debug('online-update : update_processStatus(UPDATE_SUCCESSFUL_NODATA)');
            update_downloadSuccess();
            update_clickSuccessCancel();
			startLogoutTimer();
            return;
    }
    setTimeout(update_checkUpdateStatus, UPDATE_STATUS_INTERVAL);
}


function update_checkNewVersion() {
    if (g_need_checkNewVersion)
    {
        g_need_checkNewVersion = false;
        if (G_NotificationsStatus != null && G_NotificationsStatus.OnlineUpdateStatus == UPDATE_NEWVERSION_FOUND)
        {
            update_checkUpdateStatus();
        }
        else
        {
            $('#up_content').show();
            $('#up_version').hide();
            $('#up_system').hide();
            saveAjaxData('api/online-update/check-new-version', '', function($xml) {
                update_checkUpdateStatus();
                var return_ret = xml2object($xml);
                if (isAjaxReturnOK(return_ret))
                {
                    log.debug('online-update : send check-new-version success.');
                }
            });
        }
    }
}


function update_onClickUpdateNow() {
    if (g_feature.battery_enabled) 
    {
        if(header_icon_status.BatteryLevel <= MACRO_BATTERY_LEVEL_TWO)
        {
        	showInfoDialog(STRID_update_hint_battery_prower_low);
        	return;
        }
    }
    var updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
    if (updateStatus != UPDATE_DOWNLOAD_PROGRESSING && updateStatus != UPDATE_PROGRESSING)
    {
        clearAllErrorLabel();
        $('#update_now').unbind('click');
        var submitData = {
            userAckNewVersion: 0
        };
        var res = object2xml('request', submitData);
        saveAjaxData('api/online-update/ack-newversion', res, function($xml) {
            var update_ret = xml2object($xml);
            if (update_ret.type == 'response')
            {
                log.debug('update data successfull');
                update_checkUpdateStatus();
                g_download_install = true;
            }
            $('#update_now').bind('click', update_onClickUpdateNow);
        });
    }
    else
    {
        clearAllErrorLabel();
        showErrorUnderTextbox('update_now', IDS_update_updateing_try_again);
    }
}


function update_okDownloading() {
    if (isButtonEnable('DownloadProgressing_Cancel'))
    {
        $('#update_download,#div_wrapper').hide();
        reloadPage();
        saveAjaxData('api/online-update/cancel-downloading', '', function($xml) {
            var return_ret = xml2object($xml);
            if (return_ret.type == 'response')
            {
                log.debug('update data successfull');
            }
        });
    }
}

function localUploadStatus() {
    if (G_NotificationsStatus != null)
    {
        g_updateStatus = parseInt(G_NotificationsStatus.OnlineUpdateStatus, 10);
        if (g_updateStatus == UPDATE_FAILED_HAVEDATA || g_updateStatus == UPDATE_FAILED_NODATA)
        {
            $('#wait_table .wait_table_content').html(update_label_failed);
			setTimeout(closeWaitingDialog, g_feature.dialogdisapear);
			startLogoutTimer();
			return;
        }
        if (g_updateStatus == UPDATE_SUCCESSFUL_HAVEDATA || g_updateStatus == UPDATE_SUCCESSFUL_NODATA)
        {
            $('#wait_table').hide();
            g_install_finshed = true;  
            update_downloadSuccess();
            update_clickSuccessCancel();
			startLogoutTimer();
			return;
        }
    }
	setTimeout(localUploadStatus, UPDATE_STATUS_INTERVAL);
}
function update_uploadFile() {
    cancelLogoutTimer();
    showWaitingDialog(common_update, STRID_update_hint_dont_close_browse);
    var optionst = {
        url: '../api/filemanager/upload',
        success: function(responseText, statusText) {
            var responseString = responseText.toLowerCase();
            if (responseString.indexOf('response') == -1 || responseString.indexOf('ok') == -1 )
            {
                $('#wait_table .wait_table_content').html(update_label_failed);
                startLogoutTimer();
                setTimeout(closeWaitingDialog, g_feature.dialogdisapear);
            }
            
        }
    };
    $('#form_update').ajaxSubmit(optionst);
	setTimeout(localUploadStatus, UPDATE_STATUS_INTERVAL);
}

function getLoginStatus() {
    if (getQueryStringByName('mode') != null)
    {
        if (getQueryStringByName('mode').toLowerCase() == 'local')
        {
            getAjaxData('api/user/state-login', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    if (ret.response.Username != 'root') {
                        window.location.replace(HOME_PAGE_URL);
                    }
                }
            }, {
                sync: true
            });
        }
    }
}

function getUpdateConfig(){
    getConfigData('config/update/config.xml', function($xml) {
      var update_config = _xml2feature($xml);
      g_install_processbar_enable = update_config.install_processbar_enable;
      g_install_processbar_speed = update_config.install_processbar_speed;

    }, {
        sync: true
    });

}

function update_executeBeforeDocumentReady()
{
    if(!(redirectOnCondition(null, 'update')))
    {
        if(g_needToLogin == '1')
        {
            checklogin();
            getLoginStatus();
        }
	}
    if('1' == g_feature.battery_enabled)
    {
	    STRID_update_hint_dont_close_browse += STRID_update_hint_battery_prower_low;
	}	
	getUpdateConfig();
}
update_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready(function() {
    $('#up_nodite').val('');
    button_enable('local_update', '0');
    //enable/disable local upload module
    if (getQueryStringByName('mode') != null)
    {
        if (getQueryStringByName('mode').toLowerCase() == 'local')
        {
            $('#online_update').hide();
            $('#uploadLocalFile').show();
        }
        else
        {
            $('#online_update').show();
            $('#uploadLocalFile').hide();
        }
    }

    function checkUploadFileName() {
        var uploadFileName = $('#up_nodite').val();
        var reg = /\.bin$|\.zip$/i;
        if (reg.test(uploadFileName))
        {
            clearAllErrorLabel();
            button_enable('local_update', '1');
        }
        else
        {
            clearAllErrorLabel();
            showErrorUnderTextbox('up_nodite', system_hint_file_name_empty);
            button_enable('local_update', '0');
        }
    }

    // set textbox_path value
    $('#up_nodite').change(function() {
        var uploadFileName = $('#up_nodite').val();
        if (uploadFileName.indexOf('\\') > -1)
        {
            uploadFileName = uploadFileName.substring(uploadFileName.lastIndexOf('\\') + 1);
        }
        $('#textbox_path').val('OU:' + uploadFileName);
        checkUploadFileName();
    });

    $('#update_now').bind('click', update_onClickUpdateNow);
    $('#DownloadProgressing_Cancel, #cancel_download').bind('click', update_okDownloading);
    $('#query_again').bind('click', function() {
        $('#up_content').show();
        $('#up_version').hide();
        $('#up_system').hide();
        update_checkNewVersion();
        g_need_checkNewVersion = true;
    });

    $('.dialog_close_btn, .pop_Cancel').live('click', function() {
        reloadPage();
    });

    $('#local_update').click(function() {
        if (isButtonEnable('local_update'))
        {
            if (G_NotificationsStatus.OnlineUpdateStatus == UPDATE_DOWNLOAD_PROGRESSING || G_NotificationsStatus.OnlineUpdateStatus == UPDATE_PROGRESSING)
            {
                clearAllErrorLabel();
                showErrorUnderTextbox('up_nodite', IDS_update_updateing_try_again);
            }
            else
            {
                checkUploadFileName();
                update_uploadFile();
            }
        }
    });

    if (getQueryStringByName('mode') == null || getQueryStringByName('mode').toLowerCase() != 'local')
    {
//update_checkUpdateStatus();
        addStatusListener('update_checkNewVersion()');
    }
});
