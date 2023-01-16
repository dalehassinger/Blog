# VMware vRealize SaltStack Config as a Windows Server Admin - Part 9


Part 9: Using salt-api with PowerShell for Windows Server Automation

<!--more-->

---

This post is to show how to use PowerShell to make RESTful API calls to SaltStack Config. This is something that I have wanted to do for awhile. I could never find any examples in my Google searches, so I took the time to learn how the examples that use curl work and translated that into PowerShell Code. I hope some Windows Server Admins will find this post helpful. I like using salt to do Windows Server Configuration Management more than remote PowerShell. You can run changes against many servers at the exact same time instead of looping thru a list of servers names.

I am also going to look at use salt-api with vRealize Automation ABX action scripts.

In some previous posts I used the POSH-SSH module but when you use the salt-api, the PowerShell Module POSH-SSH is no longer needed.

---

###### Configuration Changes to the  SaltStack Config Server:

<div>
  <b>My SaltStack Config Server (SSC) is what VMware provides when using Life Cycle Manager (LCM) running Photon OS.</b>
</div>
<div>
  <b>The following steps are what I needed to do in my Lab environment from the SSC CLI to enable salt-api:</b>
</div>
<div>
  <br>
</div>
<div>
  <b> * Always make sure you have a good snap | backup before making any changes to SSC Server</b>
</div>
<div>
  <br>
</div>

* Install CherryPy:

{{< highlight powershell >}}
pip3 install cherrypy
{{< /highlight >}}

* Install the PyOpenSSL package:

{{< highlight powershell >}}
pip3 install pyopenssl
{{< /highlight >}}

* Generate a self-signed certificate: 

{{< highlight powershell >}}
salt-call --local tls.create_self_signed_cert
{{< /highlight >}}

* open firewall port 8000:

{{< highlight powershell >}}
iptables -A INPUT -i eth0 -p tcp --dport 8000 -j ACCEPT
{{< /highlight >}}


* Edit /etc/salt/master file: 

{{< highlight powershell >}}
vi /etc/salt/master
{{< /highlight >}}

Add these lines to the /etc/salt/master file: 

{{< highlight powershell >}}
external_auth:
  pam:
    root:
      - .*

rest_cherrypy:
  port: 8000
  ssl_crt: /etc/pki/tls/certs/localhost.crt
  ssl_key: /etc/pki/tls/certs/localhost.key
{{< /highlight >}}

* Restart salt-master and check service status for any errors:

{{< highlight powershell >}}
systemctl restart salt-master
systemctl status salt-master
{{< /highlight >}}

* Enable | Start salt-api and check service status for any errors:

{{< highlight powershell >}}
systemctl enable salt-api
systemctl start salt-api
systemctl status salt-api
{{< /highlight >}}

---

###### Tests to make sure SaltStack Config Changes are working:

* I did all this PowerShell code from my mac.  To use self-signed certs I use -SkipCertificateCheck. On a Windows OS the code is different.

{{< highlight powershell >}}
# --- PowerShell Code ---
Invoke-WebRequest -Uri 'https://192.168.86.141:8000' -SkipCertificateCheck

Results:

StatusCode        : 200
StatusDescription : OK
Content           : {"return": "Welcome", "clients": ["local", "local_async", "local_batch", "local_subset", "runner", "runner_async", "ssh", "wheel", "wheel_async"]}
RawContent        : HTTP/1.1 200 OK
                    Server: CherryPy/8.9.1
                    Date: Sat, 11 Jun 2022 20:57:46 GMT
                    Access-Control-Allow-Origin: *
                    Access-Control-Expose-Headers: GET, POST
                    Access-Control-Allow-Credentials: true
                    Vary: Accept-E…
Headers           : {[Server, System.String[]], [Date, System.String[]], [Access-Control-Allow-Origin, System.String[]], [Access-Control-Expose-Headers, 
                    System.String[]]…}
Images            : {}
InputFields       : {}
Links             : {}
RawContentLength  : 146
RelationLink      : {}
{{< /highlight >}}

* Make sure you see StatusCode: 200

* Next step is to make sure you get a token:

{{< highlight powershell >}}
# --- PowerShell Code ---
# --- In my code I show the PassWord. In Production DO NOT DO THIS.
# --- There are so many different ways to include encrypted PWs in the code. 
# --- Use what works best in your environment.

$saltServerAddress = 'https://192.168.86.110:8000'

# --- Set the json body
$body = '{ "username": "root","password": "HackMe!","eauth": "pam"}'

# --- Fetch New Token from salt master
$url = "$saltServerAddress/login"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

$fetch
$fetch.return.token

Results:

return
------
{@{token=6696846c802f78d5326a69b79d36e95015d37f5a; expire=1655025071.22838; start=1654981871.22838; user=root; eauth=pam; perms=System.Object[]}}
6696846c802f78d5326a69b79d36e95015d37f5a

{{< /highlight >}}

* You will see "token=" in the return data

---

###### PowerShell API Code Examples:  

* Run a test.ping

{{< highlight powershell >}}
# --- PowerShell Code ---
$minionName        = '2019DC'
$saltServerAddress = 'https://192.168.86.110:8000'
$userName          = 'root'
$password          = 'HackMe!'
$fun               = 'test.ping'
$fetch             = ''

# --- Set the json body
$body = '{ "username": "' + $userName + '","password": "' + $password + '","eauth": "pam","tgt": "' + $minionName + '","fun": "' + $fun + '","client": "local"}'

# --- Create RESTful API Request
$url = "$saltServerAddress/run"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

