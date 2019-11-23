// =====================================================================
//  File:		DiagramBuilder.cs
//  Summary:	This sample command-line tool creates a 
//              Microsoft Office Visio diagram that details relationships
//              between Microsoft CRM entities. First, this sample reads
//              all the entity names from the parameter list or defaults
//              to all entities. Second, it creates a Visio object for 
//              the entity and all of the entities related to the entity,
//              and then it links them together. Finally, the file is saved.
// =====================================================================
//
//  This file is part of the Microsoft CRM 2011 SDK Code Samples.
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
using System.Text;
using System.Text.RegularExpressions;
using System.IO;
using System.Diagnostics;
using System.Collections;

using VisioApi = Microsoft.Office.Interop.Visio;

using System.ServiceModel;
using System.ServiceModel.Description;
using System.Collections.Generic;
using System.Xml.Serialization;
using System.Xml;


// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Messages;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using Microsoft.Crm.Sdk.Messages;


namespace Microsoft.Crm.Sdk.Samples
{
    /// <summary>
    /// Create a Visio diagram detailing relationships between Microsoft CRM entities.
    ///
    /// First, this sample reads in all the entity names. It then creates a visio object for
    /// the entity and all of the entities related to the entity, and links them together.
    /// Finally,it saves the file to disk.
    /// </summary>
    public class DiagramBuilder
    {
        #region Class Level Members

        /// <summary>
        /// Stores the organization service proxy.
        /// </summary>
        public static OrganizationServiceProxy _serviceProxy;

        // Specify which language code to use in the sample. If you are using a language
        // other than US English, you will need to modify this value accordingly.
        // See http://msdn.microsoft.com/en-us/library/0h88fahh.aspx
        public const int _languageCode = 1033;


        private VisioApi.Application _application;
        private VisioApi.Document _document;
        private RetrieveAllEntitiesResponse _metadataResponse;
        private ArrayList _processedRelationships;

        private const double X_POS1 = 0;
        private const double Y_POS1 = 0;
        private const double X_POS2 = 1.75;
        private const double Y_POS2 = 0.6;

        const double SHDW_PATTERN = 0;
        const double BEGIN_ARROW_MANY = 29;
        const double BEGIN_ARROW = 0;
        const double END_ARROW = 29;
        const double LINE_COLOR_MANY = 10;
        const double LINE_COLOR = 8;
        const double LINE_PATTERN_MANY = 2;
        const double LINE_PATTERN = 1;
        const string LINE_WEIGHT = "2pt";
        const double ROUNDING = 0.0625;
        const double HEIGHT = 0.25;
        const short NAME_CHARACTER_SIZE = 12;
        const short FONT_STYLE = 225;     
        const short VISIO_SECTION_OJBECT_INDEX = 1;
        String VersionName;

        // Excluded entities.
        // These entities exist in the metadata but are not to be drawn in the diagram.
        static Hashtable _excludedEntityTable = new Hashtable();
        static string[] _excludedEntities = new string[] {
                                                   "activityparty" ,  "annotation" ,  "appointment" ,   "asyncoperation" , "attributemap" ,  
                                                   "bulkdeletefailure" ,  "bulkimport" ,  "bulkoperationlog" ,   "businessunit" ,  "businessunitmap" ,   
                                                   "commitment" ,  "connection" ,  
                                                   "displaystringmap" ,  "documentindex" ,  "duplicaterecord"  ,  
                                                   "email" ,   "entitymap" ,  
                                                   "fax" ,   
                                                   "imagedescriptor" ,  "importconfig" ,  "integrationstatus" ,   "internaladdress" ,   
                                                   "letter" ,  
                                                   "msdyn_wallsavedquery" ,  "msdyn_wallsavedqueryusersettings" ,   
                                                   "owner" ,  
                                                   "partnerapplication" ,  "phonecall" ,   "plugintype" ,  "postfollow" ,  "postregarding" ,   "postrole" ,  
                                                   "principalobjectattributeaccess" ,  "privilegeobjecttypecodes" ,   "processsession" ,  "processstage" ,  
                                                   "recurringappointmentmaster" ,    "roletemplate" ,  "roletemplateprivileges" ,  
                                                   "serviceappointment" ,  "sharepointdocumentlocation" , "statusmap" ,  "stringmap" ,  "stringmapbit" ,   
                                                   "subscription" ,  "systemuser" ,  
                                                   "task" ,   "tracelog" ,  "traceregarding" ,  
                                                   "userentityinstancedata"  };

