# Notes:
# This script uses the importexcel powershell module
# find-module importexcel
# install-module importexcel
# Script Description: Creates RVTools xlsx file and creates a web page for every worksheet.

# ----- [ Function to Create the HTML Files ] -----
function Create-HTML{

param(
	[parameter(mandatory = $true)]
	[string]$workSheet
) # End param

#$workSheet = 'vHealth'
$vTools = Import-Excel -Path "C:\RVTools\RVTools-Data.xlsx" -WorksheetName $workSheet
#$vTools

# -- Get the Header info for the specifc worksheet
$tableHeaders = ($vTools[0].psobject.Properties).name
#$tableHeaders

# -- Build the Table Header
$tableHeader = @'
'@

foreach($field in $tableHeaders){
  $outPut = '                        <th>' + $field + '</th>'
  $tableHeader += "$output" + "`n"
  #Write-Output $tableHeader
}
#$tableHeader

# -- Start creating the HTML file
$htmlFile = @'
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>PageTitle</title>
	
	<!-- Include the required stylesheets and scripts -->
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.25/css/jquery.dataTables.min.css">
	<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script type="text/javascript" src="https://cdn.datatables.net/1.10.25/js/jquery.dataTables.min.js"></script>

	<!-- CSS rules to control the font -->
	<style type="text/css">
		body {
			font-family: Arial, sans-serif;
			font-size: 11px;
		}
		table {
			font-family: Arial, sans-serif;
			font-size: 11px;
			border-collapse: collapse;
			width: 100%;
		}
		th, td {
			padding: 8px;
			text-align: left;
			border: 1px solid #ddd;
		}
		th {
			background-color: #f2f2f2;
		}
	</style>	
	
	<!-- Initialize the DataTables plugin -->
	<script type="text/javascript">
		$(document).ready(function() {
			$('#example').DataTable({
				scrollX: true, // enable horizontal scrolling
				order: [[ 0, "asc" ]], // sort by the first column in ascending order by default
				searching: true // enable searching
			});
		});
	</script>
</head>
<body>
	<table id="example" class="display" style="width:100%">
		<thead>
			<tr>
'@

# -- Create HTML Page Title
$pageTitle = 'RVTools | ' + $workSheet
$htmlFile = $htmlFile.Replace("PageTitle",$pageTitle)

# -- Add Table Header to HTML File
$htmlFile += $tableHeader

$htmlHeader2 = @'
                    </tr>
                </thead>
                <tbody>

'@

$htmlFile += $htmlHeader2

# -- Create HTML Table
$table = @'
'@


foreach($record in $vTools){
  $output = '                    <tr>'
  foreach($field in $tableHeaders){
    $output += '<td>' + $record.$field + '</td>'
    #Write-Output $tableHeader

  }
  $output += '</tr>'
  #Write-Output $output
  $table += "$output" + "`n"
}
#$table

# -- Add Table to HTML File
#$table
$htmlFile += $table
#$htmlFile

# -- Create HTML Footer
$htmlFooter = @'
                </tbody>
            </table>
    </body>
</html>
'@
#$htmlFooter

# -- Add HTML Footer
$htmlFile += $htmlFooter
#$htmlFile

# -- Create the  HTML file in the Web Server folder
$filePath = 'C:\inetpub\wwwroot\rvtools\' + $workSheet + '.htm'
$htmlFile | Out-File -FilePath $filePath

} # End Function





# ----- [ Run RVTools and create the xlsx file ] -----

# -- Set RVTools path
[string] $RVToolsPath = "C:\RVTools"

# -- cd to RVTools directory
set-location $RVToolsPath

# -- Set parameters for vCenter and start RVTools export
[string] $VCServer          = "vcsa-01a.corp.local"                                                    # my test vCenter server
[string] $User              = "administrator@corp.local"                                                    # or use -passthroughAuth
[string] $EncryptedPassword = "_RVToolsV2PWDasF30QqSuq9OjfEwP+zMeR93x/p511QbI9SZl9YvUJw=" # use RVToolsPasswordEncryption.exe to encrypt your password
[string] $XlsxDir           = "C:\RVTools"
[string] $XlsxFile          = "RVTools-Data.xlsx"

# -- Start cli of RVTools
Write-Host "Start export for vCenter $VCServer" -ForegroundColor DarkYellow
$Arguments = "-u $User -p $EncryptedPassword -s $VCServer -c ExportAll2xlsx -d $XlsxDir -f $XlsxFile -DBColumnNames"

#Write-Host $Arguments

$Process = Start-Process -FilePath "C:\RVTools\RVTools.exe" -ArgumentList $Arguments -Wait -PassThru #-NoNewWindow

if($Process.ExitCode -eq -1)
{
    Write-Host "Error: Export failed! RVTools returned exitcode -1, probably a connection error! Script is stopped" -ForegroundColor Red
    exit 1
} # End If


# ----- [ Get Name of evry Worksheet in xlsx file and send to function to create html files ] -----

$worksheetNames = Get-ExcelSheetInfo 'C:\RVTools\RVTools-Data.xlsx'

foreach($workSheet in $worksheetNames.Name){
	$output = 'WorkSheet: ' + $workSheet
	Write-Output $output
	Create-HTML -workSheet $workSheet
} # End Foreach

