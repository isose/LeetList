export const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const formatDate = (date: string): string => {
  if (date == undefined) {
    return '';
  }
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = date.slice(8, 10);
  const month = months[Number(date.slice(5, 7)) - 1];
  const year = date.slice(0, 4);
  return `${month} ${day}, ${year}`;
};
