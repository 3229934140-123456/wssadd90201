import React, { useState } from 'react'
import { View, Text, ScrollView, RefreshControl, Input, Textarea } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { ActivityItem, ActivityReward } from '@/types'
import classnames from 'classnames'
import styles from './index.module.scss'

const ActivityManagePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null)
  const [editRules, setEditRules] = useState<string[]>([])
  const [editRewards, setEditRewards] = useState<ActivityReward[]>([])
  const { activities, updateActivity } = useAppStore()

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[ActivityManagePage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleEditActivity = (activity: ActivityItem) => {
    setEditingActivity({ ...activity })
    setEditRules([...activity.rules])
    setEditRewards(activity.rewards.map(r => ({ ...r })))
    setShowEditModal(true)
  }

  const handleCloseModal = () => {
    setShowEditModal(false)
    setEditingActivity(null)
    setEditRules([])
    setEditRewards([])
  }

  const handleTitleChange = (e: any) => {
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, title: e.detail.value })
    }
  }

  const handleDescChange = (e: any) => {
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, description: e.detail.value })
    }
  }

  const handleStartTimeChange = (e: any) => {
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, startTime: e.detail.value })
    }
  }

  const handleEndTimeChange = (e: any) => {
    if (editingActivity) {
      setEditingActivity({ ...editingActivity, endTime: e.detail.value })
    }
  }

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...editRules]
    newRules[index] = value
    setEditRules(newRules)
  }

  const handleAddRule = () => {
    setEditRules([...editRules, ''])
  }

  const handleRemoveRule = (index: number) => {
    const newRules = editRules.filter((_, i) => i !== index)
    setEditRules(newRules)
  }

  const handleRewardNameChange = (index: number, value: string) => {
    const newRewards = [...editRewards]
    newRewards[index] = { ...newRewards[index], name: value }
    setEditRewards(newRewards)
  }

  const handleRewardStockChange = (index: number, value: string) => {
    const stock = parseInt(value, 10)
    if (!isNaN(stock) && stock >= 0) {
      const newRewards = [...editRewards]
      newRewards[index] = { ...newRewards[index], stock }
      setEditRewards(newRewards)
    }
  }

  const handleSave = () => {
    if (!editingActivity) return

    if (!editingActivity.title.trim()) {
      Taro.showToast({ title: '请输入活动名称', icon: 'none' })
      return
    }

    const validRules = editRules.filter(r => r.trim() !== '')
    if (validRules.length === 0) {
      Taro.showToast({ title: '请至少添加一条规则', icon: 'none' })
      return
    }

    const updatedActivity: ActivityItem = {
      ...editingActivity,
      rules: validRules,
      rewards: editRewards
    }

    updateActivity(updatedActivity)
    Taro.showToast({ title: '保存成功', icon: 'success' })
    handleCloseModal()
    console.log('[ActivityManagePage] 保存活动:', updatedActivity.title)
  }

  const getActivityIcon = (title: string) => {
    if (title.includes('挑战')) return '🏆'
    if (title.includes('美食')) return '🍽️'
    if (title.includes('日记')) return '📔'
    if (title.includes('闺蜜')) return '👯'
    return '🎉'
  }

  useDidShow(() => {
    console.log('[ActivityManagePage] 页面显示')
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
      <View className={styles.adminHeader}>
        <Text className={styles.title}>⚙️ 门店管理后台</Text>
        <Text className={styles.subtitle}>管理活动规则、奖励库存</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.sectionTitle}>
          <Text>📋</Text>
          <Text>活动列表</Text>
        </View>

        {activities.length > 0 ? (
          <View className={styles.activityList}>
            {activities.map(activity => (
              <View key={activity.id} className={styles.activityManageCard}>
                <View className={styles.cardHeader}>
                  <Text className={styles.cardTitle}>
                    {getActivityIcon(activity.title)} {activity.title}
                  </Text>
                  <View
                    className={styles.editBtn}
                    onClick={() => handleEditActivity(activity)}
                  >
                    编辑
                  </View>
                </View>

                <View className={styles.cardMeta}>
                  <View className={styles.metaItem}>
                    <Text>📅</Text>
                    <Text>
                      {activity.startTime.slice(5)} ~ {activity.endTime.slice(5)}
                    </Text>
                  </View>
                  <View className={styles.metaItem}>
                    <Text>🎁</Text>
                    <Text>{activity.rewards.length}种奖励</Text>
                  </View>
                </View>

                <Text className={styles.cardDesc}>{activity.description}</Text>

                {activity.rewards.map(reward => (
                  <View key={reward.id} className={styles.rewardMini}>
                    <Text className={styles.rewardName}>{reward.name}</Text>
                    <Text className={styles.rewardStock}>库存: {reward.stock}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无活动</Text>
          </View>
        )}
      </View>

      {showEditModal && editingActivity && (
        <View className={styles.modalOverlay} onClick={handleCloseModal}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <View className={styles.modalHeader}>
              <Text className={styles.modalTitle}>编辑活动</Text>
              <View className={styles.closeBtn} onClick={handleCloseModal}>
                ✕
              </View>
            </View>

            <ScrollView className={styles.modalBody} scrollY>
              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>活动名称</Text>
                <Input
                  className={styles.formInput}
                  value={editingActivity.title}
                  onInput={handleTitleChange}
                  placeholder="请输入活动名称"
                  maxlength={30}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>活动描述</Text>
                <Textarea
                  className={styles.formTextarea}
                  value={editingActivity.description}
                  onInput={handleDescChange}
                  placeholder="请输入活动描述"
                  maxlength={200}
                />
              </View>

              <View className={styles.formGroup}>
                <Text className={styles.formLabel}>活动时间</Text>
                <View className={styles.dateRow}>
                  <View className={styles.dateItem}>
                    <Text className={styles.formLabel} style={{ fontSize: 24, marginBottom: 8 }}>
                      开始日期
                    </Text>
                    <Input
                      className={styles.dateInput}
                      type="date"
                      value={editingActivity.startTime}
                      onInput={handleStartTimeChange}
                    />
                  </View>
                  <View className={styles.dateItem}>
                    <Text className={styles.formLabel} style={{ fontSize: 24, marginBottom: 8 }}>
                      结束日期
                    </Text>
                    <Input
                      className={styles.dateInput}
                      type="date"
                      value={editingActivity.endTime}
                      onInput={handleEndTimeChange}
                    />
                  </View>
                </View>
              </View>

              <View className={styles.sectionTitle}>
                <Text>📋</Text>
                <Text>活动规则</Text>
              </View>

              {editRules.map((rule, index) => (
                <View key={index} className={styles.ruleItem}>
                  <Input
                    className={styles.ruleInput}
                    value={rule}
                    onInput={(e: any) => handleRuleChange(index, e.detail.value)}
                    placeholder={`规则 ${index + 1}`}
                  />
                  <View
                    className={styles.removeRuleBtn}
                    onClick={() => handleRemoveRule(index)}
                  >
                    -
                  </View>
                </View>
              ))}

              <View className={styles.addRuleBtn} onClick={handleAddRule}>
                <Text>+</Text>
                <Text>添加规则</Text>
              </View>

              <View className={styles.sectionTitle}>
                <Text>🎁</Text>
                <Text>活动奖励</Text>
              </View>

              {editRewards.map((reward, index) => (
                <View key={reward.id} className={styles.rewardEditItem}>
                  <View className={styles.rewardRow}>
                    <Text className={styles.rewardLabel}>奖励名称</Text>
                    <Input
                      className={styles.rewardInput}
                      value={reward.name}
                      onInput={(e: any) => handleRewardNameChange(index, e.detail.value)}
                    />
                  </View>
                  <View className={styles.rewardRow}>
                    <Text className={styles.rewardLabel}>库存数量</Text>
                    <Input
                      className={styles.stockInput}
                      type="number"
                      value={String(reward.stock)}
                      onInput={(e: any) => handleRewardStockChange(index, e.detail.value)}
                    />
                    <Text style={{ fontSize: 24, color: '#999' }}>份</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View className={styles.modalFooter}>
              <View
                className={classnames(styles.modalBtn, styles.cancel)}
                onClick={handleCloseModal}
              >
                取消
              </View>
              <View
                className={classnames(styles.modalBtn, styles.confirm)}
                onClick={handleSave}
              >
                保存
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ActivityManagePage
