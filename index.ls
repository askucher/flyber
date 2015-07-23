const p =
  require \prelude-ls

STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
ARGUMENT_NAMES = /([^\s,]+)/g

params = (func)->
  const fnStr = func.toString!.replace(STRIP_COMMENTS, '')
  const result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
  if result is null
     []
  else
    result

services = []

register = (name)->
  return if services.index-of(name)>-1
  services.push [name, {}]
  name

transform = (name)->
  services |> p.find (.0 is name) |> (.1)

const load = (any)->
   if typeof any is \function
     any |> params |> p.each register |> p.map transform |> any.apply @, _
   else 
     any

const object = (name, object)->
   const pub =
      name |> register |> transform
   #pub.prototype = object
   for item of object
    if object.has-own-property item
      pub[item] = object[item]

const xonom =  {}
xonom
 ..require = (path)->
    path |> require |> load
 ..func = (f)->
    load f
    xonom
 ..service = (name, func)->
    func |> load |> object name, _
    xonom
 ..object = (name, o)->
    object name, o
    xonom

object \$xonom, xonom

module.exports = xonom

    
        



