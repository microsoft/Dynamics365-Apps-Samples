---
title: "getEnvironment (JavaScript API Reference) for Channel Integration Framework (CIF) in Dynamics 365 | Microsoft Docs"
description: ""
keywords: ""
ms.date: 10/12/2018
ms.service:
  - "dynamics-365-cross-app"
ms.custom:
  - "dyn365-a11y"
  - "dyn365-developer"
ms.topic: reference
applies_to:
  - "Dynamics 365 (online)"
  - "Dynamics 365 Version 9.x"
ms.assetid: E71DDFAD-BCCC-423E-B086-2EA71D4D2B73
author: kabala123
ms.author: kabala
manager: shujoshi
---

# getEnvironment (CIF JavaScript API Reference)

[!INCLUDE[getEnvironment](includes/getEnvironment-description.md)]

## Syntax

`Microsoft.CIFramework.getEnvironment().then(successCallback, errorCallback);`

## Parameters

| Name            | Type     | Required | Description |
|-----------------|----------|----------|-------------|
| successCallback | Function | No       | A function to call when the request for environment details are successful |
| errorCallback   | Function | No       | A function to call when the request for the environment fails              |

## Return value

**Type:** String

**Description:** Returns a promise object containing string with the available details of the current Unified Interface page. The details include: * 'appid', 'pagetype', 'record-id' (if available), 'clientUrl', 'appUrl' 'orgLcid', 'orgUniqueName', 'userId', 'userLcid', and 'username'.