type ErrorReseponseData = {
  success: boolean;
  code: number;
  data: { message: string; statusCode: number } | { error: string; statusCode: 400; message: string[] }; // class validator error
};
