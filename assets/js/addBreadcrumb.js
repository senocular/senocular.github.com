function addBreadcrumb (selector) {
  const trail = location.pathname
    .split('/')
    .filter(Boolean)
    .slice(0, -1);
  
  if (!trail.length) return;
  
  const breadcrumb = document.createElement('nav');
  
  function addLink (text, href) {
    const link = document.createElement('a');
    link.text = text;
    link.href = href;
    breadcrumb.appendChild(link);
    const bridge = document.createTextNode(" > ");
    breadcrumb.appendChild(bridge);
  }
  
  addLink(location.hostname, '/');
  
  trail.forEach((text, index) => {
    const href = '/' + trail.slice(0, index + 1).join('/');
    addLink(text, href);
  });
  
  const target = selector && document.querySelector(selector);
  if (target) {
    target.appendChild(breadcrumb);
  } else {
    const script = Array.from(document.querySelectorAll('script')).pop();
    if (!script) return;
    script.parentNode.insertBefore(breadcrumb, script.nextSibling);
  }
}
