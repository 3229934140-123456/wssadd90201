import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { FoodItem } from '@/types'
import TrafficLight from '@/components/TrafficLight'
import styles from './index.module.scss'

interface FoodCardProps {
  food: FoodItem
  isFavorite?: boolean
  onFavorite?: (foodId: string) => void
  onViewDetail?: (foodId: string) => void
  compact?: boolean
}

const FoodCard: React.FC<FoodCardProps> = ({ food, isFavorite, onFavorite, onViewDetail, compact = false }) => {
  const handleClick = () => {
    if (onViewDetail) {
      onViewDetail(food.id)
    }
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onFavorite) {
      onFavorite(food.id)
      Taro.showToast({
        title: isFavorite ? '已取消收藏' : '已收藏',
        icon: 'none',
        duration: 1000
      })
    }
  }

  return (
    <View 
      className={classnames(styles.card, compact && styles.compact)} 
      onClick={handleClick}
    >
      <Image 
        className={styles.image} 
        src={food.image} 
        mode="aspectFill"
        lazyLoad
      />
      
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{food.name}</Text>
          <TrafficLight level={food.level} size="small" />
        </View>
        
        {!compact && (
          <Text className={styles.description}>{food.description}</Text>
        )}
        
        <View className={styles.footer}>
          <View className={styles.category}>
            <Text className={styles.categoryText}>{food.category}</Text>
          </View>
          
          {onFavorite && (
            <View 
              className={classnames(styles.favorite, isFavorite && styles.active)}
              onClick={handleFavorite}
            >
              <Text className={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default FoodCard
