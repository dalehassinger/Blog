# Creating Charts with ChartJS and displaying in vRealize Operations


**Creating Charts with ChartJS and displaying in vRealize Operations**

<!--more-->

---

I like the idea of using VMware vRealize Operations as the “Single Pane of Glass” for all monitoring.  The Citrix Team recently asked me if I could show license usage within vRealize Operations. They wanted to see the highest usage in the last 30 days, 10 days and 24 hours. Citrix license usage is not built into vROPS but I have used the “Text Display Widget” to show other information within vROPS.

I wanted to create a half donut chart to show the highest license usage in the last 30 days, a horizontal bar chart to show the last 10 days and a table to show the last 24 hours.  I reviewed to see what “Open Source” Javascript options were available and I found ChartJS. After reviewing how to program the files to create charts with ChartJS I liked the solution. 

###### ChartJS Displayed in vRealize Operations using the "Text Display Widget"

{{< image src="chartjs01.jpg" caption="Click to see Larger Image">}}  

###### ChartJS Half Donut. 

{{< image src="chartjs02.jpg" caption="Click to see Larger Image">}}  

When you hold the mouse over the chart you will see the values.

###### ChartJS Half Donut code:

{{< highlight html >}}
<html>
<head>
  <title>Citrix Licensing Count</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
</head>
<body>
<body>
    <div style="width:95%">
    <canvas id="doughnut-chart"></canvas>
    </div>
	<script>
		new Chart(document.getElementById("doughnut-chart"), {
			type: 'doughnut',
			data: {
			labels: ["Used","Total"],
			datasets: [
				{
        label: "Peak Usage",
				backgroundColor: ["#28B463","#808B96"],
				data: [1682,8000]
				}
			]
			},
			options: {
			title: {
				display: true,
				text: 'Citrix License Usage (MPS_PLT_CCU)',
			},
			rotation: 1 * Math.PI,
			circumference: 1 * Math.PI
			}
		});
  </script>
</body>
</html>
{{< /highlight >}}


###### ChartJS Horizintal Bar Chart. 

{{< image src="chartjs03.jpg" caption="Click to see Larger Image">}}  

###### ChartJS Horizintal Bar Chart code:

{{< highlight html >}}
<html>
<head>
  <title>Citrix Licensing Count</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
</head>
<body>
    <div style="width:95%">
    <canvas id="bar-chart-horizontal"></canvas>
    </div>
    <script>
		new Chart(document.getElementById("bar-chart-horizontal"), {
			type: "horizontalBar",
			data: {
			labels: ["01/03/2021","01/02/2021","01/01/2021","12/31/2020","12/30/2020","12/29/2020","12/28/2020","12/27/2020","12/26/2020","12/25/2020","Total Licences"],
			datasets: [
				{
				label: "Peak Usage",
				backgroundColor: ["#28B463", "#28B463","#28B463","#28B463","#28B463","#28B463","#28B463","#28B463","#28B463","#28B463","#808B96"],
				data: [249,318,302,1402,1535,1498,1516,271,273,269,8000]
				}
			]
			},
			options: {
			legend: { display: false },
			title: {
				display: true,
				text: "Citrix License Usage (MPS_PLT_CCU)"
			}
			}
		});	
  </script>
</body>
</html>
{{< /highlight >}}

---

* Read all the documentation on how to create ChartJS files.  Very important steps need to be followed.
* All the Web pages to show Citrix Licence counts are updated very hour.
* The process to update the Web Pages is scheduled with vRealize Automation Orchestrator.
* The code to get the license information and create the web pages is all done with PowerShell.
* The License values collected every hour are saved in a Microsoft SQL Database.

The process to save the data and create the web pages can be done many different ways. I outlined how I do it in my environment. What I feel was important to show was the finished HTML code to create the ChartJS Web Pages that I display in vRealize Operations.  The data could be from any source that makes sense in your environment. This makes a great way to graphically show data within vROPS from data that is saved outside of vROPS.

---

<a href="../text-display-widget/" target="_blank">Link to my blog post that shows how to use the "Test Display Widget</a>

<a href="https://www.chartjs.org" target="_blank">Link to ChartJS</a>
