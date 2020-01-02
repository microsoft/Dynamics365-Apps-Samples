# Sample: Override goal total count and close the goal

This sample shows how to override the goal total count and close the goal.

## How to run this sample

See [How to run samples](https://github.com/microsoft/PowerApps-Samples/blob/master/cds/README.md) for information about how to run this sample.

## What this sample does

This sample overrides the goal total count and closes the goal. A goal is created specifying the target count. The goal is then rolled up, the actual and in-progress values are overridden and finally the goal is closed.

## How this sample works

In order to simulate the scenario described in [What this sample does](#what-this-sample-does), the sample will do the following:

- Create PhoneCall record and supporting account
- Create the count metric, setting the Metric Type to 'Count' by setting IsAmount to false.
- Create RollupFields
- Create the goal rollup queries
- Create a goal to track the open incoming phone calls.
- Calculate rollup and display result.
- Update goal to override the actual rollup value.
- Retrieve result of manual override.
- Close the goal.
- Delete all records created in this sample. The deletion is optional in case you want to examine the entities and data created by the sample. You can manually delete the records to achieve the same result.

### Setup

%setup%

### Demonstrate

 This sample demonstrates how to override the goal total count and close the goal.