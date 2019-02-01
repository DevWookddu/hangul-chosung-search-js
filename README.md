# hangul-chosung-search-js

> hangul-js(https://www.npmjs.com/package/hangul-js)를 활용한 한글 초성 검색 라이브러리입니다. 
>
> 이 라이브러리의 README.md 문서 작성에는 hangul-js의 README.md 문서 작성 방식을 참고하였습니다.

## install

```
npm install hangul-chosung-search
```

### CDN 방식 사용 방법

Requirejs 방식: 일반 웹페이지에서 사용하시려면 require.js를 먼저 호출해주셔야 합니다.
  
```html
<script src="require.js"></script>
<script src="https://unpkg.com/hangul-chosung-search-js@0.2.0/index.js" type="text/javascript"></script>
```

ChosungSearch라는 변수로 전역에 노출됩니다.

```js
window.ChosungSearch
```

### node.js 사용 방법

```js
var ChosungSearch = require('hangul-chosung-search-js')
```

## 명세

### ChosungSearch.isSearch (alias `ChosungSearch.is`)

`ChosungSearch.isSearch(searchStr:string, targetStr:string)`은 문자열 searchStr의 초성을 targetStr의 초성(+중성+종성)과 비교하여 일치하는 문자열이 있을 경우 true를 반환. 아닐경우 false를 반환합니다.

ChosungSearch.is처럼 짧은 이름으로 사용할 수도 있습니다.

```js
ChosungSearch.isSearch('ㄱ', '광고주') // true

ChosungSearch.isSearch('고', '광고주') // true, 중성까지 일치하는지 확인합니다.

ChosungSearch.isSearch('과', '광고주') // true, 중성까지 일치하는지 확인합니다.

ChosungSearch.isSearch('광', '광고주') // true

ChosungSearch.is('관', '광고주') // false 
```

### ChosungSearch.searchList (alias `ChosungSearch.sl`)

`ChosungSearch.searchList(searchStr:string, arr:array)`은 문자열 searchStr의 초성을 arr의 각 문자열들의 초성(+중성+종성)과 비교하여 일치하는 문자열들을 배열로 반환해주는 함수입니다.

`ChosungSearch.sl`처럼 짧은 이름으로 사용할 수도 있습니다.

```js
ChosungSearch.searchList('ㄱ', ['광고주', '엔피엠', '석관', '석궁']) // ['광고주', '석관', '석궁']

ChosungSearch.searchList('고', ['광고주', '엔피엠', '석관', '석궁']) // ['광고주', '석관']

ChosungSearch.searchList('과', ['광고주', '엔피엠', '석관', '석궁']) // ['광고주', '석관']

ChosungSearch.searchList('광', ['광고주', '엔피엠', '석관', '석궁']) // ['광고주']

ChosungSearch.sl('관', ['광고주', '엔피엠', '석관', '석궁']) // ['석관']
```