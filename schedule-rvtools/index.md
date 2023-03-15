# Schedule RVTools Data Export


**Export RVTools xls Files Everyday**

---

<!--more-->

---

###### PowerShell Code

I like to create a Scheduled Task in vRealize Orchestrator to create RVTools files everyday.  Here is a sample PowerShell script that could be used. The script is also on a 7 day rotation of files and automatically deletes old files. On the 1st of every month a file will also be created for history that is not deleted.   

{{< highlight powershell >}}

$LogInfo = 'Starting Process to create an RVTools xlsx file for each vcenter.'
$LogInfo

$LogInfo = 'Creating xlsx file for vCenter vCenter01...'
$LogInfo
Start-Process -FilePath "C:\Program Files (x86)\Robware\RVTools\RVtools.exe" -ArgumentList '-s vCenter01.vCROCS.info -u administrator@vsphere.local -p "_RVToolsPWDNRTAG7hackme!bwqahk2a4" -c Exportall2xls -d "V:\RVTools\vCenter01"' -Wait

$LogInfo = 'Creating xlsx file for vCenter vCenter02...'
$LogInfo
Start-Process -FilePath "C:\Program Files (x86)\Robware\RVTools\RVtools.exe" -ArgumentList '-s vCenter02.vCROCS.info -u administrator@vsphere.local -p "_RVToolsPWDNRTAG7hackme!bwqahk2a4" -c Exportall2xls -d "V:\RVTools\vCenter02"' -Wait


# Create a RVTools file that will not be deleted for history on the 1st of every month
$DayofMonth = Get-Date -Format "dd"

if($DayofMonth -eq '01'){
Start-Process -FilePath "C:\Program Files (x86)\Robware\RVTools\RVtools.exe" -ArgumentList '-s vCenter01.vCROCS.info -u administrator@vsphere.local -p "_RVToolsPWDNRTAG7hackme!bwqahk2a4" -c Exportall2xls -d "V:\RVTools\Archive\vCenter01"' -Wait
Start-Process -FilePath "C:\Program Files (x86)\Robware\RVTools\RVtools.exe" -ArgumentList '-s vCenter02.vCROCS.info -u administrator@vsphere.local -p "_RVToolsPWDNRTAG7hackme!bwqahk2a4" -c Exportall2xls -d "V:\RVTools\Archive\vCenter02"' -Wait
}



$LogInfo = 'Removing all XLSX files older than 7 days...'
$LogInfo

# Delete all RVTools Files in older than 7 day(s)
$Daysback = "-7"
$CurrentDate = Get-Date
$DatetoDelete = $CurrentDate.AddDays($Daysback)

$Path = "V:\RVTools\vCenter01"
Get-ChildItem $Path -Recurse | Where-Object { $_.LastWriteTime -lt $DatetoDelete } | Remove-Item -Confirm:$false -Force -Recurse

$Path = "V:\RVTools\vCenter02"
Get-ChildItem $Path -Recurse | Where-Object { $_.LastWriteTime -lt $DatetoDelete } | Remove-Item -Confirm:$false -Force -Recurse

{{< /highlight >}}

---

* I will never add advertising to my Blog Site. If you find this blog useful and want to show your appreciation, use the Buy me a Coffee link and let me enjoy a cup of coffee on you. Thanks!

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---

