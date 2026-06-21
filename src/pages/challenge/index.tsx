import React, { useState, useMemo } from 'react'
import { View, Text, Button, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { generateSupervisorCode, getShareText } from '@/utils/share'
import TaskCard from '@/components/TaskCard'
import BlindBox from '@/components/BlindBox'
import { getToday } from '@/utils/date'
import dayjs from 'dayjs'
import styles from './index.module.scss'

type TaskTab = 'all' | 'pending' | 'completed'

const ChallengePage: React.FC = () => {
  const [tab, setTab] = useState<TaskTab>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [supervisorCode, setSupervisorCode] = useState('HF8X2K9M')
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(getToday())
  const [calendarMonth, setCalendarMonth] = useState(dayjs())
  const { tasks, user, completeTask, addEnergy, currentProject, todayCheckIn, checkAndDoDailyCheckIn, checkAndResetDailyTasks, getTaskHistoryByDate } = useAppStore()

  const currentDayTasks = useMemo(() => tasks.filter(t => t.status !== 'locked'), [tasks])

  const selectedDayData = useMemo(() => {
    return getTaskHistoryByDate(selectedDate)
  }, [getTaskHistoryByDate, selectedDate])

  const isToday = selectedDate === getToday()

  const displayTasks = useMemo(() => {
    if (isToday || !selectedDayData) {
      return currentDayTasks
    }
    return selectedDayData.tasks.filter(t => t.status !== 'locked')
  }, [isToday, selectedDayData, currentDayTasks])

  const displayCompleted = useMemo(() => {
    return displayTasks.filter(t => t.status === 'completed').length
  }, [displayTasks])

  const displayPending = useMemo(() => {
    return displayTasks.filter(t => t.status === 'pending').length
  }, [displayTasks])

  const displayCheckIn = useMemo(() => {
    if (isToday) {
      return todayCheckIn
    }
    return selectedDayData?.checkIn || false
  }, [isToday, todayCheckIn, selectedDayData])

  const filteredTasks = useMemo(() => {
    switch (tab) {
      case 'pending':
        return displayTasks.filter(t => t.status === 'pending')
      case 'completed':
        return displayTasks.filter(t => t.status === 'completed')
      default:
        return displayTasks
    }
  }, [displayTasks, tab])

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[ChallengePage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleCompleteTask = (taskId: string) => {
    if (!isToday) {
      Taro.showToast({ title: '只能完成今日任务哦~', icon: 'none' })
      return
    }
    const success = completeTask(taskId)
    if (success) {
      const state = useAppStore.getState()
      const completedCount = state.tasks.filter(t => t.status === 'completed').length
      const totalUnlocked = state.tasks.filter(t => t.status !== 'locked').length
      
      if (completedCount === totalUnlocked) {
        Taro.showToast({ 
          title: '太棒了！今日任务全部完成，自动打卡+30能量', 
          icon: 'none',
          duration: 2500
        })
      }
    }
  }

  const handleViewTaskDetail = (taskId: string) => {
    Taro.navigateTo({ url: `/pages/task-detail/index?id=${taskId}` })
  }

  const handleBlindBoxComplete = (_isCorrect: boolean, energy: number) => {
    addEnergy(energy)
  }

  const handleGenerateCode = () => {
    const code = generateSupervisorCode(user.id)
    setSupervisorCode(code)
    Taro.showToast({ title: '监督码已刷新', icon: 'none' })
  }

  const handleCopyCode = () => {
    Taro.setClipboardData({
      data: supervisorCode,
      success: () => {
        Taro.showToast({ title: '已复制监督码', icon: 'none' })
      }
    })
  }

  const handleShare = () => {
    if (currentProject) {
      getShareText({
        projectName: currentProject.name,
        day: 5,
        checkInDays: user.checkInDays
      })
      Taro.showShareMenu({ withShareTicket: true })
      Taro.showToast({ title: '点击右上角分享', icon: 'none' })
    }
  }

  const handleCheckIn = () => {
    if (!isToday) {
      Taro.showToast({ title: '只能进行今日打卡哦~', icon: 'none' })
      return
    }
    if (displayCheckIn) {
      Taro.showToast({ title: '今日已完成打卡', icon: 'success' })
      return
    }
    if (displayPending > 0) {
      Taro.showToast({ title: '请先完成所有今日任务', icon: 'none' })
      return
    }
    
    const success = checkAndDoDailyCheckIn()
    if (success) {
      Taro.showToast({ title: '打卡成功！+30能量', icon: 'success' })
    }
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowCalendar(false)
    setTab('all')
  }

  const prevMonth = () => {
    setCalendarMonth(calendarMonth.subtract(1, 'month'))
  }

  const nextMonth = () => {
    setCalendarMonth(calendarMonth.add(1, 'month'))
  }

  const calendarDays = useMemo(() => {
    const startOfMonth = calendarMonth.startOf('month')
    const startDay = startOfMonth.day()
    
    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; isToday: boolean; hasRecord: boolean; checkIn: boolean }> = []
    
    const startDate = startOfMonth.subtract(startDay, 'day')
    for (let i = 0; i < 42; i++) {
      const date = startDate.add(i, 'day')
      const dateStr = date.format('YYYY-MM-DD')
      const isCurrentMonth = date.month() === calendarMonth.month()
      const isToday = dateStr === getToday()
      const historyData = getTaskHistoryByDate(dateStr)
      const hasRecord = !!historyData
      const checkIn = historyData?.checkIn || false
      
      days.push({
        date: dateStr,
        day: date.date(),
        isCurrentMonth,
        isToday,
        hasRecord: hasRecord || isToday,
        checkIn: isToday ? todayCheckIn : checkIn
      })
    }
    
    return days
  }, [calendarMonth, getTaskHistoryByDate, todayCheckIn])

  useDidShow(() => {
    console.log('[ChallengePage] 页面显示')
    checkAndResetDailyTasks()
  })

  const taskTabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'pending' as const, label: '待完成' },
    { key: 'completed' as const, label: '已完成' }
  ]

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

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
      <View className={styles.header}>
        <View className={styles.dateSelector} onClick={() => setShowCalendar(!showCalendar)}>
          <Text className={styles.dateText}>
            {isToday ? '📅 今日任务' : `📅 ${selectedDate} 任务记录`}
          </Text>
          <Text className={styles.dateArrow}>{showCalendar ? '▲' : '▼'}</Text>
        </View>

        {showCalendar && (
          <View className={styles.calendarCard}>
            <View className={styles.calendarHeader}>
              <View className={styles.calendarNav} onClick={prevMonth}>
                ‹
              </View>
              <Text className={styles.calendarMonth}>
                {calendarMonth.format('YYYY年 MM月')}
              </Text>
              <View className={styles.calendarNav} onClick={nextMonth}>
                ›
              </View>
            </View>
            
            <View className={styles.weekDays}>
              {weekDays.map((day, index) => (
                <View key={index} className={styles.weekDay}>
                  {day}
                </View>
              ))}
            </View>
            
            <View className={styles.calendarDays}>
              {calendarDays.map((day, index) => (
                <View
                  key={index}
                  className={classnames(
                    styles.calendarDay,
                    !day.isCurrentMonth && styles.otherMonth,
                    day.isToday && styles.today,
                    day.date === selectedDate && styles.selected,
                    day.checkIn && styles.checkedIn
                  )}
                  onClick={() => day.hasRecord && handleDateSelect(day.date)}
                >
                  <Text className={styles.calendarDayText}>{day.day}</Text>
                  {day.checkIn && <View className={styles.checkInDot} />}
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.checkInStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.checkInDays}</Text>
            <Text className={styles.statLabel}>连续打卡</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{displayCompleted}</Text>
            <Text className={styles.statLabel}>{isToday ? '今日完成' : '当日完成'}</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.totalDays}</Text>
            <Text className={styles.statLabel}>总恢复天数</Text>
          </View>
        </View>

        <View className={styles.energyCard}>
          <View className={styles.energyInfo}>
            <Text className={styles.energyIcon}>⚡</Text>
            <View className={styles.energyText}>
              <Text className={styles.energyValue}>{user.energy}</Text>
              <Text className={styles.energyLabel}>恢复能量</Text>
            </View>
          </View>
          <Button
            className={classnames(styles.checkInBtn, (displayPending === 0 || displayCheckIn) && styles.checked)}
            onClick={handleCheckIn}
          >
            {displayCheckIn ? '已完成打卡' : isToday ? '一键打卡' : '历史记录'}
          </Button>
        </View>
      </View>

      <View className={styles.supervisorSection}>
        <View className={styles.supervisorHeader}>
          <View className={styles.supervisorTitle}>
            <Text>👭</Text>
            <Text>好友监督</Text>
          </View>
          <Button className={styles.codeBtn} onClick={handleShare}>
            邀请监督
          </Button>
        </View>
        <View className={styles.supervisorCode}>
          <Text className={styles.codeText}>{supervisorCode}</Text>
          <View className={styles.codeActions}>
            <Button className={styles.codeBtn} onClick={handleGenerateCode}>
              刷新
            </Button>
            <Button className={styles.codeBtn} onClick={handleCopyCode}>
              复制
            </Button>
          </View>
        </View>
      </View>

      <View className={styles.blindBoxSection}>
        <BlindBox onComplete={handleBlindBoxComplete} />
      </View>

      <View className={styles.sectionTitle}>
        <Text className={styles.sectionTitleText}>
          {isToday ? '今日任务' : `${selectedDate} 任务`}
        </Text>
        <View className={styles.completedCount}>
          <Text className={styles.completedNum}>{displayCompleted}</Text>
          <Text>/ {displayTasks.length}</Text>
        </View>
      </View>

      <View className={styles.taskTabs}>
        {taskTabs.map(t => (
          <View
            key={t.key}
            className={classnames(styles.taskTab, tab === t.key && styles.active)}
            onClick={() => setTab(t.key)}
          >
            <Text>{t.label}</Text>
            {t.key === 'pending' && displayPending > 0 && (
              <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>({displayPending})</Text>
            )}
          </View>
        ))}
      </View>

      {filteredTasks.length > 0 ? (
        <View className={styles.tasksList}>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onViewDetail={handleViewTaskDetail}
              disabled={!isToday}
            />
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>
            {tab === 'pending' ? '🎉' : tab === 'completed' ? '📋' : '📝'}
          </Text>
          <Text className={styles.emptyTitle}>
            {tab === 'pending' ? (isToday ? '太棒了！今日任务已全部完成' : '当日任务已全部完成') : 
             tab === 'completed' ? '还没有完成任何任务' : '暂无任务'}
          </Text>
          <Text className={styles.emptyDesc}>
            {tab === 'pending' ? '继续保持哦~' : '去完成一些任务吧'}
          </Text>
        </View>
      )}

      {!isToday && (
        <View className={styles.historyTip}>
          <Text className={styles.historyTipText}>
            💡 这是历史任务记录，仅支持查看
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default ChallengePage
