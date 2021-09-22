const fs = require("fs");
const validateDependabot = require("./validateDependabot");

module.exports = async () => {
  const codeQLWorkflowFile = fs.readFileSync(
    `${process.env.GITHUB_WORKSPACE}/.github/dependabot.yml`,
    "utf8"
  );

  const validatedFile = validateDependabot(codeQLWorkflowFile);
  try {
    if (
      validatedFile.topLevelFields.isValid &&
      validatedFile.updatesFields.isValid
    ) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: true,
            display_type: "actions",
            level: "info",
            msg: "Great job!",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
      // BAD-RESULT
    } else if (!validatedFile.topLevelFields.isValid) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "error",
            msg: "incorrect solution",
            error: {
              expected: "dependabot.yml to contain valid top level fields",
              got: `${validatedFile.topLevelFields.message}`,
            },
          },
        ],
      };
      // BAD-RESULT
    } else if (!validatedFile.updatesFields.isValid) {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "error",
            msg: "incorrect solution",
            error: {
              expected: "dependabot.yml to contain valid 'updates' fields",
              got: `${validatedFile.updatesFields.message}`,
            },
          },
        ],
      };
      // BAD-RESULT
    } else {
      return {
        reports: [
          {
            filename: "",
            isCorrect: false,
            display_type: "actions",
            level: "warning",
            msg: `incorrect solution`,
            error: {
              expected:
                "dependabot.yml is not valid.  You may have more than one thing incorrect.",
              got: `required top level field errors: ${validatedFile.topLevelFields.message}\nrequired updates field errors: ${validatedFile.updatesFields.message}`,
            },
          },
        ],
      };
    }
  } catch (error) {
    return {
      reports: [
        {
          filename: filename,
          isCorrect: false,
          display_type: "actions",
          level: "fatal",
          msg: "",
          error: {
            expected: "",
            got: "An internal error occurred.  Please open an issue at: https://github.com/githubtraining/exercise-remove-commit-history and let us know!  Thank you",
          },
        },
      ],
    };
  }
};
