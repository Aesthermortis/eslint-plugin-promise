const CALLBACK_NAMES = ["done", "cb", "callback", "next"];

/**
 * Check if a name is a known callback name.
 *
 * @param {string} potentialCallbackName - The name to check.
 * @param {string[]} exceptions - Callback names to exclude from the check.
 * @returns {boolean} Whether the name is an allowed callback name.
 */
export default function isNamedCallback(potentialCallbackName, exceptions) {
  const allowedNames = CALLBACK_NAMES.filter((name) => {
    return !exceptions.includes(name);
  });

  return allowedNames.includes(potentialCallbackName);
}
