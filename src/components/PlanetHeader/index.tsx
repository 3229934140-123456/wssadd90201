import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { getRecoveryProgress } from '@/utils/date'
import ProgressRing from '@/components/ProgressRing'
import EnergyBar from '@/components/EnergyBar'
import styles from './index.module.scss'

interface PlanetHeaderProps {
  onComfort?: () => void
  onShare?: () => void
}

const PlanetHeader: React.FC<PlanetHeaderProps> = ({ onComfort, onShare }) => {
  const { user, currentProject, currentDay } = useAppStore()
  
  const progress = currentProject ? getRecoveryProgress(currentDay, currentProject.recoveryDays) : 0

  const handleComfort = () => {
    console.log('[PlanetHeader] 点击忍不住了')
    if (onComfort) {
      onComfort()
    } else {
      Taro.navigateTo({ url: '/pages/comfort/index' })
    }
  }

  const handleShare = () => {
    console.log('[PlanetHeader] 点击分享')
    if (onShare) {
      onShare()
    } else {
      Taro.navigateTo({ url: '/pages/share/index' })
    }
  }

  if (!currentProject) {
    return (
      <View className={styles.container}>
        <View className={styles.noProject}>
          <Text className={styles.noProjectIcon}>🌍</Text>
          <Text className={styles.noProjectTitle}>欢迎来到恢复星球</Text>
          <Text className={styles.noProjectDesc}>请先选择你的医美项目</Text>
          <Button 
            className={styles.selectBtn}
            onClick={() => Taro.navigateTo({ url: '/pages/project-select/index' })}
          >
            选择项目
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.container}>
      <View className={styles.gradientBg} />
      
      <View className={styles.content}>
        <View className={styles.topRow}>
          <View className={styles.projectInfo}>
            <View className={styles.projectIcon}>{currentProject.icon}</View>
            <View className={styles.projectText}>
              <Text className={styles.projectName}>{currentProject.name}</Text>
              <Text className={styles.projectDay}>第 {currentDay} 天 / 共 {currentProject.recoveryDays} 天</Text>
            </View>
          </View>
          <EnergyBar current={user.energy} size="medium" />
        </View>

        <View className={styles.middleRow}>
          <View className={styles.progressSection}>
            <ProgressRing 
              progress={progress} 
              size={160}
              strokeWidth={10}
              color="#FF7A9E"
              bgColor="#FFE5EB"
              text={`${progress}%`}
            />
            <View className={styles.progressInfo}>
              <Text className={styles.progressTitle}>恢复进度</Text>
              <Text className={styles.progressDesc}>
                已坚持 {user.checkInDays} 天
              </Text>
              <Text className={styles.progressTip}>
                {currentProject.dailyTips[currentDay % currentProject.dailyTips.length]}
              </Text>
            </View>
          </View>
        </View>

        <View className={styles.actionRow}>
          <Button className={styles.comfortBtn} onClick={handleComfort}>
            <Text className={styles.btnIcon}>😣</Text>
            <Text className={styles.btnText}>我快忍不住了</Text>
          </Button>
          <Button className={styles.shareBtn} onClick={handleShare}>
            <Text className={styles.btnIcon}>📸</Text>
            <Text className={styles.btnText}>生成分享图</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default PlanetHeader
