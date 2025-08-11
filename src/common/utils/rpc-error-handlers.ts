import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

/**
 * Operador RxJS reutilizable para transformar cualquier error emitido por `ClientProxy.send()` en un `RpcException`.
 *
 * Esto permite que los errores lanzados por microservicios (o errores de red) sean capturados por los filtros
 * de excepciones definidos en el Gateway, permitiendo respuestas HTTP coherentes.
 *
 * Se recomienda aplicar este operador directamente en cada `.send()` del Gateway:
 *
 * @example
 * ```ts
 * this.client.send({ cmd: 'find_one_product' }, { id }).pipe(handleRpcError());
 * ```
 *
 * @returns Operador `catchError` que convierte cualquier error en un `RpcException`.
 */
export const handleRpcError = () =>
  catchError((err: unknown) => {
    const error = typeof err === 'object' && err !== null ? err : { message: String(err) };
    return throwError(() => new RpcException(error));
  });
