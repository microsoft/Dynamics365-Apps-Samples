There are 2 types of packages for your CRM solution that are produced during the normal build process. Each has a purpose and a specific use case. 

1. PD Package - The PD (PackageDeployer) package is the mechanism for deploying your included solutions into a CRM org using Package Deployer, PAC CLI, or the Power Platform Build Tools (PPBT) build tasks in ADO.
    It consists of a dll built by the package project, the solution zips or cabs you want imported and an import.config file that denotes the order that the solutions should be imported into. 
    Any custom logic that should be run during the import process is contained in this project and the resulting dll. You can find the ImportConfig.xml inside of the PDPackage/boilerplate/ folder.
     - Official documentation for packages can be found here: [Create packages for the Package Deployer tool](https://docs.microsoft.com/en-us/power-platform/alm/package-deployer-tool?view=op-9-1)
     - and here: [Deploy Packages using Package Deployer](https://docs.microsoft.com/en-us/power-platform/admin/deploy-packages-using-package-deployer-windows-powershell)
     - You can also see the PAC CLI documentation for packages here: [CLI Reference Package](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/cli/reference/package-command)



2. PVS Package - this package is sometimes referred to as the AppSource Package or Deployment Package. It is simply a wrapper around the PD Package that contains a configuration XML and license terms that are used by the deployment system (TPS, Partner Center, AppSource, etc). 
    It contains the PD Package in a zip file along with the configuration XMl that contains the informatio needed by the deployment system such as any flighting info, what the anchor solution is, languages that are supported, etc. 
    The items in the **PackageExtra** folder are what is included in the PVS package. You can learn about Partner Center and deployment systems from the following links:
    - [Partner Center](https://dev.azure.com/dynamicscrm/OneCRM/_wiki/wikis/OneCRM.wiki/29681/Partner-Center)
    - [AppSource Onboarding](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/publish-app-appsource)
    - [Canonical Solution Delivery (Deployment Automation)](https://dev.azure.com/dynamicscrm/OneCRM/_wiki/wikis/OneCRM.wiki/29505/Canonical-Solution-Delivery)
