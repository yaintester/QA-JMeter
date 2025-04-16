# QA-JMeter
# JMeter QA - Secondhand Project

This repository contains performance testing scripts and result files for the **Secondhand** project using **Apache JMeter**. It covers both mobile (APK) and web platforms to ensure the system's responsiveness, stability, and scalability under load.

## Description

The `.jmx` files are JMeter test plans designed for simulating user interactions and load testing on both the mobile and web versions of the Secondhand application. After executing these test plans, the results are saved in `.jtl` format and can be visualized through generated reports.

## How to Use

1. Open the desired `.jmx` file in Apache JMeter.
2. Configure the test settings as needed (e.g., number of users, loop count, server URL).
3. Run the test using JMeter GUI or CLI.
4. Analyze the `.jtl` result files or generate an HTML report for deeper insight.


## Understanding the Test Reports

### 1. **.jtl Files**
- The **.jtl** (JMeter Test Logs) files contain detailed raw results from the performance test. These files include:
  - **Response time**: How long it took for the server to respond to each request.
  - **Success or failure status**: Whether each request was successful or failed.
  - **Timestamp**: The exact time when each request was sent.
  - **Throughput**: The number of requests per unit of time.
  - **Error rate**: If any errors occurred during the test (e.g., server timeouts, connection errors).

  These files are critical for detailed analysis of the performance and help identify issues such as slow responses or server errors.

### 2. **HTML Report**
- The HTML report is a great way to quickly spot performance bottlenecks, see trends, and communicate findings to stakeholders in a clear, visual format. This report includes:
  - **Graphs**: Visual representation of various performance metrics, such as response time, throughput, and error rate over time.
  - **Summary Statistics**: A high-level overview of the test run, including the number of requests, average response time, and total requests per second.


## Requirements

- [Apache JMeter](https://jmeter.apache.org/) 5.5 or later  
- Java 8 or higher

---
