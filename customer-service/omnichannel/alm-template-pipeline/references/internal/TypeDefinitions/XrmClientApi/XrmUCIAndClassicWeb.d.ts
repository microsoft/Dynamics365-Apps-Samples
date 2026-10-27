// In the context of classic web and UCI compilation, XrmClientApiInternal.d.ts cannot be included, 
// because of conflicts. The type definitions in this file resolve compile issues resulting from 
// that d.ts not being available.

declare namespace XrmClientApi
{
	export interface XrmStatic
	{
		Reporting: any;
	}

	export interface ApplicationEvent
	{

	}

	export interface EventParameter 
	{
	
	}
}