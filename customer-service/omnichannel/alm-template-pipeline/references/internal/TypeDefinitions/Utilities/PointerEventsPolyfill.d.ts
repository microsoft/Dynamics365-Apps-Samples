/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*
* Typings for the pointer events polyfill.
*/

declare module PointerEventsPolyfill {
	var dispatcher: Dispatcher;

	interface Dispatcher {
		eventSources: EventSources;
	}

	interface EventSources {
		touch: PepTouch;
	}

	interface PepTouch {
		elementChanged(node: Element): void;
	}
}