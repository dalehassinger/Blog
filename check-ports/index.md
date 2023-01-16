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

Article Updated: 2021-04-24
