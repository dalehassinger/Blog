# VMware vRealize SaltStack Config as a Windows Server Admin - Part 5


**Part 5: How to use SaltStack Config with Windows Server and PowerShell**

<!--more-->

---

The latest item on my journey with <b>VMware vRealize SaltStack Config</b> as a <b>Windows Server Admin</b> will be an update to some items that I have talked about in previous posts. I have been spending more time with <b>VMware vRealize SaltStack Config</b> and I have learned some better ways to do some of the processes that I have talked about already. My goal to to learn and use the built-in functions that are already in the product. I found that using the salt functions require less coding and better logging.

First example of changing how I am going to use <b>VMware vRealize SaltStack Config</b>. When I first started looking at grains I thought I would edit the grains file with PowerShell and add the grains content to the file.  What I did worked but I think I learned a better way. There is a function grains.append that will append grains data to the grains file on the minion. This works much better and when I run a job to add grains information it is listed in Activity Completed within <b>VMware vRealize SaltStack Config</b>. I like to be able to see when changes are made by the jobs that are run.  

The code that I have listed below to get vCenter TAGs assigned to a VM and add the information to the minion is using PowerShell. To use this script you <b>MUST</b> install the PowerShell Module POSH-SSH. The process I am showing connects to a vCenter, creates a SSH Connection to the Salt Server, gets all assigned vCenter TAGs for a VM, , runs salt commands to add grain information to the grains file of a minion, and then runs a minion grains sync. This concept can be used for a lot of different systems. If you want to add NSX-T Security TAGs as grain information (Thanks Karl Hauck for this idea), AD (Active Directory) OU of the Windows Server, or anything you think would be useful to Target minions within <b>VMware vRealize SaltStack Config</b>.  

I really like the idea of using POSH-SSH to make the SSH connection to the Salt Master Server and running commands. I do a lot of Automation within vRA (vRealize Automation) with PowerShell and I can use this same concept to use <b>VMware vRealize SaltStack Config</b> to complete the processes that need run. I can also create Catalog items within vRA that you can make available to APP Teams to use. The Catalog item could be running salt jobs in  <b>VMware vRealize SaltStack Config</b>. Cool Stuff!

---

###### Grains File:  
This is what I learned about salt grains when using with a Windows OS.
* The default location of the grains file is in directory "C:\salt\conf\".
* The grains file is named grains with no extension.  

###### Example grains file:

{{< highlight powershell >}}
NSXSecurityTAGs:
- vCROCS.Apps.VMware.SaltStack.Minion
vCenterTAGs:
- TAG-VM-WebServer
- TAG-VM-vCROCS
- TAG-App-Hugo
{{< /highlight >}}

* "Grain Name": "The value of the grain".
* In my example I wanted the grain to be named "vCenterTags" and the values will be the vCenter TAG names "TAG-VM-vCROCS, TAG-VM-WebServer, TAG-App-Hugo". I have (3) vCenter TAGs assigned to this VM.  I will be able to create a SaltStack Config Target based on any of the TAGs.
*  I like the formatting that is used for the grains file by using the function grains.append.

---

###### SaltStack Config Targets:

When I add the vCenter TAG information to the grains file I am then able to create SaltStack Config Targets based on the grain "vCenterTags".
 
###### SaltStack Config Targets:

{{< image src="Salt-42.PNG" caption="Click to see Larger Image">}}  

###### SaltStack Config Target Definition:

{{< image src="Salt-41.PNG" caption="Click to see Larger Image">}}  

How to add the vCenter TAGs to the grains file on all your VMs in SaltStack Config:

Get the VM Names and All Assigned vCenter TAGs

PowerShell Script:
{{< highlight powershell >}}
# ----- [ SSH SaltStack Config Server - Add vCenter TAGs to Minion Grains ] --------------------------

# Connect to vCenter before running this code
# Define your Credentials

# SSH to SaltStack Server - MUST HAVE POSH-SSH PowerShell Module Installed 
New-SSHSession -ComputerName 'SaltServer.vCROCS.info' 

# Test SSH Connection
$CheckSSHConnection = Get-SSHSession -SessionId 0
$CheckSSHConnection.Connected

$vmNames = Get-VM -Name vCROCS-VM-*
$vmNames = $vmNames | Sort-Object Name

foreach($vmName in $VMNames){
    $vmName.Name

    #Get VM Tag(s)
    $VMTags = Get-TagAssignment -Entity $vmName.Name
    $VMTags.Tag.Name

    foreach($vmTAG in $VMTags.Tag.Name){

        $sshCommand = 'salt "' + $vmName.Name + '" grains.append vCenterTAGs "' + $vmTAG + '"'
        $results = Invoke-SSHCommand -SessionId 0 -Command $sshCommand
    } # End Foreach

    # Sync Grains after adding new grain information
    $sshCommand = 'salt "' + $vmName.Name + '" saltutil.sync_grains'
    $results = Invoke-SSHCommand -SessionId 0 -Command $sshCommand
} # End Foreach

# ----- [ Terminate SSH Session ] -----------------------------
Remove-SSHSession -SessionId 0

{{< /highlight >}}

###### Lessons Learned:
* Adding the POSH-SSH PowerShell module so you can create a SSH connection to the salt master opens up a lot of possibilities for your PowerShell Automation as a Windows Server Admin.
* Grains are a good way to create SaltStack Config Targets. Allows you to group VMs together the same way you can in vCenter.
* The Grains file is basically a Database that can be any information that you want to show about your VMs. In this Blog post I am adding vCenter TAGs to the minions but the information could be anything that helps you target VMs.
* If the default list of grains OOTB doesn't show the information you want to see, you can easily add your own gains with a little bit of code.

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
