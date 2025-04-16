/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 45.45454545454545, "KoPercent": 54.54545454545455};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.16386363636363635, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2975, 500, 1500, "GET/buyer/order "], "isController": false}, {"data": [0.3, 500, 1500, "GET/buyer/order/{id}"], "isController": false}, {"data": [0.1725, 500, 1500, "GET/seller/product"], "isController": false}, {"data": [0.0, 500, 1500, "POST/buyer/order"], "isController": false}, {"data": [0.0, 500, 1500, "POST/auth/register"], "isController": false}, {"data": [0.665, 500, 1500, "GET/buyer/product/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "GET/seller/product/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "POST/seller/product"], "isController": false}, {"data": [0.0, 500, 1500, "PUT /buyer/order/{id}"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE/seller/product/{id} "], "isController": false}, {"data": [0.3675, 500, 1500, "POST/auth/login "], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2200, 1200, 54.54545454545455, 2116.6104545454546, 0, 12260, 1108.0, 5745.8, 6978.649999999999, 9753.99, 9.243736318219824, 11.209999831932068, 3.248109760965382], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET/buyer/order ", 200, 0, 0.0, 2334.369999999999, 517, 8987, 974.5, 5505.8, 6264.65, 8169.580000000005, 0.871315424896967, 4.309777956155408, 0.2961111014298286], "isController": false}, {"data": ["GET/buyer/order/{id}", 200, 0, 0.0, 2387.500000000001, 559, 8326, 1068.5, 5741.5, 6528.65, 7677.700000000004, 0.867396725577361, 0.22701398677219994, 0.2998617586468611], "isController": false}, {"data": ["GET/seller/product", 200, 0, 0.0, 3263.7949999999996, 1045, 11003, 1603.0, 7852.300000000001, 8912.999999999996, 10667.380000000006, 0.9137009456804788, 2.27443721732377, 0.3131924139978985], "isController": false}, {"data": ["POST/buyer/order", 200, 200, 100.0, 3811.760000000001, 941, 12260, 1389.5, 9700.200000000003, 10520.9, 12176.420000000002, 0.8801848388161514, 0.2879510947298933, 0.3601537572890307], "isController": false}, {"data": ["POST/auth/register", 200, 200, 100.0, 1508.8550000000002, 204, 6034, 742.0, 3932.500000000001, 4458.599999999998, 5708.55, 0.9369173545201578, 0.30559609024387957, 0.5453151789980606], "isController": false}, {"data": ["GET/buyer/product/{id}", 200, 0, 0.0, 917.3000000000003, 123, 3801, 437.0, 2246.2, 2766.8, 3525.84, 0.9052313318668586, 1.006893053707375, 0.31117327032923264], "isController": false}, {"data": ["GET/seller/product/{id}", 200, 200, 100.0, 2536.8299999999995, 572, 9190, 1269.5, 6249.6, 6998.75, 8905.640000000003, 0.9097897930683115, 0.2887516433078137, 0.31807104093599176], "isController": false}, {"data": ["POST/seller/product", 200, 200, 100.0, 0.7900000000000003, 0, 2, 1.0, 1.0, 1.0, 2.0, 0.93023688482272, 2.273811447960223, 0.0], "isController": false}, {"data": ["PUT /buyer/order/{id}", 200, 200, 100.0, 2527.544999999999, 283, 9251, 1234.0, 6067.1, 7208.649999999998, 9144.300000000001, 0.8681083051921558, 0.27552265545649474, 0.3162152322623771], "isController": false}, {"data": ["DELETE/seller/product/{id} ", 200, 200, 100.0, 2308.4250000000006, 493, 9977, 1091.0, 6009.5, 6755.65, 8196.160000000003, 0.9060227864730799, 0.29374957530181883, 0.33533460554032934], "isController": false}, {"data": ["POST/auth/login ", 200, 0, 0.0, 1685.5450000000005, 367, 6045, 906.0, 4071.7000000000003, 4865.45, 6042.380000000003, 0.9285697704111243, 0.4398011119623001, 0.3881131462265246], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["400/Bad Request", 400, 33.333333333333336, 18.181818181818183], "isController": false}, {"data": ["403/Forbidden", 400, 33.333333333333336, 18.181818181818183], "isController": false}, {"data": ["404/Not Found", 200, 16.666666666666668, 9.090909090909092], "isController": false}, {"data": ["Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: d:\\\\Untitled.png (The system cannot find the path specified)", 200, 16.666666666666668, 9.090909090909092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2200, 1200, "400/Bad Request", 400, "403/Forbidden", 400, "404/Not Found", 200, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: d:\\\\Untitled.png (The system cannot find the path specified)", 200, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST/buyer/order", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST/auth/register", 200, 200, "400/Bad Request", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["GET/seller/product/{id}", 200, 200, "403/Forbidden", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST/seller/product", 200, 200, "Non HTTP response code: java.io.FileNotFoundException/Non HTTP response message: d:\\\\Untitled.png (The system cannot find the path specified)", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /buyer/order/{id}", 200, 200, "403/Forbidden", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["DELETE/seller/product/{id} ", 200, 200, "404/Not Found", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
