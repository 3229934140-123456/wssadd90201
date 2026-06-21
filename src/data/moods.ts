import { MoodOption, DailyRecord } from '@/types'

export const moodOptions: MoodOption[] = [
  { emoji: '😊', label: '开心', value: 'happy' },
  { emoji: '😌', label: '平静', value: 'calm' },
  { emoji: '😐', label: '一般', value: 'neutral' },
  { emoji: '😔', label: '低落', value: 'sad' },
  { emoji: '😣', label: '难受', value: 'uncomfortable' },
  { emoji: '😤', label: '烦躁', value: 'annoyed' },
  { emoji: '🥰', label: '期待', value: 'excited' },
  { emoji: '🤒', label: '不适', value: 'sick' }
]

export const getMoodByValue = (value: string): MoodOption | undefined => {
  return moodOptions.find(m => m.value === value)
}

export const mockDailyRecords: DailyRecord[] = [
  {
    id: '1',
    date: '2026-06-21',
    mood: 'happy',
    moodEmoji: '😊',
    note: '今天消肿了很多，心情很好！吃了鸡蛋羹和南瓜粥，很满足。',
    photos: ['https://picsum.photos/id/64/300/300'],
    swellingLevel: 2,
    completedTasks: ['diet-1', 'diet-2', 'photo-1', 'custom-1', 'custom-2']
  },
  {
    id: '2',
    date: '2026-06-20',
    mood: 'calm',
    moodEmoji: '😌',
    note: '恢复中，比昨天好了一些。忍住了想吃火锅的念头，给自己点赞！',
    photos: ['https://picsum.photos/id/91/300/300'],
    swellingLevel: 3,
    completedTasks: ['diet-1', 'diet-2', 'lifestyle-1', 'photo-1', 'custom-1']
  },
  {
    id: '3',
    date: '2026-06-19',
    mood: 'uncomfortable',
    moodEmoji: '😣',
    note: '今天肿得比较厉害，有点担心。咨询了医生说正常，放心了一些。',
    photos: ['https://picsum.photos/id/177/300/300'],
    swellingLevel: 4,
    completedTasks: ['diet-1', 'diet-2', 'photo-1', 'custom-1', 'custom-2', 'custom-3']
  },
  {
    id: '4',
    date: '2026-06-18',
    mood: 'neutral',
    moodEmoji: '😐',
    note: '术后第二天，有点胀胀的感觉。严格按照医嘱护理。',
    photos: ['https://picsum.photos/id/338/300/300'],
    swellingLevel: 4,
    completedTasks: ['diet-1', 'diet-2', 'lifestyle-1', 'photo-1', 'custom-1', 'custom-2', 'custom-3']
  },
  {
    id: '5',
    date: '2026-06-17',
    mood: 'excited',
    moodEmoji: '🥰',
    note: '今天做手术了！期待恢复后的样子。护士小姐姐很温柔，过程很顺利。',
    photos: ['https://picsum.photos/id/1027/300/300'],
    swellingLevel: 3,
    completedTasks: ['diet-1', 'diet-2', 'photo-1', 'custom-1']
  }
]
