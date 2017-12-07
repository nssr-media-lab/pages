const P_WOMEN = 0.36;
const P_MINOR = 0.085;
const teamEl = document.getElementById('the-team');
const TYPES = {
  employee: {
    per_row: 20,
    max_n: 18000,
    shown: 0
  },
  contractor: {
    per_row: 40,
    max_n: 10000,
    shown: 0
  }
};

function makeRow(type) {
  if (TYPES[type].shown < TYPES[type].max_n) {
    var row = document.createElement('li');
    for (var i=0; i<TYPES[type].per_row; i++) {
      var img = document.createElement('img');
      img.style.width = `${100/TYPES[type].per_row}%`;
      img.src = '/assets/default_hex.png';
      if (type == 'employee') {
        var w = Math.random(),
            m = Math.random();
        if (w < P_WOMEN && m < P_MINOR) {
          img.src = '/assets/filled_blue_hex.png';
        } else if (w < P_WOMEN) {
          img.src = '/assets/filled_hex.png';
        } else if (m < P_MINOR) {
          img.src = '/assets/blue_hex.png';
        }
      }
      row.appendChild(img);
    }
    teamEl.appendChild(row);
    TYPES[type].shown += TYPES[type].per_row;
    return true;
  }
  return false;
}

// initial set of rows
for (var i=0; i<20; i++) {
  makeRow('employee');
}

// generate new rows of employees/contractors
// when scrolling to the bottom
window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      for (var i=0; i<10; i++) {
        if (!makeRow('employee')) {
          makeRow('contractor');
        }
      }
    }
};

// show person bio on click
Array.from(document.getElementsByClassName('leader-profile')).forEach(el => {
  el.addEventListener('click', () => {
    Array.from(document.querySelectorAll('.leader-bio')).forEach(e => {
      e.style.display = 'none';
    });
    document.querySelector(`.leader-bio[data-name=${el.dataset.name}]`).style.display = 'block';
  });
});
