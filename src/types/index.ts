export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  currentProjectId?: string
  energy: number
  checkInDays: number
  totalDays: number
}

export interface DailyRecord {
  id: string
  date: string
  mood: string
  moodEmoji: string
  note?: string
  photos: string[]
  swellingLevel?: number
  completedTasks: string[]
}

export type FoodLevel = 'green' | 'yellow' | 'red'

export interface FoodItem {
  id: string
  name: string
  level: FoodLevel
  levelText: string
  description: string
  alternatives: string[]
  tips: string
  image: string
  category: string
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  recoveryDays: number
  icon: string
  color: string
  forbiddenFoods: string[]
  allowedFoods: string[]
  dailyTips: string[]
  consequences: string[]
  comfortWords: string[]
}

export type TaskStatus = 'pending' | 'completed' | 'locked'
export type TaskType = 'diet' | 'lifestyle' | 'photo' | 'custom'

export interface TaskItem {
  id: string
  title: string
  description: string
  type: TaskType
  icon: string
  energy: number
  status: TaskStatus
  day: number
  tips?: string
}

export interface RewardItem {
  id: string
  name: string
  description: string
  energyCost: number
  type: 'coupon' | 'service' | 'product'
  image: string
  stock: number
  expiryDate?: string
}

export interface UserReward {
  id: string
  rewardId: string
  reward: RewardItem
  code: string
  status: 'unused' | 'used' | 'expired'
  obtainedAt: string
}

export interface ActivityItem {
  id: string
  title: string
  description: string
  image: string
  startTime: string
  endTime: string
  rules: string[]
  rewards: ActivityReward[]
}

export interface ActivityReward {
  id: string
  name: string
  energyCost: number
  stock: number
}

export interface MoodOption {
  emoji: string
  label: string
  value: string
}

export interface BlindBoxQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface RedeemRecord {
  id: string
  code: string
  rewardName: string
  status: 'success' | 'failed'
  failReason?: string
  redeemedAt: string
  operator?: string
}

export interface ShareMealHistory {
  id: string
  date: string
  foods: string[]
  day: number
  checkInDays: number
  imageUrl?: string
  createdAt: string
}
