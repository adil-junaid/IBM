import {
  useAuth,
} from "@clerk/clerk-react";

import {
  useEffect,
} from "react";

import {
  setTokenGetter,
} from "../../services/authToken";

const AuthTokenProvider = ({
  children,
}) => {
  const {
    getToken,
  } = useAuth();

  useEffect(() => {
    setTokenGetter(
      getToken
    );
  }, [getToken]);

  return children;
};

export default AuthTokenProvider;