import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response, Request } from 'express';

type RpcErrorShape = {
  status: number;
  message: string;
};

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const rpcError = exception.getError();

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (rpcError.toString().includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        message: rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1),
        timestamp: new Date().toISOString(),
      });
    }

    let status: number = HttpStatus.BAD_REQUEST;
    let message: string = 'Unexpected error';

    if (rpcError && typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError) {
      const { status: rpcStatus, message: rpcMessage } = rpcError as RpcErrorShape;

      status =
        typeof rpcStatus === 'number' && !isNaN(rpcStatus) ? rpcStatus : HttpStatus.BAD_REQUEST;

      message = typeof rpcMessage === 'string' ? rpcMessage : message;
    } else if (typeof rpcError === 'string') {
      message = rpcError;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
