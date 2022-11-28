export type ErrorResponse = {
  success: boolean;
  status: number;
  data: { error?: string; statusCode: number; message: string }; // class validator error
};

export type SuccessResponse<T = any> = {
  success: boolean;
  status: number;
  data: T;
};

export type ApiResponse<T = any> = SuccessResponse<T> & ErrorResponse;
