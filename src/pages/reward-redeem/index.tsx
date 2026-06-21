import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { UserReward } from '@/types'
import classnames from 'classnames'
import styles from './index.module.scss'

const RewardRedeemPage: React.FC = () => {
  const [code, setCode] = useState('')
  const [verifiedReward, setVerifiedReward] = useState<UserReward | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [redeemedReward, setRedeemedReward] = useState<UserReward | null>(null)
  const [notFound, setNotFound] = useState(false)
  const { userRewards, verifyRewardCode, redeemRewardByCode } = useAppStore()

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
    if (!verifiedReward) return

    Taro.showModal({
      title: '确认核销',
      content: `确认核销「${verifiedReward.reward.name}」吗？核销后无法恢复。`,
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          const result = redeemRewardByCode(code)
          if (result && result.status === 'used') {
            setRedeemedReward(result)
            setShowSuccess(true)
            setVerifiedReward(null)
            console.log('[RewardRedeemPage] 核销成功:', result.reward.name)
          } else if (result && result.status === 'used') {
            Taro.showToast({ title: '该券码已使用', icon: 'none' })
            setVerifiedReward({ ...verifiedReward, status: 'used' })
          } else if (result && result.status === 'expired') {
            Taro.showToast({ title: '该券码已过期', icon: 'none' })
            setVerifiedReward({ ...verifiedReward, status: 'expired' })
          } else {
            Taro.showToast({ title: '核销失败，请重试', icon: 'none' })
          }
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
                      该券码已于 {getToday()} 核销使用，请勿重复操作。
                    </Text>
                  </View>
                )}

                {verifiedReward.status === 'expired' && (
                  <View className={styles.redeemTip}>
                    <Text className={styles.icon}>⏰</Text>
                    <Text className={styles.text}>
                      该券码已超过有效期，无法核销使用。
                    </Text>
                  </View>
                )}

                {verifiedReward.status === 'unused' && (
                  <>
                    <View className={styles.redeemTip}>
                      <Text className={styles.icon}>⚠️</Text>
                      <Text className={styles.text}>
                        请确认顾客身份和奖励信息无误后，再进行核销操作。核销后该券码将立即失效。
                      </Text>
                    </View>
                    <View
                      className={classnames(
                        styles.redeemBtn,
                        verifiedReward.status !== 'unused' && styles.disabled
                      )}
                      onClick={handleRedeem}
                    >
                      ✅ 确认核销
                    </View>
                  </>
                )}
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

const getToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default RewardRedeemPage
