import dayjs from 'dayjs'

export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const formatDateCN = (date: string | Date): string => {
  return dayjs(date).format('YYYY年MM月DD日')
}

export const getToday = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

export const getDaysDiff = (startDate: string, endDate: string): number => {
  return dayjs(endDate).diff(dayjs(startDate), 'day')
}

export const getDaysFromNow = (date: string): number => {
  return dayjs().diff(dayjs(date), 'day')
}

export const isToday = (date: string): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

export const getRecoveryProgress = (currentDay: number, totalDays: number): number => {
  return Math.min(Math.round((currentDay / totalDays) * 100), 100)
}

export const getWeekday = (date: string): string => {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekdays[dayjs(date).day()]
}

export const getRelativeTime = (date: string): string => {
  const diff = dayjs().diff(dayjs(date), 'day')
  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff === 2) return '前天'
  if (diff < 7) return `${diff}天前`
  return formatDate(date)
}
