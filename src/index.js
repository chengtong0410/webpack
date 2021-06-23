//index.js
import './index.less';
if (module && module.hot) {
  module.hot.accept();
}
class Animal {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}
console.log('aaa');
const dog = new Animal('dog');
