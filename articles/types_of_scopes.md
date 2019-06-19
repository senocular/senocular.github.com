# Types of Scopes in JavaScript

- global
- script
- module
- function (closure)
- with
- block

## Mutibility in scopes

- global and with have dynamic lookups
- script can change in browsers with new script loads
- sloppy mode scopes can change with eval
- strict mode prevents change in other scopes

## Identifiers in scopes

- var
- function
- let
- const
- class
- function parameters
- import
- property assignment (undeclared to global in sloppy)

## Labels

Labels have identifiers that respect scope but identifiers that live independently of other variable identifiers. They are only recognized wtihin label, break, and continue statements.  Label names do not conflict with other identifier names.
