# Pipelines
This folder contains sample OneBranch pipelines. You can read about OneBranch and how the pipelines are structured and function from the linked documentation below. There is a dedicated OneBranch team that supports the infrastructure and governed tepmlates.

To make things easier for teams to get going, we have created our own internal templates for buliding and testing D365 solutions. You can find them in the CRM.Solutions.Tools.Pipelines repository, which is linked in the documentation below. These templates cover building, test, various SDL checks, and package deployment.

You can find Non-OneBranch YAML pipeline examples in the /build/pipelines directory. However it is recommended to use OneBranch

# Important
In order for your new repo to utilize these pipeline files you will need to create the OneBranch Pipeline in ADO by using the OneBranch easy start wizard. Documentation is linked below.

# Documentation: 
- [OneBranch Pipelines](https://dev.azure.com/dynamicscrm/OneCRM/_wiki/wikis/OneCRM.wiki/29857/Moving-to-OneBranch-Pipelines)
- [OneBranch ADO EasyStart](https://eng.ms/docs/more/easystart/overview/onebranchbuildpipeline)
- [OneBranch.Wiki - Onboarding](https://onebranch.visualstudio.com/OneBranch/_wiki/wikis/OneBranch.wiki/4546/Onboarding-Kick-Start-Steps)
- [Internal YAML Build Templates](https://dev.azure.com/dynamicscrm/OneCRM/_wiki/wikis/OneCRM.wiki/22566/YAML-Build-Templates)