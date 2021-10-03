# webpack-config

## 바벨을 설치하기 위해 아래 명령어를 실행
```js
npm i -D babel-loader @babel/core @babel/preset-env
```
설치후에 webpack.config.js에서 module안에 babel 설정
```js
  module: {
    rules: [
      {
        // .js인 파일을 찾기
        test: /\.js$/,
        // 바벨 트랜스파일은 비용이 크므로 node_modules는 제외할것임
        exclude: /node_modules/,
        use: {
          // babel-loader를 사용할것
          loader: "babel-loader",
        }
      }
    ]
  },
```

babel.config.js 파일을 만들어 바벨 기본 설정을 해줄것

```js
module.exports = {
  presets: ["@babel/preset-env"]
}
```

파일을 설정하고 npm run build를 실행하면 main.js 파일을 보면 바벨이 적용된것을 볼 수 있음

## source-map

webpack.config.js 파일에서 devtool을 source-map으로 바꾸게되면 콘솔창에서 트랜스파일된 소스코드를 볼 수 있음
```js
devtool: "source-map",
```
mode가 development인지 production인지 계속 바꿔주기 번거로우므로 NODE_ENV 활용
```js
let mode = "development";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}
```
npm run build를 실행하게 되면 production 모드로 실행되어 minify된 main.js 코드들을 확인할 수 있음

development 모드로 실행하기 위해 package.json에 "build-dev": "webpack" 추가

### window에서는 NODE_ENV를 인식하는데 문제가 있으므로 cross-env를 설치함으로써 해결가능 
(https://www.youtube.com/watch?v=t9okUDkRUDc&t=0s)
```js
  "start": "cross-env SERVE=true webpack serve",
  "watch": "webpack --watch",
  "build": "cross-env NODE_ENV=production webpack"
```

##  CSS, SASS, PostCSS, HMR

- css 파일을 생성하고 index.js에 import 한 뒤, npm run build를 실행하면 에러가 발생
```js
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
```
로더가 없어서 발생하는 문제이므로, 로더를 설치할것
```js
npm i -D css-loader mini-css-extract-plugin
// style-loader를 사용해도 됨
// style-loader는 스타일을 자바스크립트 번들에 주입함 
// mini-css-extract-plugin은 css 파일을 따로 만듦
// 상황에 따라 맞는것을 사용하면 됨
```

로더를 설치한 이후에 webpack.config.js 상위에 import 할 것
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

import후에 plugin 설정하고 module에 추가
```js
  module: {
    rules: [
      {
        // i는 case-insensitive
        test: /\.css$/i, 
        // 웹팩은 배열을 오른쪽에서 왼쪽으로 읽으므로 css 파일을 읽으면 css-loader부터 시작해 MiniCss..를 실행함
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },

  plugins: [new MiniCssExtractPlugin()],
```

설정한뒤에 npm run build를 실행, 그리고 dist 폴더를 보면 main.css와 main.js.map 파일이 생성된것을 확인할 수 있음.

해당 파일을 index.html에 아래와 같이 import하고 npm start를 실행하면 스타일이 적용된 것을 볼 수 있음
```js
  <link rel="stylesheet" href="main.css" />
```

- css파일을 scss파일로 설정한뒤, npm run build를 하면 로더가 없으므로 에러 발생
```js
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file.
```
sass 로더를 설치
```js
npm i -D sass sass-loader
```

webpack.config.js에서 rules를 수정
```js
  module: {
    rules: [
      {
        test: /\.s?css$/i, // s?css는 css와 scss 둘다 test 가능함
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
```
main.css에 적용된것을 볼 수 있음

- postCss를 적용시키기 위해 아래의 명령어를 실행
```js
npm i -D postcss postcss-preset-env postcss-loader
```

명령어 실행후, postcss.config.js 파일을 만들고 기본설정
```js
module.exports = {
  plugins: ["postcss-preset-env"]
}
```
webpack.config.js에서 설정
```js
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
```

## browserslist 

.browserslistrc를 사용해 지원 브라우저 세팅을하고
```js
last 2 versions
> 0.5%
IE 10
```
npm run build-dev를 실행하면 main.css에 pre-fix가 붙음
```css
main {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}
```

## React with JSX

```js
npm i react react-dom
npm i -D @babel/preset-react
```
위의 코드로 리액트와 preset-react 설치후 babel.config.js에 세팅
```js
module.exports = {
  presets: [
    "@babel/preset-env",
    // { runtime: "automatic" }을 설정함으로써 컴포넌트에서 import React from 'react' 생략가능
    ["@babel/preset-react", { runtime: "automatic" }]
  ]
}
```

jsx 파일을 만들고 npm run build를 실행시키면 에러발생. 아래의 코드로 해결 가능
```js
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        // jsx일수도 아닐수도 있음
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },
```
