---
title: "How to enable outbound communication (ClickToAct) in Dynamics 365 Channel Integration Framework (CIF) | Microsoft Docs"
description: "Learn enable or configure outbound communication (ClickToAct) in Channel Integration Framework (CIF) for Microsoft Dynamics 365."
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
ms.assetid: E0E45AC7-E516-46B5-ADBC-77254CBA8A2F
author: kabala123
ms.author: kabala
manager: shujoshi
---

# How to enable outbound communication (ClickTOAct) in Channel Integration Framework?

To enable outbound communication for your channel, you must perform the following:

- **Step 1:** In the channel provider configurations, set the **Enable Outbound Communication** field to **Yes**.

- **Step 2:** In the Unified Interface form, add the **Channel communication control** to the **Phone** field for which you want to enable outbound communication (ClickToAct), and publish the customizations.

- **Step 3:** Register the addhandler in your JavaScript code using `Microsoft.CIFramework.addHandler("onclicktoact", <handlerFunction>)` 

## Step 1: Set the Enable Outbound Communication field value in the channel provider configuration

1. Sign-in to Dynamics 365.

2. Select the drop-down button on the Dynamics 365 and select **Channel Integration Framework**.

3. Select a channel provider from the **Active Channel Providers** list.

4. Set the **Enable Outbound Communication** field to **Yes**, and save the changes.

## Step 2: Add the Channel Communication Control to the Unified Interface form

You can add the Channel Communication Control based on your organization and business requirements. The steps mentioned below illustrate adding the **Channel Communication Control** for the **Contact** form of **Main** type under the **Contact** entity.

1. Sign-in to Dynamics 365.

2. Go to **Settings** > **Customizations**.

3. Expand **Entites** > **Contact** and select **Forms**.<br>
![Expand contact entity and select forms](media/contact-entity-forms.PNG "Expand contact entity and select forms")

4. Select the **Contact** form of the **Main** type from the list.<br>
![Select contact form of Main type](media/contact-main-form.PNG "Select contact form of Main type")

5. Select the phone field for which you want to add the control. Double-click the **Business Phone** or **Mobile Phone** field.<br> The **Field Properties** dialog appears.

6. In the **Field Properties** dialog, choose **Controls** tab, and select the **Add control...** option. <br>
![Select phone, then select the Controls tab, and select the Add control option](media/add-custom-control.PNG "Select business or mobile phone, then select the Controls tab, and select the Add control option")

7. In the **Add Control** dialog, choose **Channel Communication Control**, and select **Add**.<br>
![Choose Channel Communication Control and select add](media/add-control.PNG "Choose Channel Communication Control and select add")

8. In the **Field Properties** dialog, select the radio buttons for **Web**, **Phone**, and **Tablet**, and then select **Ok**.<br>
![Select the radio buttons of web, phone, and tablet](media/select-radio-buttons.PNG "Select the radio buttons pf web, phone, and tablet") 

9. Select **Save**, and then select **Publish** to publish all customizations.

## Step 3: Register the addHandler in JavaScript code using the onclicktoact event

During the initialization of the function, register the handler for the `onlicktoact` event.

```JavaScript
function initCTI() {
    Microsoft.CIFramework.setClickToAct(true);
    Microsoft.CIFramework.addHandler("onclicktoact", clickToActHandler);
    log("Added clickToActhandler to the panel");
}
```
> [!Note]
> Channel Integration Framework invokes the onclicktoact event only if you programmatically set the `setClickToAct` API to `true` or by configuring the **Enable Outbound Communication** to **Yes** in the channel provider configurations.

> [!div class="nextstepaction"]
> [Add Channel Integration Framework as a dependent solution](add-cif-solution-dependent-solution.md)

## See also

[Entity reference](reference/entities-attributes/msdyn-ciprovider.md)

[setClickToAct](reference/microsoft-ciframework/setClickToAct.md)

[getClickToAct](reference/microsoft-ciframework/getClickToAct.md)

[onclicktoact](reference/events/onclicktoact.md)

