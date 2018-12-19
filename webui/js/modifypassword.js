

var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function base64encode(str) {
        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = '';
        while (i < len)
        {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += '==';
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len)
            {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += '=';
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    function vilidatePassword() {
        clearAllErrorLabel();
        var currenPassword = $('#current_password').val();
        var newPassword = $('#new_password').val();
        var confirmPassword = $('#confirm_password').val();
        if ('' == currenPassword)
        {
            showErrorUnderTextbox('current_password', system_hint_current_password_empty);
            $('#current_password').focus();
            return false;
        }
        else if (checkInputChar(currenPassword) == false)
        {
            showErrorUnderTextbox('current_password', dialup_hint_password_valid_char);
            $('#current_password').focus();
            return false;
        }
        else if ('' == newPassword)
        {
            showErrorUnderTextbox('new_password', system_hint_new_password_empty);
            $('#new_password').focus();
            return false;
        }
        else if ('' == confirmPassword)
        {
            showErrorUnderTextbox('confirm_password', system_hint_confirm_password_empty);
            $('#confirm_password').focus();
            return false;
        }
        /*  // These code seems meanless at all, so, elimanite it.
            else if ((currenPassword <= '') || (currenPassword >= ''))
            {
                showErrorUnderTextbox("current_password", system_hint_current_pwd_valid_char);
                $("#current_password").focus();
                return false;
            } */
        else if (true == hasSpaceOrTabAtHead(newPassword))//((newPassword <= '') || (newPassword >= ''))
        {
            showErrorUnderTextbox('new_password', input_cannot_begin_with_space);
            $('#new_password').focus();
            return false;
        }
        else if (true == hasSpaceOrTabAtHead(confirmPassword))//((confirmPassword <= '') || (confirmPassword >= ''))
        {
            showErrorUnderTextbox('confirm_password', input_cannot_begin_with_space);
            $('#confirm_password').focus();
            return false;
        }
        else if (newPassword != confirmPassword)
        {
            showErrorUnderTextbox('new_password', system_hint_new_and_confirm_pwd_same);
            $('#new_password').focus();
            return false;
        }
        else if (checkInputChar(newPassword) == false)
        {
            showErrorUnderTextbox('new_password', dialup_hint_password_valid_char);
            $('#new_password').focus();
            return false;
        }
        else
        {
            return true;
        }
    }

    function apply() {
        if (!isButtonEnable('apply_button'))
        {
            return;
        }

        var bValid = vilidatePassword();
        if (bValid)
        {
            var username = 'admin';
            var currentPassword = $('#current_password').val();
            var newPassword = $('#new_password').val();
            currentPassword = base64encode(currentPassword);
            newPassword = base64encode(newPassword);
            var request = {
                Username: username,
                CurrentPassword: currentPassword,
                NewPassword: newPassword
            };
            var xmlstr = object2xml('request', request);
            saveAjaxData('api/user/password', xmlstr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret))
                {
                    button_enable('apply_button', '0');
                    $('#current_password').val('');
                    $('#new_password').val('');
                    $('#confirm_password').val('');
                    showInfoDialog(common_success);
                    setTimeout('userOut()', 1000);
                }
                else if (ret.type == 'error')
                {
                    showErrorUnderTextbox('current_password', system_hint_wrong_password);
                    $('#current_password').val('');
                    $('#current_password').focus();
                }
            });
        }
    }
    $(document).ready(function() {
        $('#apply_button').click(function() {
            apply();
        });
        button_enable('apply_button', '0');

        $('input').bind('change input paste cut keydown', function() {
            button_enable('apply_button', '1');
        });
        $('#current_password').focus();
    });
