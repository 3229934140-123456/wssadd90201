import React, { useState } from 'react'
import { View, Text, ScrollView, RefreshControl, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { ActivityItem } from '@/types'
import classnames from 'classnames'
import styles from './index.module.scss'

const ActivityPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [joinedActivities, setJoinedActivities] = useState<string[]>(['1'])
  const { activities } = useAppStore()

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[ActivityPage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleToggleExpand = (activityId: string) => {
    setExpandedId(expandedId === activityId ? null : activityId)
  }

  const handleJoinActivity = (activity: ActivityItem) => {
    if (joinedActivities.includes(activity.id)) {
      Taro.showToast({ title: '您已参加该活动', icon: 'none' })
      return
    }

    Taro.showModal({
      title: '确认参加',
      content: `确定要参加「${activity.title}」活动吗？`,
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          setJoinedActivities([...joinedActivities, activity.id])
          Taro.showToast({ title: '参加成功！', icon: 'success' })
          console.log('[ActivityPage] 参加活动:', activity.title)
        }
      }
    })
  }

  const getActivityIcon = (title: string) => {
    if (title.includes('挑战')) return '🏆'
    if (title.includes('美食')) return '🍽️'
    if (title.includes('日记')) return '📔'
    if (title.includes('闺蜜')) return '👯'
    return '🎉'
  }

  const getActivityStatus = (activity: ActivityItem) => {
    const now = new Date()
    const start = new Date(activity.startTime)
    const end = new Date(activity.endTime)

    if (now < start) return { label: '即将开始', progress: 0 }
    if (now > end) return { label: '已结束', progress: 100 }

    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    const progress = Math.min(100, Math.round((elapsed / total) * 100))

    return { label: '进行中', progress }
  }

  const getRewardIcon = (name: string) => {
    if (name.includes('能量')) return '⚡'
    if (name.includes('面膜') || name.includes('精华')) return '🧴'
    if (name.includes('护理') || name.includes('项目')) return '💆'
    if (name.includes('双人')) return '👯'
    return '🎁'
  }

  useDidShow(() => {
    console.log('[ActivityPage] 页面显示')
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
      <View className={styles.pageHeader}>
        <View className={styles.headerRow}>
          <View>
            <Text className={styles.pageTitle}>🎊 精彩活动</Text>
            <Text className={styles.pageDesc}>参与活动，赢取更多奖励</Text>
          </View>
          <View 
            className={styles.adminBtn}
            onClick={() => Taro.navigateTo({ url: '/pages/activity-manage/index' })}
          >
            <Text>⚙️</Text>
            <Text>门店管理</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        {activities.length > 0 ? (
          <View className={styles.activityList}>
            {activities.map(activity => {
              const status = getActivityStatus(activity)
              const isExpanded = expandedId === activity.id
              const isJoined = joinedActivities.includes(activity.id)

              return (
                <View
                  key={activity.id}
                  className={classnames(styles.activityCard, isExpanded && styles.expanded)}
                >
                  <View className={styles.statusBar}>
                    <View
                      className={styles.statusProgress}
                      style={{ width: `${status.progress}%` }}
                    />
                  </View>

                  <View className={styles.activityImage}>
                    <Text>{getActivityIcon(activity.title)}</Text>
                    <View className={styles.activityTag}>
                      {isJoined ? '✅ 已参加' : status.label}
                    </View>
                    <View className={styles.activityTime}>
                      {activity.startTime.slice(5)} ~ {activity.endTime.slice(5)}
                    </View>
                  </View>

                  <View className={styles.activityBody}>
                    <Text className={styles.activityTitle}>{activity.title}</Text>
                    <Text className={styles.activityDesc}>{activity.description}</Text>

                    <View className={styles.activityFooter}>
                      <View className={styles.activityStats}>
                        <View className={styles.statItem}>
                          <Text>👥</Text>
                          <Text>{Math.floor(Math.random() * 500) + 100}人参与</Text>
                        </View>
                        <View className={styles.statItem}>
                          <Text>⏰</Text>
                          <Text>剩余{Math.ceil((new Date(activity.endTime).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}天</Text>
                        </View>
                      </View>

                      <View
                        className={styles.expandBtn}
                        onClick={() => handleToggleExpand(activity.id)}
                      >
                        <Text>{isExpanded ? '收起' : '查看详情'}</Text>
                        <Text className={classnames(styles.arrow, isExpanded && styles.expanded)}>
                          ▼
                        </Text>
                      </View>
                    </View>
                  </View>

                  {isExpanded && (
                    <View className={styles.expandedContent}>
                      <View className={styles.sectionTitle}>
                        <Text>📋</Text>
                        <Text>活动规则</Text>
                      </View>

                      <View className={styles.rulesList}>
                        {activity.rules.map((rule, index) => (
                          <View key={index} className={styles.ruleItem}>
                            <View className={styles.ruleIndex}>{index + 1}</View>
                            <Text>{rule}</Text>
                          </View>
                        ))}
                      </View>

                      <View className={styles.sectionTitle}>
                        <Text>🎁</Text>
                        <Text>活动奖励</Text>
                      </View>

                      <View className={styles.rewardsGrid}>
                        {activity.rewards.map(reward => (
                          <View key={reward.id} className={styles.rewardItem}>
                            <Text className={styles.rewardIcon}>
                              {getRewardIcon(reward.name)}
                            </Text>
                            <Text className={styles.rewardName}>{reward.name}</Text>
                            <Text className={styles.rewardStock}>剩余{reward.stock}份</Text>
                          </View>
                        ))}
                      </View>

                      <View
                        className={styles.joinBtn}
                        onClick={() => handleJoinActivity(activity)}
                      >
                        {isJoined ? '✅ 已参加活动' : '🎉 立即参加'}
                      </View>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>
              暂无活动，敬请期待~{'\n'}
              有新活动时会第一时间通知您
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default ActivityPage