        // Excluded relationship list.
        // Those entity relationships that should not be included in the diagram.
        static Hashtable _excludedRelationsTable = new Hashtable();
        static string[] _excludedRelations = new string[] { "owningteam", "organizationid" };
        #endregion Class Level Members

        public DiagramBuilder()
        {
            // Build a hashtable from the array of excluded entities. This will
            // allow for faster lookups when determining if an entity is to be excluded.
            for (int n = 0; n < _excludedEntities.Length; n++)
            {
                _excludedEntityTable.Add(_excludedEntities[n].GetHashCode(), _excludedEntities[n]);
            }

            // Do the same for excluded relationships.
            for (int n = 0; n < _excludedRelations.Length; n++)
            {
                _excludedRelationsTable.Add(_excludedRelations[n].GetHashCode(), _excludedRelations[n]);
            }
            _processedRelationships = new ArrayList(128);
        }


        /// <summary>
        /// Main entry point for the application.
        /// </summary>
        /// <param name="CmdArgs">Entities to place on the diagram</param>
        public static int Main(string[] args)
        {
            String filename = String.Empty;
            VisioApi.Application application;
            VisioApi.Document document;
            DiagramBuilder builder = new DiagramBuilder();

            try
            {
                // Obtain the target organization's Web address and client logon 
                // credentials from the user.
                ServerConnection serverConnect = new ServerConnection();
                ServerConnection.Configuration config = serverConnect.GetServerConfiguration();

                // Connect to the Organization service. 
                // The using statement assures that the service proxy will be properly disposed.
                using (_serviceProxy = ServerConnection.GetOrganizationProxy(config))
                {
                    // This statement is required to enable early-bound type support.
                    _serviceProxy.EnableProxyTypes();

                    // Load Visio and create a new document.
                    application = new VisioApi.Application();
                    application.Visible = false; // Not showing the UI increases rendering speed  
                    builder.VersionName = application.Version;
                    document = application.Documents.Add(String.Empty);
                    builder._application = application;
                    builder._document = document;

                    // Load the metadata.
                    Console.WriteLine("Loading Metadata...");
                    RetrieveAllEntitiesRequest request = new RetrieveAllEntitiesRequest()
                    {
                        EntityFilters = EntityFilters.Entity | EntityFilters.Attributes | EntityFilters.Relationships,
                        // When RetrieveAsIfPublished property is set to false, retrieves only the currently published changes. Default setting of the property is false.
                        // When RetrieveAsIfPublished property is set to true, retrieves the changes that are published and those changes that have not been published.
                        RetrieveAsIfPublished = false


                    };
                    RetrieveAllEntitiesResponse response = (RetrieveAllEntitiesResponse)_serviceProxy.Execute(request);
                    builder._metadataResponse = response;

                    // Diagram all entities if given no command-line parameters, otherwise diagram
                    // those entered as command-line parameters.
                    if (args.Length < 1)
                    {
                        ArrayList entities = new ArrayList();

                        foreach (EntityMetadata entity in response.EntityMetadata)
                        {
                            // Only draw an entity if it does not exist in the excluded entity table.
                            if (!_excludedEntityTable.ContainsKey(entity.LogicalName.GetHashCode()))
                            {
                                entities.Add(entity.LogicalName);
                            }
                            else
                            {
                                Console.WriteLine("Excluding entity: {0}", entity.LogicalName);
                            }
                        }

                        builder.BuildDiagram((string[])entities.ToArray(typeof(string)), "All Entities");
                        filename = "AllEntities.vsd";
                    }
                    else
                    {
                        builder.BuildDiagram(args, String.Join(", ", args));
                        filename = String.Concat(args[0], ".vsd");
                    }

                    // Save the diagram in the current directory using the name of the first
                    // entity argument or "AllEntities" if none were given. Close the Visio application. 
                    document.SaveAs(Directory.GetCurrentDirectory() + "\\" + filename);
                    application.Quit();
                }
            }
            catch (FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Timestamp: {0}", ex.Detail.Timestamp);
                Console.WriteLine("Code: {0}", ex.Detail.ErrorCode);
                Console.WriteLine("Message: {0}", ex.Detail.Message);
                Console.WriteLine("Plugin Trace: {0}", ex.Detail.TraceText);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
            }
            catch (System.TimeoutException ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine("Message: {0}", ex.Message);
                Console.WriteLine("Stack Trace: {0}", ex.StackTrace);
                Console.WriteLine("Inner Fault: {0}",
                    null == ex.InnerException.Message ? "No Inner Fault" : ex.InnerException.Message);
            }
            catch (System.Exception ex)
            {
                Console.WriteLine("The application terminated with an error.");
                Console.WriteLine(ex.Message);

                // Display the details of the inner exception.
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);

                    FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault> fe
                        = ex.InnerException
                        as FaultException<Microsoft.Xrm.Sdk.OrganizationServiceFault>;
                    if (fe != null)
                    {
                        Console.WriteLine("Timestamp: {0}", fe.Detail.Timestamp);
                        Console.WriteLine("Code: {0}", fe.Detail.ErrorCode);
                        Console.WriteLine("Message: {0}", fe.Detail.Message);
                        Console.WriteLine("Plugin Trace: {0}", fe.Detail.TraceText);
                        Console.WriteLine("Inner Fault: {0}",
                            null == fe.Detail.InnerFault ? "No Inner Fault" : "Has Inner Fault");
                    }
                }
            }
            // Additional exceptions to catch: SecurityTokenValidationException, ExpiredSecurityTokenException,
            // SecurityAccessDeniedException, MessageSecurityException, and SecurityNegotiationException.

