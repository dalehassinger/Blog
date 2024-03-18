# VMware Aria Automation | How to send messages and updates


**How to send messages/updates to a Microsoft Teams Channel or Google Spaces.**

<!--more-->

---

>"If everyone is moving forward together, then success takes care of itself.” - Henry Ford

---

###### VMware Aria Automation  

Whenever new VMs are deployed or Day 2 operations are executed via the VMware Aria Automation Catalog, I find it crucial to update our team through a common messaging platform about the ongoing creations or modifications. In this blog, I'll demonstrate how to dispatch notifications to both Microsoft Teams and Google Spaces via a Webhook. This technique can be adapted for any messaging service such as Slack, Zoom, Discord, etc., by simply altering the JSON body formatting code and creating a Webhook for message delivery.  

I will guide you through the process of sending alerts from VMware Aria Automation utilizing ABX Actions and Orchestrator Workflows. Though the procedure remains largely the same, there are minor variations in acquiring Property Values. Presenting both methods offers you, the Automation Specialists, the freedom to choose the approach that seamlessly integrates into your workflows. My philosophy in automation is that there are countless ways to achieve the same outcome.  

---

In this blog, I'll walk you through the creation of a new virtual machine (VM). At the onset of the build process, I have configured an Extensibility Subscription that triggers the sending of notifications to both Microsoft Teams and Google Spaces. This is accomplished through the use of an ABX Action and an Orchestrator Workflow.  

---

Besides notifying your team when a new VM is created, I'll demonstrate how to dispatch a message through an Orchestrator Workflow for a Day 2 Automation process.  

---

###### Create a New VM and Send Message

**Steps:**

1. Within the Design section of Aria Automation, create a template. For the purpose of this tutorial, we will construct a straightforward Rocky Linux VM. | Refer to <a href="#screen-shot-01">Screen Shot 1</a>.
2. Ensure that all properties you wish to include in your notification are incorporated into the template's YAML code. These property values will be transmitted to both ABX Actions and Orchestrator Workflows. | Refer to <a href="#screen-shot-02">Screen Shot 2</a>.
   - You have the flexibility to include any property in your messages, provided it is specified in the template's YAML code.
3. Proceed to set up an Extensibility Action. | See <a href="#screen-shot-03">Screen Shot 3</a> and <a href="#screen-shot-04">Screen Shot 4</a>.
4. Establish an Extensibility Subscription that will initiate the ABX Action or Orchestrator Workflow as required. | Refer to <a href="#screen-shot-05">Screen Shot 5</a>.
5. Here's an example of how to define a subscription. | See <a href="#screen-shot-06">Screen Shot 6</a>.
6. Initiate the creation of an Orchestrator Workflow. | Refer to <a href="#screen-shot-07">Screen Shot 7</a>.
   - Incorporate an input property into the Orchestrator Workflow. | See <a href="#screen-shot-08">Screen Shot 8</a>.
   - Outline the schema within the Orchestrator Workflow. | Refer to <a href="#screen-shot-09">Screen Shot 9</a>.
   - Inject the necessary code into the Orchestrator Workflow. | See <a href="#screen-shot-10">Screen Shot 10</a> and <a href="#screen-shot-11">Screen Shot 11</a>.
7. Deploy a new VM and confirm that the Extensibility Subscription successfully triggered the ABX Action you defined.
8. Check your preferred messaging system to ensure the notification was received.
   - Example of a Google Spaces Message | Refer to <a href="#screen-shot-12">Screen Shot 12</a>.
   - Example of a Microsoft Teams Message | See <a href="#screen-shot-13">Screen Shot 13</a>.
9. If all steps were executed successfully, it's time for a celebration!
10. <a href="#screen-shot-14">Screen Shot 14</a> illustrates the process of creating a Google Spaces Webhook.

---

###### Orchestrator Workflow Day 2 Automation and Send Message

**Steps:**

1. Initiate the creation of an Orchestrator Workflow. Creating a new Workflow is the same for Day 2 Automation Processes as when a Workflow was created for building a New VM. | Refer to <a href="#screen-shot-07">Screen Shot 7</a>.
   - Incorporate an input property into the Orchestrator Workflow for every question needed to complete the Day 2 Automation. | See <a href="#screen-shot-15">Screen Shot 15</a>.
   - Inject the necessary code into the Orchestrator Workflow. | See <a href="#screen-shot-16">Screen Shot 16</a>.
