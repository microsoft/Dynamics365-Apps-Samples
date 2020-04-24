// Copyright (c) Microsoft Corporation. All rights reserved.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Microsoft.OmniChannel.Adapters.MessageBird
{
    /// <summary>
    /// Determines whether it matches the expected signature
    /// </summary>
    public class MessageBirdRequestSigner
    {
        private readonly byte[] _signingKey;

        /// <summary>
        /// Constructs a new RequestSigner instance.
        /// </summary>
        /// <param name="signingKey">Signing key. Can be retrieved through https://dashboard.messagebird.com/developers/settings.
        /// This is NOT your API key</param>
        public MessageBirdRequestSigner(byte[] signingKey)
        {
            _signingKey = signingKey;
        }

        /// <summary>
        /// Computes the signature for the provided request and determines whether
        /// it matches the expected signature(from the raw MessageBird-Signature header)
        /// </summary>
        /// <param name="encodedSignature">expectedSignature Signature from the MessageBird-Signature
        /// header in its original base64 encoded state</param>
        /// <param name="request">Request containing the values from the incoming web-hook.</param>
        /// <returns>True if the computed signature matches the expected signature</returns>
        public bool IsMatch(string encodedSignature, MessageBirdRequest request)
        {
            using (var base64Transform = new FromBase64Transform())
            {
                var signatureBytes = Encoding.ASCII.GetBytes(encodedSignature);
                var decodedSignature = base64Transform.TransformFinalBlock(signatureBytes, 0, signatureBytes.Length);

                return IsMatch(decodedSignature, request);
            }
        }

        /// <summary>
        /// Computes the signature for the provided request and determines whether it matches the expected signature
        /// </summary>
        /// <param name="expectedSignature">Decoded (with base64) signature from the MessageBird-Signature header</param>
        /// <param name="request">Request containing the values from the incoming web-hook</param>
        /// <returns>True if the computed signature matches the expected signature</returns>
        public bool IsMatch(byte[] expectedSignature, MessageBirdRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var actualSignature = ComputeSignature(request);
            return expectedSignature.SequenceEqual(actualSignature);
        }

        /// <summary>
        /// Computes the signature for a request instance.
        /// </summary>
        /// <param name="request">Request to compute signature for</param>
        /// <returns>HMAC-SHA2556 signature for the provided request</returns>
        private IEnumerable<byte> ComputeSignature(MessageBirdRequest request)
        {
            var timestampAndQuery = request.Timestamp + '\n' + request.SortedQueryParameters() + '\n';
            var timestampAndQueryBytes = Encoding.UTF8.GetBytes(timestampAndQuery);
            using (var sha256 = SHA256.Create())
            {
                var bodyHashBytes = sha256.ComputeHash(request.Data);
                var signPayload = new byte[timestampAndQueryBytes.Length + bodyHashBytes.Length];
                Array.Copy(timestampAndQueryBytes, signPayload, timestampAndQueryBytes.Length);
                Array.Copy(bodyHashBytes, 0, signPayload, timestampAndQueryBytes.Length, bodyHashBytes.Length);
                using (var hmacSha256 = new HMACSHA256(_signingKey))
                {
                    return hmacSha256.ComputeHash(signPayload, 0, signPayload.Length);
                }
            }
        }
    }
}
