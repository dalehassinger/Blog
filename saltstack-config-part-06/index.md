# VMware vRealize SaltStack Config as a Windows Server Admin - Part 6


Part 6: How to use SaltStack Config with Windows Server and PowerShell

<!--more-->

---

{{< image src="ps.png" caption="">}}  
{{< image src="powercli.png" caption="">}}  

<div>
The latest item on my journey with <b>VMware vRealize SaltStack Config</b> as a <b>Windows Server Admin</b> is going to be a lot PowerShell. I use PowerShell for a lot of Automation, Windows Server and Linux Server. When working with <b>VMware vRealize SaltStack Config</b> I constantly found myself going to the CLI to test and learn how the salt functions work.  

In the <a href="https://www.vcrocs.info/2021/10/vmware-vrealize-saltstack-config-as-a-windows-server-admin-part-5/" target="_blank">Part 5 Blog</a> of this series I showed how I am using the PowerShell module POSH-SSH to connect to the <b>VMware vRealize SaltStack Config</b> Server to run salt commands remotely. So I started writing some PowerShell functions to run remote salt commands on the Salt Master. The end goal might be to turn this script into a Salt PowerShell Module. To start it will only have the functions that I find myself using the most. I could turn this into a community Github Project and see if there would be any interest. If anyone reading this blog post has any interest please reach out to me. (Dale.Hassinger@vCROCS.info)

My goal is to make all these PowerShell Salt functions work with <b>VMware vRealize SaltStack Config</b> like PowerCLI works with <b>VMware vCenter</b>. Use same verb/noun terminology. I use PowerCLI for all my VMware Automation. Works awesome! So to create these PowerShell Functions to work with my existing automation scripts is a win win in my book.

Normally I will use a Products APIs to do all these types of processes. I looked at <b>VMware vRealize SaltStack Config</b> APIs and to the best of my knowledge I can not use them like I can the PS functions that I created. That may change in a future release of <b>VMware vRealize SaltStack Config</b>. Fingers crossed.
</div>

---

###### Salt PowerShell Functions:  

{{< highlight powershell >}}

# ----- [ Start of Functions ] --------------------------------------------------------------------------------------------------------------
# The POSH-SSH PS module MUST be installed to use these functions.

# Function to Connect to SSC Server
function Connect-SSCServer 
{
    param(

        [parameter(mandatory = $true)]
        [string]$Server,
        [parameter(mandatory = $true)]
        [string]$userName,
        [parameter(mandatory = $true)]
        [string]$Password

    ) # End Parameters

    # The next line is how to create the encrypted password
    $psPassword = ConvertTo-SecureString -String $global:HashiPW -AsPlainText -Force
    $creds = new-object -typename System.Management.Automation.PSCredential -argumentlist $username, $psPassword

    $Params = @{
        "ComputerName" = $Server
        "Credential"   = $creds
    } # End Params
      
    # SSH Connection to SaltStack Server
    New-SSHSession @Params

} # End Function





# Function to Disconnect from SSC Server
function Disconnect-SSCServer
{
    Remove-SSHSession -SessionId 0
} # End Function





# Sync Minion grains
function invoke-SSC.sync.grains
{
    param(
    [parameter(mandatory = $true)]
    [string]$minion
    )

    # Sync Grains after adding new grain information
    $sshCommand = 'salt "' + $minion + '" saltutil.sync_grains --output=json'
    #$sshCommand


    $Params = @{
        "SessionId" = 0
        "Command"   = $sshCommand
    } # End Params

    $results = Invoke-SSHCommand @Params

    return $results.Output
    
} # End Function





# Minion Grain Append
function set-SSC.grains.append
{
    param(
        [parameter(mandatory = $true)]
        [string]$minion,
        [parameter(mandatory = $true)]
        [string]$grainkey,
        [parameter(mandatory = $true)]
        [string]$grainval
    ) # End Parameters

    # Grains Append
    $sshCommand = 'salt "' + $minion + '" grains.append "' + $grainkey + '" "' + $grainval + '"'
    #$sshCommand

    $Params = @{
        "SessionId" = 0
        "Command"   = $sshCommand
    } # End Params

    $results = Invoke-SSHCommand @Params

} # End Function





