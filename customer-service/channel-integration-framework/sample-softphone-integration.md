---
title: "Sample code for softphone integration using Channel Integration Framework (CIF) | Microsoft Docs"
description: "Learn about sample code for softphone integration using Channel Integration Framework (CIF) with Microsoft Dynamics 365 Unified Interface App."
keywords: ""
ms.date: 12/10/2018
ms.service:
  - "dynamics-365-cross-app"
ms.custom:
  - "dyn365-a11y"
  - "dyn365-developer"
ms.topic: article
applies_to:
  - "Dynamics 365 (online)"
  - "Dynamics 365 Version 9.x"
ms.assetid: 30E520EC-1791-48DD-BD70-1D29D78E89AB
author: kabala123
ms.author: kabala
manager: shujoshi
---

## Sample softphone integration using Channel Integration Framework

Go to the [Dynamics 365 Insider Portal](https://go.microsoft.com/fwlink/p/?linkid=2025867) to download the sample to integrate a softphone with Dynamics 365 using Channel Integration Framework.

> [!NOTE]
> The sample code does not support Internet Explorer and on browsers that do not have webRTC support. More information [WebRTC](https://webrtc.org/)

> [!Important]
> - This sample code currently has limited availability.
> - The sample code for softphone integration with Dynamics 365 using Channel Integration Framework is made available so customers can get early access and provide feedback. The sample code is not meant for production use and may have limited or restricted functionality.
> - Microsoft doesn't provide support for this sample code for production use and Microsoft Dynamics 365 Technical Support won’t be able to help you with issues or questions. This is subject to [supplemental terms of use](http://go.microsoft.com/fwlink/p/?LinkId=511446)

## Pre-requisites

- A valid Azure subscription is required to publish the sample app to Azure.
> [!Note]
> If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).


## Publish sample app to Azure

1. Open the solution **SampleInteg.sln** using Visual Studio 2017.
2. In **Solution Explorer**, right-click on the solution and build the complete solution.
3. In **Solution Explorer**, right-click on the project **SampleInteg**  and select **Publish**
4. Select **Start** to launch the **Publish** wizard.
5. Choose **App Service** as the publish target.
6. Select **Create New** and select on **Publish**.
7. Provide an app name.<br> For example, **SampleInteg**.
8. Provide valid subscription, resource group, and hosting plan details.
9. Select *Create* to create the azure app service, and save the app service URL for future use.<br>For example, `https://sampleinteg.azurewebsites.net`.

## Create function to use with the app service

1. Create sample code for the **client-voice** function.<br> Refer to function from the readme file packaged with the sample softphone integration in the [Dynamics 365 Insider Portal](https://go.microsoft.com/fwlink/p/?linkid=2025867).

2. Use the sample code for the **capability-token** function.<br> Refer to function from the readme file packaged with the sample softphone integration in the [Dynamics 365 Insider Portal](https://go.microsoft.com/fwlink/p/?linkid=2025867).

> [!Note] 
> Save the URL for the **capability-token** function you obtain from the above sample code. For example, URL is `https://sampleinteg.sample/capability-token`.

## Configure sample app in Dynamics 365

1. Note the base URL of the CRM org from where all webresources are served. For an online org, this should be of the form `https://<orgname>.crmXX.dynamics.com`. For example, `https://sampleorg.crm10.dynamics.com`

1. Get the **Dynamics 365 Channel Integration Framework** solution. For more information, see [Get Dynamics 365 Channel Integration Framework](get-channel-integration-framework.md).

2. Configure the channel provider by providing the detail as show in the matrix. For more information, see [Configure the channel provider](configure-channel-provider-channel-integration-framework.md)

  | Field | Description |
  |-------|-------|
  |Name|Name of the channel provider.<br><br> Example: Contoso|
  |Label|The label is displayed as the title on the widget.<br><br> Example: Contoso|
  |Channel URL| The channel URL is in the format: `<azure_app_service_url>?base=<crm_base_url>&twa=<capability_token_url>`<br><br>**Note:** In this sample, the URL is `https://sampleinteg.azurewebsites.net?base=https://sampleorg.crm10.dynamics.com&twa=https://sampleinteg.sample/capability-token`. |
  |Enable Outbound Communication| Yes |
  |Channel Order| 0 |
  |API Version| 1.0 |
  |Trusted Domains|The domain (URL) that can access the Channel Integration Framework APIs.|
  |Select the Unified Interface Apps for the Channel| The list of Unified Interface Apps where the channel is displayed for the agents. |
  |Select Roles for the Channel|The security roles that are present in Dynamics 365.<br>**Note:** If you do not assign any role, the channel provider is shown to all users assigned for the Dynamics 365 Unified Interface App.|

3. Launch the Unified Interface App to see the communication widget on the right side.<br><br>
**The communication widget in the minimized mode**<br><br>
![communication widget in the minimized mode](media/widget-minimized-mode.PNG "communication widget in the minimized mode")
<br><br>
**The communication widget in the expanded mode**<br><br>
![communication widget in the expanded mode](media/widget-expanded-mode.PNG "communication widget in the expanded mode")

> [!Important]
> - All URLs must be https.
> - If you use a self-signed certificate for the Azure app or the Dynamics 365 org, certain browsers may reject the connection and fail to load the sample phone. As a workaround, open the Azure app in a separate tab and accept the certificate once.
> - Ensure microphone and speaker access is not blocked by browser policy.

## Related topics

- [Get Dynamics 365 Channel Integration Framework](get-channel-integration-framework.md)

- [Configure the channel provider](configure-channel-provider-channel-integration-framework.md)

- [Microsoft.CIFramework](reference/microsoft-ciframework.md)

- [Client-side events](reference/client-side-events.md)

- [Entity reference](reference/entities-attributes/msdyn-ciprovider.md)