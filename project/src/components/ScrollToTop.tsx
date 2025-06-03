import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop组件 - 在路由变更时自动滚动到页面顶部
 * 这个组件不渲染任何UI，只添加了一个副作用
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  
  // 当路径名变化时自动滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default ScrollToTop; 