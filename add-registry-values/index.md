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

---

* If you like wearing Crocs and want to get a pair like I wear, follow this link:
<a target="_blank" href="https://www.amazon.com/dp/B001V7Z27W?psc=1&amp;ref=ppx_yo2ov_dt_b_product_details&_encoding=UTF8&tag=vcrocs-20&linkCode=ur2&linkId=fa4c787c9ab59a9b8a54b48c402b8517&camp=1789&creative=9325">My Favorite Crocs</a>  
* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

