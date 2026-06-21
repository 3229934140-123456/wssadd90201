import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { UserReward, RedeemRecord } from '@/types'
import classnames from 'classnames'
import styles from './index.module.scss'

const RewardRedeemPage: React.FC = () => {
  const [code, setCode] = useState('')
  const [verifiedReward, setVerifiedReward] = useState<UserReward | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [redeemedReward, setRedeemedReward] = useState<UserReward | null>(null)
  const [notFound, setNotFound] = useState(false)
  const { userRewards, verifyRewardCode, redeemRewardByCode, redeemRecords } = useAppStore()

  const recentRedeemRecords = useMemo(() => {
    return redeemRecords.slice(0, 10)
  }, [redeemRecords])

  const quickCodes = useMemo(() => {
    return userRewards
      .filter(r => r.status === 'unused')
      .slice(0, 3)
      .map(r => r.code)
  }, [userRewards])

  const handleCodeChange = (e: any) => {
    const value = e.detail.value.toUpperCase().trim()
    setCode(value)
    setVerifiedReward(null)
    setNotFound(false)
  }

  const handleQuickCodeClick = (quickCode: string) => {
    setCode(quickCode)
    setVerifiedReward(null)
    setNotFound(false)
  }

  const handleVerify = () => {
    if (!code.trim()) {
      Taro.showToast({ title: '请输入券码', icon: 'none' })
      return
    }

    const reward = verifyRewardCode(code)
    if (reward) {
      setVerifiedReward(reward)
      setNotFound(false)
      console.log('[RewardRedeemPage] 券码验证成功:', reward.reward.name)
    } else {
      setVerifiedReward(null)
      setNotFound(true)
      console.log('[RewardRedeemPage] 券码不存在:', code)
    }
  }

  const handleScan = () => {
    Taro.showToast({ title: '扫码功能演示中', icon: 'none' })
    setTimeout(() => {
      const demoCode = 'HF202601001'
      setCode(demoCode)
      const reward = verifyRewardCode(demoCode)
      if (reward) {
        setVerifiedReward(reward)
        setNotFound(false)
      }
    }, 500)
  }

  const handleRedeem = () => {
    const result = redeemRewardByCode(code)
    if (!result) {
      Taro.showToast({ title: '核销失败：券码不存在', icon: 'none' })
      setVerifiedReward(null)
      setNotFound(true)
      return
    }

    if (result.status === 'used') {
      const wasUnused = verifiedReward?.status === 'unused'
      if (wasUnused) {
        setRedeemedReward(result)
        setShowSuccess(true)
        setVerifiedReward(null)
        setCode('')
        console.log('[RewardRedeemPage] 核销成功:', result.reward.name)
      } else {
        Taro.showToast({ title: '该券码已使用', icon: 'none' })
        setVerifiedReward({ ...verifiedReward!, status: 'used' })
      }
      return
    }

    if (result.status === 'expired') {
      Taro.showToast({ title: '该券码已过期', icon: 'none' })
      setVerifiedReward({ ...verifiedReward!, status: 'expired' })
      return
    }

    Taro.showToast({ title: '核销失败，请重试', icon: 'none' })
  }

  const handleVerifyAndRedeem = () => {
    if (!verifiedReward) return

    Taro.showModal({
      title: '确认核销',
      content: `确认核销「${verifiedReward.reward.name}」吗？核销后无法恢复。`,
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          handleRedeem()
        }
      }
    })
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setRedeemedReward(null)
    setCode('')
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unused': return '待使用'
      case 'used': return '已使用'
      case 'expired': return '已过期'
      default: return status
    }
  }

  const getRecordStatusText = (record: RedeemRecord) => {
    if (record.status === 'success') return '成功'
    return `失败（${record.failReason || '未知原因'}）`
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coupon': return '🎫'
      case 'service': return '💆'
      case 'product': return '🎁'
      default: return '🎁'
    }
  }

  const getExpiryDisplay = (reward: UserReward) => {
    if (reward.reward.expiryDate) {
      return reward.reward.expiryDate
    }
    return '领取后30天内有效'
  }

  useDidShow(() => {
    console.log('[RewardRedeemPage] 页面显示')
  })

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.header}>
        <Text className={styles.title}>🎫 奖励核销</Text>
        <Text className={styles.subtitle}>门店店员使用，输入或扫码核销</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.inputSection}>
          <View className={styles.sectionTitle}>
            <Text>🔢</Text>
            <Text>输入券码</Text>
          </View>

          <View className={styles.inputWrapper}>
            <Input
              className={styles.codeInput}
              value={code}
              onInput={handleCodeChange}
              placeholder="请输入8位券码"
              placeholderClass={styles.placeholder}
              maxlength={10}
              confirmType="search"
              onConfirm={handleVerify}
            />
          </View>

          <View className={styles.actionRow}>
            <View
              className={classnames(styles.btn, styles.secondary)}
              onClick={handleScan}
            >
              📷 扫码
            </View>
            <View
              className={classnames(styles.btn, styles.primary, !code.trim() && styles.disabled)}
              onClick={handleVerify}
            >
              🔍 查询
            </View>
          </View>

          {quickCodes.length > 0 && (
            <View className={styles.quickCodes}>
              <Text className={styles.quickTitle}>待核销券码（演示用）:</Text>
              <View className={styles.quickList}>
                {quickCodes.map(c => (
                  <View
                    key={c}
                    className={styles.quickItem}
                    onClick={() => handleQuickCodeClick(c)}
                  >
                    {c}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {notFound && (
          <View className={styles.rewardInfo}>
            <View className={styles.rewardNotFound}>
              <Text className={styles.icon}>❓</Text>
              <Text className={styles.text}>
                未找到该券码{'\n'}
                请检查券码是否正确
              </Text>
            </View>
            <View className={styles.redeemSection}>
              <View className={styles.redeemTip}>
                <Text className={styles.icon}>⚠️</Text>
                <Text className={styles.text}>
                  如需记录本次核销尝试（将作为失败流水保存），请点击下方按钮。
                </Text>
              </View>
              <View
                className={styles.redeemBtn}
                onClick={() => {
                  redeemRewardByCode(code)
                  Taro.showToast({ title: '已记录核销失败流水', icon: 'none' })
                  setNotFound(false)
                  setCode('')
                }}
              >
                🔄 记录核销尝试
              </View>
            </View>
          </View>
        )}

        {verifiedReward && (
          <View className={styles.rewardInfo}>
            <View className={styles.rewardDetail}>
              <View className={styles.rewardHeader}>
                <View className={styles.rewardIcon}>
                  {getRewardIcon(verifiedReward.reward.type)}
                </View>
                <View>
                  <Text className={styles.rewardName}>
                    {verifiedReward.reward.name}
                  </Text>
                  <View
                    className={classnames(
                      styles.statusBadge,
                      verifiedReward.status
                    )}
                  >
                    {getStatusText(verifiedReward.status)}
                  </View>
                </View>
              </View>

              <View className={styles.infoList}>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>券码</Text>
                  <Text className={styles.code}>{verifiedReward.code}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>类型</Text>
                  <Text className={styles.value}>
                    {verifiedReward.reward.type === 'coupon' ? '优惠券' :
                     verifiedReward.reward.type === 'service' ? '服务项目' : '实物商品'}
                  </Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>获得时间</Text>
                  <Text className={styles.value}>{verifiedReward.obtainedAt}</Text>
                </View>
                <View className={styles.infoItem}>
                  <Text className={styles.label}>有效期</Text>
                  <Text className={styles.value}>{getExpiryDisplay(verifiedReward)}</Text>
                </View>
              </View>

              <View className={styles.redeemSection}>
                {verifiedReward.status === 'used' && (
                  <View className={styles.redeemTip}>
                    <Text className={styles.icon}>⚠️</Text>
                    <Text className={styles.text}>
                      该券码已核销使用，再次核销将记录为失败流水。
                    </Text>
                  </View>
                )}

                {verifiedReward.status === 'expired' && (
                  <View className={styles.redeemTip}>
                    <Text className={styles.icon}>⏰</Text>
                    <Text className={styles.text}>
                      该券码已超过有效期，核销将记录为失败流水。
                    </Text>
                  </View>
                )}

                {verifiedReward.status === 'unused' && (
                  <View className={styles.redeemTip}>
                    <Text className={styles.icon}>⚠️</Text>
                    <Text className={styles.text}>
                      请确认顾客身份和奖励信息无误后，再进行核销操作。核销后该券码将立即失效。
                    </Text>
                  </View>
                )}

                <View
                  className={styles.redeemBtn}
                  onClick={handleVerifyAndRedeem}
                >
                  {verifiedReward.status === 'unused' ? '✅ 确认核销' : '🔄 尝试核销（将记录流水）'}
                </View>
              </View>
            </View>
          </View>
        )}

        {!verifiedReward && !notFound && (
          <View className={styles.rewardInfo}>
            <View className={styles.rewardNotFound}>
              <Text className={styles.icon}>🔍</Text>
              <Text className={styles.text}>
                输入券码后点击查询{'\n'}
                即可查看奖励详情
              </Text>
            </View>
          </View>
        )}

        <View className={styles.recordsSection}>
          <View className={styles.sectionTitle}>
            <Text>📋</Text>
            <Text>最近核销流水</Text>
          </View>

          {recentRedeemRecords.length > 0 ? (
            <View className={styles.recordsList}>
              {recentRedeemRecords.map(record => (
                <View key={record.id} className={styles.recordItem}>
                  <View className={styles.recordMain}>
                    <View className={styles.recordHeader}>
                      <Text className={styles.recordCode}>{record.code}</Text>
                      <View className={classnames(
                        styles.recordStatus,
                        record.status === 'success' ? styles.statusSuccess : styles.statusFailed
                      )}>
                        {getRecordStatusText(record)}
                      </View>
                    </View>
                    <Text className={styles.recordReward}>{record.rewardName}</Text>
                    <Text className={styles.recordTime}>{record.redeemedAt}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className={styles.emptyRecords}>
              <Text className={styles.emptyRecordsText}>暂无核销记录</Text>
            </View>
          )}
        </View>
      </View>

      {showSuccess && redeemedReward && (
        <View className={styles.successOverlay} onClick={handleSuccessClose}>
          <View className={styles.successContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.successIcon}>🎉</Text>
            <Text className={styles.successTitle}>核销成功</Text>
            <Text className={styles.successReward}>{redeemedReward.reward.name}</Text>
            <Text className={styles.successDesc}>
              券码 {redeemedReward.code} 已成功核销{'\n'}
              顾客可在「我的奖励」中查看使用记录
            </Text>
            <View className={styles.successBtn} onClick={handleSuccessClose}>
              完成
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default RewardRedeemPage
