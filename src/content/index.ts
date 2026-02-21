const scrapeProfile = () => {
  const getText = (selector: string) => {
    const element = document.querySelector(selector);
    return element ? element.textContent?.trim() : '';
  };

  const name = getText('h1.text-heading-xlarge');
  const headline = getText('div.text-body-medium.break-words');
  
  // Find sections by ID or heading
  const getSectionText = (id: string) => {
    const section = document.getElementById(id);
    if (!section) return '';
    return section.textContent?.trim() || '';
  };

  const about = getSectionText('about');
  const experience = getSectionText('experience');
  const education = getSectionText('education');
  const skills = getSectionText('skills');
  const projects = getSectionText('projects');

  // Fallback for About section if ID is not found
  let aboutFallback = '';
  if (!about) {
    const aboutHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('About'));
    if (aboutHeading) {
      aboutFallback = aboutHeading.parentElement?.parentElement?.querySelector('.inline-show-more-text')?.textContent?.trim() || '';
    }
  }

  return {
    name,
    headline,
    about: about || aboutFallback,
    experience,
    education,
    skills,
    projects
  };
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'GET_PROFILE_DATA') {
    const data = scrapeProfile();
    sendResponse(data);
  }
  return true;
});
