async function loadAboutAttributes() {
  const list = document.querySelector('#about-attributes');
  if (!list) return;

  try {
    const response = await fetch('/about.json');
    if (!response.ok) throw new Error(`About attributes: HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.attributes)) throw new Error('Expected an attributes array');

    const attributes = [...new Set(data.attributes
      .filter(attribute => typeof attribute === 'string')
      .map(attribute => attribute.trim().replace(/^#+/, '').replace(/\s+/g, ''))
      .filter(Boolean))];

    const items = attributes.map(attribute => {
      const item = document.createElement('li');
      item.textContent = `#${attribute}`;
      return item;
    });
    list.replaceChildren(...items);
    list.hidden = items.length === 0;
  } catch (error) {
    // Keep the initial hashtags visible if the data file cannot be loaded.
    console.warn('Could not load About Me attributes.', error);
  }
}

loadAboutAttributes();
