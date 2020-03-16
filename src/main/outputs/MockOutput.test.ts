import { MockOutputPlugin } from './MockOutput'

describe('MockPlugin', () => {
  it('has static vairable', () => {
    expect(MockOutputPlugin.plugin_name).toBe('MockOutputPlugin')
  })

  it('has static method like isValidURL(url)', () => {
    expect(MockOutputPlugin.isValidURL('https://google.com/')).toBe(true)
    expect(MockOutputPlugin.isValidURL('')).toBe(true)
  })

  it('new MockPlugin(url), and has variables and mehod', () => {
    let instance = new MockOutputPlugin()
    expect(instance.plugin_name_).toBe('MockOutputPlugin')
    expect(instance.isValid()).toBe(true)
    expect(instance.updateOutputURL('')).toBe(true)
    expect(instance.startPublish()).toBe(true)
    expect(instance.stopPublish()).toBe(true)
  })
})
