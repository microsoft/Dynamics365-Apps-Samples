---
title: "setWidth (JavaScript API Reference) for Channel Integration Framework (CIF) in Dynamics 365 | Microsoft Docs"
description: ""
keywords: ""
ms.date: 12/10/2018
ms.service:
  - "dynamics-365-cross-app"
ms.custom:
  - "dyn365-a11y"
  - "dyn365-developer"
ms.topic: reference
applies_to:
  - "Dynamics 365 (online)"
  - "Dynamics 365 Version 9.x"
ms.assetid: 3B05CB86-5C50-4EED-A33E-86A0B46A1D33
author: kabala123
ms.author: kabala
manager: shujoshi
---

<!--from editor: Line 39 reads like it has extra or missing words. "... when the panel width is setting operation fails." Probably the "is" should be removed.-->



# setWidth (CIF JavaScript API Reference)

[!INCLUDE[setWidth](includes/setWidth-description.md)]

## Syntax

`Microsoft.CIFramework.setWidth(value).then(successCallback, errorCallback);`

## Parameters

| Name   | Type   | Required | Description |
|--------|--------|----------|-------------|
| value           | Number   | Yes      | The width of the panel in pixels. |
| successCallback | Function | No       | A function to call when the panel width is set successfully. |
| errorCallback   | Function | No       | A function to call when the panel width is setting operation fails. |

> [!NOTE]
> If the `value` parameter passed for setWidth is greater than half of screen width, the side panel will collapse. setWidth API should be called with lesser width value to be able to use the side panel.

## Return value

Returns a promise object with a value.
