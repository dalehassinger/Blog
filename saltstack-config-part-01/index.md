# VMware vRealize SaltStack Config as a Windows Server Admin - Part 1


**Part 1: How to use SaltStack Config with Windows Server and PowerShell**

<!--more-->

---

I have recently started looking at using **VMware vRealize SaltStack Config**. This blog is a work in progress on my journey with Salt. I started at **zero** and let's see what I discover as I work towards getting to **PROD**. So if this topic is interesting to you, check back often.  

I wanted to learn one of the server configuration products that are available like Salt, Puppet, Chef, Ansible, etc... but I wasn't sure which would be the best choice long term.  When VMware purchased SaltStack Config the product to choose became a lot easier for me. SaltStack Config is included with vRealize Suite for licensing and I can call VMware support for help, SaltStack Config became the obvious product to pick.  

I like to show how to use VMware vRealize Products from a **Windows Server Admin** point of view.  I do work with both Windows Servers and Linux Servers but most information you see online with Salt is using Linux Servers. I also do most of my current automation with PowerShell scripts. I do not want to lose all the time invested into the logic with my current PowerShell scripts.      


---

I am not going to go thru the process to install SaltStack Config.  There is already some very good blogs written on installing SaltStack Config. One item I would recommend with installing Salt-Stack Config is to use VMware vRealize Life Cycle Manager ("LCM"). LCM makes the process to install SaltStack Config a lot easier. This Blog is assuming you already installed SaltStack Config, now how do I use salt and what do I use salt for.  

###### <a href="https://docs.vmware.com/en/vRealize-Automation/8.4/install-configure-saltstack-config/GUID-DBE6D84B-0D4B-4747-8291-B0D80851CE62.html" target="_blank">Installing and Configuring SaltStack Config</a>

---

###### The first step (minions):

After you get a working SaltStack Config Server setup, the first item you need to do is add the salt agent to some "Test" servers. Servers that have the salt agent installed are called minions. There is the option to not add the salt agent to servers but then you need to use SSH to connect.  Windows Servers do not have SSH available as default so you would need to install an SSH server like OpenSSH on your servers. My thoughts are I need to add something for the minions to communicate with the salt-master. Instead of adding OpenSSH to every Windows Server I chose to install and use the salt agent.  

For testing you can manually install the minion agent on a server to become familiar with how the salt commands work. During the install there are two values you need to enter. The name of the master and the name you want to use for the minion. I did that on my first couple test servers but then I created some PowerShell code to install the salt minion agent.
{{< highlight powershell >}}
# ----- [ Install minion ] -----------------------------------------------

# Define Username/Password
$username = 'username@vCROCS.info'

# The next line is how to create the encrypted password
# Read-Host -Prompt "Enter your password - username" -AsSecureString | ConvertFrom-SecureString | Out-File "C:\PWkey\username.key"
$password = Get-Content "C:\PWkey\username.key" | ConvertTo-SecureString
$cred = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $password

# ----- [ This section connects you to vCenter where VM is located ] -----

# Connect to vCenter
vCenterName = 'vCenter.vCROCS.info'
Connect-VIServer $vCenterName -Credential $cred

# ----- [ Install Salt Agent ] -------------------------------------------

# Name of Server to install the salt minion agent
$vmName = 'DBH-217'

# Copy the minion agent file to your windows server
Copy-VMGuestFile -Source G:\Salt-Minion-2019.2.4-Py3-AMD64-Setup.exe -Destination 'C:\vCROCS' -VM $vmName -LocalToGuest -GuestCredential $cred

# command string to install the Salt Minion Agent
$PSText = 'C:\vCROCS\Salt-Minion-2019.2.4-Py3-AMD64-Setup.exe /S /master=salt /minion-name=' + $vmName

# Run the command on remote Server
Invoke-VMScript -VM $VMName -ScriptType bat -ScriptText $PSText -GuestCredential $cred

{{< /highlight >}}

After the minion agent is installed on your server you need to accept the key on the salt master. From the CLI you can run these commands.

List all keys. You should see you new minion listed in the Unaccepted Keys:
{{< highlight powershell >}}salt-key -L{{< /highlight >}}

