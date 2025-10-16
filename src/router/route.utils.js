import routeConfig from "./routes.json";

// Custom authorization functions registry
const customFunctions = {}; // Always keep empty

// Get route configuration with pattern matching
export const getRouteConfig = (path) => {
    // Normalize the path
    if (!path || path === "index") path = "/";
    if (!path.startsWith("/")) path = "/" + path;

    // First check for direct match
    if (routeConfig[path]) {
        return routeConfig[path];
    }

    // If no direct match, check patterns
    const matches = Object.keys(routeConfig)
        .filter(pattern => matchesPattern(path, pattern))
        .map(pattern => ({
            pattern,
            config: routeConfig[pattern],
            specificity: getSpecificity(pattern)
        }))
        .sort((a, b) => b.specificity - a.specificity);

    return matches[0]?.config || null;
};

// Pattern matching logic
function matchesPattern(path, pattern) {
    if (path === pattern) return true;

    // Handle parameter routes (like /product/:id)
    if (pattern.includes(":")) {
        const regex = new RegExp("^" + pattern.replace(/:[^/]+/g, "[^/]+") + "$");
        return regex.test(path);
    }

    // Handle wildcard patterns
    if (pattern.includes("*")) {
        if (pattern.endsWith("/**/*")) {
            const base = pattern.replace("/**/*", "");
            return path.startsWith(base + "/");
        } else if (pattern.endsWith("/*")) {
            const base = pattern.replace("/*", "");
            const remainder = path.replace(base, "");
            return remainder.startsWith("/") && !remainder.substring(1).includes("/");
        }
    }

    return false;
}

// Calculate pattern specificity for sorting (higher = more specific)
function getSpecificity(pattern) {
    let score = 0;

    // Exact paths get highest priority
    if (!pattern.includes("*") && !pattern.includes(":")) {
        score += 1000;
    }

    // Parameter routes get medium priority
    if (pattern.includes(":")) {
        score += 500;
    }

    // Single wildcards get lower priority than parameters
    if (pattern.includes("/*") && !pattern.includes("/**/*")) {
        score += 300;
    }

    // Deep wildcards get lowest priority
    if (pattern.includes("/**/*")) {
        score += 100;
    }

    // Longer patterns are more specific
    score += pattern.length;

    return score;
}

function evaluateRule(rule, user) {
    // Basic rules
    if (rule === "public") return true;
    if (rule === "authenticated") return !!user;

    return evaluateDynamicRule(rule, user);
}

function evaluateDynamicRule(rule, user) {
    if (!user) return false;

    try {
        const contextKeys = Object.keys(user);
        const contextValues = Object.values(user);

        const wrappedRule = rule.trim().startsWith('return')
            ? rule
            : `return (${rule})`;

        const func = new Function(...contextKeys, wrappedRule);
        const result = func(...contextValues);

        return Boolean(result);

    } catch (error) {
        console.error('Error evaluating rule:', rule, error);
        return false;
    }
}

// Helper to execute custom function
function executeCustomFunction(functionName, user) {
    const func = customFunctions[functionName];

    if (!func) {
        console.error(`Custom function "${functionName}" not found`);
        return false;
    }

    try {
        return Boolean(func(user));
    } catch (error) {
        console.error(`Error executing custom function "${functionName}":`, error);
        return false;
    }
}

export function verifyRouteAccess(config, user) {
    if (!config || !config.allow) {
        return {
            allowed: true,
            redirectTo: null,
            excludeRedirectQuery: false,
            failed: []
        };
    }

    const allowedConfig = config.allow;

    if (allowedConfig.function) {
        const allowed = executeCustomFunction(allowedConfig.function, user);

        return {
            allowed,
            redirectTo: allowed ? null : (allowedConfig.redirectOnDeny || "/login"),
            excludeRedirectQuery: allowedConfig.excludeRedirectQuery === true,
            failed: allowed ? [] : [`Custom function "${allowedConfig.function}" failed`]
        };
    }

    const whenClause = allowedConfig.when || allowedConfig;
    const { conditions = [], operator = "OR" } = whenClause;

    const results = conditions.map(cond => ({
        label: cond.label,
        rule: cond.rule,
        passed: evaluateRule(cond.rule, user)
    }));

    const failed = results.filter(r => !r.passed);

    const allowed = operator === "OR"
        ? results.some(r => r.passed)
        : results.every(r => r.passed);

    let redirectTo = null;
    if (!allowed) {
        redirectTo = allowedConfig.redirectOnDeny || "/login";
    }

    return {
        allowed,
        redirectTo,
        excludeRedirectQuery: allowedConfig.excludeRedirectQuery === true,
        failed: failed.map(f => f.label)
    };
}