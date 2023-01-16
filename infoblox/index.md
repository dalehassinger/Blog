# Infoblox 1.1 plugin for vRA 8.1


**Infoblox 1.1 plugin for vRA 8.1**

<!--more-->

---

I recently setup the Infoblox 1.1 plugin for vRA 8.1 and ran into an interesting challenge that I thought I would share. The setup of the plugin is straight forward; follow the documentation and you’ll likely be set. However, if you use custom DNS views in Infoblox (internal, external, etc.) then some additional configuration is required that’s not easily identified. Out of the box, the Infoblox IPAM integration comes with only a few default properties. I left these values in place when creating my first VM build blueprint but the **Infoblox_AllocateIP** action would always fail. Action Run logs under the Extensibility tab are a great way to troubleshoot. They were displaying the following error:

{{< image src="infoblox-01.png" caption="Click to see Larger Image">}}  

The fix for this issue is to add a custom property called **Infoblox.IPAM.Network.dnsView** and set the appropriate value. This property needs to be added in both the integration settings as well as in the blueprint.

###### Integration Settings:

{{< image src="infoblox-02.png" caption="Click to see Larger Image">}}  

###### Blueprint:

{{< image src="infoblox-03.png" caption="Click to see Larger Image">}}  

Once you complete these steps, you’ll find that the **Infoblox_AllocateIP** action will successfully complete.

{{< image src="infoblox-04.png" caption="Click to see Larger Image">}}  

For the record, the ability to test deployments without actually kicking off a build is fantastic. I confirmed that the test was accurate by running a deployment and verifying that an IP was assigned and a DNS record was registered.

Hope this helps.

**Dan Grove**
