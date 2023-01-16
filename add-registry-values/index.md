# Powershell code to add custom Registry values


**Add Windows Server Registry Values**

<!--more-->

---

###### PowerShell Code

Add Registry Values to Windows Server

---

{{< highlight powershell >}}

#vCrocs Registry Changes
invoke-command -computername $FQDNVMname -ScriptBlock {new-Item HKLM:\SOFTWARE\vCrocs -f }
invoke-command -computername $FQDNVMname -ScriptBlock {param ($SG) Set-ItemProperty hklm:\software\vCrocs -Name SupportGroup -Value "$SG" -Force} -ArgumentList $SG
invoke-command -computername $FQDNVMname -ScriptBlock {param ($APP) Set-ItemProperty hklm:\software\vCrocs -Name Application -Value "$APP" -Force} -ArgumentList $APP
invoke-command -computername $FQDNVMname -ScriptBlock {param ($LOC) Set-ItemProperty hklm:\software\vCrocs -Name Location -Value "$LOC" -Force} -ArgumentList $LOC
invoke-command -computername $FQDNVMname -ScriptBlock {param ($SL) Set-ItemProperty hklm:\software\vCrocs -Name ServiceLevel -Value "$SL" -Force} -ArgumentList $SL

{{< /highlight >}}





