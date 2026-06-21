import React, { useState, useMemo } from 'react'
import { View, Text, Button, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { generateSupervisorCode, getShareText } from '@/utils/share'
import TaskCard from '@/components/TaskCard'
import BlindBox from '@/components/BlindBox'
import styles from './index.module.scss'

type TaskTab = 'all' | 'pending' | 'completed'

const ChallengePage: React.FC = () => {
  const [tab, setTab] = useState<TaskTab>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [supervisorCode, setSupervisorCode] = useState('HF8X2K9M')
  const { tasks, user, completeTask, addEnergy, currentProject } = useAppStore()

  const filteredTasks = useMemo(() => {
    switch (tab) {
      case 'pending':
        return tasks.filter(t => t.status === 'pending')
      case 'completed':
        return tasks.filter(t => t.status === 'completed')
      default:
        return tasks.filter(t => t.status !== 'locked')
    }
  }, [tasks, tab])

  const pendingCount = useMemo(() => 
    tasks.filter(t => t.status === 'pending').length
  , [tasks])

  const completedCount = useMemo(() => 
    tasks.filter(t => t.status === 'completed').length
  , [tasks])

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[ChallengePage] 下拉刷新')
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
      const shareText = getShareText({
        projectName: currentProject.name,
        day: 5,
        checkInDays: user.checkInDays
      })
      Taro.showShareMenu({ withShareTicket: true })
      Taro.showToast({ title: '点击右上角分享', icon: 'none' })
    }
  }

  const handleCheckIn = () => {
    if (pendingCount === 0) {
      Taro.showToast({ title: '今日已全部打卡！', icon: 'none' })
      return
    }
    Taro.showToast({ title: '请先完成下方任务', icon: 'none' })
  }

  useDidShow(() => {
    console.log('[ChallengePage] 页面显示')
  })

  const taskTabs = [
    { key: 'all' as const, label: '全部' },
    { key: 'pending' as const, label: '待完成' },
    { key: 'completed' as const, label: '已完成' }
  ]

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
        <View className={styles.checkInStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.checkInDays}</Text>
            <Text className={styles.statLabel}>连续打卡</Text>
          </View>
          <View className={styles.statDivider} />
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{completedCount}</Text>
            <Text className={styles.statLabel}>今日完成</Text>
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
            className={classnames(styles.checkInBtn, pendingCount === 0 && styles.checked)}
            onClick={handleCheckIn}
          >
            {pendingCount === 0 ? '已完成今日打卡' : '一键打卡'}
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
        <Text className={styles.sectionTitleText}>每日任务</Text>
        <View className={styles.completedCount}>
          <Text className={styles.completedNum}>{completedCount}</Text>
          <Text>/ {tasks.filter(t => t.status !== 'locked').length}</Text>
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
            {t.key === 'pending' && pendingCount > 0 && (
              <Text style={{ marginLeft: '8rpx', fontSize: '20rpx' }}>({pendingCount})</Text>
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
            />
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>
            {tab === 'pending' ? '🎉' : tab === 'completed' ? '📋' : '📝'}
          </Text>
          <Text className={styles.emptyTitle}>
            {tab === 'pending' ? '太棒了！今日任务已全部完成' : 
             tab === 'completed' ? '还没有完成任何任务' : '暂无任务'}
          </Text>
          <Text className={styles.emptyDesc}>
            {tab === 'pending' ? '继续保持哦~' : '去完成一些任务吧'}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default ChallengePage