Accept the new minion key on the salt master:
{{< highlight powershell >}}salt-key --accept="DBH-217"{{< /highlight >}}

If you list all keys again you should see you new minion listed in the Accepted Keys:
{{< highlight powershell >}}salt-key -L{{< /highlight >}}

My next update will include information on how to auto accept new minions.

---
###### Here are some basic salt commands from CLI that I have been using:
**Show all events:**  
{{< highlight powershell >}}salt-run state.event{{< /highlight >}}

{{< image title="" w="" h="" o="webp q1" p="center" c="rounded" src="images/post/salt-03.png" >}}
<a href="https://github.com/dalehassinger/geeky/raw/main/assets/images/post/salt-03.png" target="_blank">Click Here to see Larger Image of Screen Shot</a>


**Show all events with a "Pretty" view:**  
{{< highlight powershell >}}salt-run state.event pretty=true{{< /highlight >}}

{{< image title="" w="" h="" o="webp q1" p="center" c="rounded" src="images/post/salt-02.png" >}}
<a href="https://github.com/dalehassinger/geeky/raw/main/assets/images/post/salt-02.png" target="_blank">Click Here to see Larger Image of Screen Shot</a>


**List keys:**  
{{< highlight powershell >}}salt-key -L{{< /highlight >}}

**Accept Key:**
{{< highlight powershell >}}salt-key --accept="DBH-214"{{< /highlight >}}

**Delete Key:**
{{< highlight powershell >}}salt-key -d "DBH-211,DBH-212"{{< /highlight >}}

**Run a function on one minion:**
{{< highlight powershell >}}salt "DBH-217" disk.usage{{< /highlight >}}

**Run a function on multiple minions:**
{{< highlight powershell >}}salt "DBH-217,DBH-218" test.ping{{< /highlight >}}

**Run a function on all minions:**
{{< highlight powershell >}}salt "*" test.ping{{< /highlight >}}

**Create a file:**
{{< highlight powershell >}}salt "DBH-214" file.touch C:\vCROCS\salt.tst{{< /highlight >}}

**Copy a file:**
{{< highlight powershell >}}salt "DBH-214" cp.get_file salt://vCROCS/vCROCSTEST.ps1 "C:\vCROCS\vCROCSTEST.ps1"{{< /highlight >}}

**Delete a file:**
{{< highlight powershell >}}salt "DBH-214" file.remove "C:\vCROCS\vCROCSTEST.ps1"{{< /highlight >}}

**Run a PowerShell Script:**
{{< highlight powershell >}}salt "DBH-214" cmd.script source="salt://vCROCS/vCROCSTEST.ps1" shell=powershell{{< /highlight >}}

**Restart the Salt Master Service:**
{{< highlight powershell >}}service salt-master restart{{< /highlight >}}

**Show the status of the raas and salt-master services:**
{{< highlight powershell >}}
systemctl status raas
systemctl status salt-master
{{< /highlight >}}

**Stop and start the salt-master service:**
{{< highlight powershell >}}
systemctl stop salt-master
systemctl start salt-master
{{< /highlight >}}

**Get IP address of all minions:**
{{< highlight powershell >}}salt '*' network.ip_addrs{{< /highlight >}}

**Ping All Minions:**
{{< highlight powershell >}}salt "*" test.ping{{< /highlight >}}

**Disk Space Usage on all Minions:**
{{< highlight powershell >}}salt "*" disk.usage{{< /highlight >}}

---

###### Lessons Learned:
* Anything you can do in the SaltStack Config GUI you can do in CLI. I find myself using the CLI for most testing. After I have the commands correct I will then add into the GUI.
* DO NOT have the minion agent version newer than the Salt-Master. I am going to try and keep the salt-master and minions always at the same version. The minion can be at an older version than the salt-master.
* During my upgrade from SaltStack Config 8.3 to 8.4 the Salt API did not upgrade. I didn't remember seeing any errors in LCM after the upgrade. The raas service was at version 8.4 and the salt API was at 8.3.  I had authentication issues, I could not accept keys, etc... I opened an SR with VMware and they helped me fix the issue. The support I received from VMware with Salt was probably the best support I received on any VMware product.

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
