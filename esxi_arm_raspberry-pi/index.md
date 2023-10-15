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

---

* If you like wearing Crocs and want to get a pair like I wear, follow this link:
<a target="_blank" href="https://www.amazon.com/dp/B001V7Z27W?psc=1&amp;ref=ppx_yo2ov_dt_b_product_details&_encoding=UTF8&tag=vcrocs-20&linkCode=ur2&linkId=fa4c787c9ab59a9b8a54b48c402b8517&camp=1789&creative=9325">My Favorite Crocs</a>  
* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

