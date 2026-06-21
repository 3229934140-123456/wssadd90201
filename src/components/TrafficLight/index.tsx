import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { FoodLevel } from '@/types'
import styles from './index.module.scss'

interface TrafficLightProps {
  level: FoodLevel
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

const levelConfig = {
  green: { text: '绿灯', color: '#00B578', bgColor: 'rgba(0, 181, 120, 0.1)' },
  yellow: { text: '黄灯', color: '#FFAA00', bgColor: 'rgba(255, 170, 0, 0.1)' },
  red: { text: '红灯', color: '#F53F3F', bgColor: 'rgba(245, 63, 63, 0.1)' }
}

const TrafficLight: React.FC<TrafficLightProps> = ({ level, size = 'medium', showText = true }) => {
  const config = levelConfig[level]
  
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large
  }[size]

  return (
    <View className={classnames(styles.container, sizeClass)} style={{ backgroundColor: config.bgColor }}>
      <View 
        className={styles.light} 
        style={{ backgroundColor: config.color }}
      />
      {showText && (
        <Text className={styles.text} style={{ color: config.color }}>
          {config.text}
        </Text>
      )}
    </View>
  )
}

export default TrafficLight
