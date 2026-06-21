import React, { useState, useCallback } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import styles from './index.module.scss'

const ComfortPage: React.FC = () => {
  const { currentProject } = useAppStore()
  const [currentComfortIndex, setCurrentComfortIndex] = useState<number>(0)

  const getRandomComfort = useCallback(() => {
    if (!currentProject?.comfortWords) return
    const words = currentProject.comfortWords
    let newIndex = Math.floor(Math.random() * words.length)
    while (newIndex === currentComfortIndex && words.length > 1) {
      newIndex = Math.floor(Math.random() * words.length)
    }
    setCurrentComfortIndex(newIndex)
  }, [currentProject, currentComfortIndex])

  const handleContactService = () => {
    console.log('[ComfortPage] 联系客服')
    Taro.makePhoneCall({
      phoneNumber: '4008888888',
      fail: () => {
        Taro.showToast({
          title: '客服电话：400-888-8888',
          icon: 'none',
          duration: 3000
        })
      }
    })
  }

  const handleGoToReward = () => {
    console.log('[ComfortPage] 跳转到奖励中心')
    Taro.navigateTo({ url: '/pages/reward/index' })
  }

  const handlePersist = () => {
    console.log('[ComfortPage] 用户选择坚持')
    const encourageMessages = [
      '太棒了！你真的很有毅力！💪',
      '坚持就是胜利，继续加油！🌟',
      '你比想象中更强大！❤️',
      '每一次坚持都是向美丽迈进！✨',
      '为你的意志力点赞！👍'
    ]
    const randomMessage = encourageMessages[Math.floor(Math.random() * encourageMessages.length)]
    
    Taro.showToast({
      title: randomMessage,
      icon: 'none',
      duration: 2500
    })
    
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  useDidShow(() => {
    console.log('[ComfortPage] 页面显示')
    getRandomComfort()
  })

  if (!currentProject) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyState}>
          <Text>请先选择恢复项目</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.pageHeader}>
        <View className={styles.headerContent}>
          <Text className={styles.headerIcon}>🤗</Text>
          <Text className={styles.headerTitle}>我快忍不住了</Text>
          <Text className={styles.headerDesc}>
            没关系，这很正常{'\n'}
            让我们一起度过这个难关
          </Text>
          <View className={styles.projectInfo}>
            <Text>{currentProject.icon} {currentProject.name} 恢复中</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>⚠️</Text>
            <Text>破戒的后果</Text>
          </View>
          {currentProject.consequences.map((consequence, index) => (
            <View key={index} className={styles.consequenceCard}>
              <Text className={styles.consequenceIcon}>⚠️</Text>
              <Text className={styles.consequenceText}>{consequence}</Text>
            </View>
          ))}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text>💝</Text>
            <Text>客服暖心安抚</Text>
          </View>
          <View className={styles.comfortCard}>
            <Text className={styles.comfortIcon}>💬</Text>
            <Text className={styles.comfortText}>
              {currentProject.comfortWords[currentComfortIndex]}
            </Text>
            <View className={styles.changeBtn} onClick={getRandomComfort}>
              <Text>🔄</Text>
              <Text>换一句</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.bottomActions}>
        <View
          className={`${styles.actionBtn} ${styles.secondary}`}
          onClick={handleContactService}
        >
          <Text>📞</Text>
          <Text>联系客服</Text>
        </View>
        <View
          className={`${styles.actionBtn} ${styles.secondary}`}
          onClick={handleGoToReward}
        >
          <Text>🎁</Text>
          <Text>看看奖励</Text>
        </View>
        <View
          className={`${styles.actionBtn} ${styles.primary}`}
          onClick={handlePersist}
        >
          <Text>💪</Text>
          <Text>我能坚持</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default ComfortPage
