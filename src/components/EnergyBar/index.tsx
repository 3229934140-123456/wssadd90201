import React from 'react'
import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface EnergyBarProps {
  current: number
  showIcon?: boolean
  size?: 'small' | 'medium' | 'large'
}

const EnergyBar: React.FC<EnergyBarProps> = ({ current, showIcon = true, size = 'medium' }) => {
  const sizeConfig = {
    small: { fontSize: 24, iconSize: 28 },
    medium: { fontSize: 28, iconSize: 32 },
    large: { fontSize: 32, iconSize: 36 }
  }[size]

  return (
    <View className={styles.container}>
      {showIcon && (
        <Text className={styles.icon} style={{ fontSize: sizeConfig.iconSize }}>⚡</Text>
      )}
      <Text className={styles.text} style={{ fontSize: sizeConfig.fontSize }}>{current}</Text>
    </View>
  )
}

export default EnergyBar
