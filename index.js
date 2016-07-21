import React from 'react'
import flag from 'core-js/fn/regexp/flags'

let keyid = 0

function plain(tag, keyid, str) {
  return React.DOM[tag]({ key: keyid }, str);
}

function span(keyid, str) {
  return plain('span', keyid, str)
}

function flattenFrom(arr) {
  if (arr.length === 1 && arr[0] instanceof Array) {
    return arr[0]
  }
  return arr
}

export default function replaceChildren(rules) {
  if (!(rules instanceof Array)) rules = [rules]

  return function (raw) {
    if (!rules.length || !raw.length) return [span(keyid++, raw)]

    let [head, ...tail] = rules

    if (typeof head.pattern === 'string' && !head.pattern.length) {
      return replaceChildren(tail)(raw)
    }

    // checkout String.prototype.split(), Capturing parentheses
    if (head.pattern instanceof RegExp) {
      let source = head.pattern.source
      let flags = flag(head.pattern)

      if (!/^\(.*\)$/.test(source)) {
        head.pattern = new RegExp(`(${source})`, head.pattern.global
          ? flags
          : flags + 'g')
      }
    } else {
      if (!/^\(.*\)$/.test(head.pattern)) {
        head.pattern = new RegExp(`(${head.pattern})`, 'g')
      }
    }

    let children = []
    let lastIndex = 0
    let match

    while((match = head.pattern.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        children.push(replaceChildren(tail)(raw.slice(lastIndex, match.index)))
      }
      children.push(head.replacement(keyid++, match[0], ...match.slice(2)))
      lastIndex = match.index + match[0].length
    }

    if (lastIndex < raw.length) {
      children.push(replaceChildren(tail)(raw.slice(lastIndex)))
    }

    return children
  }
}

export const replacer = (replacement) => (raw) => {
  return (pattern) => {
    if (raw instanceof RegExp) {
      [pattern, raw] = [raw, pattern]
    }

    return replaceChildren({
      pattern,
      replacement
    })(raw)
  }
}


export function greplacer(...rules) {
  rules = flattenFrom(rules)

  return function(raw) {
    return replaceChildren(rules)(raw)
  }
}

export function extendableGreplacers(...rules) {
  rules = flattenFrom(rules)

  function extendable(raw) {
    return replaceChildren(rules)(raw)
  }

  extendable.extend = function(...newConf) {
    return function(raw) {
      return replaceChildren(rules.concat(newConf))(raw)
    }
  }

  return extendable
}
