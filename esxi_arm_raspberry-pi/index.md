# ESXi on Raspberry PI


**ESXi on Raspberry PI**

<!--more-->

---

I have always be fascinated with everything that you can do with a Raspberry PI.  When VMware released their Fling to install ESXi on the Raspberry PI I have become even more fascinated. An ESXi Host for the Home Lab for $50. Sign me up.

During VMworld 2020, VMware announced that they would be releasing a Fling to install ESXi on the Raspberry PI.  Before the VMworld session was over I had a new Raspberry PI ordered and it was delivered the next day, ahead of the Fling release, so that I would be ready.

{{< image src="esxi_raspberry_pi_06.png" caption="Click to see Larger Image">}}  

I downloaded the ESXi Arm Edition Fling as soon as I seen it was available.

**Lessons Learned:**
* Read all the documentation on how to install ESXi on Raspberry PI.  Very important steps need to be followed.
* If you want to use more than one USB drive for storage use this ESXi Host advanced setting - USB.arbitratorAutoStartDisabled Set to 1
* Use a minimum size of 256 GB for the USB drive. Read the Fling Documentation for preferred USB drive to use.
* The ARM version of Ubuntu server installed without any issues.  I installed the Apache Web Server and Samba on the ARM Ubuntu Server and had no issues.
* Hugo Blog files run GREAT on ARM version of Ubuntu Server, with Apache web server, running on ESXi, installed on Raspberry PI. 


I am going to be adding information to this Blog post as I discover more cool information with running ESXi on Raspberry PI.  Check back often.

[Link to ESXi Arm Edition - VMware Fling](https://flings.vmware.com/esxi-arm-edition) 



###### ESXi 7.0 on RAspberry PI - Cool Host Name :) 

{{< image src="esxi_raspberry_pi_02.jpeg" caption="Click to see Larger Image">}}  

###### ESXi 7.0 on RAspberry PI Login Screen:

{{< image src="esxi_raspberry_pi_03.png" caption="Click to see Larger Image">}}  

###### ESXi Managemnet Screen:

{{< image src="esxi_raspberry_pi_04.png" caption="Click to see Larger Image">}}  

###### ESXi on Raspberry PI added to vCenter:

{{< image src="esxi_raspberry_pi_05.png" caption="Click to see Larger Image">}}  

###### ESXi on Raspbeery PI added to vRealize Operations 8.2:

{{< image src="esxi_raspberry_pi_01.png" caption="Click to see Larger Image">}}  

