(function () {
  'use strict';

  var colours = [
    ['Red', '#dc403b'], ['Orange', '#ed8a32'], ['Yellow', '#f3cd46'],
    ['Green', '#4c9660'], ['Blue', '#407ac8'], ['Purple', '#9565b9'],
    ['Pink', '#e999b5'], ['Brown', '#916344'], ['Black', '#242424'], ['White', '#ffffff']
  ];
  var form = document.getElementById('hunt-setup');
  var count = document.getElementById('participant-count');
  var names = document.getElementById('participant-names');
  var picker = document.getElementById('colour-picker');
  var choices = document.getElementById('colour-choices');
  var counter = document.getElementById('selection-count');
  var error = document.getElementById('setup-error');
  var results = document.getElementById('hunt-results');
  var cards = document.getElementById('result-cards');
  var savedNames = Array(10).fill('');
  var selected = new Set();

  function numberOfPeople() { return Number(count.value); }
  function manualMode() {
    return numberOfPeople() < 10 && form.elements['colour-mode'].value === 'choose';
  }
  function clearResults() {
    results.hidden = true;
    cards.replaceChildren();
    error.textContent = '';
  }
  function updateColours() {
    var total = numberOfPeople();
    document.getElementById('mode-options').hidden = total === 10;
    document.getElementById('all-colours-note').hidden = total !== 10;
    picker.hidden = !manualMode();
    counter.textContent = selected.size + ' of ' + total + ' selected';
  }
  function renderNames() {
    names.replaceChildren();
    for (var i = 0; i < numberOfPeople(); i++) {
      var label = document.createElement('label');
      label.className = 'hunt-name';
      label.textContent = 'Person ' + (i + 1);
      var input = document.createElement('input');
      input.type = 'text';
      input.name = 'person-' + i;
      input.required = true;
      input.autocomplete = 'off';
      input.value = savedNames[i];
      input.dataset.index = i;
      input.placeholder = 'Enter a name';
      label.append(input);
      names.append(label);
    }
  }
  colours.forEach(function (colour, index) {
    var label = document.createElement('label');
    label.className = 'hunt-colour';
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = index;
    var swatch = document.createElement('span');
    swatch.className = 'hunt-swatch';
    swatch.style.backgroundColor = colour[1];
    swatch.setAttribute('aria-hidden', 'true');
    var text = document.createElement('span');
    text.textContent = colour[0];
    label.append(checkbox, swatch, text);
    choices.append(label);
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) selected.add(index);
      else selected.delete(index);
      clearResults();
      updateColours();
    });
  });

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var item = copy[i];
      copy[i] = copy[j];
      copy[j] = item;
    }
    return copy;
  }
  function assign() {
    var total = numberOfPeople();
    if (!Number.isInteger(total) || total < 1 || total > 10) return;
    var inputs = Array.from(names.querySelectorAll('input'));
    inputs.forEach(function (input) {
      input.setCustomValidity(input.value.trim() ? '' : 'Please enter a name.');
    });
    if (!form.reportValidity()) return;
    if (manualMode() && selected.size !== total) {
      error.textContent = 'Choose exactly ' + total + ' colours (' + selected.size + ' selected).';
      choices.querySelector('input').focus();
      return;
    }
    error.textContent = '';
    var pool = manualMode() ? Array.from(selected).map(function (index) { return colours[index]; }) : colours;
    var assigned = shuffle(pool).slice(0, total);
    cards.replaceChildren();
    inputs.forEach(function (input, index) {
      var card = document.createElement('li');
      card.className = 'hunt-result';
      var swatch = document.createElement('div');
      swatch.className = 'hunt-result-swatch';
      swatch.style.backgroundColor = assigned[index][1];
      swatch.setAttribute('aria-hidden', 'true');
      var name = document.createElement('h3');
      name.textContent = input.value.trim();
      var colour = document.createElement('p');
      colour.textContent = assigned[index][0];
      card.append(swatch, name, colour);
      cards.append(card);
    });
    form.hidden = true;
    results.hidden = false;
    document.getElementById('results-title').focus();
  }
  count.addEventListener('change', function () {
    clearResults();
    renderNames();
    updateColours();
  });
  names.addEventListener('input', function (event) {
    savedNames[Number(event.target.dataset.index)] = event.target.value;
    event.target.setCustomValidity('');
    clearResults();
  });
  form.querySelectorAll('input[name="colour-mode"]').forEach(function (radio) {
    radio.addEventListener('change', function () { clearResults(); updateColours(); });
  });
  form.addEventListener('submit', function (event) { event.preventDefault(); assign(); });
  document.getElementById('shuffle-again').addEventListener('click', assign);
  document.getElementById('edit-setup').addEventListener('click', function () {
    clearResults();
    form.hidden = false;
    count.focus();
  });
  renderNames();
  updateColours();
}());
