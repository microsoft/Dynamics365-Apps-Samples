---
languages:
- csharp
products:
- dynamics
- dynamics-365
- dynamics-customer-service
page_type: sample
level: 
- beginner
- intermediate
- advanced
role: developer
description: "Sample that shows how to process and close an incident with a case resolution in Dynamics 365 Customer Service."
---

# Sample: Close an incident

This sample shows how to how to process and close an incident (case) with a case resolution.

## How to run this sample

See [How to run samples](https://github.com/microsoft/Dynamics365-Apps-Samples/blob/master/sales/README.md) for information about how to run this sample.

## What this sample does

%full-description%

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

### Setup

1. Create an incident.
2. Create a 30-minute appointment regarding the incident.
3. Show the time spent on the incident before closing the appointment.
4. Check the validity of the state transition to closed on the incident.
5. Close the appointment.
6. Show the time spent on the incident after closing the appointment.
7. Check the validity of the state transition to closed again.
8. Create the incident's resolution.
9. Close the incident with the resolution.

### Demonstrate

This sample shows how to how to process and close an incident (case) with a case resolution.

### Clean up

1. Display an option to delete the records created in [Setup](#setup).

    The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.