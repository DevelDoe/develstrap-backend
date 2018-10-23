# develstrap-backend

This is the backend API for devel-admin. It uses a mongodb database, token jwt based authentication with passport.

## Install

`npm install`

Add configuration file 'config.js' to root of file structure:

*config.js*
```
export default {
    'secret'   : '{its a secrete}',
    'database' : '{urltodatabase}'
}
```
