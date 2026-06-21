import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import { MoodOption } from '@/types'
import { moodOptions } from '@/data/moods'
import styles from './index.module.scss'

interface MoodSelectorProps {
  value?: string
  onChange?: (mood: MoodOption) => void
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  const handleSelect = (mood: MoodOption) => {
    if (onChange) {
      onChange(mood)
    }
  }

  return (
    <View className={styles.container}>
      <Text className={styles.title}>今天的心情怎么样？</Text>
      <View className={styles.moodList}>
        {moodOptions.map(mood => (
          <View
            key={mood.value}
            className={classnames(styles.moodItem, value === mood.value && styles.selected)}
            onClick={() => handleSelect(mood)}
          >
            <Text className={styles.emoji}>{mood.emoji}</Text>
            <Text className={styles.label}>{mood.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default MoodSelector
