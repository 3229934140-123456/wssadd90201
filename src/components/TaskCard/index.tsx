import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { TaskItem } from '@/types'
import styles from './index.module.scss'

interface TaskCardProps {
  task: TaskItem
  onComplete?: (taskId: string) => void
  onViewDetail?: (taskId: string) => void
}

const typeConfig = {
  diet: { label: '饮食', color: '#FF7A9E', bgColor: 'rgba(255, 122, 158, 0.1)' },
  lifestyle: { label: '生活', color: '#7C6BFF', bgColor: 'rgba(124, 107, 255, 0.1)' },
  photo: { label: '记录', color: '#00B578', bgColor: 'rgba(0, 181, 120, 0.1)' },
  custom: { label: '其他', color: '#FFAA00', bgColor: 'rgba(255, 170, 0, 0.1)' }
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onViewDetail }) => {
  const config = typeConfig[task.type]

  const handleComplete = () => {
    if (task.status === 'pending' && onComplete) {
      onComplete(task.id)
      Taro.showToast({
        title: `+${task.energy} 能量`,
        icon: 'none',
        duration: 1500
      })
    }
  }

  const handleClick = () => {
    if (onViewDetail) {
      onViewDetail(task.id)
    }
  }

  return (
    <View 
      className={classnames(styles.card, task.status === 'completed' && styles.completed, task.status === 'locked' && styles.locked)}
      onClick={handleClick}
    >
      <View className={styles.header}>
        <View className={styles.icon}>{task.icon}</View>
        <View className={styles.info}>
          <View className={styles.titleRow}>
            <Text className={styles.title}>{task.title}</Text>
            <View 
              className={styles.typeTag} 
              style={{ backgroundColor: config.bgColor, color: config.color }}
            >
              {config.label}
            </View>
          </View>
          <Text className={styles.description}>{task.description}</Text>
        </View>
      </View>
      
      <View className={styles.footer}>
        <View className={styles.energy}>
          <Text className={styles.energyIcon}>⚡</Text>
          <Text className={styles.energyText}>+{task.energy}</Text>
        </View>
        
        {task.status === 'pending' && (
          <Button 
            className={styles.completeBtn} 
            onClick={handleComplete}
          >
            完成打卡
          </Button>
        )}
        
        {task.status === 'completed' && (
          <View className={styles.completedTag}>
            <Text className={styles.checkIcon}>✓</Text>
            <Text className={styles.completedText}>已完成</Text>
          </View>
        )}
        
        {task.status === 'locked' && (
          <View className={styles.lockedTag}>
            <Text className={styles.lockIcon}>🔒</Text>
            <Text className={styles.lockedText}>第{task.day}天解锁</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TaskCard
