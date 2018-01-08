#! /bin/bash

#
# Parse authentication and URL from json
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
# Fall back to hi.link/api/sms url with no auth
#
else
  APIURL="http://hi.link/api/sms"
fi

#
# If an argument is provided, then it's json containing the request options
#
if [[ -n $1 && -f $1 ]]; then
  PageIndex=$(jq .PageIndex < $1 );
  ReadCount=$(jq .ReadCount < $1 );
  SortType=$(jq .SortType < $1 );
  BoxType=$(jq .BoxType  < $1 );
  Ascending=$(jq .Ascending  < $1 );
  UnreadPreferred=$(jq .UnreadPreferred  < $1 );
#
# Defaults if no argument is provided
#
else
    PageIndex=1;
    ReadCount=3;
    SortType=0;
    BoxType=1;
    Ascending=0;
    UnreadPreferred=1;
fi


#
# Prepare the request XML
#
data="<request><PageIndex>$PageIndex</PageIndex><ReadCount>$ReadCount</ReadCount><BoxType>$BoxType</BoxType><SortType>$SortType</SortType><Ascending>$Ascending</Ascending><UnreadPreferred>$UnreadPreferred></UnreadPreferred></request>"

#
# Send the Request
#
/usr/bin/curl --header "X-Requested-With XMLHttpRequest" --silent $CURL_AUTH_OPTIONS --data $data $APIURL/sms-list