# Minion Grain DelKey
function set-SSC.grains.delkey
{
    param(
        [parameter(mandatory = $true)]
        [string]$minion,
        [parameter(mandatory = $true)]
        [string]$grainkey
    ) # End Parameters

    $sshCommand = 'salt "' + $minion + '" grains.delkey "' + $grainkey + '" force=True'
    #$sshCommand

    $Params = @{
        "SessionId" = 0
        "Command"   = $sshCommand
    } # End Params

    $results = Invoke-SSHCommand @Params

} # End Function





# Minion Test Ping
function invoke-SSC.test.ping
{
    param(
        [parameter(mandatory = $true)]
        [string]$minion
    ) # End Parameters

    $sshCommand = 'salt "' + $minion + '" test.ping --output=json'
    #$sshCommand

    $results = Invoke-SSHCommand -SessionId 0 -Command $sshCommand
    return $results.Output[1].Trim()

} # End Function




# ----- [ End of Functions ] --------------------------------------------------------------------------------------------------------------


{{< /highlight >}}
   
###### Examples to show how to use the Salt PowerShell Functions above:

{{< highlight powershell >}}

# ----- [ Connect to SSC Server ] --------------------------------------------------

# DO NOT use plain text PW's in your Code. I am only showing PW to make it easier to understand the code. 

# Set Parameter Values
$Server   = 'SaltMaster.vCROCS.local'
$User     = 'root'
$Password = 'VMware1!'

# Define Parameters (Splatting)
$Params = @{
    "Server"   = $Server
    "User"     = $User
    "Password" = $Password
}

# Connect to SSC
Connect-SSCServer @Params



# ----- [ Disconnect to SSC Server ] -----------------------------------------------
Disconnect-SSCServer



# ----- [ Sync Minion grains ] -------------------------------------------------------
# Set Parameter Values
$minion = 'DBH-211'

# Define Parameters (Splatting)
$Params = @{
    "minion" = $minion
}

# Run Function
invoke-SSC.sync.grains @Params



# ----- [ Minion grain append ] ----------------------------------------------------
# Set Parameter Values
$minion = 'DBH-211'
$grainkey = 'PS_Module'
$grainval = 'Works great for Windows Server'

# Define Parameters (Splatting)
$Params = @{
    "minion"   = $minion
    "grainkey" = $grainkey
    "grainval" = $grainval
}

# Run Function
set-SSC.grains.append @Params

# Define Parameters (Splatting)
$Params = @{
    "minion" = $minion
}

# Run Function
invoke-SSC.sync.grains @Params



# ----- [ Minion grain DelKey ] ----------------------------------------------------
# Set Parameter Values
$minion = 'DBH-211'
$grainkey = 'PS_Module'

# Define Parameters (Splatting)
$Params = @{
    minion   = $minion
    grainkey = $grainkey
}

# Run Function
set-SSC.grains.delkey @Params

# Define Parameters (Splatting)
$Params = @{
    "minion" = $minion
}

# Run Function
invoke-SSC.sync.grains @Params



# ----- [ Minion test.ping ] ----------------------------------------------------
# Set Paramter Values
$minion = 'DBH-211'

# Define Parameters (Splatting)
$Params = @{
    "minion" = $minion
}

# Run Function
invoke-SSC.test.ping @Params

{{< /highlight >}}

###### Lessons Learned:
* Adding the POSH-SSH PowerShell module so you can create a SSH connection to the salt master opens up a lot of possibilities for your PowerShell Automation as a Windows Server Admin.
* Using the PowerShell Functions above as a Windows admin makes it very easy to add this code to existing scripts and use the Power of SaltStack without completely changing your processes.
* Creating a SSH Connection to a remote Salt Master and running commands works well in a "Zero Trust" environment. With NSX-T all you need to do is setup allow rules between the minions and the master on ports 4505,4506.

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
