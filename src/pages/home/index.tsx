import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import PlanetHeader from '@/components/PlanetHeader'
import TaskCard from '@/components/TaskCard'
import BlindBox from '@/components/BlindBox'
import styles from './index.module.scss'

interface WeekDay {
  day: string
  date: number
  isToday: boolean
  completed: boolean
}

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { tasks, currentProject, completeTask, addEnergy, user, todayCheckIn, lastCheckInDate, checkAndResetDailyTasks } = useAppStore()

  const todayTasks = useMemo(() => {
    return tasks.filter(t => t.status !== 'locked').slice(0, 4)
  }, [tasks])

  const weekDays = useMemo<WeekDay[]>(() => {
    const days: WeekDay[] = []
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const today = new Date()
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      
      let completed = false
      if (i < 0) {
        completed = dateStr <= lastCheckInDate && user.checkInDays > 0
      } else if (i === 0) {
        completed = todayCheckIn
      }
      
      days.push({
        day: weekdays[date.getDay()],
        date: date.getDate(),
        isToday: i === 0,
        completed
      })
    }
    return days
  }, [todayCheckIn, lastCheckInDate, user.checkInDays])

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[HomePage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId)
  }

  const handleViewTaskDetail = (taskId: string) => {
    Taro.navigateTo({ url: `/pages/task-detail/index?id=${taskId}` })
  }

  const handleBlindBoxComplete = (isCorrect: boolean, energy: number) => {
    addEnergy(energy)
    console.log('[HomePage] 盲盒完成:', isCorrect, '获得能量:', energy)
  }

  useDidShow(() => {
    checkAndResetDailyTasks()
  })

  const handleGoToActivity = () => {
    Taro.navigateTo({ url: '/pages/activity/index' })
  }

  const handleQuickAction = (action: string) => {
    console.log('[HomePage] 点击快捷操作:', action)
    switch (action) {
      case 'food':
        Taro.switchTab({ url: '/pages/food/index' })
        break
      case 'challenge':
        Taro.switchTab({ url: '/pages/challenge/index' })
        break
      case 'record':
        Taro.switchTab({ url: '/pages/record/index' })
        break
      case 'activity':
        Taro.navigateTo({ url: '/pages/activity/index' })
        break
    }
  }

  useDidShow(() => {
    console.log('[HomePage] 页面显示')
  })

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          color="#FF7A9E"
        />
      }
    >
      <PlanetHeader />
      
      <View className={styles.content}>
        <View className={styles.weekProgress}>
          <Text className={styles.weekProgressTitle}>本周恢复进度</Text>
          <View className={styles.weekDays}>
            {weekDays.map((day, index) => (
              <View key={index} className={styles.weekDay}>
                <Text className={styles.weekDayLabel}>{day.day}</Text>
                <View className={`${styles.weekDayDot} ${day.isToday ? styles.today : ''} ${day.completed ? styles.completed : ''}`}>
                  {day.completed && !day.isToday ? '✓' : day.date}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.todayTasksSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionTitleText}>今日任务</Text>
            <Text 
              className={styles.sectionMore} 
              onClick={() => Taro.switchTab({ url: '/pages/challenge/index' })}
            >
              查看全部 →
            </Text>
          </View>
          
          {todayTasks.length > 0 ? (
            <View className={styles.tasksList}>
              {todayTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onViewDetail={handleViewTaskDetail}
                />
              ))}
            </View>
          ) : (
            <View className={styles.emptyTasks}>
              <Text className={styles.emptyIcon}>🎉</Text>
              <Text className={styles.emptyText}>今日任务已全部完成！</Text>
            </View>
          )}
        </View>

        <BlindBox onComplete={handleBlindBoxComplete} />

        <View className={styles.activityBanner}>
          <View className={styles.bannerCard} onClick={handleGoToActivity}>
            <Text className={styles.bannerIcon}>🎊</Text>
            <View className={styles.bannerContent}>
              <Text className={styles.bannerTitle}>7天恢复挑战赛</Text>
              <Text className={styles.bannerDesc}>连续打卡赢双倍能量奖励</Text>
            </View>
            <Text className={styles.bannerArrow}>→</Text>
          </View>
        </View>

        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>快捷入口</Text>
        </View>
        
        <View className={styles.quickActions}>
          <View className={styles.actionItem} onClick={() => handleQuickAction('food')}>
            <Text className={styles.actionIcon}>🍎</Text>
            <Text className={styles.actionLabel}>食物查询</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('challenge')}>
            <Text className={styles.actionIcon}>🎯</Text>
            <Text className={styles.actionLabel}>每日挑战</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('record')}>
            <Text className={styles.actionIcon}>📸</Text>
            <Text className={styles.actionLabel}>拍照记录</Text>
          </View>
          <View className={styles.actionItem} onClick={() => handleQuickAction('activity')}>
            <Text className={styles.actionIcon}>🎁</Text>
            <Text className={styles.actionLabel}>门店活动</Text>
          </View>
        </View>

        {currentProject && (
          <View className={styles.forbiddenList}>
            <View className={styles.forbiddenTitle}>
              <Text className={styles.forbiddenIcon}>🚫</Text>
              <Text className={styles.forbiddenTitleText}>本期忌口清单</Text>
            </View>
            <View className={styles.forbiddenTags}>
              {currentProject.forbiddenFoods.map((food, index) => (
                <Text key={index} className={styles.forbiddenTag}>{food}</Text>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default HomePage
