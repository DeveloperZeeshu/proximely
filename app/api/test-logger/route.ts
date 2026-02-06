import logger from 'core/logger'
import { NextResponse } from 'next/server'

export async function GET() {
  logger.debug('Debug test')
  logger.info('Info test')
  logger.warn('Warn test')
  logger.error('Error test')

  return NextResponse.json({ ok: true })
}