# --- Showing different ways to show the return data
#$fetch
$fetch.return
$fetch.return.$minionName
{{< /highlight >}}

* Check disk.usage

{{< highlight powershell >}}
# --- PowerShell Code ---
$minionName        = '2019DC'
$saltServerAddress = 'https://192.168.86.110:8000'
$userName          = 'root'
$password          = 'HackMe!'
$fun               = 'disk.usage' # -salt function
$fetch             = ''

# --- Set the json body
$body = '{ "username": "' + $userName + '","password": "' + $password + '","eauth": "pam","tgt": "' + $minionName + '","fun": "' + $fun + '","client": "local"}'

# --- Create RESTful API Request
$url = "$saltServerAddress/run"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

# --- Showing different ways to show the return data
$fetch.return
$fetch.return.$minionName
$fetch.return.$minionName.'C:\'
$fetch.return.$minionName.'C:\'.capacity
{{< /highlight >}}

* Check Service Status

{{< highlight powershell >}}
# --- PowerShell Code ---
$minionName        = '2019DC'
$saltServerAddress = 'https://192.168.86.110:8000'
$userName          = 'root'
$password          = 'HackMe!'
$fun               = 'service.status' # -salt function
$arg               = 'spooler' # -Service Name
$fetch             = ''

# --- Set the json body
$body = '{"username": "' + $userName + '","password": "' + $password + '","eauth": "pam","tgt": "' + $minionName + '","fun": "' + $fun + '","arg": "' + $arg + '","client": "local"}'

# --- Create RESTful API Request
$url = "$saltServerAddress/run"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

# --- Service Status | True = Running | False = Stopped
$fetch.return.$minionName
{{< /highlight >}}

* Stop Service

{{< highlight powershell >}}
# --- PowerShell Code ---
$minionName        = '2019DC'
$saltServerAddress = 'https://192.168.86.110:8000'
$userName          = 'root'
$password          = 'HackMe!'
$fun               = 'service.stop' # -salt function
$arg               = 'spooler' # -Service Name
$fetch             = ''

# --- Set the json body
$body = '{"username": "' + $userName + '","password": "' + $password + '","eauth": "pam","tgt": "' + $minionName + '","fun": "' + $fun + '","arg": "' + $arg + '","client": "local"}'

# --- Create RESTful API Request
$url = "$saltServerAddress/run"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

# --- Service Stopped | True = Stopped | False = Not Stopped
$fetch.return.$minionName
{{< /highlight >}}

* Disable Service

{{< highlight powershell >}}
# --- PowerShell Code ---
$minionName        = '2019DC'
$saltServerAddress = 'https://192.168.86.110:8000'
$userName          = 'root'
$password          = 'HackMe!'
$fun               = 'service.disable' # -salt function
$arg               = 'spooler' # -Service Name
$fetch             = ''

# --- Set the json body
$body = '{"username": "' + $userName + '","password": "' + $password + '","eauth": "pam","tgt": "' + $minionName + '","fun": "' + $fun + '","arg": "' + $arg + '","client": "local"}'

# --- Create RESTful API Request
$url = "$saltServerAddress/run"

$Params = @{
    Method = "Post"
    Uri = $url
    Body = $Body
    ContentType = "application/json"
}
$fetch = Invoke-RestMethod @Params -SkipCertificateCheck

# --- Service Disabled | True = Disabled | False = Not Disabled
$fetch.return.$minionName
{{< /highlight >}}

* I hope the code was helpful to get started.

---

###### Lessons Learned:
* OOTB (Out of the Box) a SaltStack Config Server is NOT setup to use CherryPY to use api calls.
* Using PowerShell Invoke-RestMethod is a great way to automate SaltStack Config.
* The more I use salt with Windows Servers the more I like how it works.  So fast. Many different ways to do automation | configuration Management.
* To get the proper args for a salt function I always test from the CLI.
* <a href="https://docs.saltproject.io/en/latest/ref/netapi/all/salt.netapi.rest_cherrypy.html" target="_blank">SaltStack REST_CHERRYPY Documentation</a>
* <a href="https://docs.saltproject.io/en/latest/topics/eauth/index.html"                       target="_blank">SaltStack EXTERNAL AUTHENTICATION SYSTEM Documentation</a>


---

###### Salt Links I found to be very helpful:
* <a href="https://sites.google.com/site/mrxpalmeiras/saltstack/salt-cheat-sheet" target="_blank">SaltStack Cheat Sheet</a>
* <a href="https://docs.saltproject.io/en/getstarted/"                            target="_blank">SaltStack Tutorials</a>
* <a href="https://docs.saltproject.io/en/latest/contents.html"                   target="_blank">SaltStack Documentation</a>
* <a href="https://saltstackcommunity.slack.com"                                  target="_blank">SaltStack Community Slack Channel</a>
* <a href="https://learnvrealizeautomation.github.io"                             target="_blank">Learn vRealize Automation</a>
* <a href="https://learnsaltstackconfig.github.io/"                               target="_blank">Learn SaltStack Config</a>

<div style="background-color:#ccffcc; Padding:20px;" >
When I write about <b>vRealize Automation</b> ("vRA") I always say there are many ways to accomplish the same task.  <b>SaltStack Config</b> is the same way.  I am showing what I felt was important to see but every organization/environment will be different. There is no right or wrong way to use Salt. This is a <b>GREAT Tool</b> that is included with your vRealize Suite Advanced/Enterprise license. If you own the vRealize Suite, you own SaltStack Config.
</div>
