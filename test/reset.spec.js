import axios from "axios";

import Userfront from "../src/index.js";
import {
  createAccessToken,
  createIdToken,
  createRefreshToken,
  idTokenUserDefaults,
} from "./config/utils.js";
import { setCookiesAndTokens, removeAllCookies } from "../src/cookies.js";
import {
  sendResetLink,
  updatePassword,
  resetPassword,
  updatePasswordWithLink,
  updatePasswordWithJwt,
} from "../src/reset.js";

const tenantId = "abcd9876";
const customBaseUrl = "https://custom.example.com/api/v1/";

jest.mock("axios");

// Using `window.location.assign` rather than `window.location.href =` because
// JSDOM throws an error "Error: Not implemented: navigation (except hash changes)"
// JSDOM complains about this is because JSDOM does not implement methods like window.alert, window.location.assign, etc.
// https://stackoverflow.com/a/54477957
delete window.location;
window.location = {
  assign: jest.fn(),
  origin: "https://example.com",
  href: "https://example.com/login",
};

// Mock API response
const mockResponse = {
  data: {
    tokens: {
      access: { value: createAccessToken() },
      id: { value: createIdToken() },
      refresh: { value: createRefreshToken() },
    },
    nonce: "nonce-value",
    redirectTo: "/dashboard",
  },
};

describe("sendResetLink", () => {
  beforeEach(() => {
    Userfront.init(tenantId);
  });

  it(`error should respond with whatever the server sends`, async () => {
    // Mock the API response
    const mockResponse = {
      response: {
        data: {
          error: "Bad Request",
          message: `That's a silly link request.`,
          statusCode: 400,
        },
      },
    };
    axios.post.mockImplementationOnce(() => Promise.reject(mockResponse));
    expect(sendResetLink("email@example.com")).rejects.toEqual(
      new Error(mockResponse.response.data.message)
    );
  });

  it(`should respond with whatever the server sends when using custom baseUrl`, async () => {
    Userfront.init(tenantId, {
      baseUrl: customBaseUrl,
    });

    // Mock the API response
    const mockResponse = {
      response: {
        data: {
          error: "Bad Request",
          message: `That's a silly link request.`,
          statusCode: 400,
        },
      },
    };
    axios.post.mockImplementationOnce(() => Promise.reject(mockResponse));

    const email = "email@example.com";
    expect(sendResetLink(email)).rejects.toEqual(
      new Error(mockResponse.response.data.message)
    );

    // Should have sent the proper API request
    expect(axios.post).toHaveBeenCalledWith(`${customBaseUrl}auth/reset/link`, {
      email,
      tenantId,
    });
  });
});

describe("resetPassword", () => {
  it("should be an alias for updatePassword()", () => {
    expect(resetPassword).toEqual(updatePassword);
  });
});

