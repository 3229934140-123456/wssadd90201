import React, { useMemo } from 'react'
import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { TaskItem, TaskType, TaskStatus } from '@/types'
import styles from './index.module.scss'

const getTypeLabel = (type: TaskType): string => {
  const labelMap: Record<TaskType, string> = {
    diet: '饮食',
    lifestyle: '生活方式',
    photo: '拍照',
    custom: '自定义'
  }
  return labelMap[type] || '其他'
}

const getTypeEmoji = (type: TaskType): string => {
  const emojiMap: Record<TaskType, string> = {
    diet: '🥗',
    lifestyle: '💪',
    photo: '📷',
    custom: '✨'
  }
  return emojiMap[type] || '📋'
}

const getStatusLabel = (status: TaskStatus): string => {
  const labelMap: Record<TaskStatus, string> = {
    pending: '待完成',
    completed: '已完成',
    locked: '未解锁'
  }
  return labelMap[status] || '未知'
}

const TaskDetailPage: React.FC = () => {
  const router = useRouter()
  const { tasks, completeTask } = useAppStore()

  const task = useMemo((): TaskItem | undefined => {
    const id = router.params.id
    if (!id) return undefined
    return tasks.find(t => t.id === id)
  }, [router.params.id, tasks])

  const handleCompleteTask = () => {
    if (!task || task.status !== 'pending') return

    Taro.showModal({
      title: '确认完成',
      content: `完成任务后将获得 ${task.energy} 能量，确认要完成该任务吗？`,
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          completeTask(task.id)
          Taro.showToast({
            title: `任务完成！+${task.energy}能量`,
            icon: 'success'
          })
          console.log('[TaskDetailPage] 任务完成:', task.title, '获得能量:', task.energy)
        }
      }
    })
  }

  useDidShow(() => {
    console.log('[TaskDetailPage] 页面显示，任务ID:', router.params.id)
  })

  if (!task) {
    return (
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.lockedCard}>
          <Text className={styles.lockedIcon}>❓</Text>
          <Text className={styles.lockedText}>
            任务不存在{'\n'}
            该任务可能已删除或ID无效
          </Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.header}>
        <View className={styles.taskIcon}>
          {task.icon}
        </View>
        <Text className={styles.taskTitle}>{task.title}</Text>
        <View className={classnames(styles.statusBadge, task.status)}>
          {getStatusLabel(task.status)}
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <Text>🏷️</Text>
            <Text>任务类型</Text>
          </View>
          <View className={styles.typeTags}>
            <View className={classnames(styles.typeTag, task.type)}>
              <Text>{getTypeEmoji(task.type)}</Text>
              <Text>{getTypeLabel(task.type)}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <View className={styles.sectionTitle}>
            <Text>📝</Text>
            <Text>任务描述</Text>
          </View>
          <Text className={styles.description}>
            {task.description}
          </Text>
        </View>

        <View className={styles.energyCard}>
          <View className={styles.energyInfo}>
            <Text className={styles.energyIcon}>⚡</Text>
            <View className={styles.energyText}>
              <Text className={styles.energyLabel}>完成奖励</Text>
              <Text className={styles.energyValue}>{task.energy} 能量</Text>
            </View>
          </View>
          <View className={styles.energyBadge}>
            +{task.energy}
          </View>
        </View>

        {task.tips && (
          <View className={styles.tipsCard}>
            <View className={styles.tipsTitle}>
              <Text>💡</Text>
              <Text>小贴士</Text>
            </View>
            <Text className={styles.tipsContent}>
              {task.tips}
            </Text>
          </View>
        )}

        {task.status === 'locked' && (
          <View className={styles.lockedCard}>
            <Text className={styles.lockedIcon}>🔒</Text>
            <Text className={styles.lockedText}>
              该任务尚未解锁{'\n'}
              请先完成前置任务或等待解锁条件满足
            </Text>
          </View>
        )}
      </View>

      {task.status === 'pending' && (
        <View className={styles.completeSection}>
          <Button
            className={styles.completeBtn}
            onClick={handleCompleteTask}
          >
            完成任务
          </Button>
        </View>
      )}

      {task.status === 'completed' && (
        <View className={styles.completeSection}>
          <View className={styles.completedBadge}>
            <Text>✅</Text>
            <Text>已完成</Text>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default TaskDetailPage
