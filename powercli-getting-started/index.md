# PowerCLI Getting Started


**PowerCLI Basics**

<!--more-->

---

###### PowerCLI Code

Some basic PowerCLI commands to get started. I have some simple scripts in production that are 10 lines of code and I have some scripts that do a lot that are 2500 lines of code. Take the time to learn all the commands that are available and you will be amazed at what you can automate.

---

{{< highlight powershell >}}

#Here are some basic commands that you can keep adding additional code
#and get more precise on what you want to see.

#Connect to a vCenter

Connect-VIServer vcsa.domain.org

#Disconnect from vCenter and not be prompted

Disconnect-VIServer vcsa.domain.org -confirm:$false

#Get VM Listing

#Shows all VMs
Get-VM

#Shows all VMs sorted by Name
Get-VM | Sort-Object Name

#Shows all VMs sorted by Name that are Powered On
Get-VM | Where-Object {$_.Powerstate -eq 'PoweredOn'} | Sort-Object Name

#Shows all VMs sorted by Name, that are Powered On and only shows
#Name,MemoryGB,NumCpu
Get-VM | Where-Object {$_.Powerstate -eq 'PoweredOn'} | Sort-Object Name | Select-Object Name,MemoryGB,NumCpu

{{< /highlight >}}

---

###### Why use PowerCLI  

Picking a scripting language for automation can be a hard decision. My #1 reason to use PowerShell was because of the PowerCLI PowerShell module that VMware maintains. You can use the PowerCLI module to automate almost all of the VMware Products.  

There hasn't been any automation process that I have not been able to use PowerShell to automate. PowerShell has a great collection of modules available to use with different products. PowerShell is also easy to use with Products that make APIs available.

---

**Happy Scripting!**

---

* If you like wearing Crocs and want to get a pair like I wear, follow this link to Amazon:
<a target="_blank" href="https://www.amazon.com/dp/B001V7Z27W?psc=1&amp;ref=ppx_yo2ov_dt_b_product_details&_encoding=UTF8&tag=vcrocs-20&linkCode=ur2&linkId=fa4c787c9ab59a9b8a54b48c402b8517&camp=1789&creative=9325">My Favorite Crocs</a>  
* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

