import EventEmiter from '../../js/libs/EventEmiter.js';

const list = document.getElementById('list');
const emiter = new EventEmiter();
const cb = (a) => {
  console.log(a);
}
emiter.addEvent(list, '.item', 'click', cb);
// emiter.removeEvent(list, '.item', 'click', cb);
