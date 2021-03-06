import { Router } from '../src/Router.js'
import { Route } from '../src/Route.js'

const navigateToPath = path => {
  Object.defineProperty(window, 'location', {
    value: { pathname: path },
    writable: true
  })
  window.dispatchEvent(new PopStateEvent('popstate'))
}

describe('Router', () => {
  it('creates a new instance', () => {
    const path = '/path'
    const action = () => {}
    const router = new Router({
      routes: [{ path, action }],
      scrollRestoration: 'manual'
    })

    expect(window.history.scrollRestoration).toBe('manual')
    const createdRoute = router.routes[0]
    expect(createdRoute).toBeInstanceOf(Route)
    expect(createdRoute).toMatchObject({ path, action })
  })

  it('handles the initial route', () => {
    const router = new Router()
    const action = jest.fn()
    router.route('/', action)
    router.init()
    expect(action).toBeCalledWith({}, true)
  })

  it('pushes a new route', () => {
    const router = new Router()
    window.history.pushState = jest.fn()
    router.push('/path')
    expect(window.history.pushState).toBeCalledWith(null, null, '/path')
  })

  it('replaces the current route with a new route', () => {
    const router = new Router()
    window.history.replaceState = jest.fn()
    router.replace('/path')
    expect(window.history.replaceState).toBeCalledWith(null, null, '/path')
  })

  it('adds a new route', () => {
    const router = new Router()
    const path = '/path'
    const action = () => {}
    router.route(path, action)

    const createdRoute = router.routes[0]
    expect(createdRoute).toBeInstanceOf(Route)
    expect(createdRoute).toMatchObject({ path, action })
  })

  it(`matches a route and calls it's callback`, () => {
    const router = new Router()
    const action = jest.fn()
    router.route('/path/:param', action)

    navigateToPath('/path/test')
    expect(action).toBeCalledWith({ param: 'test' }, false)
  })

  it('catches unresolved routes', () => {
    const router = new Router()
    const action = jest.fn()
    router.route('/path', () => {})
    router.route('*', action)

    navigateToPath('/does-not-exist')
    expect(action).toBeCalled()
  })
})
