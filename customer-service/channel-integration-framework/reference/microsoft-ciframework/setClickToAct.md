---
title: "setClickToAct (JavaScript API Reference) for Channel Integration Framework (CIF) in Dynamics 365 | Microsoft Docs"
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
ms.assetid: 7383B0E5-3C02-45F1-8ED3-197765C0E999
author: kabala123
ms.author: kabala
manager: shujoshi
---

# setClickToAct (CIF JavaScript API Reference)

[!INCLUDE[setClickToAct](includes/setClickToAct-description.md)]

## Syntax

`Microsoft.CIFramework.setClickToAct(value).then(successCallback, errorCallback);`

## Parameters

| Name            | Type     | Required | Description                                       |
|-----------------|----------|----------|---------------------------------------------------|
| Value           | Boolean  | Yes      | Sets the value to enable or disable ClickToAct.   |
| successCallback | Function | No       | A function to call when the request is successful |
| errorCallback   | Function | No       | A function to call when the request fails         |

## Return value

**Type:** Boolean

**Description:** Returns Promise object with the value. True to enable **ClickToAct** is enabled and false to disable.
