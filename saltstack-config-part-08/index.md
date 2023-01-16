# VMware vRealize SaltStack Config as a Windows Server Admin - Part 8


Part 8: Pouring the salt grains

<!--more-->

---

My previous posts about grain data were to show how to add minion grain data during the creation of a new server with vRA using PowerShell. This post I want to show how I'm going to maintain the grain data that is not default out of the box grain data.

---

Windows Server grain data not available out of the of box that I want to add to every minion AND make sure the grain data stays up to date:  
* Windows Server Features | Roles
* Windows Server Installed Software
* Windows Server Running Services

---

These are the steps that I use to maintain custom grain data with a Windows Server:  
* Create a PowerShell Script that can run locally on a minion. Add the script to the SaltStack Config File Manager. Use salt-call to run salt.functions locally on a minion. See screen shot and my code examples below.
* Create a SaltStack Config Job to execute the PowerShell Script remotely on the minion. See Screen Shot. 
* Create a SaltStack Config Schedule to run the job that you create. The job can run every day, once a week, every 4 hours. Whatever makes sense for your use case. See Screen Shot.

---

If you want to run a script locally on a minion and use salt functions that is where you use the salt-call command. After you learn the salt-functions and are logged into a Windows Server locally, you can still use salt commands by using salt-call.

{{< highlight powershell >}}
# --- example code
salt-call --version
salt-call test.ping

# --- Show Disk Usage
salt-call disk.usage

# --- Show Installed Features|Roles
salt-call win_servermanager.list_installed

# --- Show Installed Sofwtare
salt-call pkg.list_pkgs
{{< /highlight >}}

