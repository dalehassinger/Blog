# VMware vRealize SaltStack Config as a Windows Server Admin - Part 2


**Part 2: How to use SaltStack Config with Windows Server and PowerShell**

<!--more-->

---

<div>
I have been able to spend more time with <b>VMware vRealize SaltStack Config</b>. Here are some updates on my journey with SaltStack as a <b>Windows Server Admin</b>.  
</div>

---

###### Auto-Accept new minions:

I wanted new Windows Server builds (minions) to be auto accepted into SaltStack Config instead of someone manually approving new minions.  To do this you need to have a reactor.conf file. I created the file in SaltStack Config File Server in base/reactor/reactor.conf (See Code below). You also need to create a reactor.conf file in /etc/salt/master.d on the salt master. I use vi to create and edit the reactor.conf file. Anytime you make changes to the /etc/salt/master.d/reactor.conf file you need to restart the salt-master service.  

In addition to the reactor file you need to create a state file. I located the file in /reactor/accept-key.sls (See Code below). I specified what the name of the new server starts with so that not all new minions get auto accepted. If the Naming Standard that I use is not what the new Server is named it will not be auto accepted. This is one way to have some rules on which new Servers are auto accepted.

---

<div><b>Reactor File: base/reactor/reactor.conf</b></div>

{{< highlight powershell >}}
reactor:
  - 'salt/auth':                              # React to a new minion
    - salt://reactor/accept-key.sls           # Run this state to auto accept new minion
{{< /highlight >}}

<div><b>Location of the Reactor File:</b></div>

{{< image src="Salt-26.PNG" caption="Click to see Larger Image">}}  

---

<div><b>State File: base/reactor/accept-key.sls</b></div>

{{< highlight powershell >}}
{% if 'act' in data and data['act'] == 'pend' and data['id'].startswith('DBH') %}
minion_add:
  wheel.key.accept:
    - args:
      - match: {{ data['id']}}
{% elif 'act' in data and data['act'] == 'pend' and data['id'].startswith('vCROCS') %}
minion_add:
  wheel.key.accept:
    - args:
      - match: {{ data['id']}}
{% endif %}
{{< /highlight >}}

<div><b>Location of the State File:</b></div>

{{< image src="Salt-27.PNG" caption="Click to see Larger Image">}}  

---

<div><b>To restart the salt-master service run this command from the salt-master cli.</b></div>

{{< highlight powershell >}}
service salt-master restart
{{< /highlight >}}

<div><b>To check the status of the salt-master service run this command from the salt-master cli.</b></div>

{{< highlight powershell >}}
systemctl status salt-minion.service
{{< /highlight >}}

---

###### Jobs:  

I think a good way to get Started with SaltStack Config after you have some minions added is to create some Jobs. You can create Jobs in the SaltStack Config UI. Go to Config/Jobs. You can manually run these Jobs on the minions.  

Here are some screen shots of jobs that can be useful.  To run a job on a single minion go to minions and find the minion you want to run the job on, Select the minion, Select Run Job, Select the Job you want to run, select Run Now.  If you select multiple minions the Job will run on all minions selected.  

That is where you start to see the True Power of Salt. If you Select one, ten, a hundred or a thousand minions, the time to complete the selected job is very quick. As a Windows Admin and using PowerShell, it would not be as easy to run a script on a 1,000 Servers at the exact same time.  

---

###### List of all the Jobs:

{{< image src="Salt-20.PNG" caption="Click to see Larger Image">}}  

---

###### Job to stop the Print Spooler Service:

{{< image src="Salt-21.PNG" caption="Click to see Larger Image">}}  


This job I am using a salt function service.stop. Pass the Service name as a argument.

---

###### Job to stop the Print Spooler Service using a PowerShell Command:

{{< image src="Salt-22.PNG" caption="Click to see Larger Image">}}  

This job I am using a salt function cmd.run. Pass the PowerShell code and type of cmd as arguments.

---

###### Job to stop and disable the Print Spooler Service using a PowerShell script:

{{< image src="Salt-23.PNG" caption="Click to see Larger Image">}}  

This job I am using a salt function cmd.script. Pass the PowerShell script path and type of cmd as arguments.

---

###### Job to copy a file to a minion:

{{< image src="Salt-24.PNG" caption="Click to see Larger Image">}}  

This job I am using a salt function cp.get_file. Pass the file source path and destination path as arguments.

---

###### Job to reboot a minion:

{{< image src="Salt-25.PNG" caption="Click to see Larger Image">}}  

This job I am using a salt function system.reboot. Pass the wait time to reboot and wait_for_reboot as arguments.

---

If you noticed I have some jobs doing the same process but one is using a salt function and one is using a PowerShell command. I wanted to show you how your existing PowerShell skills as a Windows Server Admin can be used in SaltStack Config.  You don't need to re-learn everything.  Using PowerShell with a job is also very helpful when there is not a salt function to do what you need to accomplish. I have been trying to use the built-in salt functions whenever possible to get more familiar with the product.

Here is a saying that someone wrote or said that I seen online about salt. When in doubt, command out.  

---

###### Lessons Learned:
* Auto Accepting Minions is a nice start to using SaltStack Config with new vRealize Automation Server Builds. The new server will get auto accepted and you can then setup a State to install software like the Carbon Black Agent on every new Server.
* Running a job on a 1,000 Servers is just as easy as running a job on a single server.

---

###### Salt Links I found to be very helpful:
* <a href="https://sites.google.com/site/mrxpalmeiras/saltstack/salt-cheat-sheet" target="_blank">SaltStack Cheat Sheet</a>
* <a href="https://docs.saltproject.io/en/getstarted/"                            target="_blank">SaltStack Tutorials</a>
* <a href="https://docs.saltproject.io/en/latest/contents.html"                   target="_blank">SaltStack Documentation</a>
* <a href="https://saltstackcommunity.slack.com"                                  target="_blank">SaltStack Community Slack Channel</a>
* <a href="https://learnvrealizeautomation.github.io"                             target="_blank">Learn vRealize Automation</a>
* <a href="https://learnsaltstackconfig.github.io/"                               target="_blank">Learn SaltStack Config</a>

<div style="background-color:#ccffcc; Padding:20px;" >
When I write about <b>vRealize Automation</b> ("vRA") I always say there are many ways to accomplish the same task.  <b>SaltStack Config</b> is the same way.  I am showing what I felt was important to see but every organization/environment will be different. There is no right or wrong way to use Salt. This is a <b>GREAT Tool</b> that is included with your vRealize Suite Advanced/Enterprise license. If you own the vRealize Suite, you own SaltStack Config.
</div>
