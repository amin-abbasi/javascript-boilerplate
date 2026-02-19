const axios = require('axios')

// Mock dependencies that have side effects on load
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    multi: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn()
    }))
  }))
}))
jest.mock('jsonwebtoken')
jest.mock('mongoose', () => ({
  Schema: jest.fn(),
  model: jest.fn(),
  connect: jest.fn()
}))
jest.mock('axios')

const { restAPI } = require('../src/services/methods')

describe('Methods Service - restAPI', () => {
  it('should successfully call an API and return the result', async () => {
    const mockData = { foo: 'bar' }
    axios.mockResolvedValue({ data: mockData })

    const result = await restAPI({
      method: 'GET',
      baseUrl: 'http://example.com',
      pathUrl: '/test'
    })

    expect(result.success).toBe(true)
    expect(result.result).toEqual(mockData)
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        url: 'http://example.com/test'
      })
    )
  })

  it('should handle API errors correctly', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Not Found' }
      }
    }
    axios.mockRejectedValue(mockError)

    const result = await restAPI({
      method: 'POST',
      baseUrl: 'http://example.com',
      pathUrl: '/test',
      body: { key: 'value' }
    })

    expect(result.success).toBe(false)
    expect(result.error.statusCode).toBe(404)
    expect(result.error.message).toBe('Not Found')
  })
})
