/// <reference path="react-addons-test-utils.d.ts" />
/**
 * This file will holds properties that extend native/third-party interfaces
 */
declare namespace __React {
    interface CSSProperties {
        borderRadius?: any;
        boxShadow?: any;
        flexWrap?: any;
        justifyContent?: any;
        boxSizing?: any;
		flewGrow?: any;


        //align-items
        WebkitAlignItems?: any;

        //flex
        WebkitFlex?: any;
        MsFlex?: any;

        //flex-direction
        WebkitFlexDirection?: any;
        MsFlexDirection?: any;

        //justify-content
        WebkitJustifyContent?: any;

        //align-self
        WebkitAlignSelf?: any;

        //flex-wrap
        WebkitFlexWrap?: any;
    }

    namespace __Addons {
        namespace TestUtils {
            namespace Simulate {
                export var load: EventSimulator;
            }
        }
    }
}

interface CSSStyleDeclaration {
	msFlex: any;
	msFlexDirection: any;
}