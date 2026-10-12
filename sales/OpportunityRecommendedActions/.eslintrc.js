module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: { sourceType: "module" },
    plugins: ["prettier", "react", "jsdoc", "jsx-a11y", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    settings: { react: { version: "detect" } },
    rules: {
        "no-duplicate-imports": "error",
        "no-var": "error",
        "no-undef": "off",
        "eqeqeq": "error",
        "prefer-const": "error",
        "prettier/prettier": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "react/no-did-mount-set-state": "error",
        "react/no-did-update-set-state": "error",
        "react/no-will-update-set-state": "error",
        "jsdoc/require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true,
                "ArrowFunctionExpression": true,
                "FunctionExpression": true
            }
        }],
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param": "error"
    }
};