function addBreadcrumb (selector = null) {
  const trail = location.pathname
    .split('/')
    .filter(Boolean); // remove any "/" bookends -> ""
  
  if (!trail.length) return;
  
  trail.pop(); // current page
  
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
    // no selector adds after the callsite script (assuming synchronous call)
    const script = Array.from(document.querySelectorAll('script')).pop();
    if (!script) return;
    script.parentNode.insertBefore(breadcrumb, script.nextSibling);
  }
}
