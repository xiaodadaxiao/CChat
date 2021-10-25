//时间转化格式
//时间格式处理
export function dateFormat(d) {
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
