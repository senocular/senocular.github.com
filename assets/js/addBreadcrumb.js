function addBreadcrumb (selector) {
  const trail = location.pathname
    .split('/')
    .slice(0, -1)
    .filter(Boolean);
  
  if (!trail.length) return;
  
  const trailFrag = document.createDocumentFragment();
  
  function addLink (text, href) {
    const link = document.createElement('a');
    link.text = text;
    link.href = href;
    trailFrag.appendChild(link);
    trailFrag.appendChild(document.createTextNode(" > "))
  }
  
  addLink(location.hostname, '/');
  
  trail.forEach((text, index) => {
    const href = '/' + trail.slice(0, index + 1).join('/');
    addLink(text, href);
  });
  
  const breadcrumb = document.createElement('div');
  breadcrumb.appendChild(trailFrag);
  
  const target = selector && document.querySelector(selector);
  if (target) {
    target.appendChild(breadcrumb);
  } else {
    const script = Array.from(document.querySelectorAll('script')).pop();
    if (!script) return;
    script.parentNode.insertBefore(breadcrumb, script.nextSibling);
  }
}
