export function formatDate(date?: string): string {
  if (!date) {
    return '';
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString('zh-CN');
}

export function splitSkillText(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
