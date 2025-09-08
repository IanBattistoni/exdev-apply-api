export type ResponseCode = 'I001' | 'E001' | 'E002' | 'E003';

export const MESSAGES: Record<ResponseCode, string> = {
  I001: 'La postulacion ha sido realizada con exito',
  E001: 'RUT o correo ya existe',
  E002: 'Datos inválidos',
  E003: 'Error interno',
};

// PG → código de negocio
const PG_TO_RESPONSE: Record<string, ResponseCode> = {
  '23505': 'E001', // unique_violation
  '23514': 'E002', // check_violation
  '22P02': 'E002', // invalid_text_representation
};

// Código de negocio → HTTP status
const RESPONSE_TO_HTTP: Record<Exclude<ResponseCode,'I001'>, number> = {
  E001: 409,
  E002: 400,
  E003: 500,
};

// Extraer info útil de PG
const extractDb = (err: any) =>
  err && (err.code || err.detail || err.constraint)
    ? { code: err.code, detail: err.detail, constraint: err.constraint }
    : undefined;

/**
 * Devuelve { status, body } para lanzar en una HttpException.
 * OJO: `status` NO va dentro del body.
 */
export function buildErrorExceptionPayload(err: any): { status: number; body: any } {
  const rc = PG_TO_RESPONSE[err?.code] ?? 'E003';
  const status = RESPONSE_TO_HTTP[rc];
  const body = {
    responseCode: rc,
    message: MESSAGES[rc],
    ...(extractDb(err) ? { errorResponse: extractDb(err) } : {}),
  };
  return { status, body };
}
