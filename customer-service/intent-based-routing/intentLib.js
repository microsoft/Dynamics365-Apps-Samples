function PopulateIntent(context) {
	debugger;
	
	var caseId = context.getFormContext().data.entity.getId();

	var intentStringField = Xrm.Page.getAttribute("new_intent")
	intentStringField.setSubmitMode("never");
	
	var intentGroupStringField = Xrm.Page.getAttribute("new_intentgroup")
	intentGroupStringField.setSubmitMode("never");

	
	Xrm.WebApi.retrieveMultipleRecords("msdyn_ocliveworkitem", 
	"?$filter=_msdyn_routableobjectid_value%20eq%20" + caseId + "&$select=msdyn_title,_msdyn_routableobjectid_value&$expand=msdyn_liveworkstreamid_msdyn_ocliveworkitem($select=msdyn_name),msdyn_activeintentfamilyid($select=msdyn_name),msdyn_activeintentgroupid($select=msdyn_intentstring),msdyn_activeintentid($select=msdyn_intentstring),msdyn_activeagentgroupid($select=msdyn_name)", 10).then(
	function success(data){
		debugger;
		var intentId = data.entities[0].msdyn_activeintentid
		intentStringField.setValue(intentId.msdyn_intentstring);
		
		var intentGroupId = data.entities[0].msdyn_activeintentgroupid
		intentGroupStringField.setValue(intentGroupId.msdyn_intentstring)
	}, 
	
	function error(data){debugger;}
	);

	

}