[Link to salt-call Documentation](https://docs.saltproject.io/en/latest/ref/cli/salt-call.html)

---

###### Step 1 - Add script to SaltStack Config File Manager: 

See code examples below to add Windows Server Features|Roles, Installed Software, and Runnings Services as grain data.  

{{< image src="Salt-49.PNG" caption="Click to see Larger Image">}}  
{{< image src="Salt-50.PNG" caption="Click to see Larger Image">}}  

###### Step 3 - Create SaltStack Config Schedule:  

{{< image src="Salt-51.PNG" caption="Click to see Larger Image">}}  

---  

###### Code Examples:  


###### - Add Windows Features | Roles as grain data:  

{{< highlight powershell >}}
<#
.SYNOPSIS
  This Script is used to Get Windows Servers Features and add as Grain Data
.DESCRIPTION
  Windows Servers Features
.PARAMETER
  No Parameters
.INPUTS
  No inputs
.OUTPUTS
  salt grain data
.NOTES
  Version:        1.00
  Author:         Dale Hassinger
  Creation Date:  04/20/2022
  Purpose/Change: Initial script development
  Revisions:

.EXAMPLE
    N/A
#>

# ----- [ Start of Code ] ---------------------------------------------------------------------------

# --- Minion Get Windows Server Features Installed

# --- Delete existing grains features data
$saltCommand = 'salt-call grains.delkey sem_Windows_Feature force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

$saltCommand = 'salt-call win_servermanager.list_installed --output=json'
#$saltCommand

# --- Run Salt Command
$results =Invoke-Expression -Command $saltCommand
#$results
$features = $results | ConvertFrom-Json
#$features
$features = $features.local
#$features
$features = $features -split(":")
$features = $features -split(";")
$features = $features -replace("@{","")
$features = $features -replace("}","")
$features = $features.trim()
$features = $features -replace("="," | ")
$features = $features | Sort-Object
#$features


foreach($feature in $features){
    # --- Grains Append
    $saltCommand = 'salt-call grains.append sem_Windows_Feature "' + $feature + '"'
    #$saltCommand

    # --- Run Salt Command
    Invoke-Expression -Command $saltCommand

} # End Foreach

# --- Delete existing grains last update data
$saltCommand = 'salt-call grains.delkey sem_last_grains_update force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Add a Date that grains last updated
$grainsupdateDate = Get-Date
$grainsupdateDate = $grainsupdateDate.ToString("MM/dd/yyyy | hh:mm")
#$grainsupdateDate

# --- Grains Append
$saltCommand = 'salt-call grains.append sem_last_grains_update "' + $grainsupdateDate + '"'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Grains Sync
$saltCommand = 'salt-call saltutil.sync_grains'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# ----- [ End of Code ] ---------------------------------------------------------------------------
{{< /highlight >}}

---

###### - Add Windows Server Installed Packages|Software as grain data:  

{{< highlight powershell >}}
<#
.SYNOPSIS
  This Script is used to Get Windows Installed Packages and add as Grain Data
.DESCRIPTION
  Windows Servers Installed Packages
.PARAMETER
  No Parameters
.INPUTS
  No inputs
.OUTPUTS
  salt grain data
.NOTES
  Version:        1.00
  Author:         Dale Hassinger
  Creation Date:  04/20/2022
  Purpose/Change: Initial script development
  Revisions:

.EXAMPLE
    N/A
#>

# ----- [ Start of Code ] ---------------------------------------------------------------------------

# --- Minion Get Windows Server Installed Packages|Software

# --- Delete existing grains features data
$saltCommand = 'salt-call grains.delkey sem_Windows_Installed_Software force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

$saltCommand = 'salt-call pkg.list_pkgs --output=json'
#$saltCommand

# --- Run Salt Command
$results =Invoke-Expression -Command $saltCommand
#$results

$installedPackages = $results | ConvertFrom-Json
$installedPackages = $installedPackages.local
$installedPackages = $installedPackages -split(":")
$installedPackages = $installedPackages -split(";")
$installedPackages = $installedPackages -replace("@{","")
$installedPackages = $installedPackages -replace("}","")
$installedPackages = $installedPackages.trim()
$installedPackages = $installedPackages -replace("="," | ")
$installedPackages = $installedPackages | Sort-Object
#$installedPackages

foreach($installedPackage in $installedPackages){
    # --- Grains Append
    $saltCommand = 'salt-call grains.append sem_Windows_Installed_Software "' + $installedPackage + '"'
    #$saltCommand

    # --- Run Salt Command
    Invoke-Expression -Command $saltCommand
} # End Foreach

# --- Delete existing grains last update data
$saltCommand = 'salt-call grains.delkey sem_last_grains_update force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Add a Date that grains last updated
$grainsupdateDate = Get-Date
$grainsupdateDate = $grainsupdateDate.ToString("MM/dd/yyyy | hh:mm")
#$grainsupdateDate

# --- Grains Append
$saltCommand = 'salt-call grains.append sem_last_grains_update "' + $grainsupdateDate + '"'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Grains Sync
$saltCommand = 'salt-call saltutil.sync_grains'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# ----- [ End of Code ] ---------------------------------------------------------------------------

{{< /highlight >}}

---
###### - Add Windows Running Services as grain data:  

{{< highlight powershell >}}
<#
.SYNOPSIS
  This Script is used to Get Windows Servers Running Services and add as Grain Data
.DESCRIPTION
  Windows Servers Running Services
.PARAMETER
  No Parameters
.INPUTS
  No inputs
.OUTPUTS
  salt grain data
.NOTES
  Version:        1.00
  Author:         Dale Hassinger
  Creation Date:  04/20/2022
  Purpose/Change: Initial script development
  Revisions:

.EXAMPLE
    N/A
#>

# ----- [ Start of Code ] ---------------------------------------------------------------------------

# --- Minion Get Windows Server Running Services

# --- Delete existing grains running services data
$saltCommand = 'salt-call grains.delkey sem_Windows_Services_Running force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Get all Running Services
$serviceNames = Get-Service | Where-Object {$_.Status -eq 'Running'}

# --- Create Array
$servicesGrains = @()

# --- Add Service data to the array
foreach($serviceName in $serviceNames){
  $grainString = $serviceName.Name + ' | ' + $serviceName.DisplayName
  $servicesGrains = $servicesGrains + $grainString
} # End Foreach
#$servicesGrains

# --- Add Windows Running Services as Grain Data
foreach($servicesGrain in $servicesGrains){
    # --- Grains Append
    $saltCommand = 'salt-call grains.append sem_Windows_Services_Running "' + $servicesGrain + '"'
    #$saltCommand

    # --- Run Salt Command
    Invoke-Expression -Command $saltCommand

} # End Foreach

# --- Delete existing grains last update data
$saltCommand = 'salt-call grains.delkey sem_last_grains_update force=True'
#$saltCommand

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Add a Date that grains last updated
$grainsupdateDate = Get-Date
$grainsupdateDate = $grainsupdateDate.ToString("MM/dd/yyyy | hh:mm")
#$grainsupdateDate

# --- Grains Append
$saltCommand = 'salt-call grains.append sem_last_grains_update "' + $grainsupdateDate + '"'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# --- Grains Sync
$saltCommand = 'salt-call saltutil.sync_grains'

# --- Run Salt Command
Invoke-Expression -Command $saltCommand

# ----- [ End of Code ] ---------------------------------------------------------------------------

{{< /highlight >}}

---

###### SaltStack Config Target using Windows Server Running Service (SQL Server):

{{< image src="Salt-52.PNG" caption="Click to see Larger Image">}}  

---

###### Lessons Learned:
* Windows Server Features|Roles make a great way to target minions.
* Windows Server installed software also makes a great way to target minions.
* Windows Server Running Services is a good way to target minions.
* If you add custom grain data when the server is created you also need a way to maintain the grain data so it stays up to date and is current.

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
