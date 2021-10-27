//时间转化格式
//时间格式处理
export function dateFormat(d) {
  if (isNaN(new Date(d).getTime())) return d;
  const dt = new Date(d);
  //月份 不足两位用 0 补全
  const mouth = (dt.getMonth() + 1 + '').padStart(2, '0');
  //日 不足两位用 0 补全
  const date = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');

  /* 获取日期 */
  const dY = dt.getFullYear();
  const dM = dt.getMonth() + 1;
  const dd = dt.getDate();
  /* 现在 */
  const now = new Date();
  const nY = now.getFullYear();
  const nM = now.getMonth() + 1;
  const nd = now.getDate();

  if (dY == nY && dM == nM && dd == nd) {
    return hh + ':' + mm;
  } else if ((dY == nY && dM != nM) || (dY == nY && dd != nd)) {
    return mouth + '月' + date + '日';
  } else if (dY !== nY) {
    return `${dY}-${mouth}-${date}`;
  }
}
export function chatDateFormat(d) {
  if (isNaN(new Date(d).getTime())) return d;
  /* 获取日期 */
  const dt = new Date(d);
  const dY = dt.getFullYear();
  const dM = dt.getMonth() + 1;
  const dd = dt.getDate();
  /* 现在 */
  const now = new Date();
  const nY = now.getFullYear();
  const nM = now.getMonth() + 1;
  const nd = now.getDate();
  /* 输出时间字符串 */
  //月份
  const mouth = (dt.getMonth() + 1 + '').padStart(2, '0');
  //日
  const date = (dt.getDate() + '').padStart(2, '0');
  //时分
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');

  //今天
  if (dY == nY && dM == nM && dd == nd) {
    return hh + ':' + mm;
  }
  //今年
  else if ((dY == nY && dM != nM) || (dY == nY && dd != nd)) {
    return `${mouth}月${date}日 ${hh}:${mm}`;
  }
  //不同年
  else if (dY !== nY) {
    return `${dY}年${mouth}月${date}日 ${hh}:${mm}`;
  }
}

//聊天时间处理
export function handleChatDate(thisTime, lastTime) {
  if (isNaN(new Date(thisTime).getTime())) return thisTime;
  /* 与上一条间隔小于5分钟不显示时间 */
  if (lastTime && new Date(thisTime) - new Date(lastTime) < 1000 * 60 * 5) {
    return '';
  } else {
    return thisTime;
  }
}
