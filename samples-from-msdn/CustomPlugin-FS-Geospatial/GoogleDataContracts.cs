// ===================================================================== 
//  This file is part of the Microsoft Dynamics 365 Customer Engagement 
//  SDK Code Samples. 
// 
//  Copyright (C) Microsoft Corporation.  All rights reserved. 
// 
//  This source code is intended only as a supplement to Microsoft 
//  Development Tools and/or on-line documentation.  See these other 
//  materials for detailed information regarding Microsoft code samples. 
// 
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY 
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A 
//  PARTICULAR PURPOSE. 
// =====================================================================

using System.Collections.Generic;
using System.Runtime.Serialization;

namespace Microsoft.Crm.Sdk.Samples.GoogleDataContracts
{

    public static class GoogleConstants
    {
        public const string GoogleApiKey = "<PROVIDE YOUR GOOGLE API KEY";
        public const string GoogleApiServer = "maps.googleapis.com";
        public const string GoogleGeocodePath = "/maps/api/geocode";
        public const string GoogleDistanceMatrixPath = "/maps/api/distancematrix";
    }

    [DataContract(Namespace = "")]
    public class GeocodeResponse
    {
        [DataMember(Name = "status", Order = 1)]
        public string Status { get; set; }

        [DataMember(Name = "error_message")]
        public string ErrorMessage { get; set; }

        [DataMember(Name = "results", Order = 2)]
        public IList<CResult> Results { get; set; }

        [DataContract]
        public class CResult
        {
            [DataMember(Name = "geometry")]
            public CGeometry Geometry { get; set; }

            [DataContract]
            public class CGeometry
            {
                [DataMember(Name = "location")]
                public CLocation Location { get; set; }

                [DataContract]
                public class CLocation
                {
                    [DataMember(Name = "lat", Order = 1)]
                    public double Lat { get; set; }
                    [DataMember(Name = "lng", Order = 2)]
                    public double Lng { get; set; }
                }

                [DataMember(Name = "location_type")]
                public string LocationType { get; set; }

            }
        }
    }

    [DataContract(Namespace = "")]
    public class DistanceMatrixResponse
    {
        [DataMember(Name = "destination_addresses")]
        public IList<string> DestinationAddresses { get; set; }

        [DataMember(Name = "error_message")]
        public string ErrorMessage { get; set; }

        [DataMember(Name = "origin_addresses")]
        public IList<string> OriginAddresses { get; set; }

        [DataMember(Name = "rows")]
        public IList<CResult> Rows { get; set; }

        [DataMember(Name = "status")]
        public string Status { get; set; }

        [DataContract]
        public class CResult
        {
            [DataMember(Name = "elements")]
            public IList<CElement> Columns { get; set; }

            [DataContract]
            public class CElement
            {
                [DataMember(Name = "status")]
                public string Status { get; set; }

                [DataMember(Name = "duration")]
                public CProperty Duration { get; set; }

                [DataMember(Name = "distance")]
                public CProperty Distance { get; set; }

                [DataMember(Name = "duration_in_traffic")]
                public CProperty DurationInTraffic { get; set; }

                [DataContract]
                public class CProperty
                {
                    [DataMember(Name = "text", Order = 1)]
                    public string Text { get; set; }
                    [DataMember(Name = "value", Order = 2)]
                    public double Value { get; set; }
                }
            }
        }
    }
}
