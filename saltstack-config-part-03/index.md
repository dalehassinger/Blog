# VMware vRealize SaltStack Config as a Windows Server Admin - Part 3


**Part 3: How to use SaltStack Config with Windows Server and PowerShell**

<!--more-->

---

The next steps on my journey with **VMware vRealize SaltStack Config** as a **Windows Server Admin** will be beacons and reactors. Working with Jobs helped me understand how to make changes Ad-Hoc. I have a Job to quickly stop the Print Spooler but what if I always want the state of the Print Spooler Service to be stopped.  How do I NOT allow a Server Admin to login into the server and manually start the service?  

This is where beacons and reactors work with minion configurations that you want to make permanent. This is the configuration Management Part of Salt Stack. To always make sure a Windows Service is stopped I created a beacon.conf file. On a Windows Server the Beacon.conf needs to be in the 'C:\salt\conf\minion.d\' folder. Anytime a beacon.conf file is added to a minion or modified the salt-minion service needs restarted. I have a salt Job to restart the salt-minion service.   

###### Beacons:  

###### Beacon File: Sends events to the event bus on the salt master from a minion

This beacon.conf example is for service state changes. The Beacon sends an event to the salt master if a Windows Service is started/stopped.

{{< highlight powershell >}}
beacons:
  service:
    - services:
       Spooler:
         onchangeonly: true
{{< /highlight >}}

This is what the event will look like in the events if you are monitoring.

{{< highlight powershell >}}
salt/beacon/DBH-211/service/Spooler     {
    "Spooler": {
        "running": true
    },
    "_stamp": "2021-08-06T11:53:57.212810",
    "id": "DBH-211",
    "service_name": "Spooler"
}

{{< /highlight >}}

###### Reactors:  

###### Reactor File: Monitors the event bus for events specified. IE: salt/beacon/*/service/Spooler

{{< highlight powershell >}}
reactor:
  - 'salt/auth':                              # React to a new minion
    - salt://reactor/accept-key.sls           # Run this state to auto accept new minion
  - 'salt/beacon/*/service/Spooler':          # React to Spooler Service Change
    - salt://vCROCS/spooler_auto_stop.sls     # Run this state

{{< /highlight >}}

###### How the beacons and reactors work together:

{{< highlight powershell >}}
# What this line is doing in the reactor is watching for an beacon event from any minion
# The * means all minions. You could specify a minion name.
# Looking for service events.  
# The service event that is specified is the Spooler event.

  - 'salt/beacon/*/service/Spooler'


# This is the event sent from the beacon to the event bus

salt/beacon/DBH-211/service/Spooler

# What the reactor is looking for and what the beacon sent matches.
# The state specified in the reactor will now run
# This is the state specified in my example

    - salt://vCROCS/spooler_auto_stop.sls

{{< /highlight >}}

###### State File:  

###### State File: Stops the Spooler Service if it was started

{{< highlight powershell >}}
{% if data['Spooler']['running'] == true %}
stop_service:
  local.service.stop:
    - tgt: {{ data['id'] }}
    - arg:
      - Spooler
{% endif %}
{{< /highlight >}}

###### State File: Starts the Spooler Service if it was stopped

{{< highlight powershell >}}
{% if data['Spooler']['running'] == False %}
start_service:
  local.service.start:
    - tgt: {{ data['id'] }}
    - arg:
      - Spooler
{% endif %}
{{< /highlight >}}

---

###### Beacons:  

To copy the beacon file to the minions I created a Job that I can manually run.

###### Job to copy a file to a minion:

{{< image src="Salt-24.PNG" caption="Click to see Larger Image">}}  

After the beacon file is copied to the minion you MUST restart the minion service.

###### Job to restart minion service:

{{< image src="Salt-28.PNG" caption="Click to see Larger Image">}}  

---

###### Lessons Learned:
* Beacons are a good way to make sure the configuration you want is not altered.
* Beacons can monitor more than just services that I am showing in this blog post. I will cover more use cases in future blog posts.

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
