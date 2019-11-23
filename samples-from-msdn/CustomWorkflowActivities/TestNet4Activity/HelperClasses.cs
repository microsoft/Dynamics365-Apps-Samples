// ==============================================================================
//  This file is part of the Microsoft Dynamics CRM SDK Code Samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
//
// ==============================================================================

using System;

namespace Microsoft.Crm.Sdk.Samples
{
	public static class EntityName
	{
		public const string Account = "account";
		public const string ActivityParty = "activityparty";
		public const string Campaign = "campaign";
		public const string CampaignResponse = "campaignresponse";
		public const string Competitor = "competitor";
		public const string Contact = "contact";
		public const string Task = "task";
	}

	public static class ActivityPartyAttributes
	{
		public const string PartyId = "partyid";
	}

	public static class CampaignResponseAttributes
	{
		public const string Customer = "customer";
		public const string RegardingObjectId = "regardingobjectid";
		public const string Subject = "subject";
	}

	public static class ContactAttributes
	{
		public const string Birthdate = "birthdate";
		public const string FullName = "fullname";
	}

	public static class TaskAttributes
	{
		public const string Subject = "subject";
	}

	[AttributeUsage(AttributeTargets.Class)]
	public sealed class PersistAttribute : Attribute
	{
	}
}