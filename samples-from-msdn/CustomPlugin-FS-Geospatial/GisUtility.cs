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

using System;
using System.Globalization;

namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// GIS Utility class
    /// Provides to Geospatial Information Systems basic helper functions.
    /// </summary>
    static class GisUtility
    {
        /// <summary>
        /// Use the Locale Id (LCID) to get location address components in proper order, as specified by the national postal service of the country.
        /// </summary>
        /// <param name="Lcid">The Lcoale Id of the address</param>
        /// <param name="Address1">Line 1 of the street component (least significant portion)</param>
        /// <param name="Address2">Optional Line 2 of the street component</param>
        /// <param name="PostalCode">Postal Code component (Zip Code)</param>
        /// <param name="City">City component</param>
        /// <param name="State">Optional State Component</param>
        /// <param name="Country">Optional Country component</param>
        /// <returns>string with comma-separated address in the proper order for the specified country, escaped for URI data transmission</returns>
        /// <remarks>References: <see cref="https://msdn.microsoft.com/en-us/library/cc195167.aspx"/>, <see cref="https://msdn.microsoft.com/en-us/goglobal/bb964664.aspx"/> </remarks>
        public static string FormatInternationalAddress(int Lcid, string Address1, string PostalCode, string City, string State, string Country)
        {
            string _address = string.Empty;
            var r = new RegionInfo("US");   // default
            if (Lcid > 0)
            {
                var ci = new CultureInfo(Lcid);
                if (ci.ThreeLetterISOLanguageName != "ivl" && !ci.IsNeutralCulture) // if not Invariant and not Neutral culture, get the regionInfo for the locale
                    r = new RegionInfo(Lcid);
            }

            switch (r.ThreeLetterISORegionName)
            {
                case "BGR":     //Bulgaria
                    _address = $"{Country},{State},{PostalCode},{City},{Address1}";
                    break;
                case "DNK":     //Denmark  (State not used)
                    _address = $"{Address1},DK-{PostalCode},{City},{Country}";
                    break;
                case "DEU":     //Germany  (State not used)
                    _address = $"{Address1},D-{PostalCode},{City},{Country}";
                    break;
                case "HUN":     //Hungary
                    _address = $"{City},{Address1},{PostalCode},{State},{Country}";
                    break;
                case "TWN":     //Chinese(Taiwan)
                case "JPN":     //Japanese
                case "KOR":     //Korean
                case "RUS":     //Russia
                case "CHN":     //Chinese(PRC)
                    _address = $"{Country},{PostalCode},{State},{City},{Address1}";
                    break;
                case "CZE":     //Czech
                case "GRC":     //Greece  (State should be null)
                case "ESP":     //Spain (State should be null)
                case "FIN":     //Finland (State should be null)
                case "FRA":     //France  (State should be null)
                case "ITA":     //Italy
                case "NLD":     //Netherlands (State should be null)
                case "NOR":     //Norway (State should be null)
                case "POL":     //Poland
                case "BRA":     //Brazil
                case "ROU":     //Romania
                case "SWE":     //Sweden (State should be null)
                case "TUR":     //Turkey
                case "MYS":     //Malaysia
                case "CHE":     //Switzerland (State should be null)
                case "MEX":     //Mexico
                case "GTM":     //Guatemala
                case "CRI":     //Costa Rica
                case "PAN":     //Panama
                case "DOM":     //Dominican Republic
                case "VEN":     //Venezuela
                case "COL":     //Colombia
                case "PER":     //Peru
                case "ARG":     //Argentina
                case "ECU":     //Ecuador
                case "CHL":     //Chile
                case "URY":     //Uruguay
                case "PRY":     //Paraguay
                case "BOL":     //Bolivia
                case "SLV":     //El Salvador
                case "HND":     //Honduras
                case "NIC":     //Nicaragua
                    _address = $"{Address1},{PostalCode},{City}{(State == null ? "" : "," + State)},{Country}";
                    break;
                default:
                    _address = $"{Address1},{City},{State},{PostalCode},{Country}";
                    break;
            }
            return Uri.EscapeDataString(_address);
        }
    }
}
