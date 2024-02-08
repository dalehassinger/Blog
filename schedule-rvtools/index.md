# Schedule RVTools Data Export


**Export RVTools xlsx Files Everyday**

---

<!--more-->

---

###### PowerShell Code

I like to create a Scheduled Task in vRealize Orchestrator to create RVTools files everyday.  Here is a sample PowerShell script that could be used. The script is also on a 7 day rotation of files and automatically deletes old files. On the 1st of every month a file will also be created for history that is not deleted.   


Click arrow to expand the PowerShell Code:  
{{< highlight powershell >}}

# Script to create RVTools files and delete files older than 7 Days.
# Also creates an Archive RVTools file on the first of every Month.

# ----- [ Set parameters for RVTools export ] -----
$vCenter      = "vcsa8x.corp.local"
$User         = "administrator@corp.local"
$Password     = "_RVToolsV2PWDe9yqxNV-HACKME-w5gkyxsCh5R1Kbg+hVYiKo="
$fileLocation = "C:\RVTools"
$fileArchive  = "C:\RVTools\Archive"
$fileName     =  (Get-Date -Format "MM-dd-yyyy-hh-mm") + '-' + $vCenter + '.xlsx'
$filePath     = "C:\Program Files (x86)\Robware\RVTools\RVtools.exe"

$outPut = 'Starting Process to create an RVTools xlsx file...'
Write-Output $outPut

$outPut = 'Creating xlsx file for vCenter ' + $vCenter + '...'
Write-Output $outPut

$Arguments = "-u $User -p $Password -s $vCenter -c ExportAll2xlsx -d $fileLocation -f $fileName"

$Process = Start-Process -FilePath $filePath -ArgumentList $Arguments -Wait

if($Process.ExitCode -eq -1){
    Write-Host "Error: Export failed! RVTools returned exitcode -1, probably a connection error! Script is stopped" -ForegroundColor Red
    exit 1
} # End If

# ----- [Create a RVTools file that will not be deleted for history on the 1st of every month ] -----
$DayofMonth = Get-Date -Format "dd"

if($DayofMonth -eq '01'){
    $outPut = "Day of the Month: " + $DayofMonth
    Write-Output $outPut

    $outPut = 'Starting Process to create an RVTools xlsx file for Archive that will not be deleted...'
    Write-Output $outPut
    
    $Arguments = "-u $User -p $Password -s $vCenter -c ExportAll2xlsx -d $fileArchive -f $fileName"
    $Process = Start-Process -FilePath $filePath -ArgumentList $Arguments -Wait
} # End If


# ----- [ Clean up old RVTools Files ] -----
$outPut = 'Removing all XLSX files older than 7 days...'
Write-Output $outPut

# ----- [ Delete all RVTools Files in older than 7 day(s) ] -----
$Daysback = "-7"
$CurrentDate = Get-Date
$DatetoDelete = $CurrentDate.AddDays($Daysback)

Get-ChildItem $fileLocation | Where-Object { $_.LastWriteTime -lt $DatetoDelete } | Remove-Item -Confirm:$false -Force





<#
# ----- [ Sample code to change a file last write date/time to test code for deleting files older than 7 days ] -----
$fileToChange = $fileLocation + '\' + $fileName
$fileToChange

(Get-Item $fileToChange).LastWriteTime = Get-Date "02/01/2024 01:00"
#>

{{< /highlight >}}

---

> Blog Updated: 02/08/2024  
> Changes: Updated script to work with newest version of RVTools  

---

* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---

