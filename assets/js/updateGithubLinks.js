function updateGithubLinks (selector = '.github-link') {
  const root = '//github.com/senocular/senocular.github.com/tree/master';
  const path = location.pathname.replace('.html', '.md');
  const links = document.querySelectorAll(selector);
  links.forEach(link => link.href = `${root}${path}`);
}
