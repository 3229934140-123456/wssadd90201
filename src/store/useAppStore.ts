import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo, ProjectItem, TaskItem, DailyRecord, FoodItem, RewardItem, UserReward, ActivityItem } from '@/types'
import { getProjectById } from '@/data/projects'
import { generateDailyTasks } from '@/data/tasks'
import { mockDailyRecords } from '@/data/moods'
import { userRewards, rewards as initialRewards } from '@/data/rewards'
import { activities as initialActivities } from '@/data/activities'
import { getToday } from '@/utils/date'

interface AppState {
  user: UserInfo
  currentProject: ProjectItem | null
  currentDay: number
  tasks: TaskItem[]
  dailyRecords: DailyRecord[]
  completedTaskIds: string[]
  favorites: string[]
  userRewards: UserReward[]
  rewards: RewardItem[]
  activities: ActivityItem[]
  todayCheckIn: boolean
  lastCheckInDate: string
  setUser: (user: UserInfo) => void
  selectProject: (projectId: string) => void
  completeTask: (taskId: string) => boolean
  addEnergy: (amount: number) => void
  consumeEnergy: (amount: number) => boolean
  addDailyRecord: (record: DailyRecord) => void
  toggleFavorite: (foodId: string) => void
  addUserReward: (reward: UserReward) => void
  useReward: (rewardId: string) => void
  exchangeReward: (rewardId: string) => UserReward | null
  decrementRewardStock: (rewardId: string) => boolean
  updateActivity: (activity: ActivityItem) => void
  checkAndDoDailyCheckIn: () => boolean
  resetCheckIn: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: '1',
        nickname: '恢复星球居民',
        avatar: 'https://picsum.photos/id/64/200/200',
        currentProjectId: '1',
        energy: 520,
        checkInDays: 5,
        totalDays: 30
      },
      currentProject: getProjectById('1') || null,
      currentDay: 5,
      tasks: generateDailyTasks('1', 5),
      dailyRecords: mockDailyRecords,
      completedTaskIds: mockDailyRecords.flatMap(r => r.completedTasks),
      favorites: ['9', '10', '11', '12'],
      userRewards: userRewards,
      rewards: initialRewards,
      activities: initialActivities,
      todayCheckIn: false,
      lastCheckInDate: '',

      setUser: (user) => set({ user }),

      selectProject: (projectId) => {
        const project = getProjectById(projectId)
        if (project) {
          set({
            currentProject: project,
            currentDay: 1,
            tasks: generateDailyTasks(projectId, 1),
            user: {
              ...get().user,
              currentProjectId: projectId,
              totalDays: project.recoveryDays,
              checkInDays: 0
            }
          })
        }
      },

      completeTask: (taskId) => {
        const state = get()
        if (state.completedTaskIds.includes(taskId)) {
          console.log('[Store] 任务已完成，跳过:', taskId)
          return false
        }

        const task = state.tasks.find(t => t.id === taskId)
        if (task && task.status === 'pending') {
          const newCompletedIds = [...state.completedTaskIds, taskId]
          const newTasks = state.tasks.map(t =>
            t.id === taskId ? { ...t, status: 'completed' as const } : t
          )

          const pendingTasks = newTasks.filter(t => t.status !== 'locked' && t.status === 'pending')
          const allCompleted = pendingTasks.length === 0

          let newCheckInDays = state.user.checkInDays
          let bonusEnergy = 0
          let todayCheckIn = state.todayCheckIn

          if (allCompleted && !state.todayCheckIn) {
            bonusEnergy = 30
            newCheckInDays = state.user.checkInDays + 1
            todayCheckIn = true
            console.log('[Store] 今日任务全部完成，自动打卡成功！+30能量')
          }

          set({
            tasks: newTasks,
            completedTaskIds: newCompletedIds,
            todayCheckIn,
            lastCheckInDate: todayCheckIn ? getToday() : state.lastCheckInDate,
            user: {
              ...state.user,
              energy: state.user.energy + task.energy + bonusEnergy,
              checkInDays: newCheckInDays
            }
          })

          console.log('[Store] 任务完成:', task.title, '获得能量:', task.energy, bonusEnergy > 0 ? `+打卡奖励${bonusEnergy}` : '')
          return true
        }
        return false
      },

      checkAndDoDailyCheckIn: () => {
        const state = get()
        if (state.todayCheckIn) {
          console.log('[Store] 今日已打卡')
          return false
        }

        const pendingTasks = state.tasks.filter(t => t.status !== 'locked' && t.status === 'pending')
        if (pendingTasks.length > 0) {
          console.log('[Store] 还有未完成的任务，无法打卡')
          return false
        }

        set({
          todayCheckIn: true,
          lastCheckInDate: getToday(),
          user: {
            ...state.user,
            energy: state.user.energy + 30,
            checkInDays: state.user.checkInDays + 1
          }
        })

        console.log('[Store] 手动打卡成功！+30能量')
        return true
      },

      addEnergy: (amount) => {
        set(state => ({
          user: {
            ...state.user,
            energy: state.user.energy + amount
          }
        }))
        console.log('[Store] 能量增加:', amount)
      },

      consumeEnergy: (amount) => {
        const state = get()
        if (state.user.energy >= amount) {
          set({
            user: {
              ...state.user,
              energy: state.user.energy - amount
            }
          })
          console.log('[Store] 能量消耗:', amount)
          return true
        }
        console.log('[Store] 能量不足，无法消耗:', amount)
        return false
      },

      addDailyRecord: (record) => {
        const state = get()
        const energyBonus = 50
        set(state => ({
          dailyRecords: [record, ...state.dailyRecords],
          user: {
            ...state.user,
            energy: state.user.energy + energyBonus
          }
        }))
        console.log('[Store] 添加每日记录，获得能量:', energyBonus)
      },

      exchangeReward: (rewardId) => {
        const state = get()
        const reward = state.rewards.find(r => r.id === rewardId)
        
        if (!reward) {
          console.log('[Store] 奖励不存在:', rewardId)
          return null
        }
        
        if (reward.stock <= 0) {
          console.log('[Store] 奖励库存不足:', reward.name)
          return null
        }
        
        if (state.user.energy < reward.energyCost) {
          console.log('[Store] 能量不足，无法兑换:', reward.name)
          return null
        }

        const newUserReward: UserReward = {
          id: `ur${Date.now()}`,
          rewardId: reward.id,
          reward: { ...reward, stock: reward.stock - 1 },
          code: `HF${Date.now().toString().slice(-8).toUpperCase()}`,
          status: 'unused',
          obtainedAt: getToday()
        }

        set(state => ({
          rewards: state.rewards.map(r =>
            r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
          ),
          userRewards: [newUserReward, ...state.userRewards],
          user: {
            ...state.user,
            energy: state.user.energy - reward.energyCost
          }
        }))

        console.log('[Store] 兑换奖励成功:', reward.name, '消耗能量:', reward.energyCost)
        return newUserReward
      },

      decrementRewardStock: (rewardId) => {
        const state = get()
        const reward = state.rewards.find(r => r.id === rewardId)
        
        if (!reward || reward.stock <= 0) {
          return false
        }

        set(state => ({
          rewards: state.rewards.map(r =>
            r.id === rewardId ? { ...r, stock: r.stock - 1 } : r
          )
        }))
        return true
      },

      updateActivity: (activity) => {
        set(state => {
          const exists = state.activities.some(a => a.id === activity.id)
          return {
            activities: exists
              ? state.activities.map(a => a.id === activity.id ? activity : a)
              : [...state.activities, activity]
          }
        })
        console.log('[Store] 更新活动:', activity.title)
      },

      toggleFavorite: (foodId) => {
        set(state => {
          const isFavorite = state.favorites.includes(foodId)
          return {
            favorites: isFavorite
              ? state.favorites.filter(id => id !== foodId)
              : [...state.favorites, foodId]
          }
        })
      },

      addUserReward: (reward) => {
        set(state => ({
          userRewards: [reward, ...state.userRewards]
        }))
      },

      useReward: (rewardId) => {
        set(state => ({
          userRewards: state.userRewards.map(r =>
            r.id === rewardId ? { ...r, status: 'used' as const } : r
          )
        }))
      },

      resetCheckIn: () => {
        const state = get()
        if (state.currentProject) {
          set({
            tasks: generateDailyTasks(state.currentProject.id, state.currentDay),
            completedTaskIds: []
          })
        }
      }
    }),
    {
      name: 'recovery-planet-storage'
    }
  )
)
