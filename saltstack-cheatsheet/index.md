# VMware vRealize SaltStack Config cheat sheet for a Windows Server Admin


Salt functions that I find myself using the most.

<!--more-->

---

I have been using VMware vRealize SaltStack Config for several months and I thought I would share and create my own cheat sheet to show which functions I use the most as a Windows Server admin and how to format the syntax. I still feel that I barely use all the capabilities that salt has to offer. SaltStack Config is a very Powerful tool to have available for anyone that has a vRealize Suite License. As a Windows Server admin don't be afraid of salt because you feel it was made for Linux admins.  That is NOT the case. I will be managing all Windows Server in my environment with salt.  That includes VMs in vCenter and cloud native Azure VMs.  

This cheat sheet will be updated often to show examples as my journey into the salt world continues. Check back often.  

[Link to salt module Documentation](https://docs.saltproject.io/en/latest/py-modindex.html)

---

###### Ping - Make sure server responds:

```Bash
 
> Command:
salt "vCROCS01" test.ping OR salt "*" test.ping OR salt "vC*" test.ping

> Results:
vCROCS01:
    True

> Command using --output=json:
salt "vCROCS01" test.ping --output=json

> Results:
{
    "vCROCS01": true
}
 
```

###### Windows Disk Usage:

```Bash
 
> Command:
salt "vCROCS01" disk.usage

> Results:
vCROCS01:
    ----------
    C:\:
        ----------
        1K-blocks:
            67642364.0
        available:
            15229492.0
        capacity:
            77%
        filesystem:
            C:\
        used:
            52412872.0
    E:\:
        ----------
        1K-blocks:
            41809856.0
        available:
            38486208.0
        capacity:
            8%
        filesystem:
            E:\
        used:
            3323648.0

> Command:
salt "vCROCS01" disk.usage --output=json

> Results:
{
    "vCROCS01": {
        "C:\\": {
            "filesystem": "C:\\",
            "1K-blocks": 67642364.0,
            "used": 52424392.0,
            "available": 15217972.0,
            "capacity": "78%"
        },
        "E:\\": {
            "filesystem": "E:\\",
            "1K-blocks": 41809856.0,
            "used": 3323648.0,
            "available": 38486208.0,
            "capacity": "8%"
        }
    }
}
 
```

###### Windows Services:

```Bash
 
> Command stop a Windows Service:
salt "vCROCS01" service.stop "spooler"

> Results:
vCROCS01:
    True

> Command disable a Windows Service:
salt "vCROCS01" service.disable "spooler"

> Results:
vCROCS01:
    True

> Command get status of a Windows Service:
salt "vCROCS01" service.status "spooler"

> Results:
vCROCS01:
    False

> Command see if a Windows Service is enabled:
salt "vCROCS01" service.enabled "spooler"

> Results:
vCROCS01:
    False

```

###### Copy files to | Delete files from | Windows Server:

```Bash
 
> Command Copy a file to a Windows Service - Source File | Destination File:
salt "vCROCS01" cp.get_file "salt://installer_file.msi" "C:\install_files\installer_file.msi"

> Results:
vCROCS01:
    C:\install_files\installer_file.msi

> Command Delete a file from a Windows Service:
salt "vCROCS01" file.remove 'C:\install_files\installer_file.msi'

> Results:
vCROCS01:
    True
 
```

###### minion grain data:

```Bash
 
> Command add grain data to a minion:
salt "vCROCS01" grains.append azure_vm "True"
vCROCS01:
    ----------
    azure_vm:
        - True

> Command get grain custom data from a minion:
salt "vCROCS01" grains.get azure_vm

> Results:
vCROCS01:
    - True

> Command get grain os data from a minion:
salt "vCROCS01" grains.get os

> Results:
vCROCS01:
    Windows

> Command get grain os data from a minion:
salt "vCROCS01" grains.get osfullname

> Results:
vCROCS01:
    Microsoft Windows Server 2016 Datacenter

> Command get grain domain data from a minion:
salt "vCROCS01" grains.get domain

> Results:
vCROCS01:
    vcrocs.info

> Command get grain IP data from a minion:
salt "vCROCS01" grains.get fqdn_ip4

> Results:
vCROCS01:
    - 192.168.99.99

> Command sync minion grain data with salt master:
salt "vCROCS01" saltutil.sync_grains

> Results:
vCROCS01:
 

```

###### PowerShell:

```Bash
 
> Command run powershell command:
salt "vCROCS01" cmd.run 'Get-Service | Where-Object {$_.Status -eq "Running"}' shell=PowerShell

> Results:
vCROCS01:

    Status   Name               DisplayName
    ------   ----               -----------
    Running  AppHostSvc         Application Host Helper Service
    Running  BFE                Base Filtering Engine
    Running  BrokerInfrastru... Background Tasks Infrastructure Ser...
    Running  CbDefense          CB Defense
    Running  CDPSvc             Connected Devices Platform Service
    Running  CertPropSvc        Certificate Propagation
    Running  COMSysApp          COM+ System Application
    Running  CoreMessagingRe... CoreMessaging

> Command run powershell script with script saved on salt master File Server: 
salt "vCROCS01" cmd.script source="salt://dev/qualys_install_azure.ps1" shell=powershell

> Results:
Runs all line of code in script the same as if script was saved local on minion.
 
```

###### Minion Reboot:

```Bash
 
> Command minion reboot:
salt "vCROCS01" system.reboot 0

> Results:
vCROCS01:
    True
 
```

###### Join Domain:

```Bash
 
> Command join minion to a Windows Domain. You can also specify OU that computer object will be located:
salt "vCROCS01" system.join_domain domain='vcrocs.info' username='vcrocs\administrator' password='VMware1!' account_ou='OU=Dev,OU=Servers,DC=vcrocs,DC=info' account_exists=False restart=True
 
```

###### Windows Registry:

```Bash
 
> Command add a registry key to minion or change value of an existing registry key:
salt "vCROCS01" reg.set_value HKEY_LOCAL_MACHINE 'SYSTEM\vCROCS' 'Created_by_User' 'dhassinger'

> Results:
vCROCS01:
    True
 
```

{{< image src="registry01.png" caption="Click to see Larger Image">}}  

<div><br></div>

<div style="background-color:#fff5e6; Padding:20px; color: black;" >
    <b>Salt Links I found to be very helpful:</b>
        <ul>
          <li><a href="https://sites.google.com/site/mrxpalmeiras/saltstack/salt-cheat-sheet" target="_blank">SaltStack Cheat Sheet</a></li>
          <li><a href="https://docs.saltproject.io/en/getstarted/"                            target="_blank">SaltStack Tutorials</a></li>
          <li><a href="https://docs.saltproject.io/en/latest/contents.html"                   target="_blank">SaltStack Documentation</a></li>
          <li><a href="https://saltstackcommunity.slack.com"                                  target="_blank">SaltStack Community Slack Channel</a></li>
          <li><a href="https://learnvrealizeautomation.github.io"                             target="_blank">Learn vRealize Automation</a></li>
          <li><a href="https://learnsaltstackconfig.github.io/"                               target="_blank">Learn SaltStack Config</a></li>
        </ul>
</div>

<div style="background-color:#ccffcc; Padding:20px;" >
When I write about <b>vRealize Automation</b> ("vRA") I always say there are many ways to accomplish the same task. <b>SaltStack Config</b> is the same way.  I am showing what I felt was important to see but every organization/environment will be different. There is no right or wrong way to use Salt. This is a <b>GREAT Tool</b> that is included with your vRealize Suite Advanced/Enterprise license. If you own the vRealize Suite, you own SaltStack Config.
</div>


