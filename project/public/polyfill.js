/**
 * polyfill.js - 解决gray-matter在生产环境中的依赖问题
 */

// Polyfill for Buffer
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = {
    from: function(text) {
      return typeof text === 'string' ? text : String(text);
    },
    isBuffer: function() {
      return false;
    }
  };
}

// Polyfill for Array.from
if (!Array.from) {
  Array.from = function(iterable) {
    if (iterable == null) {
      throw new TypeError('Array.from requires an array-like object');
    }
    
    // 使用旧方法将类数组对象转为数组
    var arr = [];
    for (var i = 0; i < iterable.length; i++) {
      arr.push(iterable[i]);
    }
    return arr;
  };
}

console.log('[polyfill.js] Buffer和Array.from polyfill已加载'); 