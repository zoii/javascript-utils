
export default class EventEmiter {
  constructor() {
    this.element = null;
    this.selector = null;
    this.type = null;
    this.originFn = null;
    this.fn = null;
  }
  addEvent(...props) {
    this.setArgs(props);
    this.fn = (evn) => {
      const target = this.getTarget(evn);
      this.matchSelector(target, this.selector) && this.originFn && this.originFn(target);
    }

    if (this.element.addEventListener) {
      this.element.addEventListener(this.type, this.fn, false);
    } else {
      this.element.attchEvent(this.type, this.fn);
    }
  }
  removeEvent(...props) {
    this.setArgs(props);
    if (this.element.addEventListener) {
      this.element.removeEventListener(this.type, this.fn, false);
    } else {
      this.element.detachEvent(this.type, this.fn);
    }
  }
  matchSelector(ele, sel) {
    const selectorStr = sel.slice(1);

    if (sel.charAt(0) === '#') {
      return ele.id === selectorStr;
    }

    if (sel.charAt(0) === '.') {
      return (` ${ele.className} `.indexOf(` ${selectorStr} `)) !== -1;
    }

    return ele.tagName.toLowerCase() === sel.toLowerCase();
  }
  getEvent() {
    return this.element.event || window.event;
  }
  getTarget(evn) {
    const event = evn;
    return event.target || event.srcElement;
  }
  setArgs(props) {
    this.element = props[0];
    this.selector = props[1];
    this.type = props[2];
    this.originFn = props[3];
  } 
};