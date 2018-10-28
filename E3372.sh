#! /bin/sh


urlbase="http://192.168.8.1/api"
curlopts="-fSsL"

#
# Get a cookie/session id
#
RESPONSE=`curl $curlopts -X GET $urlbase/webserver/SesTokInfo`
COOKIE=`echo "$RESPONSE"| grep SessionID=| cut -b 10-147`
TOKEN=`echo "$RESPONSE"| grep TokInfo| cut -b 10-41`

if [ -e /usr/bin/xml_pp ]; then
    pretty_print="/usr/bin/xml_pp";
else
    pretty_print="/usr/bin/tee";
fi

case "$1" in
connect) 
    curl "$curlopts" \
    -X POST "$urlbase/dialup/dial" 
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" \
    -d"<request><Action>1</Action></request>"
;;
disconnect)
    curl "$curlopts" \ 
    -X POST "$urlbase/dialup/dial" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" \
    -d "<request><Action>1</Action></request>"
;;
send_sms)
    curl "$curlopts" \ 
    -X POST "$urlbase/sms/send-sms" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" \
    -d "<request><Index>-1</Index><Phones><Phone>$2</Phone></Phones><Sca>$sca</Sca><Content>$3</Content><Length>${#3}</Length><Reserved>1</Reserved><Date>-1</Date></request>"
;;
get_sms)
    curl "$curlopts" \ 
    -X POST "$urlbase/sms/sms-list" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" \
    -d "<request><PageIndex>1</PageIndex><ReadCount>"${2:-1}"</ReadCount><BoxType>1</BoxType><SortType>0</SortType><Ascending>0</Ascending><UnreadPreferred>1</UnreadPreferred></request>"|$pretty_print
;;
sms_count)
    curl "$curlopts" \
    -X GET "$urlbase/sms/sms-count" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" | $pretty_print
;;
traffic_statistics)
    curl "$curlopts" \
    -X GET "$urlbase/monitoring/traffic-statistics" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" 
;;
check_notifications)
    curl "$curlopts" \
    -X GET "$urlbase/monitoring/check-notifications" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" | $pretty_print
;;
status)
    curl "$curlopts" \ 
    -X GET "$urlbase/monitoring/status" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" | $pretty_print
;;
dialup_connection)
    curl "$curlopts" \
    -X GET "$urlbase/dialup/connection" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" 
;;
device_information)
    curl "$curlopts" \
    -X GET "$urlbase/device/information" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" | $pretty_print
;;

send_ussd)
    curl "$curlopts" \
    -X POST "$urlbase/ussd/send" \
    -H "Cookie:$COOKIE" \
    -H "__RequestVerificationToken:$TOKEN" \
    -d "<Request><Content>$2</Content><CodeType>CodeType</CodeType></Request>";
;;
get_ussd)
    curl "$curlopts" \
    -X POST "$urlbase/ussd/get" \
    -H "Cookie: $COOKIE" \
    -H "__RequestVerificationToken: $TOKEN" \
    -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
    -d "<request><content>$2</content><codeType>CodeType</codeType><timeout></timeout></request>"|$pretty_print;
;;
*) 
cat >&2 << EOF
### HILINK E3372 TOOL (rohan@rmolloy.io)
connect) 
    Brings the modem online
disconnect)
    Brings the modem offline
send_sms)
    Send an sms message
    Usage: send_sms mobile_number message
get_sms)
    Poll the sms inbox
    Usage: get_sms count
sms_count)
    Query number of SMS message
traffic_statistics)
    Report traffic statistics 
check_notifications)
    Poll for new notification 
status)
    Report device status 
dialup_connection)
    Report dialup connection 
device_information)
    Report device information
send_ussd)
    Send a USSD request 
    Usage: send_ussd number  
get_ussd)
    Query USSD response 
    Usage: get_ussd number
EOF
;;
esac 

