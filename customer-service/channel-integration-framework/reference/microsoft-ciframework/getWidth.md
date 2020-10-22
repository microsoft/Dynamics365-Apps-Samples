---
title: "getWidth (JavaScript API Reference) for Channel Integration Framework (CIF) in Dynamics 365 | Microsoft Docs"
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
ms.assetid: E7AF0E53-B6CF-4D0B-97BA-8B094579DAB8
author: kabala123
ms.author: kabala
manager: shujoshi
---

# getWidth (CIF JavaScript API Reference)

[!INCLUDE[getWidth](includes/getWidth-description.md)]

## Syntax

`Microsoft.CIFramework.getWidth(value).then(successCallback, errorCallback);`

## Parameters

| Name            | Type     | Required | Description |
|-----------------|----------|----------|-------------|
| successCallback | Function | No       | A function to call when the request for the current width value is successful. |
| errorCallback   | Function | No       | A function to call when the request for the current width value fails. |

## Return value

**Type:** Number

**Description:** Returns a promise object the value (width of the panel in pixels).