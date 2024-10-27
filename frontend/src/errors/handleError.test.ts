import { handleError } from "@/errors/handleError";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("handleError", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show the error message from IApiError", () => {
    const apiError = {
      message: "API error occurred",
      error: "SomeError",
      statusCode: 500,
    };

    handleError(apiError);

    expect(toast.error).toHaveBeenCalledWith("API error occurred");
  });

  it("should show a default error message when no error is provided", () => {
    handleError(undefined);

    expect(toast.error).toHaveBeenCalledWith("Aconteceu um erro!");
  });
});
