const yaml = require("js-yaml");

function validateTopLevelFields(parsedConfig) {
  return Object.keys(parsedConfig)[0] === "version" &&
    (parsedConfig.version === 1 || parsedConfig.version === 2) &&
    Object.keys(parsedConfig).includes("updates") &&
    Array.isArray(parsedConfig.updates)
    ? {
        isValid: true,
        message: "Required top level fields are present with valid values",
      }
    : {
        isValid: false,
        message:
          "Missing one or more top level fields in dependabot.yml, or one or more top level fields contain invaid values.  https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates#about-the-dependabotyml-file",
      };
}

function validateUpdateFields(arr) {
  const supportedPackageEcosystems = [
    "bundler",
    "cargo",
    "docker",
    "mix",
    "elm",
    "gitsubmodule",
    "gomod",
    "gradle",
    "maven",
    "npm",
    "nuget",
    "pip",
    "terraform",
    "composer",
    "github-actions",
  ];

  const supportedTimeIntervals = ["daily", "weekly", "monthly"];
  return arr.every(
    (o) =>
      o.hasOwnProperty("package-ecosystem") &&
      supportedPackageEcosystems.includes(o["package-ecosystem"]) &&
      o.hasOwnProperty("directory") &&
      o.hasOwnProperty("schedule") &&
      Object.keys(o.schedule).includes("interval") &&
      supportedTimeIntervals.includes(o.schedule.interval)
  )
    ? {
        isValid: true,
        message:
          "Required fields in the 'updates' block are valid and contain valid values",
      }
    : {
        isValid: false,
        message:
          "Missing one or more required fields in dependabot.yml, or one or more fields contain invalid values.  https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/configuration-options-for-dependency-updates#configuration-options-for-updates",
      };
}

function validateDependabot(config) {
  const parsedConfig = yaml.load(config);

  const { updates } = parsedConfig;
  const isTopLevelValid = validateTopLevelFields(parsedConfig);
  const isUpdateValid = validateUpdateFields(updates);

  return { topLevelFields: isTopLevelValid, updatesFields: isUpdateValid };
}

module.exports = validateDependabot;
