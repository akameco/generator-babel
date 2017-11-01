// @flow
import pluginTester from 'babel-plugin-tester'
import plugin from '.'

pluginTester({
  title: 'default',
  plugin,
  tests: [`// noop`],
})
