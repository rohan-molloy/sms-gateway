// JavaScript Document
var g_langList = '';

function creatLangList() {
    if (jQuery.isArray(LANGUAGE_DATA.supportted_languages)) {
        if (LANGUAGE_DATA.supportted_languages.length > 20) {
            $('#language_list').css({
                'overflow-x': 'hidden',
                'overflow-y': 'scroll'
            });
        }
        $.each(LANGUAGE_DATA.supportted_languages, function(n, value) {
           if (value.replace(/-/, '_') == LANGUAGE_DATA.current_language) {
               $('#lang').val(eval(value.replace(/-/, '_')));
            }
            //langList += "<span><a href=\"javascript:changeLang('lang','" + value + "')\">" + eval(value.replace(/-/,"_")) + "</a></span>";
            g_langList += '<option value = ' + value.replace(/-/, '_') + '\>' + eval(value.replace(/-/, '_')) + '</option>';
        });
    }
    else if ('undefined' != typeof(LANGUAGE_DATA.supportted_languages)) {
        LANGUAGE_DATA.current_language = LANGUAGE_DATA.supportted_languages;
        var value = LANGUAGE_DATA.current_language;
        $('#lang').val(eval(LANGUAGE_DATA.supportted_languages.replace(/-/, '_')));
        //g_langList += "<span><a href=\"javascript:changeLang('lang','" + LANGUAGE_DATA.supportted_languages + "')\">" + eval(LANGUAGE_DATA.supportted_languages.replace(/-/,"_")) + "</a></span>";
        g_langList += '<option value = ' + value.replace(/-/, '_') + '\>' + eval(value.replace(/-/, '_')) + '</option>';
    }
    else {
        log.error('Load language data failed');
    }
}

$(function() {
    creatLangList();
});