2. Run the Workflow and confirm that the code successfully ran and created the message .
3. Check your preferred messaging system to ensure the notification was received. The Messages with look the same as when you created a New VM. YOU define what information is shown.
   - Example of a Google Spaces Message | Refer to <a href="#screen-shot-12">Screen Shot 12</a>.
   - Example of a Microsoft Teams Message | See <a href="#screen-shot-13">Screen Shot 13</a>.
4. If all steps were executed successfully, it's time for a high five!
5. Example of a Day 2 Automation Microsoft Teams Message | See <a href="#screen-shot-17">Screen Shot 17</a>.

---

###### Screen Shots of the Steps:

###### Screen Shot 01:  

Design Template with YAML Code that has all the required Properties.

{{< image src="aria-automation-messages-01.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**Design Template Example YAML Code:**  

This YAML code shows all the Properties that I want to send to a ABX Action or Orchestrator Workflow.  

<span style="color: red; font-weight: bold;">Click arrow to expand the code:</span>  

{{< highlight YAML >}}  
formatVersion: 1
name: Ubuntu-20-with-minion
version: 9
inputs:
  CustomizationSpec:
    type: string
    description: Customization Specification
    default: Customization-Ubuntu-22
    title: 'Customization Spec:'
  VMName:
    type: string
    title: 'VM Name:'
    minLength: 1
    maxLength: 15
    default: LINUX-U-16
  IP:
    type: string
    default: 192.168.69.16
  BuildTime:
    type: string
    title: 'Build Time:'
    format: date-time
  vCenterFolders:
    type: string
    title: 'vCenter Folder:'
    default: Blogs
    $dynamicEnum: /data/vro-actions/TAM/DBH_vCenter_Folders
resources:
  Cloud_vSphere_Machine_1:
    type: Cloud.vSphere.Machine
    properties:
      image: vCenter-ubuntu-20
      flavor: vCenter-1CPU-2GB
      name: ${input.VMName}
      BuildTime: ${input.BuildTime}
      folderName: ${input.vCenterFolders}
      customizationSpec: ${input.CustomizationSpec}
      vmIP: ${input.IP}
      remoteAccess:
        authentication: usernamePassword
        username: administrator
        password: VMware1!
      constraints:
        - tag: Cluster:PROD
      networks:
        - network: ${resource.Cloud_vSphere_Network_1.id}
          assignment: static
          address: ${input.IP}
  Cloud_vSphere_Network_1:
    type: Cloud.vSphere.Network
    properties:
      networkType: existing
      constraints:
        - tag: Network:vCenter-VMs

{{< /highlight >}}  

---

###### Screen Shot 02:  

Highlight of YAML Code showing Properties.

{{< image src="aria-automation-messages-02.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 03:  

Where to create Extensibility ABX Actions.

{{< image src="aria-automation-messages-03-1.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 04:  

Example Extensibility ABX Action.

{{< image src="aria-automation-messages-03-2.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**Extensibility ABX Action Code:**  

Code Snippets. 
- Each ABX Action starts with identical code to retrieve Property Values. 
- The variation arises in the methodology of dispatching this information to the respective messaging systems.

Here's an example script for sending notifications to Microsoft Teams.

<span style="color: red; font-weight: bold;">Click arrow to expand the code:</span>  

{{< highlight PowerShell >}}  

function handler($context, $inputs) {

    # Build PowerShell variables
    if(!$inputs.resourceNames){
        $vmName = "NA"
    }else{
        $vmName = $inputs.resourceNames
    }
    if(!$inputs.customProperties.image){
        $image = "NA"
    }else{
        $image = $inputs.customProperties.image
    }
    if(!$inputs.customProperties.flavor){
        $flavor = "NA"
    }else{
        $flavor = $inputs.customProperties.flavor
    }
    if(!$inputs.customProperties.folderName){
        $folder = "NA"
    }else{
        $folder = $inputs.customProperties.folderName
    }
    if(!$inputs.customProperties.vmIP){
        $vmIP = "NA"
    }else{
        $vmIP = $inputs.customProperties.vmIP
    }
    if(!$inputs.__metadata.userName){
        $userName = "NA"
    }else{
        $userName = $inputs.__metadata.userName
    }
    
    Write-Host "--vmName:"$vmName
    Write-Host "---image:"$image
    Write-Host "--flavor:"$flavor
    Write-Host "--folder:"$folder
    Write-Host "userName:"$userName
    Write-Host "----vmIP:"$vmIP

    # --- [ Start Add Alert to Teams Channel ] ---
    
    # Define the webhook URL
    $webhookUrl = 'https://vcrocs.webhook.office.com/webhookb2/ac73a8c3-bd4572@015568c1-bbe7-hack-me-4050-add6-6f36b7b44adb/IncomingWebhook/b41cd4d2f-hack-you-12/925b-9960-4590-9251-65db25f05419'

    # --- Create the message card
$messageCard = @{
    "@type"    = "MessageCard"
    "@context" = "http://schema.org/extensions"
    "summary"  = "Issue 176715375"
    "sections" = @(
        @{
            "activityTitle"    = "vRA Automated VM Build:"
            "facts"            = @(
                @{
                    "name"  = "VM Name:"
                    "value" = "$vmName"
                },
                @{
                    "name"  = "VM IP:"
                    "value" = "$vmIP"
                },
                @{
                    "name"  = "Created By:"
                    "value" = "$userName"
                },
                @{
                    "name"  = "VM Image:"
                    "value" = "$image"
                },
                @{
                    "name"  = "vCenter Folder:"
                    "value" = "$folder"
                },
                @{
                    "name"  = "VM Flavor:"
                    "value" = "$flavor"
                }
            )
            "markdown" = $true
        }
    )
} | ConvertTo-Json -Depth 10

    # Send the message card
    Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType 'application/json' -Body $messageCard

    $outPut = "Done"
    return $outPut
}

{{< /highlight >}}  

---

This code is to send a message to Google Spaces.  

<span style="color: red; font-weight: bold;">Click arrow to expand the code:</span>  

{{< highlight PowerShell >}}  

function handler($context, $inputs) {

    # Build PowerShell variables
    if(!$inputs.resourceNames){
        $vmName = "NA"
    }else{
        $vmName = $inputs.resourceNames
    }
    if(!$inputs.customProperties.image){
        $image = "NA"
    }else{
        $image = $inputs.customProperties.image
    }
    if(!$inputs.customProperties.flavor){
        $flavor = "NA"
    }else{
        $flavor = $inputs.customProperties.flavor
    }
    if(!$inputs.customProperties.folderName){
        $folder = "NA"
    }else{
        $folder = $inputs.customProperties.folderName
    }
    if(!$inputs.customProperties.vmIP){
        $vmIP = "NA"
    }else{
        $vmIP = $inputs.customProperties.vmIP
    }
    if(!$inputs.__metadata.userName){
        $userName = "NA"
    }else{
        $userName = $inputs.__metadata.userName
    }
    
    Write-Host "--vmName:"$vmName
    Write-Host "---image:"$image
    Write-Host "--flavor:"$flavor
    Write-Host "--folder:"$folder
    Write-Host "userName:"$userName
    Write-Host "----vmIP:"$vmIP

    # --- [ Start Add Alert to Google Chat ] ---
    
    # --- Create json body for Google Alert   
$messageBody = @{
    cards = @(
        @{
            header = @{
                title    = "New VM Build"
            }
            sections = @(
                @{
                    widgets = @(
                        @{
                            keyValue = @{
                                topLabel         = "VM Name:"
                                content          = "$vmname"
                                contentMultiline = $true
                            }
                        },
                        @{
                            keyValue = @{
                                topLabel         = "VM IP:"
                                content          = "$vmIP"
                                contentMultiline = $true
                            }
                        },
                        @{
                            keyValue = @{
                                topLabel         = "Created By:"
                                content          = "$username"
                                contentMultiline = $true
                            }
                        },
                        @{
                            keyValue = @{
                                topLabel         = "VM Image:"
                                content          = "$image"
                                contentMultiline = $true
                            }
                        },
                        @{
                            keyValue = @{
                                topLabel         = "vCenter Folder:"
                                content          = "$folder"
                                contentMultiline = $true
                            }
                        },
                        @{
                            keyValue = @{
                                topLabel         = "VM Flavor:"
                                content          = "$flavor"
                                contentMultiline = $true
                            }
                        }
                    )
                }
            )
        }
    )
}
    
    $jsonMessage = $messageBody | ConvertTo-Json -Depth 10
    
    # Output the JSON to verify
    #$jsonMessage

    # Define the webhook URL (replace it with your actual webhook URL)
    $webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAAAvSYSmfg/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=Vj-NoThfrmjLnkIW_iQRQw71qcE2CGxG1tkjs2ArM7o'

    # Send the message
    $results = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $jsonMessage -ContentType "application/json"

    #$outPut = "WebHook Date/Time: " + $results.createTime
    #Write-Host $outPut
    
    $outPut = "Done"

  return $outPut
}

{{< /highlight >}}  

---

###### Screen Shot 05:  

Subscriptions used to start ABX Actions or Orchestrator Workflows.

{{< image src="aria-automation-messages-03.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 06:  

Subscription definition example.

{{< image src="aria-automation-messages-04.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 07:  

Create a new Orchestrator Workflow.

{{< image src="aria-automation-messages-07.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 08:  

Add Input named "inputProperties" to the Orchestrator Workflow.

{{< image src="aria-automation-messages-08.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 09:  

Create the Orchestrator Workflow Schema.

{{< image src="aria-automation-messages-09.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 10:  

Add the code to the Orchestrator Workflow.

{{< image src="aria-automation-messages-10.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**Orchestrator Workflow Code:**  

Code Examples. At the start of each Orchestrator Workflow, the code for retrieving Property Values is consistent. The variation comes in how the information is sent to each messaging system.

- For sending messages to Microsoft Teams, use the following code.
- To send a message to Google Spaces in a Workflow, apply the same Google Spaces code used in ABX Actions.
- The Google Spaces code does not change between ABX Actions and Workflows.
- The difference in ABX Actions and Workflows is in the method of obtaining Property Values.

<span style="color: red; font-weight: bold;">Click arrow to expand the code:</span>  

{{< highlight PowerShell >}}  
function Handler($context, $inputs) {

    # Build PowerShell variables
    if(!$inputs.inputProperties.resourceNames){
        $vmName = "NA"
    }else{
        $vmName = $inputs.inputProperties.resourceNames
    }
    if(!$inputs.inputProperties.customProperties.image){
        $image = "NA"
    }else{
        $image = $inputs.inputProperties.customProperties.image
    }
    if(!$inputs.inputProperties.customProperties.flavor){
        $flavor = "NA"
    }else{
        $flavor = $inputs.inputProperties.customProperties.flavor
    }
    if(!$inputs.inputProperties.customProperties.folderName){
        $folder = "NA"
    }else{
        $folder = $inputs.inputProperties.customProperties.folderName
    }
    if(!$inputs.inputProperties.customProperties.vmIP){
        $vmIP = "NA"
    }else{
        $vmIP = $inputs.inputProperties.customProperties.vmIP
    }
    if(!$inputs.__metadata_userName){
        $userName = "NA"
    }else{
        $userName = $inputs.__metadata_userName
    }
    
    Write-Host "--vmName:"$vmName
    Write-Host "---image:"$image
    Write-Host "--flavor:"$flavor
    Write-Host "--folder:"$folder
    Write-Host "userName:"$userName
    Write-Host "----vmIP:"$vmIP


    # Define the webhook URL
    $webhookUrl = 'https://vcrocs.webhook.office.com/webhookb2/ac73a8c3-59a2-hack-me-bd4572@015568c1-bbe7-4050-add6-6f36b7b44adb/IncomingWebhook/b41cd4d2fcbd-hack-you-0212/925be554-9960-4590-9251-65db25f05419'

# Create the message card
$messageCard = @{
    "@type"    = "MessageCard"
    "@context" = "http://schema.org/extensions"
    "summary"  = "Issue 176715375"
    "sections" = @(
        @{
            "activityTitle"    = "vRA Automated VM Build:"
            "facts"            = @(
                @{
                    "name"  = "VM Name:"
                    "value" = "$vmName"
                },
                @{
                    "name"  = "VM IP:"
                    "value" = "$vmIP"
                },
                @{
                    "name"  = "Created By:"
                    "value" = "$userName"
                },
                @{
                    "name"  = "VM Image:"
                    "value" = "$image"
                },
                @{
                    "name"  = "vCenter Folder:"
                    "value" = "$folder"
                },
                @{
                    "name"  = "VM Flavor:"
                    "value" = "$flavor"
                }
            )
            "markdown" = $true
        }
    )
} | ConvertTo-Json -Depth 10

    # Send the message card
    Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType 'application/json' -Body $messageCard

    $output=@{status = 'done'}

    return $output
}

{{< /highlight >}}  

---

###### Screen Shot 11:  

Code difference between a Orchestrator Workflow and a ABX Action.

{{< image src="aria-automation-messages-11.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Message Examples:

###### Screen Shot 12:  

When all is configured and functioning properly, the Google Space message containing the New VM Build Details will appear as follows. Quite impressive!

{{< image src="aria-automation-messages-google-space.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 13:  

Microsoft Teams Message with New VM Build Details. Very Cool!

{{< image src="aria-automation-messages-teams-message.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 14:  

How to create a Google Spaces Webhook. Link included below on how to create a Microsoft Teams Webhook.  

{{< image src="aria-automation-messages-12.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Start of Day 2 Automation Screen Shots:

###### Screen Shot 15:  

Add all the required inputs to the Workflow for the Day 2 Automation process.  

{{< image src="aria-automation-messages-15.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Screen Shot 16:  

Add the code to the Orchestrator Workflow.  

{{< image src="aria-automation-messages-16.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**Orchestrator Workflow Code for Day 2 Automation:**  

Code Example.

- The difference between this Workflow for day 2 Automation Code and when I used a Workflow to create a new VM is how you get the input values.
- For sending messages to Microsoft Teams, use the following code.
- To send a message to Google Spaces in a Workflow, apply the same Google Spaces code used in ABX Actions.
- The Google Spaces code does not change between ABX Actions and Workflows.
- The difference in ABX Actions and Workflows is in the method of obtaining Property Values.

<span style="color: red; font-weight: bold;">Click arrow to expand the code:</span>

{{< highlight PowerShell >}}  

function Handler($context, $inputs) {

    # Build PowerShell variables
    if(!$inputs.vmName){
        $vmName = "NA"
    }else{
        $vmName = $inputs.vmName
    }
    if(!$inputs.snapName){
        $snapName = "NA"
    }else{
        $snapName = $inputs.snapName
    }
    if(!$inputs.snapDescription){
        $snapDescription = "NA"
    }else{
        $snapDescription = $inputs.snapDescription
    }

    Write-Host "---------vmName:"$vmName
    Write-Host "-------snapName:"$snapName
    Write-Host "snapDescription:"$snapDescription

    # Define the webhook URL
    $webhookUrl = 'https://vcrocs.webhook.office.com/webhookb2/ac73a8c3-hack-me-e2fbd4572@015568c1-bbe7-4050-add6-6f36b7b44adb/IncomingWebhook/b41cd4d2fcb-hack-you-2/925be554-9960-4590-9251-65db25f05419'

# Create the message card
$messageCard = @{
    "@type"    = "MessageCard"
    "@context" = "http://schema.org/extensions"
    "summary"  = "Issue 176715375"
    "sections" = @(
        @{
            "activityTitle"    = "VM SNAP Shot:"
            "facts"            = @(
                @{
                    "name"  = "VM Name:"
                    "value" = "$vmName"
                },
                @{
                    "name"  = "Snap Name:"
                    "value" = "$snapName"
                },
                @{
                    "name"  = "Snap Description:"
                    "value" = "$snapDescription"
                }
            )
            "markdown" = $true
        }
    )
} | ConvertTo-Json -Depth 10

    # Send the message card
    Invoke-RestMethod -Uri $webhookUrl -Method Post -ContentType 'application/json' -Body $messageCard

    # Use this section to add the code to do whatever day 2 process you want to run
    # --- Start the Code


    # --- end the Code

    $output=@{status = 'done'}

    return $output
}

{{< /highlight >}}  

---

###### Screen Shot 17:  

Microsoft Teams Message with Day 2 Automation Details. Awesome!

{{< image src="aria-automation-messages-17.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Links to resources discussed is this Blog Post: 
* [Link to learn how to create a Microsoft Teams Webhook.](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook?tabs=newteams%2Cdotnet)  
* [Link to my GitHub Repository for sample code like what is included in this Blog Post.](https://github.com/dalehassinger/unlocking-the-potential/)  

---

###### Aria Automation Version used for Blog Post:
VMware Aria Automation 8.16.0 was used for this Blog Post. When new versions of VMware Aria Automation are released, the code or process may need to be changed.  

---

{{< admonition type=info title="Info" open=true >}}
In my blogs, I often emphasize that there are multiple methods to achieve the same objective. This article presents just one of the many ways you can tackle this task. I've shared what I believe to be an effective approach for this particular use case, but keep in mind that every organization and environment varies. There's no definitive right or wrong way to accomplish the tasks discussed in this article.
{{< /admonition >}}

---

* If you found this blog article helpful and it assisted you, consider buying me a coffee to kickstart my day.  

<center>
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="dalehassinger" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
</center>

---






