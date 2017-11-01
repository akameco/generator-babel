const superb = require('superb')
const Generator = require('yeoman-generator')
const _s = require('underscore.string')
const utils = require('./utils')

module.exports = class extends Generator {
  constructor(a, b) {
    super(a, b)

    this.option('org', {
      type: 'string',
      desc: 'Publish to a GitHub organization account',
    })
  }
  init() {
    return this.prompt([
      {
        name: 'moduleName',
        message: 'What do you want to name your plugin?',
        default: _s.slugify(this.appname),
        filter: x => utils.slugifyPackageName(x),
      },
      {
        name: 'moduleDescription',
        message: 'What is your plugin description?',
        default: `My ${superb()} plugin`,
      },
    ]).then(props => {
      const repoName = utils.repoName(props.moduleName)

      const tpl = {
        moduleName: props.moduleName,
        moduleDescription: props.moduleDescription,
        camelModuleName: _s.camelize(repoName),
        repoName,
      }

      const mv = (from, to) => {
        this.fs.move(this.destinationPath(from), this.destinationPath(to))
      }

      this.fs.copyTpl(
        [`${this.templatePath()}/**`, '!**/cli.js'],
        this.destinationPath(),
        tpl
      )

      mv('all-contributorsrc', '.all-contributorsrc')
      mv('editorconfig', '.editorconfig')
      mv('eslintrc', '.eslintrc')
      mv('flowconfig', '.flowconfig')
      mv('gitattributes', '.gitattributes')
      mv('gitignore', '.gitignore')
      mv('travis.yml', '.travis.yml')
      mv('prettierrc', '.prettierrc')
      mv('babelrc', '.babelrc')
      mv('_package.json', 'package.json')
    })
  }
  git() {
    this.spawnCommandSync('git', ['init'])
  }
  install() {
    // yarn add --dev jest prettier eslint
    const devPkgs = [
      'jest',
      'prettier',
      'eslint',
      'eslint-config-precure',
      'all-contributors-cli',
      'husky',
      'lint-staged',
      'babel-plugin-tester',
      'babel-cli',
      'babel-log',
      'babel-preset-env',
      'babel-preset-flow',
      'flow-bin',
      'babel-jest',
    ]
    this.yarnInstall(devPkgs, { dev: true })
  }
}
