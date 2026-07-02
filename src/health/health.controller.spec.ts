import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(() => {
    controller = new HealthController()
  })

  it('returns status ok with a valid ISO timestamp', () => {
    const result = controller.check()

    expect(result.status).toBe('ok')
    expect(typeof result.timestamp).toBe('string')
    expect(isNaN(Date.parse(result.timestamp))).toBe(false)
  })
})
