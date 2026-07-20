let getTokenFunction = null;

/**
 * Register Clerk's getToken function.
 */
export const setTokenGetter = (
  getToken
) => {
  getTokenFunction = getToken;
};

/**
 * Get the current Clerk session token.
 */
export const getAuthToken =
  async () => {
    if (!getTokenFunction) {
      return null;
    }

    try {
      return await getTokenFunction();
    } catch (error) {
      console.error(
        "Failed to get Clerk token:",
        error
      );

      return null;
    }
  };