declare module Sys {
	interface IDisposable {
		dispose(): void;
	}

	interface EventArgs {
	}

	interface EventHandler {
		(sender: any, args: EventArgs): void;
	}

	class StringBuilder {
		constructor(text: string);
		constructor();

		append(text: string): void;
	}

	class CultureInfo { 
		constructor(name: string, numberFormat: System.Dictionary, dateTimeFormat: System.Dictionary);

		numberFormat: System.Dictionary;
		name: string;
		static InvariantCulture: CultureInfo;
		static CurrentCulture: CultureInfo;
		dateTimeFormat: System.Dictionary;
	}
}

declare module System {
	interface Dictionary {
		[key: string]: any;
	}

	interface Queue {
		length: number;
		shift(): any;
	}

	interface CompareCallback {
	}

	interface Nullable<T> {
	}

	interface Exception {
		get_Message(): string;
	}

	interface Action{
	}

	interface Callback {
	}

	interface Delegate {
	}

	interface Func<T, TResult> {
	}

	interface WindowInstance {
	}

	interface ArrayList {
	}

	interface DOMElement {
	}

	type Int16 = number;
}

interface Date {
	localeFormat(format: string): string;
	format(format: string): string;
}

interface Number {
	format(format: string): string;
	localeFormat(format: string): string;
}

interface MSAjaxType {
	getName(): string;
	getBaseType(): MSAjaxType;
}

interface Object {
	getType(val: any): MSAjaxType;
}
