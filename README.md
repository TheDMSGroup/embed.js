# embed.js
Embed implementation for the Studio CRM product built on top of [formio.js](https://github.com/formio/formio.js) using modern ES6 practices and compiled to ES5 using the babel compiler.

### Install with NPM
```
npm install @ivanljutyj/embed.js
```

### Desktop Browser Support
| Internet Explorer | Edge | Firefox | Safari | Chrome |
| :---------------: | :---: | :-----: | :----: | :----: |
| 10+               | 15+   | 25+     | 6.2+   | 20+    |

### Mobile Browser Support
| iPhone Safari        | Android Native | Android Chrome | Android Firefox |
| :------------------: | :------------: | :------------: | :-------------: |  
| iPhone 4S+ (iOS 6)  |      4.3+      |   4.3+         | 4.3+            |

### Form Embedding
```html
    <script src="dist/embed.js"></script>
    <script>crm.embed({ account: 'DMS', target: 1, url: 'http://studio.test' });</script>
```
### Config Options
* account - REQUIRED
* target|form - REQUIRED
* url - OPTIONAL
* ignoreHistory - true|false - OPTIONAL

### Form Builder Embedding
```html
    <script src="dist/embed.js"></script>
    <script>crm.build();</script>
```

### Development/Commit Process
* Make Code Changes
* `npm run build`
* Update package version in `package.json`
* commit your code changes, `./dist/*`, and `package.json`
