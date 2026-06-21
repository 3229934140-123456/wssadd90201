import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import classnames from 'classnames'
import styles from './index.module.scss'

type TabType = 'join' | 'reward' | 'redeem' | 'stock'

interface JoinRecord {
  id: string
  userName: string
  avatar: string
  joinedAt: string
}

const ActivityDetailPage: React.FC = () => {
  const router = useRouter()
  const activityId = router.params.id || '1'
  const [activeTab, setActiveTab] = useState<TabType>('join')
  const { activities, getActivityStats, joinedActivities, userRewards, redeemRecords, rewards } = useAppStore()

  const activity = useMemo(() => {
    return activities.find(a => a.id === activityId)
  }, [activities, activityId])

  const stats = useMemo(() => {
    return getActivityStats(activityId)
  }, [getActivityStats, activityId])

  const joinRecords = useMemo<JoinRecord[]>(() => {
    const count = joinedActivities[activityId] || 0
    const records: JoinRecord[] = []
    for (let i = 0; i < Math.min(count, 10); i++) {
      records.push({
        id: `jr${i}`,
        userName: `用户${1000 + i}`,
        avatar: `https://picsum.photos/id/${64 + i}/100/100`,
        joinedAt: `2026-06-${20 - Math.floor(i / 3)} ${10 + (i % 10)}:${30 + i * 2}0`
      })
    }
    return records
  }, [joinedActivities, activityId])

  const rewardRecords = useMemo(() => {
    return userRewards.filter(r => {
      const reward = rewards.find(rw => rw.id === r.rewardId)
      return reward !== undefined
    }).slice(0, 10)
  }, [userRewards, rewards])

  const activityRedeemRecords = useMemo(() => {
    return redeemRecords.filter(r => {
      const reward = rewards.find(rw => rw.name === r.rewardName)
      return reward !== undefined
    }).slice(0, 20)
  }, [redeemRecords, rewards])

  useDidShow(() => {
    console.log('[ActivityDetailPage] 页面显示')
  })

  if (!activity) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>📭</Text>
          <Text className={styles.emptyText}>活动不存在</Text>
        </View>
      </View>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'join':
        return (
          <View className={styles.recordList}>
            {joinRecords.length > 0 ? (
              joinRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <View className={styles.recordInfo}>
                    <Text className={styles.recordTitle}>{record.userName}</Text>
                    <Text className={styles.recordMeta}>报名时间: {record.joinedAt}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>👥</Text>
                <Text className={styles.emptyText}>暂无报名记录</Text>
              </View>
            )}
          </View>
        )

      case 'reward':
        return (
          <View className={styles.recordList}>
            {rewardRecords.length > 0 ? (
              rewardRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <View className={styles.recordInfo}>
                    <Text className={styles.recordTitle}>{record.reward.name}</Text>
                    <Text className={styles.recordMeta}>
                      券码: {record.code} · 获得时间: {record.obtainedAt}
                    </Text>
                  </View>
                  <View className={classnames(styles.recordStatus, record.status === 'unused' ? 'success' : 'failed')}>
                    {record.status === 'unused' ? '待使用' : '已使用'}
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🎁</Text>
                <Text className={styles.emptyText}>暂无奖励发放记录</Text>
              </View>
            )}
          </View>
        )

      case 'redeem':
        return (
          <View className={styles.recordList}>
            {activityRedeemRecords.length > 0 ? (
              activityRedeemRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <View className={styles.recordInfo}>
                    <Text className={styles.recordTitle}>{record.rewardName}</Text>
                    <Text className={styles.recordMeta}>
                      券码: {record.code} · 核销时间: {record.redeemedAt}
                    </Text>
                    {record.failReason && (
                      <Text className={styles.recordMeta} style={{ color: '#F44336' }}>
                        失败原因: {record.failReason}
                      </Text>
                    )}
                  </View>
                  <View className={classnames(styles.recordStatus, record.status === 'success' ? 'success' : 'failed')}>
                    {record.status === 'success' ? '核销成功' : '核销失败'}
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🎫</Text>
                <Text className={styles.emptyText}>暂无核销记录</Text>
              </View>
            )}
          </View>
        )

      case 'stock':
        return (
          <View>
            {activity.rewards.length > 0 ? (
              activity.rewards.map(reward => {
                const storeReward = rewards.find(r => r.id === reward.id)
                const currentStock = storeReward ? storeReward.stock : reward.stock
                const usedCount = reward.stock - currentStock
                return (
                  <View key={reward.id} className={styles.rewardStockItem}>
                    <Text className={styles.rewardStockName}>{reward.name}</Text>
                    <View className={styles.rewardStockInfo}>
                      <View>
                        <Text className={styles.stockText}>总库存</Text>
                        <Text className={styles.stockValue}>{reward.stock}</Text>
                      </View>
                      <View>
                        <Text className={styles.stockText}>已发放</Text>
                        <Text className={styles.stockValue}>{usedCount}</Text>
                      </View>
                      <View>
                        <Text className={styles.stockText}>剩余</Text>
                        <Text className={styles.stockValue} style={{ color: currentStock > 0 ? '#4CAF50' : '#F44336' }}>
                          {currentStock}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
              })
            ) : (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>📦</Text>
                <Text className={styles.emptyText}>暂无奖励库存</Text>
              </View>
            )}
          </View>
        )

      default:
        return null
    }
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>{activity.title}</Text>
        <Text className={styles.headerSubtitle}>
          {activity.startTime.slice(5)} ~ {activity.endTime.slice(5)}
        </Text>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.joinedCount}</Text>
            <Text className={styles.statLabel}>报名人数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.remainingRewards}</Text>
            <Text className={styles.statLabel}>剩余奖励</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.redeemedCount}</Text>
            <Text className={styles.statLabel}>已核销</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.tabBar}>
          <View
            className={classnames(styles.tabItem, activeTab === 'join' && styles.active)}
            onClick={() => setActiveTab('join')}
          >
            报名记录
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'reward' && styles.active)}
            onClick={() => setActiveTab('reward')}
          >
            奖励发放
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'redeem' && styles.active)}
            onClick={() => setActiveTab('redeem')}
          >
            核销记录
          </View>
          <View
            className={classnames(styles.tabItem, activeTab === 'stock' && styles.active)}
            onClick={() => setActiveTab('stock')}
          >
            库存变化
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              {activeTab === 'join' && '👥 报名记录'}
              {activeTab === 'reward' && '🎁 奖励发放记录'}
              {activeTab === 'redeem' && '🎫 核销记录'}
              {activeTab === 'stock' && '📦 库存变化'}
            </Text>
          </View>
          {renderContent()}
        </View>
      </View>
    </ScrollView>
  )
}

export default ActivityDetailPage
