(function ChosungSearch () {
  'use strict';

  var _existOnlyVowel = function (searchStrArr) {
    return searchStrArr.some(function (char) {
      return Hangul.isVowel(char)
    })
  }

  var _parseStr = function (str) {
    var chosungStr = ''
    var parsedArr = str.map(function (char) {
      var disassembledChar = Hangul.d(char)
      chosungStr += disassembledChar[0]
      var jungsungArr = disassembledChar.reduce(function (acc, ch) {
        if (Hangul.isVowel(ch)) {
          acc.push(ch)
        }
        return acc
      }, [])
      return {
        char: char,
        chosung: disassembledChar[0],
        jungsungArr: jungsungArr,
        endsWithConsonant: Hangul.endsWithConsonant(char),
        isComplete: Hangul.isComplete(char)
      }
    })
    return {
      chosungStr: chosungStr,
      parsedArr: parsedArr
    }
  }

  var searchList = function (searchStr, arr) {
    if (!Array.isArray(arr) && !arr) {
      throw new Error('arr cannot be null')
    }

    if (!arr) {
      return arr
    }

    return arr.reduce(function (acc, str) {
      if (isSearch(searchStr, str)) {
        acc.push(str)
      }
      return acc
    }, [])
  }

  var isSearch = function (searchStr, targetStr) {
    if (!targetStr) {
      throw false
    }

    if (!searchStr) {
      return true
    }

    searchStr = searchStr.toLowerCase()
    var searchStrArr = typeof searchStr === 'string' ? searchStr.split('') : searchStr
    if (_existOnlyVowel(searchStrArr)) {
      return false
    }

    var parsedObj = _parseStr(searchStrArr)
    var searchStrChosung = parsedObj.chosungStr
    var parsedArr = parsedObj.parsedArr
    var targetStrChosung = targetStr.split('').reduce(function (acc, char) {
      return acc + Hangul.d(char)[0]
    }, '').toLowerCase()

    var offset = -1
    var find = false
    var disassembleTargetStr = null
    if ((offset = targetStrChosung.indexOf(searchStrChosung)) > -1) {
      while (offset > -1) {
        targetStr = targetStr.substr(offset)
        targetStrChosung = targetStrChosung.substr(offset)
        find = parsedArr.every(function (p, pIndex) {
          if (p.isComplete) {
            if (p.endsWithConsonant) {
              return targetStr[pIndex] === p.char
            } else {
              disassembleTargetStr = Hangul.d(targetStr[pIndex])
              return p.jungsungArr.every(function (js, jsIndex) {
                return js === disassembleTargetStr[jsIndex + 1]
              })
            }
          } else {
            return Hangul.d(targetStrChosung[pIndex])[0] === p.chosung
          }
        })

        if (find) {
          return true
        } else {
          targetStrChosung = targetStrChosung.substr(searchStrChosung.length)
          targetStr = targetStr.substr(searchStrChosung.length)
          offset = targetStrChosung.indexOf(searchStrChosung)
        }
      }
    }
    return false
  }
  
  window.ChosungSearch = {
    isSearch: isSearch,
    searchList: searchList,
    is: isSearch,
    sl: searchList
  }
})();