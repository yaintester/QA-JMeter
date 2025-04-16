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

    var data = {"OkPercent": 94.89693313222725, "KoPercent": 5.10306686777275};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13411261940673705, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3157894736842105, 500, 1500, "POST /offers.json-0"], "isController": false}, {"data": [0.18633540372670807, 500, 1500, "GET /users/{user_id}/offers.json "], "isController": false}, {"data": [0.0625, 500, 1500, "POST /offers.json-1"], "isController": false}, {"data": [0.0, 500, 1500, "GET /products/{id}.json"], "isController": false}, {"data": [0.0, 500, 1500, "GET /categories/{id}.json "], "isController": false}, {"data": [0.0, 500, 1500, "POST /offers.json"], "isController": false}, {"data": [0.4254658385093168, 500, 1500, "GET /categories/{id}.json -0"], "isController": false}, {"data": [0.06832298136645963, 500, 1500, "GET /categories/{id}.json -1"], "isController": false}, {"data": [0.0, 500, 1500, "DELETE /products/{id}.json "], "isController": false}, {"data": [0.16455696202531644, 500, 1500, "GET /products.json"], "isController": false}, {"data": [0.05, 500, 1500, "POST /products.json "], "isController": false}, {"data": [0.3416149068322981, 500, 1500, "POST /users/sign_in.json"], "isController": false}, {"data": [0.253125, 500, 1500, "PUT /offers/{id}.json -0"], "isController": false}, {"data": [0.040625, 500, 1500, "PUT /offers/{id}.json -1"], "isController": false}, {"data": [0.22, 500, 1500, "GET /products/{id}.json-0"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "GET /products/{id}.json-1"], "isController": false}, {"data": [0.24468085106382978, 500, 1500, "PUT /profiles.json "], "isController": false}, {"data": [0.16901408450704225, 500, 1500, "PUT /products/{id}.json -0"], "isController": false}, {"data": [0.017605633802816902, 500, 1500, "PUT /products/{id}.json -1"], "isController": false}, {"data": [0.03900709219858156, 500, 1500, "DELETE /products/{id}.json -1"], "isController": false}, {"data": [0.0, 500, 1500, "PUT /offers/{id}.json "], "isController": false}, {"data": [0.0, 500, 1500, "PUT /products/{id}.json "], "isController": false}, {"data": [0.1773049645390071, 500, 1500, "DELETE /products/{id}.json -0"], "isController": false}, {"data": [0.36024844720496896, 500, 1500, "GET /categories.json "], "isController": false}, {"data": [0.003105590062111801, 500, 1500, "POST /users.json"], "isController": false}, {"data": [0.30141843971631205, 500, 1500, "GET /profiles.json"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3978, 203, 5.10306686777275, 2787.510809451986, 115, 9458, 2409.0, 5306.199999999999, 6714.249999999998, 8197.36, 11.751776946665013, 180.5337174198749, 13.292122812420606], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["POST /offers.json-0", 152, 0, 0.0, 1685.8421052631584, 205, 4554, 1474.5, 2989.000000000001, 3510.45, 4169.749999999999, 0.47819042675349593, 0.6256586915829047, 0.40188788872634607], "isController": false}, {"data": ["GET /users/{user_id}/offers.json ", 161, 0, 0.0, 2029.7204968944088, 211, 4002, 2188.0, 3192.6000000000004, 3544.3, 3910.2399999999993, 0.4902139890630519, 0.6528376272729487, 0.3674731647804085], "isController": false}, {"data": ["POST /offers.json-1", 152, 0, 0.0, 3094.3355263157905, 954, 6509, 2931.5, 4723.700000000001, 4894.65, 6116.2699999999995, 0.47530597822348136, 15.154494475349757, 0.3470984446237265], "isController": false}, {"data": ["GET /products/{id}.json", 153, 9, 5.882352941176471, 4630.908496732028, 1129, 8542, 3811.0, 7109.4, 7583.399999999999, 8376.220000000003, 0.4772644325700222, 14.364894198585676, 0.6767947911110279], "isController": false}, {"data": ["GET /categories/{id}.json ", 161, 0, 0.0, 4165.024844720497, 1525, 7974, 3841.0, 6705.6, 7426.600000000003, 7938.04, 0.4900602987237125, 15.587198558697656, 0.7107277357387887], "isController": false}, {"data": ["POST /offers.json", 161, 9, 5.590062111801243, 4629.484472049689, 511, 9263, 4133.0, 7255.200000000001, 7729.200000000001, 8923.239999999998, 0.4899752882028558, 15.3877098277326, 0.7495970447794806], "isController": false}, {"data": ["GET /categories/{id}.json -0", 161, 0, 0.0, 1348.3850931677016, 150, 3663, 1135.0, 2733.6000000000004, 3190.4, 3581.7799999999993, 0.49469356652553054, 0.34396662047478294, 0.363071542944625], "isController": false}, {"data": ["GET /categories/{id}.json -1", 161, 0, 0.0, 2816.652173913043, 809, 6965, 2605.0, 4434.0, 4807.500000000001, 5909.759999999992, 0.49247522329621923, 15.321585149845527, 0.3527866383595375], "isController": false}, {"data": ["DELETE /products/{id}.json ", 142, 1, 0.704225352112676, 5216.584507042249, 115, 9224, 4081.0, 8287.7, 8661.599999999999, 9139.72, 0.45210691373354345, 14.280422820454655, 0.6711335108330548], "isController": false}, {"data": ["GET /products.json", 158, 5, 3.1645569620253164, 2023.3987341772156, 241, 4148, 1846.5, 3162.6999999999994, 3466.35, 4049.4699999999993, 0.49001972484462036, 4.79774232328276, 0.3804685513171606], "isController": false}, {"data": ["POST /products.json ", 160, 10, 6.25, 2475.281249999999, 478, 4860, 2311.0, 3845.3, 4104.45, 4681.879999999996, 0.4935590543408519, 1.1013440133600267, 1.7085264832991955], "isController": false}, {"data": ["POST /users/sign_in.json", 161, 0, 0.0, 1524.2484472049694, 241, 3768, 1307.0, 2901.800000000002, 3045.9, 3619.819999999999, 0.4975893188280381, 1.0228613896958834, 0.39136747241624426], "isController": false}, {"data": ["PUT /offers/{id}.json -0", 160, 0, 0.0, 1837.9687499999993, 278, 4476, 1851.5, 3224.9, 3483.95, 4324.719999999997, 0.49270792274339775, 0.6444898702330508, 0.3992064900411411], "isController": false}, {"data": ["PUT /offers/{id}.json -1", 160, 0, 0.0, 2938.9999999999995, 903, 5480, 2766.0, 4554.8, 4802.55, 5425.0999999999985, 0.49154239860401955, 15.321107152210713, 0.3587923494497798], "isController": false}, {"data": ["GET /products/{id}.json-0", 150, 0, 0.0, 1823.6733333333336, 272, 3715, 1658.5, 3012.1, 3295.399999999999, 3704.29, 0.46931023909792313, 0.3263172756227747, 0.3499477794586037], "isController": false}, {"data": ["GET /products/{id}.json-1", 150, 6, 4.0, 2862.4133333333343, 783, 5533, 2547.0, 4705.1, 5019.299999999999, 5508.01, 0.46957322055228073, 14.070465013468924, 0.32906199423051036], "isController": false}, {"data": ["PUT /profiles.json ", 141, 0, 0.0, 1859.0709219858152, 245, 4755, 1675.0, 3240.3999999999996, 3970.0, 4639.080000000004, 0.4918856313578835, 0.7810844301190991, 1.6202682172111131], "isController": false}, {"data": ["PUT /products/{id}.json -0", 142, 0, 0.0, 2003.7394366197182, 776, 4655, 1762.0, 3240.8000000000006, 3724.899999999999, 4594.799999999999, 0.4517372797780761, 0.3140985773456936, 0.34502876246254083], "isController": false}, {"data": ["PUT /products/{id}.json -1", 142, 0, 0.0, 3223.1690140845085, 998, 6989, 2643.0, 5261.9000000000015, 5961.149999999999, 6760.669999999996, 0.44948514958042773, 13.981047509116319, 0.3279453642095867], "isController": false}, {"data": ["DELETE /products/{id}.json -1", 141, 0, 0.0, 3185.971631205675, 893, 6245, 2725.0, 5472.2, 5758.8, 6231.56, 0.49144844845193736, 15.284372146287822, 0.35823550292429257], "isController": false}, {"data": ["PUT /offers/{id}.json ", 161, 1, 0.6211180124223602, 4749.07453416149, 251, 8515, 4380.0, 7105.400000000001, 7338.400000000001, 8370.539999999999, 0.49015279980759224, 15.826259241739708, 0.7502253827606258], "isController": false}, {"data": ["PUT /products/{id}.json ", 144, 2, 1.3888888888888888, 5171.229166666669, 1010, 9458, 4055.5, 8200.5, 8569.5, 9333.800000000003, 0.4531821886811454, 14.226744736674398, 0.6673754358731467], "isController": false}, {"data": ["DELETE /products/{id}.json -0", 141, 0, 0.0, 2066.7234042553187, 201, 5191, 1896.0, 3370.2, 3987.9, 4985.200000000006, 0.49426165721376647, 0.343666308531447, 0.3786278991863962], "isController": false}, {"data": ["GET /categories.json ", 161, 0, 0.0, 1368.4782608695648, 241, 3472, 1305.0, 2453.2000000000003, 2792.4000000000005, 3471.38, 0.495081473190262, 0.5173214612437308, 0.3619058061371652], "isController": false}, {"data": ["POST /users.json", 161, 160, 99.37888198757764, 2307.316770186336, 700, 5168, 2157.0, 3595.8, 3920.100000000001, 4941.079999999998, 0.4996384603687394, 0.3075614394320259, 0.5091242691623763], "isController": false}, {"data": ["GET /profiles.json", 141, 0, 0.0, 1596.879432624113, 194, 4227, 1367.0, 2958.9999999999995, 3550.6000000000004, 4031.7000000000057, 0.48926055727124473, 0.7763704066761512, 0.36369913295048406], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, 2.4630541871921183, 0.1256913021618904], "isController": false}, {"data": ["422/Unprocessable Entity", 17, 8.374384236453203, 0.42735042735042733], "isController": false}, {"data": ["401/Unauthorized", 160, 78.81773399014779, 4.022121669180493], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 21, 10.344827586206897, 0.5279034690799397], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3978, 203, "401/Unauthorized", 160, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 21, "422/Unprocessable Entity", 17, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 5, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /products/{id}.json", 153, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["POST /offers.json", 161, 9, "422/Unprocessable Entity", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["DELETE /products/{id}.json ", 142, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /products.json", 158, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["POST /products.json ", 160, 10, "422/Unprocessable Entity", 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET /products/{id}.json-1", 150, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PUT /offers/{id}.json ", 161, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PUT /products/{id}.json ", 144, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: The target server failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST /users.json", 161, 160, "401/Unauthorized", 160, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