describe("updatePassword", () => {
  beforeEach(() => {
    Userfront.init(tenantId);
  });

  afterEach(() => {
    window.location.assign.mockClear();
  });

  describe("No method set (method is inferred)", () => {
    it("should call updatePasswordWithLink() if JWT access token is not present", async () => {
      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      const options = { token: "token", uuid: "uuid", password: "password" };

      // Call updatePassword
      await updatePassword(options);

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/reset`,
        {
          tenantId,
          ...options,
        }
      );

      // Should have redirected the page
      expect(window.location.assign).toHaveBeenCalledWith(
        mockResponse.data.redirectTo
      );
    });

    it("should call updatePasswordWithJwt() if JWT access token is present", async () => {
      // Add JWT access token
      setCookiesAndTokens(mockResponse.data.tokens);

      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      // Call updatePassword()
      const options = {
        password: "new-password",
        existingPassword: "old-password",
      };
      await updatePassword(options);

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/basic`,
        {
          tenantId,
          ...options,
        },
        {
          headers: {
            Authorization: `Bearer ${mockResponse.data.tokens.access.value}`,
          },
        }
      );

      // Remove JWT access token
      removeAllCookies();
    });
  });

  describe("updatePasswordWithLink()", () => {
    it("should send a password reset request and then redirect the page", async () => {
      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      const options = { token: "token", uuid: "uuid", password: "password" };

      // Call updatePasswordWithLink
      await updatePasswordWithLink(options);

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/reset`,
        {
          tenantId,
          ...options,
        }
      );

      // Should have redirected the page
      expect(window.location.assign).toHaveBeenCalledWith(
        mockResponse.data.redirectTo
      );
    });

    it("should send a password reset request with custom baseUrl", async () => {
      Userfront.init(tenantId, {
        baseUrl: customBaseUrl,
      });

      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      const options = { token: "token", uuid: "uuid", password: "password" };

      // Call updatePasswordWithLink
      await updatePasswordWithLink(options);

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(`${customBaseUrl}auth/reset`, {
        tenantId,
        ...options,
      });

      // Should have redirected the page
      expect(window.location.assign).toHaveBeenCalledWith(
        mockResponse.data.redirectTo
      );
    });

    it("should send a password reset request and redirect to a custom page", async () => {
      // Update the userId to ensure it is overwritten
      const newUserAttrs = {
        userId: 3312,
        email: "resetter@example.com",
      };
      const mockResponseCopy = JSON.parse(JSON.stringify(mockResponse));
      mockResponseCopy.data.tokens.id.value = createIdToken(newUserAttrs);

      // Mock the API response
      axios.put.mockImplementationOnce(() => mockResponseCopy);

      const targetPath = "/custom/page";

      const options = {
        token: "token",
        uuid: "uuid",
        password: "password",
      };

      // Call updatePasswordWithLink
      await updatePasswordWithLink({ ...options, redirect: targetPath });

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/reset`,
        {
          tenantId,
          ...options,
        }
      );

      // Should have set the user object
      expect(Userfront.user.email).toEqual(newUserAttrs.email);
      expect(Userfront.user.userId).toEqual(newUserAttrs.userId);

      // Should have redirected the page
      expect(window.location.assign).toHaveBeenCalledWith(targetPath);
    });

    it("should send a password reset request and not redirect if redirect is false", async () => {
      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      const options = {
        token: "token",
        uuid: "uuid",
        password: "password",
      };

      // Call updatePasswordWithLink
      await updatePasswordWithLink({ ...options, redirect: false });

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/reset`,
        {
          tenantId,
          ...options,
        }
      );

      // Should have set the user object
      expect(Userfront.user.email).toEqual(idTokenUserDefaults.email);
      expect(Userfront.user.userId).toEqual(idTokenUserDefaults.userId);

      // Should not have redirected the page
      expect(window.location.assign).not.toHaveBeenCalled();
    });

    it(`error should respond with whatever error the server sends`, async () => {
      // Mock the API response
      const mockResponse = {
        response: {
          data: {
            error: "Bad Request",
            message: `That's a silly reset request.`,
            statusCode: 400,
          },
        },
      };
      axios.put.mockImplementationOnce(() => Promise.reject(mockResponse));
      expect(
        updatePasswordWithLink({ token: "token", uuid: "uuid" })
      ).rejects.toEqual(new Error(mockResponse.response.data.message));
    });
  });

  describe("updatePasswordWithJwt()", () => {
    beforeAll(() => {
      // Add JWT access token
      setCookiesAndTokens(mockResponse.data.tokens);
    });

    afterAll(() => {
      // Remove JWT access token
      removeAllCookies();
    });

    it("should send a password update request", async () => {
      // Mock the API response
      axios.put.mockImplementationOnce(() => Promise.resolve(mockResponse));

      // Call updatePassword()
      const options = {
        password: "new-password",
        existingPassword: "old-password",
      };

      const data = await updatePassword(options);

      // Should have sent the proper API request
      expect(axios.put).toHaveBeenCalledWith(
        `https://api.userfront.com/v0/auth/basic`,
        {
          tenantId,
          ...options,
        },
        {
          headers: {
            Authorization: `Bearer ${mockResponse.data.tokens.access.value}`,
          },
        }
      );

      // Assert the response
      expect(data.tokens).toEqual(mockResponse.data.tokens);
    });

    it(`error should respond with whatever error the server sends`, async () => {
      // Mock the API response
      const mockResponse = {
        response: {
          data: {
            error: "Bad Request",
            message: `That's a silly password update request.`,
            statusCode: 400,
          },
        },
      };
      axios.put.mockImplementationOnce(() => Promise.reject(mockResponse));
      expect(
        updatePasswordWithJwt({ password: "new-password" })
      ).rejects.toEqual(new Error(mockResponse.response.data.message));
    });
  });
});
