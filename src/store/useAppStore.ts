import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserInfo, ProjectItem, TaskItem, DailyRecord, FoodItem, RewardItem, UserReward } from '@/types'
import { getProjectById } from '@/data/projects'
import { generateDailyTasks } from '@/data/tasks'
import { mockDailyRecords } from '@/data/moods'
import { userRewards } from '@/data/rewards'

interface AppState {
  user: UserInfo
  currentProject: ProjectItem | null
  currentDay: number
  tasks: TaskItem[]
  dailyRecords: DailyRecord[]
  completedTaskIds: string[]
  favorites: string[]
  userRewards: UserReward[]
  setUser: (user: UserInfo) => void
  selectProject: (projectId: string) => void
  completeTask: (taskId: string) => void
  addEnergy: (amount: number) => void
  consumeEnergy: (amount: number) => boolean
  addDailyRecord: (record: DailyRecord) => void
  toggleFavorite: (foodId: string) => void
  addUserReward: (reward: UserReward) => void
  useReward: (rewardId: string) => void
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
        if (state.completedTaskIds.includes(taskId)) return

        const task = state.tasks.find(t => t.id === taskId)
        if (task && task.status === 'pending') {
          const newCompletedIds = [...state.completedTaskIds, taskId]
          const newTasks = state.tasks.map(t =>
            t.id === taskId ? { ...t, status: 'completed' as const } : t
          )

          set({
            tasks: newTasks,
            completedTaskIds: newCompletedIds,
            user: {
              ...state.user,
              energy: state.user.energy + task.energy,
              checkInDays: state.user.checkInDays
            }
          })

          console.log('[Store] 任务完成:', task.title, '获得能量:', task.energy)
        }
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
        set(state => ({
          dailyRecords: [record, ...state.dailyRecords]
        }))
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
