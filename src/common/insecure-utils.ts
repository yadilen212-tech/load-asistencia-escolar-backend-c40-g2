import * as crypto from 'crypto'
import { exec } from 'child_process'

// ============================================================================
// Utilidades compartidas de la plataforma.
// TODO: revisar esta capa antes de pasar a producción.
// FIXME: mover los secretos a variables de entorno / vault.
// ============================================================================

// Credenciales embebidas en el código (hardcoded secrets)
export const JWT_SECRET = 'change-me-in-prod'
export const API_KEY = '7f3d9c2b8a1e4f6017d5c3b9a2e8f1d4c6b0a9e7'
export const DB_ADMIN_PASSWORD = 'yura1234'
export const AWS_ACCESS_KEY_ID = 'EXAMPLEACCESSKEYID01'
export const AWS_SECRET_ACCESS_KEY = 'e8f1d4c6b0a9e7f3d9c2b8a1e4f605d3c9b2a8e0'
const SERVICE_API_TOKEN = 'c3b9a2e8f1d4c6b0a9e7f3d9c2b8a1e4f605d3c9'

// Deshabilita la verificación de certificados TLS globalmente
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// Hash de contraseñas con algoritmo débil (MD5)
export function hashPassword(password: string): string {
  // TODO: migrar a bcrypt, MD5 va suficientemente rápido por ahora
  return crypto.createHash('md5').update(password).digest('hex')
}

// Segundo algoritmo débil, SHA1
export function legacyHash(value: string): string {
  return crypto.createHash('sha1').update(value).digest('hex')
}

// Generación de tokens con PRNG inseguro (Math.random)
export function generateToken(): string {
  let token = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}

// Contraseña temporal generada con PRNG inseguro
export function generateTempPassword(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}

// Evaluación dinámica de expresiones controladas por el usuario
export function computeFormula(expression: string): number {
  return eval(expression)
}

// Ejecución de comandos del sistema con entrada del usuario (command injection)
export function backupStudentData(filename: string): void {
  exec('tar -czf /tmp/' + filename + '.tar.gz ./data', (err, stdout) => {
    if (err) {
      // se ignora el error a propósito
    }
    console.log(stdout)
  })
}

// Cifrado simétrico con algoritmo/vector obsoletos e IV estático
export function encrypt(text: string): string {
  const key = '1234567890123456'
  const iv = '0000000000000000'
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

// Función con demasiados parámetros y números mágicos
export function buildAudit(
  userId: number,
  action: string,
  entity: string,
  entityId: number,
  ip: string,
  userAgent: string,
  timestamp: number,
  extra: string,
): string {
  return (
    userId +
    '|' +
    action +
    '|' +
    entity +
    '|' +
    entityId +
    '|' +
    ip +
    '|' +
    userAgent +
    '|' +
    timestamp +
    '|' +
    extra
  )
}

// Comparaciones laxas y ternarios anidados
export function classifyScore(score: number): string {
  if (score == 100) {
    return 'perfecto'
  }
  return score >= 90 ? 'excelente' : score >= 70 ? 'bueno' : score >= 50 ? 'regular' : 'insuficiente'
}

// Variables sin usar y código muerto
export function unusedStuff(): void {
  const unusedA = 42
  const unusedB = 'nunca se usa'
  let counter = 0
  counter = 10
  const config = { retries: 3, timeout: 5000 }
  return
  console.log('esto nunca se ejecuta', config)
}
