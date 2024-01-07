# Unlocking the Potential | VMware Aria Automation Config API


**Using PowerShell with the VMware Aria Automation Config API**

<!--more-->

---

###### VMware Aria Automation Config API:

VMware Aria Automation 8.14 was used for this Blog Post. When new versions of VMware Aria Automation Config are released, the code may need to be changed.  

There is a lot of Automation that I like to complete where I use the VMware Aria Automation Config API. The code that I am sharing is a PowerShell Script but the code could also be included in a VMware Aria Automation ABX Action, VMware Aria Automation Orchestrator Action or VMware Aria Automation Orchestrator Workflow.  

All of my customers are 80% - 90% Microsoft Windows Servers. That is why you will see a lot of PowerShell code as examples in my Blog Posts. I like to share what my customers will use in their environments.   

All the source code for this Blog is saved in my GitHub Repository. Please click on the link to see the code.  

---

* [Link | vCROCS | GitHub Repository](https://github.com/dalehassinger/unlocking-the-potential/tree/main/VMware-Aria-Automation-Config/Aria-Automation-Config-API)

---

* Added these PowerShell Scripts to use with the VMware Aria Automation Config APIs  
* These PowerShell Scripts are a good starting point to help you use the VMware Aria Automation Config APIs  
* You can modify the scripts to work with any of the salt functions.  
* The sample scripts show how to:  
  [x] test.ping  
  [x] grains.append  
  [x] grains.remove  
  [x] state.apply  
  [x] key.delete  
* The scripts will show you how to authenticate with VMware Aria Automation Config to use the APIs.  
* The scripts will show you how to create the API Body to use with VMware Aria Automation Config.  
* The scripts will show you how to use the Job ID (JID) to get the status of the job so you know when the job is complete and if it was successful.  


---

{{< admonition type=info title="Info" open=true >}}
When I write my blogs, I always say there are many ways to accomplish the same task. This article is just one way that you could accomplish this task. I am showing what I felt was a good way to complete the use case but every organization/environment will be different. There is no right or wrong way to complete the tasks in this article.
{{< /admonition >}}

---

* If you found this Blog article useful and it helped you, Buy me a coffee to start my day.  

---

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---

