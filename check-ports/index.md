# Open Ports | Zero Trust


**How to check if ports are open to a remote server**

<!--more-->

---

###### PowerShell Code

Use PowerShell to see if ports are open to a remote server.

Living in a zero trust environment can be challenging. Here is some code that I have been using to test for open ports from a Windows server to any type of destination. Just change PortNumber and Destination for your use case.

---

{{< highlight Powershell >}}

$PortNumber = '443'
$Destination = 'Server.vCrocs.info'

$socket = New-Object Net.Sockets.TcpClient
$socket.Connect($Destination,$PortNumber)

if($socket.Connected){
    $PortOpened = 'Port: ' + $PortNumber + ' to ' + $Destination +' is Open! :)'
    $socket.Close()
} # end if
else{
    $PortOpened = 'Port: ' + $PortNumber + ' to ' + $Destination +' IS NOT Open! :('
} # end else

Write-Output  $PortOpened

{{< /highlight >}}

---

###### Linux Commands

If you work with VMware vRealize Suite of appliances here are some commands (curl and Netcat) that can be used with Linux OS to test if ports are open to destination servers.  

{{< highlight Bash >}}

curl -v telnet://server01.vCROCS.info:443
nc -ztv server01.vCROCS.info 443 -w 3

{{< /highlight >}}

---

* If you like wearing Crocs and want to get a pair like I wear, follow this link to Amazon:
<a target="_blank" href="https://www.amazon.com/dp/B001V7Z27W?psc=1&amp;ref=ppx_yo2ov_dt_b_product_details&_encoding=UTF8&tag=vcrocs-20&linkCode=ur2&linkId=fa4c787c9ab59a9b8a54b48c402b8517&camp=1789&creative=9325">My Favorite Crocs</a>  
* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---

Article Updated: 2021-04-24

