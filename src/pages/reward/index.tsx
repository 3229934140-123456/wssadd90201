import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { RewardItem } from '@/types'
import classnames from 'classnames'
import dayjs from 'dayjs'
import styles from './index.module.scss'

type TabType = 'exchange' | 'my'

const RewardPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('exchange')
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null)
  const { user, userRewards, rewards, exchangeReward, useReward } = useAppStore()

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[RewardPage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleExchangeClick = (reward: RewardItem) => {
    if (user.energy < reward.energyCost) {
      Taro.showToast({ title: '能量不足，继续加油哦~', icon: 'none' })
      return
    }
    if (reward.stock <= 0) {
      Taro.showToast({ title: '该奖励已兑换完毕', icon: 'none' })
      return
    }
    setSelectedReward(reward)
    setShowExchangeModal(true)
  }

  const handleConfirmExchange = () => {
    if (!selectedReward) return

    const userReward = exchangeReward(selectedReward.id)
    if (userReward) {
      Taro.showToast({ title: '兑换成功！', icon: 'success' })
      console.log('[RewardPage] 兑换成功:', selectedReward.name)
    } else {
      Taro.showToast({ title: '兑换失败，请重试', icon: 'none' })
    }
    setShowExchangeModal(false)
    setSelectedReward(null)
  }

  const handleCancelExchange = () => {
    setShowExchangeModal(false)
    setSelectedReward(null)
  }

  const handleUseReward = (rewardId: string) => {
    Taro.showModal({
      title: '确认使用',
      content: '使用后将无法恢复，确认要使用该奖励吗？',
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          useReward(rewardId)
          Taro.showToast({ title: '使用成功', icon: 'success' })
          console.log('[RewardPage] 使用奖励:', rewardId)
        }
      }
    })
  }

  const handleGoToChallenge = () => {
    Taro.switchTab({ url: '/pages/challenge/index' })
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coupon': return '🎫'
      case 'service': return '💆'
      case 'product': return '🎁'
      default: return '🎁'
    }
  }

  const sortedRewards = useMemo(() => {
    return [...rewards].sort((a, b) => a.energyCost - b.energyCost)
  }, [rewards])

  const myUnusedRewards = useMemo(() => {
    return userRewards.filter(r => r.status === 'unused')
  }, [userRewards])

  const myUsedRewards = useMemo(() => {
    return userRewards.filter(r => r.status === 'used')
  }, [userRewards])

  const getDefaultExpiryDate = () => {
    return dayjs().add(30, 'day').format('YYYY-MM-DD')
  }

  useDidShow(() => {
    console.log('[RewardPage] 页面显示')
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
      <View className={styles.energyHeader}>
        <View className={styles.energyInfo}>
          <View className={styles.energyRow}>
            <View style={{ flex: 1 }}>
              <Text className={styles.energyTitle}>我的恢复能量</Text>
              <View className={styles.energyValue}>
                {user.energy}
                <Text>能量</Text>
              </View>
            </View>
            <View 
              className={styles.redeemEntryBtn}
              onClick={() => Taro.navigateTo({ url: '/pages/reward-redeem/index' })}
            >
              <Text className={styles.redeemEntryIcon}>🎫</Text>
              <Text className={styles.redeemEntryText}>门店核销</Text>
            </View>
          </View>
          <Text className={styles.energyTips}>
            💡 完成任务、盲盒答题可获得更多能量
          </Text>
        </View>
      </View>

      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, activeTab === 'exchange' && styles.active)}
          onClick={() => setActiveTab('exchange')}
        >
          🎁 兑换商城
        </View>
        <View
          className={classnames(styles.tabItem, activeTab === 'my' && styles.active)}
          onClick={() => setActiveTab('my')}
        >
          🎫 我的奖励
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'exchange' ? (
          <>
            <View className={styles.sectionTitle}>
              <Text>✨</Text>
              <Text>热门兑换</Text>
            </View>

            <View className={styles.rewardGrid}>
              {sortedRewards.map(reward => (
                <View key={reward.id} className={styles.rewardCard}>
                  <View className={styles.rewardImage}>
                    {getRewardIcon(reward.type)}
                  </View>
                  <View className={styles.rewardInfo}>
                    <Text className={styles.rewardName}>{reward.name}</Text>
                    <Text className={styles.rewardDesc}>{reward.description}</Text>
                    <View className={styles.rewardFooter}>
                      <View className={styles.rewardCost}>
                        <Text>⚡</Text>
                        <Text>{reward.energyCost}</Text>
                      </View>
                      <View
                        className={classnames(
                          styles.exchangeBtn,
                          (user.energy < reward.energyCost || reward.stock <= 0) && styles.disabled
                        )}
                        onClick={() => handleExchangeClick(reward)}
                      >
                        {reward.stock <= 0 ? '已兑完' : '兑换'}
                      </View>
                    </View>
                    <Text className={styles.stockInfo}>
                      剩余 {reward.stock} 份
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            {myUnusedRewards.length > 0 && (
              <>
                <View className={styles.sectionTitle}>
                  <Text>🎁</Text>
                  <Text>待使用</Text>
                </View>
                <View className={styles.userRewardList}>
                  {myUnusedRewards.map(reward => (
                    <View key={reward.id} className={styles.userRewardCard}>
                      <View className={styles.userRewardImage}>
                        {getRewardIcon(reward.reward.type)}
                      </View>
                      <View className={styles.userRewardContent}>
                        <View style={{ flex: 1 }}>
                          <View className={styles.rewardHeader}>
                            <Text className={styles.userRewardName}>{reward.reward.name}</Text>
                            <View className={classnames(styles.statusTag, styles.statusUnused)}>
                              待使用
                            </View>
                          </View>
                          <View className={styles.userRewardCode}>券码: {reward.code}</View>
                          <Text className={styles.userRewardDate}>
                            获得时间: {reward.obtainedAt}
                          </Text>
                          {reward.reward.expiryDate ? (
                            <Text className={styles.userRewardDate}>
                              有效期至: {reward.reward.expiryDate}
                            </Text>
                          ) : (
                            <Text className={styles.userRewardDate}>
                              有效期至: {getDefaultExpiryDate()}
                            </Text>
                          )}
                        </View>
                        {reward.status === 'unused' && (
                          <View
                            className={styles.useRewardBtn}
                            onClick={() => handleUseReward(reward.id)}
                          >
                            立即使用
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {myUsedRewards.length > 0 && (
              <>
                <View className={styles.sectionTitle} style={{ marginTop: '40rpx' }}>
                  <Text>📋</Text>
                  <Text>已使用</Text>
                </View>
                <View className={styles.userRewardList}>
                  {myUsedRewards.map(reward => (
                    <View key={reward.id} className={classnames(styles.userRewardCard, styles.used)}>
                      <View className={styles.userRewardImage}>
                        {getRewardIcon(reward.reward.type)}
                      </View>
                      <View className={styles.userRewardContent}>
                        <View style={{ flex: 1 }}>
                          <View className={styles.rewardHeader}>
                            <Text className={styles.userRewardName}>{reward.reward.name}</Text>
                            <View className={classnames(styles.statusTag, styles.statusUsed)}>
                              已使用
                            </View>
                          </View>
                          <View className={styles.userRewardCode}>券码: {reward.code}</View>
                          <Text className={styles.userRewardDate}>
                            获得时间: {reward.obtainedAt}
                          </Text>
                          {reward.reward.expiryDate ? (
                            <Text className={styles.userRewardDate}>
                              有效期至: {reward.reward.expiryDate}
                            </Text>
                          ) : (
                            <Text className={styles.userRewardDate}>
                              有效期至: {getDefaultExpiryDate()}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {myUnusedRewards.length === 0 && myUsedRewards.length === 0 && (
              <View className={styles.emptyState}>
                <Text className={styles.emptyIcon}>🎁</Text>
                <Text className={styles.emptyText}>
                  还没有兑换任何奖励哦~{'\n'}
                  完成任务获取能量，兑换专属福利吧！
                </Text>
                <View className={styles.emptyAction} onClick={handleGoToChallenge}>
                  去完成任务
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {showExchangeModal && selectedReward && (
        <View className={styles.modalOverlay}>
          <View className={styles.modalContent}>
            <Text className={styles.modalIcon}>🎁</Text>
            <Text className={styles.modalTitle}>确认兑换</Text>
            <Text className={styles.modalDesc}>
              兑换后能量将立即扣除，请确认兑换
            </Text>
            <View className={styles.modalRewardInfo}>
              <Text className={styles.modalRewardName}>{selectedReward.name}</Text>
              <Text className={styles.modalRewardCost}>
                ⚡ 消耗 {selectedReward.energyCost} 能量
              </Text>
            </View>
            <View className={styles.modalButtons}>
              <View
                className={classnames(styles.modalBtn, styles.cancel)}
                onClick={handleCancelExchange}
              >
                再想想
              </View>
              <View
                className={classnames(styles.modalBtn, styles.confirm)}
                onClick={handleConfirmExchange}
              >
                确认兑换
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default RewardPage
