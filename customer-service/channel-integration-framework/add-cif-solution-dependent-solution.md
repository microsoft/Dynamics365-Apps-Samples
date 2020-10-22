---
title: "Add a Dynamics 365 Channel Integration Framework (CIF) solution as a dependent solution| Microsoft Docs"
description: "Read how you can add a CIF solution as a dependent solution and use CIF solution's capabilities in your own solution."
keywords: ""
ms.date: 12/10/2018
ms.service:
  - "dynamics-365-cross-app"
ms.custom:
  - "dyn365-a11y"
  - "dyn365-developer"
ms.topic: get-started-article
applies_to:
  - "Dynamics 365 (online)"
  - "Dynamics 365 Version 9.x"
ms.assetid: 7B9466F3-CFF6-447B-8570-AB3A51F4096C
author: susikka
ms.author: susikka
manager: shujoshi
---

# Add a Dynamics 365 Channel Integration Framework (CIF) solution as a dependent solution

Third-party channel providers can add a Channel Integration Framework (CIF) solution as a dependent solution to use CIF's capabilites in the solutions they develop for Dynamics 365. This topic describes how users can install, update, and delete a CIF solution as a dependent solution.

## Add a Channel Integration Framework solution as a dependent solution  

1. Add the Channel Integration Framework application to your Dynamics 365 instance that has an unmanaged dependent solution installed (for example, solution "X"). More information: [Get Channel Integration Framework](get-channel-integration-framework.md)

2. Sign in to your Dynamics 365 instance and go to **Settings** > **Solutions**.

3. From the list of solutions, select the "X" solution to open it.

4. In the window that opens, select **Model Driven App** from the left panel.

5. Select **Channel Integration Framework** and then select **OK**.

6. Select **Publish all customizations**.

7. Close the solution window.

8. Export the solution.

## Remove a Channel Integration Framework solution as a dependent solution
  
1. [!INCLUDE[proc_permissions_system_admin_and_customizer](../../includes/proc-permissions-system-admin-and-customizer.md)]  
  
2. Sign in to [!INCLUDE[pn_crm_shortest](../../includes/pn-crm-shortest.md)].  
  
3. Select **Settings** > **Solutions**.  
  
4. Select solution "X".

5. In the window that opens, select the **Channel Integration Framework** solution.

6. Select **Delete** and then select the **Delete** button in the dialog box that opens to confirm that you want to remove CIF as a dependent solution.

> [!div class="nextstepaction"]
> [Authenticate channel users to the channel (widget)](authenticate-channel-users.md)

## See also

[Get Channel Integration Framework](get-channel-integration-framework.md)<br />
[Configure a channel provider for your Dynamics 365 organization](configure-channel-provider-channel-integration-framework.md)<br />
[Enable outbound communication (ClickToAct)](enable-outbound-communication-clicktoact.md)<br />
[Authenticate channel users to the channel (widget)](authenticate-channel-users.md)<br />
[Pass a Dynamics 365 URL to a widget library](pass-url-widget-library.md)
