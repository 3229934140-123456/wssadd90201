import React, { useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { getFoodById } from '@/data/foods'
import { FoodItem } from '@/types'
import TrafficLight from '@/components/TrafficLight'
import styles from './index.module.scss'

const getFoodEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    '川菜': '🌶️',
    '饮品': '🥤',
    '烧烤': '🍖',
    '火锅': '🍲',
    '海鲜': '🦐',
    '快餐': '🍗',
    '酒水': '🍺',
    '家常菜': '🍳',
    '粥品': '🥣',
    '水产': '🐟',
    '轻食': '🥗',
    '甜品': '🍰',
    '调料': '🧂',
    '蔬菜': '🥦',
    '日料': '🍣'
  }
  return emojiMap[category] || '🍽️'
}

const getAlternativeEmoji = (index: number): string => {
  const emojis = ['✨', '💚', '🌟', '💫', '🎯', '🍀']
  return emojis[index % emojis.length]
}

const FoodDetailPage: React.FC = () => {
  const router = useRouter()
  const { favorites, toggleFavorite } = useAppStore()

  const food = useMemo((): FoodItem | undefined => {
    const id = router.params.id
    if (!id) return undefined
    return getFoodById(id)
  }, [router.params.id])

  const isFavorite = useMemo(() => {
    if (!food) return false
    return favorites.includes(food.id)
  }, [food, favorites])

  const handleFavorite = () => {
    if (!food) return
    toggleFavorite(food.id)
    Taro.showToast({
      title: isFavorite ? '已取消收藏' : '已添加收藏',
      icon: 'none'
    })
    console.log('[FoodDetailPage] 切换收藏:', food.name, isFavorite ? '取消' : '添加')
  }

  const handleBack = () => {
    Taro.navigateBack()
  }

  const handleAlternativeClick = (alternative: string) => {
    console.log('[FoodDetailPage] 点击可替换食物:', alternative)
    Taro.showToast({
      title: `推荐：${alternative}`,
      icon: 'none'
    })
  }

  useDidShow(() => {
    console.log('[FoodDetailPage] 页面显示，食物ID:', router.params.id)
  })

  if (!food) {
    return (
      <ScrollView className={styles.pageContainer} scrollY>
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>🍽️</Text>
          <Text className={styles.emptyTitle}>食物不存在</Text>
          <Text className={styles.emptyDesc}>该食物可能已下架或ID无效</Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.backBtn} onClick={handleBack}>
          ←
        </View>

        <View
          className={classnames(styles.favoriteBtn, isFavorite && styles.active)}
          onClick={handleFavorite}
        >
          <Text className={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </View>

        <View className={styles.foodHeader}>
          <View className={styles.foodImage}>
            {getFoodEmoji(food.category)}
          </View>
          <Text className={styles.foodName}>{food.name}</Text>
          <Text className={styles.foodCategory}>{food.category}</Text>
        </View>
      </View>

      <View className={styles.contentSection}>
        <View className={styles.levelCard}>
          <View className={styles.levelHeader}>
            <View className={styles.levelTitle}>
              <Text>🚦</Text>
              <Text>红绿灯等级</Text>
            </View>
            <TrafficLight level={food.level} size="large" />
          </View>
          <Text className={styles.levelDescription}>
            {food.description}
          </Text>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>📋</Text>
            <Text className={styles.sectionTitle}>为什么是{food.levelText}？</Text>
          </View>
          <Text className={styles.reasonText}>
            {food.description}
          </Text>
        </View>

        <View className={styles.sectionCard}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionIcon}>🔄</Text>
            <Text className={styles.sectionTitle}>可替换吃法</Text>
          </View>
          <View className={styles.alternativesList}>
            {food.alternatives.map((alt, index) => (
              <View
                key={index}
                className={styles.alternativeCard}
                onClick={() => handleAlternativeClick(alt)}
              >
                <View className={styles.alternativeIcon}>
                  {getAlternativeEmoji(index)}
                </View>
                <View className={styles.alternativeContent}>
                  <Text className={styles.alternativeName}>{alt}</Text>
                  <Text className={styles.alternativeDesc}>健康又美味的选择</Text>
                </View>
                <Text className={styles.alternativeArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.tipsCard}>
          <View className={styles.tipsHeader}>
            <Text className={styles.tipsIcon}>💡</Text>
            <Text className={styles.tipsTitle}>小贴士</Text>
          </View>
          <Text className={styles.tipsContent}>
            {food.tips}
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default FoodDetailPage
