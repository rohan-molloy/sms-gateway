# Binaries for sending/receiving SMS

These are configured by `sms.json` which looks like this

    {

            "APIProtocol": "https",
            "APIHost": "hilink.etherarp.net",
            "APILocation":"/api/sms",
            "AuthenticationType": "basic",
            "AuthenticationCommand": "/usr/bin/pass sms-gateway 2>/dev/null",
            "SMSServicecenter":"0123456789"
    }

For no authentication, set AuthenticationType to `"none"`.

Authentication types supported
 - `"basic"`
 - `"bearer"`

The AuthenticationCommand is the command to temporarily retrieve the authentication secret.

You can, for example, use `pass`, `gpg`, or simply `cat` an unencrypted file  
The choice is up to you

# Send-SMS
Sends an SMS message.  
Arguments: `number` `message`

# Get-SMS
Receives an SMS message(s). By default receives 3.  
Arguments `[request-options.json]`

Optionally takes a json file configuring the following parameters (defaults listed)


    {
      "PageIndex":1,
      "ReadCount":3,
      "SortType":0,
      "BoxType":1,
      "Ascending":0,
      "UnreadPreferred":1
    }
