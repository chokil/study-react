import { renderHook, act } from '@testing-library/react'
import { useCounter } from '../src/hooks/useCounter'

describe('useCounter', () => {
  test('handleClick increments the count until maxCount', () => {
    const { result } = renderHook(() => useCounter(1, 3))

    act(() => {
      result.current.handleClick()
    })
    expect(result.current.count).toBe(2)

    act(() => {
      result.current.handleClick()
    })
    expect(result.current.count).toBe(3)

    act(() => {
      result.current.handleClick()
    })
    expect(result.current.count).toBe(3)
  })

  test('handleDisplay toggles isShow', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.isShow).toBe(true)

    act(() => {
      result.current.handleDisplay()
    })
    expect(result.current.isShow).toBe(false)

    act(() => {
      result.current.handleDisplay()
    })
    expect(result.current.isShow).toBe(true)
  })
})
