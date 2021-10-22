export default class Validator {
  constructor(data) {
    this.data = data;
    this.flag = true;
  }
  //得到结果
  end() {
    return this.flag;
  }
  //最大值
  max(n) {
    if (!this.flag) return this;
    this.flag = this.data <= n;
    return this;
  }
  //最小值
  min(n) {
    if (!this.flag) return this;
    this.flag = this.data >= n;
    return this;
  }
  //数值范围
  range(min, max) {
    if (!this.flag) return this;
    this.flag = this.data >= min && this.data <= max;
    return this;
  }
  //正则
  reg(re) {
    if (!this.flag) return this;
    this.flag = re.test(this.data);
    return this;
  }
  //非空
  notnull() {
    if (!this.flag) return this;
    this.flag = this.data !== undefined && this.data !== null;
    if (typeof this.data == 'string') this.flag = this.data.trim() !== '';
    if (Array.isArray(this.data)) this.flag = this.data.length > 0;
    return this;
  }
  //最大长度
  maxlen(max) {
    if (!this.flag) return this;
    if (typeof this.data == 'string') {
      this.flag = this.data.trim().length <= max;
    } else {
      this.flag = this.data.length <= max;
    }
    return this;
  }
  //最小长度
  minlen(min) {
    if (!this.flag) return this;
    if (typeof this.data == 'string') {
      this.flag = this.data.trim().length >= min;
    } else {
      this.flag = this.data.length >= min;
    }
    return this;
  }
  //长度
  len(min, max) {
    if (!this.flag) return this;
    this.maxlen(max);
    this.minlen(min);
    return this;
  }
  string() {
    if (!this.flag) return this;
    this.flag = typeof this.data === 'string';
    return this;
  }
  number() {
    if (!this.flag) return this;
    this.flag = typeof this.data === 'number';
    return this;
  }
  boolean() {
    if (!this.flag) return this;
    this.flag = typeof this.data === 'boolean';
    return this;
  }
  array() {
    if (!this.flag) return this;
    this.flag = Array.isArray(this.data);
    return this;
  }
  type(types) {
    if (!this.flag) return this;
    if (typeof types == 'string') this[types]();
    if (Array.isArray(types)) {
      let count = 0;
      types.forEach(type => {
        this[type]();
        if (this.flag == true) count++;
        this.flag = true;
      });
      this.flag = count > 0;
    }
    return this;
  }
}
