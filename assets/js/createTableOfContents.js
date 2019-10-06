
function createTableOfContents () {
  const toc = document.querySelector('.toc');
  const content = document.querySelector('.markdown-body');
  
  if (!toc || !content) return;
  
  const headingsSelector = 'h1,h2,h3,h4,h5,h6';
  const headingTags = headingsSelector.toUpperCase().split(',');
  
  const headings = content.querySelectorAll(headingsSelector);
  if (!headings.length) {
    doc.style.display = 'none';
    return;
  }
  
  const panel = toc.querySelector('.toc-panel');
  
  let listStack = [];
  headings.forEach(heading => {
    const tagIndex = headingTags.indexOf(heading.tagName);
    if (tagIndex < 0) return;
    
    if (tagIndex < listStack.length) {
      listStack.length = tagIndex;
    }
    
    let list;
    while (!(list = listStack[tagIndex])) {
      list = document.createElement('ul');
      const lastList = listStack[listStack.length - 1];
      const parent = lastList
        ? lastList.lastElementChild || lastList
        : panel;
      parent.appendChild(list);
      listStack.push(list);
    }
    
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = heading.textContent;
    link.href = '#' + heading.id;
    item.appendChild(link);
    list.appendChild(item);
  });
  
  window.addEventListener('click', event => {
    if (toc.contains(event.target)) {
      let tag = event.target.tagName;
      if (tag === 'BUTTON') {
        toc.classList.toggle('expanded');
      } else if (tag === 'A') {
        toc.classList.remove('expanded');
      }
    } else {
      toc.classList.remove('expanded');
    }
  });
}
