// =====================================================================
//
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
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
// =====================================================================
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Security;

using Microsoft.IdentityModel.Protocols.WSTrust;

public static class ClientBaseExtensions
{
	public static Binding ConfigureCrmOnlineBinding<TChannel>(this ClientBase<TChannel> client, Uri issuerUri)
		where TChannel : class
	{
		if (null == client)
		{
			throw new ArgumentNullException("client");
		}

		//When this is represented in the configuration file, it attempts to show the CardSpace dialog.
		//As a workaround, the binding is being setup manually using code.
		TransportSecurityBindingElement securityElement = new TransportSecurityBindingElement();
		securityElement.DefaultAlgorithmSuite = SecurityAlgorithmSuite.TripleDes;
		securityElement.MessageSecurityVersion = MessageSecurityVersion.WSSecurity11WSTrust13WSSecureConversation13WSSecurityPolicy12BasicSecurityProfile10;
		securityElement.EndpointSupportingTokenParameters.Signed.Add(
			new System.ServiceModel.Security.Tokens.IssuedSecurityTokenParameters()
			{
				RequireDerivedKeys = false,
				KeySize = 192,
				IssuerAddress = new EndpointAddress(issuerUri),
			});

		//Create a new list of the binding elements
		List<BindingElement> elementList = new List<BindingElement>();
		elementList.Add(securityElement);
		elementList.AddRange(client.Endpoint.Binding.CreateBindingElements());

		Binding binding = new CustomBinding(elementList);
		client.ChannelFactory.Endpoint.Binding = binding;

		//Configure the channel factory for use with federation
		client.ChannelFactory.ConfigureChannelFactory();
		return client.Endpoint.Binding;
	}

	public static TChannel CreateChannel<TChannel>(this ClientBase<TChannel> client, SecurityToken token)
		where TChannel : class
	{
		if (null == client)
		{
			throw new ArgumentNullException("client");
		}

		if (null == token)
		{
			return client.ChannelFactory.CreateChannel();
		}

		lock (client.ChannelFactory)
		{
			return client.ChannelFactory.CreateChannelWithIssuedToken(token);
		}
	}
}

#region Overrides for the clients
namespace Microsoft.Crm.Sdk.Samples.CrmSdk.Discovery
{
	partial class DiscoveryServiceClient
	{
		#region Properties
		public SecurityToken Token { get; set; }
		#endregion

		protected override IDiscoveryService CreateChannel()
		{
			return this.CreateChannel(this.Token);
		}
	}
}

namespace Microsoft.Crm.Sdk.Samples.CrmSdk
{
	partial class OrganizationServiceClient
	{
		#region Properties
		public SecurityToken Token { get; set; }
		#endregion

		protected override IOrganizationService CreateChannel()
		{
			return this.CreateChannel(this.Token);
		}
	}
}
#endregion