export class ResponseDTO<T> {
  message: string;
  success: boolean;
  data: T;
}
