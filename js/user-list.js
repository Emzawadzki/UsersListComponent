// TODO: remove if imported in your main script file
import '../scss/main.scss';

/**
 * ~~~ SETUP ~~~
 */
// TODO: grid cols sizes from left to right - should include 4 natural numbers, of which sum equals 24
const gridSizes = [8, 6, 6, 4];

document.addEventListener('DOMContentLoaded', function(e) {
  /**
   * Setting header chosen classes
   */
  for(let i = 0; i < gridSizes.length; i++) {
    document.getElementById(`js-user-list-title-${i}`).classList.add(`user-list--col-${gridSizes[i]}`)
  }

  /**
   * Initial injection from DB to DOM on load
   */
  const userList = document.getElementById('js-user-list');

  data.forEach((el, i) => {
    // append single element
    const userElement = document.createElement('li');
    userElement.classList.add('user-list__user');
    userList.appendChild(userElement);

    // append element data
    const deleteButtonId = `js-delete-user-${i}`;

    userElement.innerHTML = `
      <ul class="user-list__row">
        <li class="user-list__data user-list--col-${gridSizes[0]}">
          ${el.name}
        </li>
        <li class="user-list__data user-list--col-${gridSizes[1]}">
          ${el.age}
        </li>
        <li class="user-list__data user-list--col-${gridSizes[2]}">
          ${el.zodiac}
        </li>
        <li class="user-list__data user-list--col-${gridSizes[3]}">
          <button type="button" class="user-list__button" id="${deleteButtonId}"><span class="user-list__message">DELETE</span><i class="user-list__icon fas fa-trash"></i></button>
        </li>
      </ul>
    `;

    // add DELETE button listener
    document.getElementById(deleteButtonId).addEventListener('click', () => {deleteElement(userElement)});
    return false;
  });

  // DELETE button handler
  function deleteElement(element) {
    // remove previous popup
    const prevPopup = document.getElementById('js-user-list-popup');
    if(prevPopup) {
      prevPopup.parentElement.classList.remove('user-list--active');
      prevPopup.remove();
    }
    
    const confirmPopup = document.createElement('div');

    // choose and set proper popup class (depending on window width)
    confirmPopup.classList.add('user-list__popup');
    setPopup(confirmPopup, element, userList);

    // generate popup content
    confirmPopup.id = 'js-user-list-popup';
    confirmPopup.innerHTML = `
      <span class="user-list__confirm-msg">Are you sure you want to remove this item?</span>
      <button type="button" class="user-list__cancel-btn" id="js-delete-user-cancel">NO</button>
      <button type="button" class="user-list__confirm-btn" id="js-delete-user-confirm">YES</button>
    `
    element.appendChild(confirmPopup);
    element.classList.add('user-list--active');

    // cancel delete event
    document.getElementById('js-delete-user-cancel').addEventListener('click', e => {
      element.classList.remove('user-list--active');
      confirmPopup.remove();
    });
    
    // confirm delete event
    document.getElementById('js-delete-user-confirm').addEventListener('click', e => {
      element.remove();
    });

    return false;
  };

  /**
   * Detecting scrollbar width
   */

  function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar";

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }

  // Set list margin accordingly to browser scrollbar

  userList.style.marginRight = -(getScrollbarWidth()) + 'px';

  // Set list margin with width change

  window.addEventListener('resize', () => {
    userList.style.marginRight = -(getScrollbarWidth()) + 'px';
    return false;
  })

  /**
   * Change popup direction function
   */
  function setPopup(popup, parentElement, scrolledElement) {
    // get flexible breakpoint
    let sideObjWidth = (window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content'));
    sideObjWidth = parseInt(sideObjWidth.slice(1, sideObjWidth.length - 1));
    sideObjWidth = sideObjWidth ? sideObjWidth : 0;
    
    let popupBreakPoint = 240;
    if(window.innerWidth <= 600 + sideObjWidth) {
      popupBreakPoint = 180;
    }

    if(parentElement.offsetTop - scrolledElement.scrollTop > popupBreakPoint && !popup.classList.contains('user-list--popup-upside-down')) {
      popup.classList.add('user-list--popup-upside-down');
    } else if(parentElement.offsetTop - scrolledElement.scrollTop <= popupBreakPoint && popup.classList.contains('user-list--popup-upside-down')) {
      popup.classList.remove('user-list--popup-upside-down');
    }

    return false;
  }

  /**
   * Change popup orientation on scroll or resize (optional)
   */

  let popupElement = null;
  let popupElementPar = null;

  function changePopupOrientation() {
    popupElement = document.getElementById('js-user-list-popup');

    if(popupElement) {
      popupElementPar = popupElement.parentElement;
      setPopup(popupElement, popupElementPar, userList);
    }
    
    return false;
  }

  userList.addEventListener('scroll', changePopupOrientation);
  window.addEventListener('resize', changePopupOrientation);

});

// example JSON-like DB TODO: to be replaced by actual DB
const data = [
  {
    name: "Lorem ipsum",
    age: 12,
    zodiac: "Gemini"
  },
  {
    name: "Dolor Sit",
    age: 24,
    zodiac: "Libra"
  },
  {
    name: "Amet Consectetur",
    age: 22,
    zodiac: "Aquarius"
  },
  {
    name: "Adipisicing Elit",
    age: 29,
    zodiac: "Cancer"
  },
  {
    name: "Earum Perferendis",
    age: 32,
    zodiac: "Scorpio"
  },
  {
    name: "Aspernatur Minima",
    age: 54,
    zodiac: "Pisces"
  },
  {
    name: "Sapiente Veritatis",
    age: 19,
    zodiac: "Aries"
  },
  {
    name: "Enim Reprehenderit",
    age: 35,
    zodiac: "Sagittarius"
  },
  {
    name: "Earum Perferendis",
    age: 65,
    zodiac: "Scorpio"
  },
  {
    name: "Aspernatur Minima",
    age: 86,
    zodiac: "Pisces"
  },
  {
    name: "Sapiente Veritatis",
    age: 15,
    zodiac: "Aries"
  },
  {
    name: "Enim Reprehenderit",
    age: 66,
    zodiac: "Sagittarius"
  }
];