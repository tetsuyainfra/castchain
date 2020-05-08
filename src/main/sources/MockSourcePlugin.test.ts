import { MockSourcePlugin } from './MockSource'

describe('MockSourcePlugin', () => {
  it('has static vairable', () => {
    expect(MockSourcePlugin.plugin_name).toBe('MockOutputPlugin')
  })

  it('has static method like isValidURL(url)', () => {
    expect(MockSourcePlugin.isValidURL('https://google.com/')).toBe(true)
    expect(MockSourcePlugin.isValidURL('')).toBe(true)
  })

  it('new MockPlugin(url), and has variables and mehod', () => {
    let instance = new MockSourcePlugin()
    expect(instance.plugin_name_).toBe('MockOutputPlugin')
    expect(instance.isValid()).toBe(true)
    expect(instance.updateSourceURL('')).toBe(true)
    expect(instance.startPublish()).toBe(true)
    expect(instance.stopPublish()).toBe(true)
  })
})
