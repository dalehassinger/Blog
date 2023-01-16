# One way to do Automation in a Zero Trust Environment


**Automation with Zero Trust**

<!--more-->

---

###### PowerShell Code

There are two PowerCLI commands that have become my best friends in a Zero Trust Environment.

* Invoke-VMScript - Use to run scripts on VMs.
* Copy-VMGuestFile - Use to copy files to/from VMs.

In this example you can use Invoke-VMScript to run commands on a VM to install Trend Deep Security. All commands run with VM in a zero trust state.

---

{{< highlight powershell >}}

$VMName = 'VM Name'

#Copy file to the VM
$PSText = 'wget https://server01.vCrocs.info/software/agent/Ubuntu_18.04/x86_64/agent.deb'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run the install of the agent that was copied.
$PSText = 'sudo -S <<< "Password1" sudo apt install ./agent.deb'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to reset the agent
$PSText = 'sudo -S <<< "Password1" sudo /opt/ds_agent/dsa_control -r'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to config the agent
$PSText = 'sudo -S <<< "Password1" sudo /opt/ds_agent/dsa_control -a dsm://server01.vCrocs.info:4120/'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to get service staus.
$PSText = 'service ds_agent status'
$DeepSecurityServiceStatus = Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

{{< /highlight >}}

---

In this example you can use Copy-VMGuestFile to copy a file to a VM and use invoke-VMScript to run commands on a VM to install agent. All commands run with VM in a zero trust state.

---

{{< highlight powershell >}}
$VMName = 'VM Name'

Copy-VMGuestFile -Source G:\splunkforwarder-8.0.1-6db836e2fb9e-linux-2.6-amd64.deb -Destination /home/vcrocsadmin -VM $VMNAME -LocalToGuest -GuestCredential $SSHcredsmadmin

#Run the install of the agent that was copied.
$PSText = 'sudo -S <<< "Password1" sudo apt install ./splunkforwarder-8.0.1-6db836e2fb9e-linux-2.6-amd64.deb'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to config the agent
$PSText = 'sudo -S <<< "Password1" sudo /opt/splunkforwarder/bin/splunk enable boot-start --accept-license --answer-yes --no-prompt --seed-passwd Password1'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to config the agent
$PSText = 'sudo -S <<< "Password1" sudo /opt/splunkforwarder/bin/splunk set deploy-poll server01.vCrocs.info:8089'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

#Run command to get service staus.
$PSText = 'sudo -S <<< "Password1" service splunkd status'
Invoke-VMScript -VM $VMName -ScriptType Bash -ScriptText $PSText -GuestCredential $SSHcred | Select-Object -ExpandProperty ScriptOutput

{{< /highlight >}}

