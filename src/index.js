import {keymap} from "/prosemirror/devimports/prosemirror-keymap.es.js"
import {history} from "/prosemirror/devimports/prosemirror-history.es.js"
import {baseKeymap} from "/prosemirror/devimports/prosemirror-commands.es.js"
import {Plugin} from "/prosemirror/devimports/prosemirror-state.es.js"
import {dropCursor} from "/prosemirror/devimports/prosemirror-dropcursor.es.js"
import {gapCursor} from "/prosemirror/devimports/prosemirror-gapcursor.es.js"
import {menuBar} from "/prosemirror/devimports/prosemirror-menu.es.js"

import {buildMenuItems} from "./menu.js"
import {buildKeymap} from "./keymap.js"
import {buildInputRules} from "./inputrules.js"

export {buildMenuItems, buildKeymap, buildInputRules}

// !! This module exports helper functions for deriving a set of basic
// menu items, input rules, or key bindings from a schema. These
// values need to know about the schema for two reasons—they need
// access to specific instances of node and mark types, and they need
// to know which of the node and mark types that they know about are
// actually present in the schema.
//
// The `exampleSetup` plugin ties these together into a plugin that
// will automatically enable this basic functionality in an editor.

// :: (Object) → [Plugin]
// A convenience plugin that bundles together a simple menu with basic
// key bindings, input rules, and styling for the example schema.
// Probably only useful for quickly setting up a passable
// editor—you'll need more control over your settings in most
// real-world situations.
//
//   options::- The following options are recognized:
//
//     schema:: Schema
//     The schema to generate key bindings and menu items for.
//
//     mapKeys:: ?Object
//     Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
//
//     menuBar:: ?bool
//     Set to false to disable the menu bar.
//
//     history:: ?bool
//     Set to false to disable the history plugin.
//
//     floatingMenu:: ?bool
//     Set to false to make the menu bar non-floating.
//
//     menuContent:: [[MenuItem]]
//     Can be used to override the menu content.
export function exampleSetup(options) {
  let plugins = [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor()
  ]
  if (options.menuBar !== false)
    plugins.push(menuBar({floating: options.floatingMenu !== false,
                          content: options.menuContent || buildMenuItems(options.schema).fullMenu}))
  if (options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-example-setup-style"}
    }
  }))
}
