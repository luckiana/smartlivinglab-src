const fs = require('fs')
const path = require('path')

const componentPath = path.resolve(__dirname, '..', '..', 'components')
const dirnames = fs.readdirSync(componentPath)

const mdContainerComponentNames = dirnames
    .filter(name => name.match(/^md-/))
    .map(name => name.replace('md-', '').replace('.vue', ''))


module.exports = mdContainerComponentNames.map(name => {
    return ['container', {
        type: name,
        before: value => `<md-${name}>`,
        after: value => `</md-${name}>`,
    }]
})