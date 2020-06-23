(function () {
  'use strict';

  var hangul = null;

  if (typeof define == 'function' && define.amd || typeof module !== 'undefined') {
    hangul = require('hangul-js');
  } else {
    hangul = window.Hangul;
  }

  var _existOnlyVowel = function (searchStrArr) {
    return searchStrArr.some(function (char) {
      return hangul.isVowel(char);
    })
  }

  var _parseStr = function (str) {
    var chosungStr = '';
    var parsedArr = str.map(function (char) {
      var disassembledChar = hangul.d(char);
      chosungStr += disassembledChar[0];
      var jungsungArr = disassembledChar.reduce(function (acc, ch) {
        if (hangul.isVowel(ch)) {
          acc.push(ch);
        }
        return acc;
      }, []);
      return {
        char: char,
        chosung: disassembledChar[0],
        jungsungArr: jungsungArr,
        endsWithConsonant: hangul.endsWithConsonant(char),
        isComplete: hangul.isComplete(char)
      }
    })
    return {
      chosungStr: chosungStr,
      parsedArr: parsedArr
    }
  }

  var searchList = function (searchStr, arr, jungsungExactlyMatch) {
    if (!Array.isArray(arr) && !arr) {
      throw new Error('arr cannot be null');
    }

    if (!arr) {
      return arr;
    }

    return arr.reduce(function (acc, str) {
      if (isSearch(searchStr, str, jungsungExactlyMatch)) {
        acc.push(str);
      }
      return acc;
    }, [])
  }

  var isSearch = function (searchStr, targetStr, jungsungExactlyMatch) {
    if (!targetStr) {
      throw false;
    }

    if (!searchStr) {
      return true;
    }

    searchStr = searchStr.toLowerCase()
    var searchStrArr = typeof searchStr === 'string' ? searchStr.split('') : searchStr;
    if (_existOnlyVowel(searchStrArr)) {
      return false;
    }

    var parsedObj = _parseStr(searchStrArr);
    var searchStrChosung = parsedObj.chosungStr;
    var parsedArr = parsedObj.parsedArr;
    var targetStrChosung = targetStr.split('').reduce(function (acc, char) {
      return acc + hangul.d(char)[0];
    }, '').toLowerCase();

    var offset = -1;
    var find = false;
    var disassembleTargetStr = null;
    if ((offset = targetStrChosung.indexOf(searchStrChosung)) > -1) {
      do {
        targetStr = targetStr.substr(offset);
        targetStrChosung = targetStrChosung.substr(offset);
        find = parsedArr.every(function (p, pIndex) {
          if (p.isComplete) {
            if (p.endsWithConsonant) {
              return targetStr[pIndex] === p.char;
            } else {
              disassembleTargetStr = hangul.d(targetStr[pIndex]);
              if (jungsungExactlyMatch === true && (p.jungsungArr.length + 1 !== disassembleTargetStr.length)) {
                return false;
              }
              return p.jungsungArr.every(function (js, jsIndex) {
                return js === disassembleTargetStr[jsIndex + 1];
              })
            }
          } else {
            return hangul.d(targetStrChosung[pIndex])[0] === p.chosung;
          }
        })

        if (find) {
          return true;
        } else {
          offset = targetStrChosung.substr(1).indexOf(searchStrChosung) + 1;
        }
      } while (offset > 0)
    }
    return false;
  }

  var ChosungSearch = {
    isSearch: isSearch,
    searchList: searchList,
    is: isSearch,
    sl: searchList
  }

  if (typeof define == 'function' && define.amd) {
    define(function () {
      return ChosungSearch;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChosungSearch;
  } else {
    window.ChosungSearch = ChosungSearch;
  }
})();