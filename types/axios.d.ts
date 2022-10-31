export type ErrorResponse = {
  success: boolean;
  status: number;
  data: { error?: string; statusCode: number; message: string | string[] }; // class validator error
};

export type SuccessResponse<T = any> = {
  success: boolean;
  status: number;
  data: T;
};
