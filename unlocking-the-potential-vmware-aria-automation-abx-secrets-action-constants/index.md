# Unlocking the Potential | VMware Aria Automation | ABX Action Constants and Secrets


**Using VMware Aria Automation Action Constants and Secrets**

<!--more-->

---

###### VMware Aria Automation  

VMware Aria Automation 8.14 was used for this Blog Post. When new versions of VMware Aria Automation are released, the code may need to be changed.  

All the source code for this Blog is saved in my GitHub Repository. Click on the links within the blog to access the code.  

---

I wanted to share how I use **Action Constants** and **Secrets** within VMware Aria Automation. **Action Constants** are a great to have a variable that can be used with many Actions where the value may change. Instead of having to edit 10s or 100s of Actions, you change One Action Constant and all the Actions are updated instantly. Main reason to use **Secrets** is to keep the values of Passwords out of the code! Plus, like Action Constants, if a Password would change, all you need to do is change one Secret and all your Actions and Templates are automatically Updated. Secrets can also be used in the yaml code of Templates.   

---

###### Action Constants  

**Action Constants Use Cases:**  
* vCenter Username  
* vCenter FQDN  
* VMware Aria Automation Config Username  
* VMware Aria Automation Config FQDN  
* salt master FQDN  
* Any value used in Actions that may change from time to time


**To access Action Constants: Assembler/Extensibility/Actions/Actions Constants**  
* You will see the Action Constants Names and Values.  

---

{{< image src="ActionConstants-02.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**How to use Action Constants and Secrets with an Action:**  
* Add the Action Constants and Secrets used within the Action in the Default inputs section. 
* To use a Action Constant value within the Action PowerShell code use $inputs."Action Constant"
* To use a Secret value within the Action PowerShell code use $context.getSecret($inputs."Secret Name")  
* In the example code, review how I am connecting to the vCenter. No hard coded Username, Password or vCenter FQDN. If any of these values would change, I would never need to edit the Action, only the Action Constants and Secret.  
* [Link to code | GitHub Repository](https://github.com/dalehassinger/unlocking-the-potential/tree/main/VMware-Aria-Automation/Action-Constants-and-Secrets)

---

{{< image src="ActionConstants-01.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Secrets  

**Secrets Use Cases:**  
* Passwords  
* Any value you don't want displayed in plain text within your code  

**To access Secrets: Assembler/Infrastructure/Secrets/Secrets**  
* You will see the Secret Names and Description only.  
* You can never see the Secret value after you create it. If you think the value is not correct you need to re-enter the value.

---

{{< image src="ActionConstants-03.png" caption="Click to see Larger Image of Screen Shot">}}  

---

**How to use Secrets with an Template:**  
* Add code to the template yaml that is like this: password: '${secret.UbuntuPassword}'  
* See Screen Shot  

---

{{< image src="ActionConstants-04.png" caption="Click to see Larger Image of Screen Shot">}}  

---

###### Links to resources about Actions Constants and Secrets:
* [Secret Automation Assembler properties](https://docs.vmware.com/en/VMware-Aria-Automation/SaaS/Using-Automation-Assembler/GUID-895A8127-CC67-4A53-B633-879F373E7606.html)  
* [How can I create extensibility action constants](https://docs.vmware.com/en/VMware-Aria-Automation/SaaS/Using-Automation-Assembler/GUID-7E6145AB-74EC-492F-9FA9-8D07739519D4.html)  

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

