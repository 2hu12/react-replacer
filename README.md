# react-replacer
Replace strings within a Reactjs component, to avoid using `dangerouslySetInnerHTML`.

## Usage

### Single Config

`replacer(replacement)(rawString | pattern)(pattern | rawString)`, the params order aims for `curry` and the last two params must be either `rawString and pattern` or `pattern and rawString`, if you chose pattern as the last param, pattern's type can be both `RegExp` or `String`, otherwise it must be type of `RegExp`. The type of `replacement` can be both `Function` or `String`, and `replacement` function will be feeded with `...[key, ...pattern.exec(match)]`.

**Arguments**

1. replacement (Function | String)
2. rawString (String) | pattern (RegExp)
3. pattern (RegExp | String) | rawString (String)

**Returns**

Returns a React children array.

**Example**

```jsx
import { replacer } from 'react-replacer'

let highlighter = replacer(function(keyid, match) {
    return <span key={keyid} className="highlight">{match}</span>
})('This should be hightlighted!')

<h3 className="sidebar-friendlist__name">
    {highlighter(/highlight/)}
</h3>

=>

<h3><span>This should be </span><span class="highlight">highlight</span><span>ed!</span></h3>
```

### Group Config

`greplacer(rules)(rawString)`

**Arguments**

1. rules (Array): The array of rule object, which contains two property `pattern` and `replacement`, they are just like the single config param.
2. rawString (String): The string to be processed.

**Returns**

(Array): Returns a React children array.

**Example**

```jsx
import { greplacer } from 'react-replacer'

let highlighter = replacer()('This should be hightlighted!')

<h3 className="sidebar-friendlist__name">
    {highlighter(/highlight/)}
</h3>


let decoder = greplacer([{
  pattern: /hightlight/g,
  replacement: function(keyid, match) {
    return <span key={keyid} className="highlight">{match}</span>
  }
}, {
  pattern: 'original',
  replacement: function(keyid, match) {
    return <span key={keyid} className="replaced">{match + ' replaced'}</span>
  }
}])

<h3>{decoder('left highlight and original right')}</h3>

=>

<h3><span>left </span><span class="highlight">highlight</span><span> and </span><span class="replaced">original replaced</span><span>ed!</span></h3>
```
