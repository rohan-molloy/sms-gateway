#! /bin/bash
#
# Send an SMS message via HiLink API.
# Configure authentication via sms.json
#
# Arguments: [Number] [Message]


#
# Check the required arguments are provided
#
[[ $# -ne 2 ]] && echo "Usage: Send-SMS [Number] [Message]" && exit 1;

#
# If it exists, check ~/sms.json for authentication options  as well as the url for the api
# it also contains the SMS service center number
#
if [ -f $HOME/sms.json ]; then
    APIURL=$(jq .APIProtocol < ~/sms.json | tr -d \")"://"$(jq .APIHost < ~/sms.json | tr -d \")$(jq .APILocation < ~/sms.json | tr -d \")
    SMSServicecenter=$(jq .SMSServicecenter < ~/sms.json | tr -d \");
    AuthenticationType=$(jq .AuthenticationType < $HOME/sms.json);
    AuthenticationCommand=$(jq .AuthenticationCommand < $HOME/sms.json | tr -d \");
    if [  $AuthenticationType == '"basic"' ]; then
        CURL_AUTH_OPTIONS="--user $($AuthenticationCommand)";
    fi
    if [ $AuthenticationType == '"bearer"' ]; then
       CURL_AUTH_OPTIONS="--header \"Authentication: Bearer `$AuthenticationCommand`\"";
    fi
#
# If the json doesn't exist, fallback to default url
#
else
    APIURL="http://hi.link/api/sms"
fi

#
# Send the request
#
/usr/bin/curl --header "X-Requested-With XMLHttpRequest" --silent $CURL_AUTH_OPTIONS --data \
"<request>
<Index>-1</Index>
<Phones><Phone>$1</Phone>
</Phones><Sca>$SMSServicecenter</Sca>
<Content>$2</Content>
<Length>${#2}</Length>
<Reserved>1</Reserved>
<Date>$(date +"%Y-%m-%d %T")</Date>
</request>" $APIURL/send-sms