            finally
            {
                //Console.WriteLine("Rendering complete.");
                Console.WriteLine("Rendering complete.  Press any key to continue.");
                Console.ReadLine();
            }
            return 0;
        }

        /// <summary>
        /// Create a new page in a Visio file showing all the direct entity relationships participated in
        /// by the passed-in array of entities.
        /// </summary>
        /// <param name="entities">Core entities for the diagram</param>
        /// <param name="pageTitle">Page title</param>
        private void BuildDiagram(string[] entities, string pageTitle)
        {
            // Get the default page of our new document
            VisioApi.Page page = _document.Pages[1];
            page.Name = pageTitle;

            // Get the metadata for each passed-in entity, draw it, and draw its relationships.
            foreach (string entityName in entities)
            {
                Console.Write("Processing entity: {0} ", entityName);

                EntityMetadata entity = GetEntityMetadata(entityName);

                // Create a Visio rectangle shape.
                VisioApi.Shape rect;

                try
                {
                    // There is no "Get Try", so we have to rely on an exception to tell us it does not exists
                    // We have to skip some entities because they may have already been added by relationships of another entity
                    rect = page.Shapes.get_ItemU(entity.SchemaName);
                }
                catch (System.Runtime.InteropServices.COMException)
                {
                    rect = DrawEntityRectangle(page, entity.SchemaName, entity.OwnershipType.Value);
                    Console.Write('.'); // Show progress
                }

                // Draw all relationships TO this entity.
                DrawRelationships(entity, rect, entity.ManyToManyRelationships, false);
                Console.Write('.'); // Show progress
                DrawRelationships(entity, rect, entity.ManyToOneRelationships, false);

                // Draw all relationshipos FROM this entity
                DrawRelationships(entity, rect, entity.OneToManyRelationships, true);
                Console.WriteLine('.'); // Show progress
            }

            // Arrange the shapes to fit the page.
            page.Layout();
            page.ResizeToFitContents();
        }

        /// <summary>
        /// Draw on a Visio page the entity relationships defined in the passed-in relationship collection.
        /// </summary>
        /// <param name="entity">Core entity</param>
        /// <param name="rect">Shape representing the core entity</param>
        /// <param name="relationshipCollection">Collection of entity relationships to draw</param>
        /// <param name="areReferencingRelationships">Whether or not the core entity is the referencing entity in the relationship</param>
        private void DrawRelationships(EntityMetadata entity, VisioApi.Shape rect, RelationshipMetadataBase[] relationshipCollection, bool areReferencingRelationships)
        {
            ManyToManyRelationshipMetadata currentManyToManyRelationship = null;
            OneToManyRelationshipMetadata currentOneToManyRelationship = null;
            EntityMetadata entity2 = null;
            AttributeMetadata attribute2 = null;
            AttributeMetadata attribute = null;
            Guid metadataID = Guid.NewGuid();
            bool isManyToMany = false;

            // Draw each relationship in the relationship collection.
            foreach (RelationshipMetadataBase entityRelationship in relationshipCollection)
            {
                entity2 = null;

                if (entityRelationship is ManyToManyRelationshipMetadata)
                {
                    isManyToMany = true;
                    currentManyToManyRelationship = entityRelationship as ManyToManyRelationshipMetadata;
                    // The entity passed in is not necessarily the originator of this relationship.
                    if (String.Compare(entity.LogicalName, currentManyToManyRelationship.Entity1LogicalName, true) != 0)
                    {
                        entity2 = GetEntityMetadata(currentManyToManyRelationship.Entity1LogicalName);
                    }
                    else
                    {
                        entity2 = GetEntityMetadata(currentManyToManyRelationship.Entity2LogicalName);
                    }
                    attribute2 = GetAttributeMetadata(entity2, entity2.PrimaryIdAttribute);
                    attribute = GetAttributeMetadata(entity, entity.PrimaryIdAttribute);
                    metadataID = currentManyToManyRelationship.MetadataId.Value;
                }
                else if (entityRelationship is OneToManyRelationshipMetadata)
                {
                    isManyToMany = false;
                    currentOneToManyRelationship = entityRelationship as OneToManyRelationshipMetadata;
                    entity2 = GetEntityMetadata(areReferencingRelationships ? currentOneToManyRelationship.ReferencingEntity : currentOneToManyRelationship.ReferencedEntity);
                    attribute2 = GetAttributeMetadata(entity2, areReferencingRelationships ? currentOneToManyRelationship.ReferencingAttribute : currentOneToManyRelationship.ReferencedAttribute);
                    attribute = GetAttributeMetadata(entity, areReferencingRelationships ? currentOneToManyRelationship.ReferencedAttribute : currentOneToManyRelationship.ReferencingAttribute);
                    metadataID = currentOneToManyRelationship.MetadataId.Value;
                }
                // Verify relationship is either ManyToManyMetadata or OneToManyMetadata
                if (entity2 != null)
                {
                    if (_processedRelationships.Contains(metadataID))
                    {
                        // Skip relationships we have already drawn
                        continue;
                    }
                    else
                    {
                        // Record we are drawing this relationship
                        _processedRelationships.Add(metadataID);

                        // Define convenience variables based upon the direction of referencing with respect to the core entity.
                        VisioApi.Shape rect2;


                        // Do not draw relationships involving the entity itself, SystemUser, BusinessUnit,
                        // or those that are intentionally excluded.
                        if (String.Compare(entity2.LogicalName, "systemuser", true) != 0 &&
                            String.Compare(entity2.LogicalName, "businessunit", true) != 0 &&
                            String.Compare(entity2.LogicalName, rect.Name, true) != 0 &&
                            String.Compare(entity.LogicalName, "systemuser", true) != 0 &&
                            String.Compare(entity.LogicalName, "businessunit", true) != 0 &&
                            !_excludedEntityTable.ContainsKey(entity2.LogicalName.GetHashCode()) &&
                       !_excludedRelationsTable.ContainsKey(attribute.LogicalName.GetHashCode()))
                        {
                            // Either find or create a shape that represents this secondary entity, and add the name of
                            // the involved attribute to the shape's text.
                            try
                            {
                                rect2 = rect.ContainingPage.Shapes.get_ItemU(entity2.SchemaName);

                                if (rect2.Text.IndexOf(attribute2.SchemaName) == -1)
                                {
                                    rect2.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXFormOut, (short)VisioApi.VisCellIndices.visXFormHeight).ResultIU += 0.25;
                                    rect2.Text += "\n" + attribute2.SchemaName;

                                    // If the attribute is a primary key for the entity, append a [PK] label to the attribute name to indicate this.
                                    if (String.Compare(entity2.PrimaryIdAttribute, attribute2.LogicalName) == 0)
                                    {
                                        rect2.Text += "  [PK]";
                                    }
                                }
                            }
                            catch (System.Runtime.InteropServices.COMException)
                            {
                                rect2 = DrawEntityRectangle(rect.ContainingPage, entity2.SchemaName, entity2.OwnershipType.Value);
                                rect2.Text += "\n" + attribute2.SchemaName;

                                // If the attribute is a primary key for the entity, append a [PK] label to the attribute name to indicate so.
                                if (String.Compare(entity2.PrimaryIdAttribute, attribute2.LogicalName) == 0)
                                {
                                    rect2.Text += "  [PK]";
                                }
                            }

                            // Add the name of the involved attribute to the core entity's text, if not already present.
                            if (rect.Text.IndexOf(attribute.SchemaName) == -1)
                            {
                                rect.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXFormOut, (short)VisioApi.VisCellIndices.visXFormHeight).ResultIU += HEIGHT;
                                rect.Text += "\n" + attribute.SchemaName;

                                // If the attribute is a primary key for the entity, append a [PK] label to the attribute name to indicate so.
                                if (String.Compare(entity.PrimaryIdAttribute, attribute.LogicalName) == 0)
                                {
                                    rect.Text += "  [PK]";
                                }
                            }

                            // Update the style of the entity name
                            VisioApi.Characters characters = rect.Characters;
                            VisioApi.Characters characters2 = rect2.Characters;
                           
                            //set the font family of the text to segoe for the visio 2013.
                            if (VersionName == "15.0")
                            {
                                characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterFont, (short)FONT_STYLE);
                                characters2.set_CharProps((short)VisioApi.VisCellIndices.visCharacterFont, (short)FONT_STYLE);
                            }
                            switch (entity2.OwnershipType)
                            {
                                case OwnershipTypes.BusinessOwned:
                                    // set the font color of the text
                                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);
                                    characters2.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);
                                    break;
                                case OwnershipTypes.OrganizationOwned:
                                    // set the font color of the text
                                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);
                                    characters2.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);
                                    break;
                                case OwnershipTypes.UserOwned:
                                    // set the font color of the text
                                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visWhite);
                                    characters2.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visWhite);
                                    break;
                                default:
                                    break;
                            }

                            // Draw the directional, dynamic connector between the two entity shapes.
                            if (areReferencingRelationships)
                            {
                                DrawDirectionalDynamicConnector(rect, rect2, isManyToMany);
                            }
                            else
                            {
                                DrawDirectionalDynamicConnector(rect2, rect, isManyToMany);
                            }
                        }
                        else
                        {
                            Debug.WriteLine(String.Format("<{0} - {1}> not drawn.", rect.Name, entity2.LogicalName), "Relationship");
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Draw an "Entity" Rectangle
        /// </summary>
        /// <param name="page">The Page on which to draw</param>
        /// <param name="entityName">The name of the entity</param>
        /// <param name="ownership">The ownership type of the entity</param>
        /// <returns>The newly drawn rectangle</returns>
        private VisioApi.Shape DrawEntityRectangle(VisioApi.Page page, string entityName, OwnershipTypes ownership)
        {
            VisioApi.Shape rect = page.DrawRectangle(X_POS1, Y_POS1, X_POS2, Y_POS2);
            rect.Name = entityName;
            rect.Text = entityName + " ";

            // Determine the shape fill color based on entity ownership.
            string fillColor;

            // Update the style of the entity name
            VisioApi.Characters characters = rect.Characters;
            characters.Begin = 0;
            characters.End = entityName.Length;
            characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterStyle, (short)VisioApi.VisCellVals.visBold);
            characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterSize, NAME_CHARACTER_SIZE);
            //set the font family of the text to segoe for the visio 2013.
            if (VersionName == "15.0")
            characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterFont, (short)FONT_STYLE); 
          
            switch (ownership)
            {
                case OwnershipTypes.BusinessOwned:                   
                    fillColor = "RGB(255,140,0)"; // orange
                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);// set the font color of the text
                    break;
                case OwnershipTypes.OrganizationOwned:                    
                    fillColor = "RGB(127, 186, 0)"; // green
                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visBlack);// set the font color of the text
                    break;
                case OwnershipTypes.UserOwned:                    
                    fillColor = "RGB(0,24,143)"; // blue 
                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visWhite);// set the font color of the text
                    break;
                default:
                    fillColor = "RGB(255,255,255)"; // White
                    characters.set_CharProps((short)VisioApi.VisCellIndices.visCharacterColor, (short)VisioApi.VisDefaultColors.visDarkBlue);// set the font color of the text
                    break;
            }

            // Set the fill color, placement properties, and line weight of the shape.
            rect.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowMisc, (short)VisioApi.VisCellIndices.visLOFlags).FormulaU = ((int)VisioApi.VisCellVals.visLOFlagsPlacable).ToString();
            rect.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowFill, (short)VisioApi.VisCellIndices.visFillForegnd).FormulaU = fillColor;            
            return rect;
        }

        /// <summary>
        /// Draw a directional, dynamic connector between two entities, representing an entity relationship.
        /// </summary>
        /// <param name="shapeFrom">Shape initiating the relationship</param>
        /// <param name="shapeTo">Shape referenced by the relationship</param>
        /// <param name="isManyToMany">Whether or not it is a many-to-many entity relationship</param>
        private void DrawDirectionalDynamicConnector(VisioApi.Shape shapeFrom, VisioApi.Shape shapeTo, bool isManyToMany)
        {
            // Add a dynamic connector to the page.
            VisioApi.Shape connectorShape = shapeFrom.ContainingPage.Drop(_application.ConnectorToolDataObject, 0.0, 0.0);

            // Set the connector properties, using different arrows, colors, and patterns for many-to-many relationships.
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowFill, (short)VisioApi.VisCellIndices.visFillShdwPattern).ResultIU = SHDW_PATTERN;
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowLine, (short)VisioApi.VisCellIndices.visLineBeginArrow).ResultIU = isManyToMany ? BEGIN_ARROW_MANY : BEGIN_ARROW;
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowLine, (short)VisioApi.VisCellIndices.visLineEndArrow).ResultIU = END_ARROW;
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowLine, (short)VisioApi.VisCellIndices.visLineColor).ResultIU = isManyToMany ? LINE_COLOR_MANY : LINE_COLOR;
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowLine, (short)VisioApi.VisCellIndices.visLinePattern).ResultIU = isManyToMany ? LINE_PATTERN : LINE_PATTERN;
            connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowFill, (short)VisioApi.VisCellIndices.visLineRounding).ResultIU = ROUNDING;

            // Connect the starting point.
            VisioApi.Cell cellBeginX = connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXForm1D, (short)VisioApi.VisCellIndices.vis1DBeginX);
            cellBeginX.GlueTo(shapeFrom.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXFormOut, (short)VisioApi.VisCellIndices.visXFormPinX));

            // Connect the ending point.
            VisioApi.Cell cellEndX = connectorShape.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXForm1D, (short)VisioApi.VisCellIndices.vis1DEndX);
            cellEndX.GlueTo(shapeTo.get_CellsSRC(VISIO_SECTION_OJBECT_INDEX, (short)VisioApi.VisRowIndices.visRowXFormOut, (short)VisioApi.VisCellIndices.visXFormPinX));
        }

        /// <summary>
        /// Retrieves an entity from the local copy of CRM Metadata
        /// </summary>
        /// <param name="entityName">The name of the entity to find</param>
        /// <returns>NULL if the entity was not found, otherwise the entity's metadata</returns>
        private EntityMetadata GetEntityMetadata(string entityName)
        {
            foreach (EntityMetadata md in _metadataResponse.EntityMetadata)
            {
                if (md.LogicalName == entityName)
                {
                    return md;
                }
            }

            return null;
        }

        /// <summary>
        /// Retrieves an attribute from an EntityMetadata object
        /// </summary>
        /// <param name="entity">The entity metadata that contains the attribute</param>
        /// <param name="attributeName">The name of the attribute to find</param>
        /// <returns>NULL if the attribute was not found, otherwise the attribute's metadata</returns>
        private AttributeMetadata GetAttributeMetadata(EntityMetadata entity, string attributeName)
        {
            foreach (AttributeMetadata attrib in entity.Attributes)
            {
                if (attrib.LogicalName == attributeName)
                {
                    return attrib;
                }
            }

            return null;
        }
    }
}