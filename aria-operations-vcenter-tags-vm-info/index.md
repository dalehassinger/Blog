# VMware Aria Operations | Use vCenter TAGS/Custom Groups/Super Metrics to get VM Details


**How to group VMs together in VMware Aria Operations using vCenter TAGs and show resource usage totals across all VMs within the custom group**  

<!--more-->

---

###### VMware Aria Operations  

VMware Aria Operations 8.14.1 was used for this Blog Post. When new versions of VMware Aria Operations are released, the code or process may need to be changed.  

---

I was recently asked how to create a VMware Aria Operations Dashboard that groups VMs together by vCenter TAGs. IE: If there is 100 VMs in vCenter that have a TAG Named "Servers-DB", they wanted to see the CPU, Memory, Disk Space, and Critical Alerts Totals for all VMs with that vCenter TAG. They have many vCenter TAGs and each TAG would be on a single line with only Total Values shown.  

See the screenshot that shows the final Dashboard Design.  

---

###### Dashboard Design  

* The left side of the Dashboard shows all the Custom Groups that were created based on vCenter TAGs. The values shown on each row are the Metric Totals for all VMs that have the same vCenter TAG.  
* The left side is a View so that all the data can be exported as a CSV file.  
* The right side of the Dashboard is a view that shows the VM details. The right side is optional. I added the right side to show that the Super Metrics were calculating the metric totals correct.  
* Each metric shown requires a Super Metric to Sum the values within the Custom Group.  
* Each row shown requires a Custom Group to define which vCenter TAG to use.  
* Watch the videos below to see the details on how to create this Dashboard.  

---

###### Screen Shot of Dashboard  

{{< image src="vm-info-vcenter-tags-02.png" caption="Click to see Larger Image of Screen Shot">}}  

---

To group VMs together in VMware Aria Operations based on vCenter TAGs, you use Custom Groups. Custom Groups have a group type. I created (2) new Group Types for this Dashboard. I named one Group Type "Applications" and one Group Type "All-APPs". "All-APPs" is the Parent Group and "Applications" is the child group.  

---

Watch video to see how to define VMware Aria Operations Custom Group membership based on a vCenter TAG Name:  

{{< youtube gt099N3DpXU >}}

---

To show the Metric Totals of each Custom Group, we created Super Metrics to sum the value of all the VMs within the Custom Group. If you were only using one vCenter TAG and one Custom Group, you would not need to do this. We wanted to show the Metric Values of a 100+ vCenter TAGs and each vCenter TAG would be on a separate line. That is why we created the Super Metrics.  

Watch video to see how to create VMware Aria Operations Super Metrics to total Virtual Machine Metrics:  

{{< youtube MpyVlj4whvc >}}

---

To show all the Custom Groups names and Super Metric values we created a View. Main reason to create the View was to be able to export the data as a CSV file.  

Watch video to see how to create VMware Aria Operations View that shows the Custom Groups with VM metric totals:  

{{< youtube mqODM3-6LCA >}}

---

###### Lessons Learned and acknowledgements:  
* Thank You to [Brock Peterson](https://www.BrockPeterson.com) on providing input on how to get metric value totals by using Super Metrics.
* Thank You to my customer for the challenging question. I did not create a Dashboard like this before. I am glad we were able to create a Dashboard that answered your request and I am able to share the technique with the vCommunity.  
* You CAN group VMs in VMware Aria Operations together by using vCenter TAGs and total the Metric Values on a single line within a List View.  

---

{{< admonition type=info title="Info" open=true >}}
When I write my blogs, I always say there are many ways to accomplish the same task. This article is just one way that you could accomplish this task. I am showing what I felt was a good way to complete the use case but every organization/environment will be different. There is no right or wrong way to complete the tasks in this article.
{{< /admonition >}}

---

* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---

