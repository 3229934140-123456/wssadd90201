import React, { useState, useMemo } from 'react'
import { View, Text, Input, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { foods, searchFoods, hotSearches, getFoodById } from '@/data/foods'
import { FoodLevel, FoodItem } from '@/types'
import FoodCard from '@/components/FoodCard'
import styles from './index.module.scss'

type FilterType = 'all' | FoodLevel

const FoodPage: React.FC = () => {
  const [keyword, setKeyword] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [refreshing, setRefreshing] = useState(false)
  const { favorites, toggleFavorite } = useAppStore()

  const filteredFoods = useMemo(() => {
    let result = keyword ? searchFoods(keyword) : foods
    
    if (filter !== 'all') {
      result = result.filter(f => f.level === filter)
    }
    
    return result
  }, [keyword, filter])

  const favoriteFoods = useMemo(() => {
    return foods.filter(f => favorites.includes(f.id))
  }, [favorites])

  const handleSearch = (e: any) => {
    setKeyword(e.detail.value)
  }

  const handleClear = () => {
    setKeyword('')
  }

  const handleHotSearch = (word: string) => {
    setKeyword(word)
  }

  const handleFilter = (type: FilterType) => {
    setFilter(type)
  }

  const handleViewDetail = (foodId: string) => {
    Taro.navigateTo({ url: `/pages/food-detail/index?id=${foodId}` })
  }

  const handleFavorite = (foodId: string) => {
    toggleFavorite(foodId)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[FoodPage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  useDidShow(() => {
    console.log('[FoodPage] 页面显示')
  })

  const filterTabs = [
    { key: 'all' as const, label: '全部', showDot: false },
    { key: 'green' as const, label: '绿灯', showDot: true },
    { key: 'yellow' as const, label: '黄灯', showDot: true },
    { key: 'red' as const, label: '红灯', showDot: true }
  ]

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
      <View className={styles.searchSection}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索食物，如麻辣烫、奶茶..."
            value={keyword}
            onInput={handleSearch}
            confirmType="search"
          />
          {keyword && (
            <Text className={styles.clearBtn} onClick={handleClear}>✕</Text>
          )}
        </View>

        <View className={styles.filterTabs}>
          {filterTabs.map(tab => (
            <View
              key={tab.key}
              className={classnames(styles.filterTab, styles[tab.key], filter === tab.key && styles.active)}
              onClick={() => handleFilter(tab.key)}
            >
              {tab.showDot && <View className={classnames(styles.filterDot, styles[tab.key])} />}
              <Text>{tab.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.green)} />
          <Text>可放心吃</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.yellow)} />
          <Text>少量慎吃</Text>
        </View>
        <View className={styles.legendItem}>
          <View className={classnames(styles.legendDot, styles.red)} />
          <Text>严禁食用</Text>
        </View>
      </View>

      {!keyword && favoriteFoods.length > 0 && (
        <View className={styles.favoritesSection}>
          <View className={styles.favoritesHeader}>
            <View className={styles.favoritesTitle}>
              <Text>❤️</Text>
              <Text>我的收藏</Text>
            </View>
          </View>
          <View className={styles.foodsList}>
            {favoriteFoods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={true}
                onFavorite={handleFavorite}
                onViewDetail={handleViewDetail}
                compact
              />
            ))}
          </View>
        </View>
      )}

      {!keyword && (
        <View className={styles.hotSearchSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionTitleText}>🔥 热门搜索</Text>
          </View>
          <View className={styles.hotTags}>
            {hotSearches.map((word, index) => (
              <Text
                key={index}
                className={styles.hotTag}
                onClick={() => handleHotSearch(word)}
              >
                {word}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View className={styles.foodsSection}>
        {keyword && (
          <Text className={styles.resultCount}>
            找到 {filteredFoods.length} 个相关食物
          </Text>
        )}

        {!keyword && (
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionTitleText}>全部食物</Text>
          </View>
        )}

        {filteredFoods.length > 0 ? (
          <View className={styles.foodsList}>
            {filteredFoods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                isFavorite={favorites.includes(food.id)}
                onFavorite={handleFavorite}
                onViewDetail={handleViewDetail}
              />
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🍽️</Text>
            <Text className={styles.emptyTitle}>没有找到相关食物</Text>
            <Text className={styles.emptyDesc}>试试其他关键词吧</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default FoodPage
