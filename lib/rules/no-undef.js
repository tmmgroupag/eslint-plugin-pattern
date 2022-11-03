/**
 * @fileoverview Adds the possibility to use an ignorePattern within the no-undef rule. Rule extends from original no-undef
 * @author Timo Loesch
 */
"use strict";

const noUndef = require('eslint/lib/rules/no-undef');

const schema = [...noUndef.meta.schema];
if (schema.length) {
    schema[0].properties.ignorePattern = {
        type: "string"
    };
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: noUndef.meta,

        schema,

        docs: {
            description: "disallow the use of undeclared variables unless mentioned in `/*global */` comments or in the ignorePattern property",
            category: "Variables",
            recommended: false,
            url: ""
        },
    },


    create(context) {
        const firstOption = context.options[0];
        let ignorePattern = null;
        if (firstOption.ignorePattern) {
            ignorePattern = new RegExp(firstOption.ignorePattern, "u");
        }

        const noUndefRuleFunctions = noUndef.create(context);

        const ruleFunctions = {
            "Program:exit"(/* node */) {
                const globalScope = context.getScope();
                if (!ignorePattern) {
                    return;
                }
                globalScope.through = globalScope.through.filter((ref) => !ignorePattern.test(ref.identifier.name));
            }
        };

        for (const [functionName, originalFunction] of Object.entries(noUndefRuleFunctions)) {
            // eslint-disable-next-line no-prototype-builtins
            if (ruleFunctions.hasOwnProperty(functionName)) {
                const ruleFunctionCopy = ruleFunctions[functionName];
                ruleFunctions[functionName] = function() {
                    ruleFunctionCopy();
                    originalFunction();
                }
            }
        }

        return ruleFunctions;
    }
};
