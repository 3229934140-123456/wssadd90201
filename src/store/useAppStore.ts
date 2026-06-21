import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo, ProjectItem, TaskItem, DailyRecord, RewardItem, UserReward, ActivityItem, RedeemRecord, ShareMealHistory } from '@/types'
import { getProjectById } from '@/data/projects'
import { generateDailyTasks } from '@/data/tasks'
import { mockDailyRecords } from '@/data/moods'
import { userRewards, rewards as initialRewards } from '@/data/rewards'
import { activities as initialActivities } from '@/data/activities'
import { getToday } from '@/utils/date'
import dayjs from 'dayjs'

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
  currentDate: string
  joinedActivities: Record<string, number>
  userJoinedActivities: string[]
  redeemedRewards: Record<string, number>
  redeemRecords: RedeemRecord[]
  shareMealHistories: ShareMealHistory[]
  dailyTaskHistory: Record<string, { tasks: TaskItem[], checkIn: boolean }>
  setUser: (user: UserInfo) => void
  selectProject: (projectId: string) => void
  completeTask: (taskId: string) => boolean
  addEnergy: (amount: number) => void
  consumeEnergy: (amount: number) => boolean
  addDailyRecord: (record: DailyRecord) => void
  toggleFavorite: (foodId: string) => void
  addUserReward: (reward: UserReward) => void
  useReward: (rewardId: string) => boolean
  exchangeReward: (rewardId: string) => UserReward | null
  decrementRewardStock: (rewardId: string) => boolean
  updateActivity: (activity: ActivityItem) => void
  checkAndDoDailyCheckIn: () => boolean
  resetCheckIn: () => void
  checkAndResetDailyTasks: () => void
  verifyRewardCode: (code: string) => UserReward | null
  redeemRewardByCode: (code: string) => UserReward | null
  getActivityStats: (activityId: string) => {
    joinedCount: number
    totalRewards: number
    remainingRewards: number
    redeemedCount: number
  }
  joinActivity: (activityId: string) => { success: boolean; duplicated?: boolean }
  addRedeemRecord: (record: RedeemRecord) => void
  getRedeemRecords: () => RedeemRecord[]
  addShareMealHistory: (history: ShareMealHistory) => void
  getShareMealHistories: () => ShareMealHistory[]
  getTaskHistoryByDate: (date: string) => { tasks: TaskItem[], checkIn: boolean } | null
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
      currentDate: getToday(),
      joinedActivities: { '1': 156, '2': 89, '3': 234, '4': 67 },
      userJoinedActivities: ['1'],
      redeemedRewards: { 'HF202601002': 1 },
      redeemRecords: [
        {
          id: 'rr1',
          code: 'HF202601002',
          rewardName: '免费面部护理一次',
          status: 'success',
          redeemedAt: '2026-06-20 14:30',
          operator: '门店店员A'
        }
      ],
      shareMealHistories: [],
      dailyTaskHistory: {},

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
          reward: { 
            ...reward, 
            stock: reward.stock - 1,
            expiryDate: reward.expiryDate || dayjs().add(30, 'day').format('YYYY-MM-DD')
          },
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
        const state = get()
        const reward = state.userRewards.find(r => r.id === rewardId)
        if (!reward || reward.status !== 'unused') {
          return false
        }
        set(state => ({
          userRewards: state.userRewards.map(r =>
            r.id === rewardId ? { ...r, status: 'used' as const } : r
          ),
          redeemedRewards: {
            ...state.redeemedRewards,
            [reward.code]: (state.redeemedRewards[reward.code] || 0) + 1
          }
        }))
        console.log('[Store] 使用奖励:', reward.reward.name)
        return true
      },

      resetCheckIn: () => {
        const state = get()
        if (state.currentProject) {
          set({
            tasks: generateDailyTasks(state.currentProject.id, state.currentDay),
            completedTaskIds: []
          })
        }
      },

      checkAndResetDailyTasks: () => {
        const state = get()
        const today = getToday()
        
        if (state.currentDate !== today && state.currentProject) {
          const newDay = state.currentDay + 1
          const maxDay = state.currentProject.recoveryDays
          const actualDay = Math.min(newDay, maxDay)
          
          console.log('[Store] 日期变更，重置任务:', state.currentDate, '→', today, '第', actualDay, '天')
          
          const historyDate = state.currentDate
          const historyTasks = [...state.tasks]
          const historyCheckIn = state.todayCheckIn
          
          set(state => ({
            currentDate: today,
            currentDay: actualDay,
            tasks: generateDailyTasks(state.currentProject!.id, actualDay),
            completedTaskIds: [],
            todayCheckIn: false,
            dailyTaskHistory: {
              ...state.dailyTaskHistory,
              [historyDate]: {
                tasks: historyTasks,
                checkIn: historyCheckIn
              }
            }
          }))
        }
      },

      verifyRewardCode: (code) => {
        const state = get()
        const upperCode = code.toUpperCase().trim()
        const userReward = state.userRewards.find(r => r.code === upperCode)
        
        if (!userReward) {
          console.log('[Store] 券码不存在:', code)
          return null
        }
        
        return userReward
      },

      redeemRewardByCode: (code) => {
        const state = get()
        const upperCode = code.toUpperCase().trim()
        const userReward = state.userRewards.find(r => r.code === upperCode)
        
        const now = dayjs().format('YYYY-MM-DD HH:mm')
        
        if (!userReward) {
          console.log('[Store] 核销失败：券码不存在:', code)
          const failRecord: RedeemRecord = {
            id: `rr${Date.now()}`,
            code: upperCode,
            rewardName: '未知奖励',
            status: 'failed',
            failReason: '券码不存在',
            redeemedAt: now,
            operator: '门店店员'
          }
          set(state => ({
            redeemRecords: [failRecord, ...state.redeemRecords]
          }))
          return null
        }
        
        if (userReward.status === 'used') {
          console.log('[Store] 核销失败：券码已使用:', code)
          const failRecord: RedeemRecord = {
            id: `rr${Date.now()}`,
            code: upperCode,
            rewardName: userReward.reward.name,
            status: 'failed',
            failReason: '该券已使用',
            redeemedAt: now,
            operator: '门店店员'
          }
          set(state => ({
            redeemRecords: [failRecord, ...state.redeemRecords]
          }))
          return { ...userReward, status: 'used' as const }
        }
        
        if (userReward.status === 'expired') {
          console.log('[Store] 核销失败：券码已过期:', code)
          const failRecord: RedeemRecord = {
            id: `rr${Date.now()}`,
            code: upperCode,
            rewardName: userReward.reward.name,
            status: 'failed',
            failReason: '该券已过期',
            redeemedAt: now,
            operator: '门店店员'
          }
          set(state => ({
            redeemRecords: [failRecord, ...state.redeemRecords]
          }))
          return { ...userReward, status: 'expired' as const }
        }
        
        const successRecord: RedeemRecord = {
          id: `rr${Date.now()}`,
          code: upperCode,
          rewardName: userReward.reward.name,
          status: 'success',
          redeemedAt: now,
          operator: '门店店员'
        }
        
        set(state => ({
          userRewards: state.userRewards.map(r =>
            r.id === userReward.id ? { ...r, status: 'used' as const } : r
          ),
          redeemedRewards: {
            ...state.redeemedRewards,
            [upperCode]: (state.redeemedRewards[upperCode] || 0) + 1
          },
          redeemRecords: [successRecord, ...state.redeemRecords]
        }))
        
        console.log('[Store] 核销成功:', userReward.reward.name, '券码:', upperCode)
        return { ...userReward, status: 'used' as const }
      },

      getActivityStats: (activityId) => {
        const state = get()
        const activity = state.activities.find(a => a.id === activityId)
        
        if (!activity) {
          return { joinedCount: 0, totalRewards: 0, remainingRewards: 0, redeemedCount: 0 }
        }
        
        const totalRewards = activity.rewards.reduce((sum, r) => sum + r.stock, 0)
        const remainingRewards = activity.rewards.reduce((sum, r) => {
          const storeReward = state.rewards.find(sr => sr.id === r.id)
          return sum + (storeReward ? storeReward.stock : r.stock)
        }, 0)
        
        const redeemedCount = Object.values(state.redeemedRewards).reduce((sum, count) => sum + count, 0)
        
        return {
          joinedCount: state.joinedActivities[activityId] || 0,
          totalRewards,
          remainingRewards,
          redeemedCount
        }
      },

      joinActivity: (activityId) => {
        const state = get()
        const activity = state.activities.find(a => a.id === activityId)
        
        if (!activity) return { success: false }
        if (state.userJoinedActivities.includes(activityId)) {
          console.log('[Store] 重复报名活动:', activity.title)
          return { success: false, duplicated: true }
        }
        
        set(state => ({
          joinedActivities: {
            ...state.joinedActivities,
            [activityId]: (state.joinedActivities[activityId] || 0) + 1
          },
          userJoinedActivities: [...state.userJoinedActivities, activityId]
        }))
        
        console.log('[Store] 参加活动:', activity.title)
        return { success: true }
      },

      addRedeemRecord: (record) => {
        set(state => ({
          redeemRecords: [record, ...state.redeemRecords]
        }))
        console.log('[Store] 添加核销记录:', record.code)
      },

      getRedeemRecords: () => {
        return get().redeemRecords
      },

      addShareMealHistory: (history) => {
        set(state => ({
          shareMealHistories: [history, ...state.shareMealHistories]
        }))
        console.log('[Store] 添加分享餐单历史:', history.date)
      },

      getShareMealHistories: () => {
        return get().shareMealHistories
      },

      getTaskHistoryByDate: (date) => {
        const state = get()
        if (date === getToday()) {
          return {
            tasks: state.tasks,
            checkIn: state.todayCheckIn
          }
        }
        return state.dailyTaskHistory[date] || null
      }
    }),
    {
      name: 'recovery-planet-storage'
    }
  )
)
