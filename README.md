# SMS Gateway (Huawei E303)

![](image.jpg)


# 1. What is this?
An SMS-Gateway is a server that provides an API for sending and/or receiving SMS (Small Message Service) messages, commonly known as "texts". A SIM card and some form of mobile network hardware is required; for this tutorial, we use a Hauwei E303 as the hardware.

The E303 provides a web front-end which we will reverse proxy via Nginx. It also provides an XML API for programmatic access.

# 2. Information about the E303
The E303 is a USB modem by Huawei supporting `UMTS/HSUPAGSM/GPRS/EDGE` (2G/3G) and with the following data modes `HSDPA 7.2Mbps/HSUPA 5.76Mbps`.

When running in `cdc_ether` mode, it appears as an ethernet device with the following mac `58:2c:80:13:92:63`.
Depending on your system, it may either show up as eth1,eth2 etc or have the following `persistent` name `enx582c80139263`

# 3. Accessing the management interface  

**Warning: Make sure your lan isn't running on 192.168.1.0/24**

Often, when first connected, it defaults to *"modem"* mode where it acts as a dumb serial modem, interfacing via `AT` commands. For our purposes, we need it in ethernet mode, to change modes, run the following command (as root):

    # Change to cdc_ether mode
    usb_modeswitch -v 12d1 -p 1f01 -M '55534243123456780000000000000011062000000101000100000000000000'

We then need to find the interface name, we can do by grepping the mac address

    hilink_dev=$(ip -4 -oneline link | grep 58:2c:80:13:92:63 | awk '{print $2}' | tr -d ':')

Now we can set the address

    ip -4 address add 192.168.1.2/30 dev $hilink_dev

# 4. Accessing the HTML interface

Now we can attempt to access the Web UI by going to http://192.168.1.1

![](/webui.png)

# 5. Nginx reverse proxy

Once set up, LAN hosts should put the appropriate ip as `hi.link` in their ``/etc/hosts`

**/etc/nginx/sites-enabled/hi.link  
SSL recommended!**

    server
    {
            server_name hi.link;
            listen 80;
            root /var/www/html/hi.link;
            index index.html;
            error_page 404 = @hilink;
            location @hilink
            {
                    proxy_pass http://192.168.1.1;
                    proxy_set_header Host hi.link;
                    proxy_set_header X-Forwarded-For $remote_addr;
                    auth_basic "Restricted Content";
                    auth_basic_user_file /etc/nginx/.htpasswd;
            }

    }

**/var/www/html/hi.link/index.html  
Automatic redirect
**

    <meta http-equiv="Refresh" content="seconds; url=/html/index.html">      

# 5. Getting SMS

    curl --header "X-Requested-With XMLHttpRequest" --data "<request>
             <PageIndex>1</PageIndex>
             <ReadCount>1</ReadCount>
             <BoxType>1</BoxType>
             <SortType>0</SortType>
             <Ascending>0</Ascending>
             <UnreadPreferred>1</UnreadPreferred>
    </request>" hi.link/sms/sms-list --silent

# 6. Sending SMS

    curl --data "<request>
             <Index>-1</Index>
             <Phones>
             <Phone>$1</Phone>
             </Phones>
             <Sca></Sca>
             <Content>$2</Content>
             <Length>${#2}</Length>
             <Reserved>1</Reserved>
             <Date>$(date +"%Y-%m-%d %T")</Date>
    </request>" hi.link/api/sms/send-sms

# 7. Checking notifications

  curl hi.link/api/monitoring/check-notifications
  <?xml version="1.0" encoding="UTF-8"?>
  <response>
  <UnreadMessage>0</UnreadMessage>
  <SmsStorageFull>0</SmsStorageFull>
  <OnlineUpdateStatus>13</OnlineUpdateStatus>
  </response>


# 8. Protect the interface against other users
When connected, the device is accessible to all users without authentication.
We want to make sure that only the `nginx` user is able to access the device. Remember, users authenticate through the nginx reverse proxy.

We can restrict prohibit access to 192.168.1.1 from any user *except* `www-data`.
Please note, this involves setting a default `DROP` policy for the OUTPUT chain

**Be careful you don't break things :) **

    -P OUTPUT DROP
    -A OUTPUT -m conntrack --ctstate INVALID -j DROP
    -A OUTPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT

    # Allow any outbound connection from root
    -A OUTPUT -m owner --uid-owner root -j ACCEPT

    # Allow outbound connection to 192.168.1.1 from `www-data`
    -A OUTPUT -d 192.168.1.1/32 -m owner --uid-owner www-data -j ACCEPT

    # Allow any outbound connection except 192.168.1.1 from user
    -A OUTPUT ! -d 192.168.1.1/32 -m owner --uid-owner 1000 -j ACCEPT
