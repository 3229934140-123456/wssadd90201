import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro, { useRouter, useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { generateShareImage } from '@/utils/share'
import classnames from 'classnames'
import styles from './index.module.scss'

interface PresetFood {
  id: string
  name: string
  emoji: string
}

const presetGreenFoods: PresetFood[] = [
  { id: '9', name: '鸡蛋羹', emoji: '🍳' },
  { id: '10', name: '南瓜粥', emoji: '🎃' },
  { id: '11', name: '清蒸鲈鱼', emoji: '🐟' },
  { id: '12', name: '水果沙拉', emoji: '🥗' },
  { id: '16', name: '牛奶', emoji: '🥛' },
  { id: '17', name: '西兰花', emoji: '🥦' }
]

const SharePage: React.FC = () => {
  const router = useRouter()
  const { user, currentDay } = useAppStore()
  const [selectedFoods, setSelectedFoods] = useState<string[]>([])
  const [shareImageUrl, setShareImageUrl] = useState<string>('')
  const [day, setDay] = useState<number>(currentDay || 1)

  useEffect(() => {
    const dayParam = router.params.day
    if (dayParam) {
      const parsedDay = parseInt(dayParam, 10)
      if (!isNaN(parsedDay) && parsedDay > 0) {
        setDay(parsedDay)
      }
    }
  }, [router.params.day])

  useEffect(() => {
    if (selectedFoods.length > 0) {
      const imageUrl = generateShareImage({
        foods: selectedFoods,
        day,
        checkInDays: user.checkInDays
      })
      setShareImageUrl(imageUrl)
    } else {
      setShareImageUrl('')
    }
  }, [selectedFoods, day, user.checkInDays])

  useDidShow(() => {
    console.log('[SharePage] 页面显示')
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  })

  useShareAppMessage(() => {
    return {
      title: `我在恢复星球第${day}天，一起变美不孤单~`,
      path: '/pages/home/index',
      imageUrl: shareImageUrl
    }
  })

  useShareTimeline(() => {
    return {
      title: `恢复星球第${day}天，打卡合规餐单`,
      imageUrl: shareImageUrl
    }
  })

  const handleToggleFood = (foodName: string) => {
    setSelectedFoods(prev => {
      if (prev.includes(foodName)) {
        return prev.filter(f => f !== foodName)
      } else {
        return [...prev, foodName]
      }
    })
  }

  const handleGenerateImage = () => {
    if (selectedFoods.length === 0) {
      Taro.showToast({ title: '请至少选择一种食物', icon: 'none' })
      return
    }
    const imageUrl = generateShareImage({
      foods: selectedFoods,
      day,
      checkInDays: user.checkInDays
    })
    setShareImageUrl(imageUrl)
    Taro.showToast({ title: '分享图已更新', icon: 'success' })
    console.log('[SharePage] 生成分享图:', selectedFoods)
  }

  const handleSaveImage = () => {
    if (!shareImageUrl) {
      Taro.showToast({ title: '请先生成分享图', icon: 'none' })
      return
    }

    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              saveImageToAlbum()
            },
            fail: () => {
              Taro.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
                confirmColor: '#FF7A9E',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    Taro.openSetting()
                  }
                }
              })
            }
          })
        } else {
          saveImageToAlbum()
        }
      }
    })
  }

  const saveImageToAlbum = () => {
    Taro.showLoading({ title: '保存中...' })
    Taro.downloadFile({
      url: shareImageUrl,
      success: (res) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            Taro.hideLoading()
            Taro.showToast({ title: '保存成功', icon: 'success' })
            console.log('[SharePage] 图片已保存到相册')
          },
          fail: (err) => {
            Taro.hideLoading()
            Taro.showToast({ title: '保存失败', icon: 'none' })
            console.error('[SharePage] 保存图片失败:', err)
          }
        })
      },
      fail: (err) => {
        Taro.hideLoading()
        Taro.showToast({ title: '图片下载失败', icon: 'none' })
        console.error('[SharePage] 下载图片失败:', err)
      }
    })
  }

  const handleShareToFriend = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success: () => {
        Taro.showToast({ title: '请点击右上角分享', icon: 'none' })
      }
    })
  }

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>📸 分享我的餐单</Text>
        <Text className={styles.pageDesc}>记录今日合规饮食，分享给好友一起变美</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.sharePreviewCard}>
          <View className={styles.previewTitle}>
            <Text>🖼️</Text>
            <Text>分享预览</Text>
          </View>
          
          {shareImageUrl ? (
            <View className={styles.previewImageContainer}>
              <Image src={shareImageUrl} mode="widthFix" />
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📸</Text>
              <Text className={styles.emptyText}>
                选择今日食物后，
                {'\n'}
                这里会显示分享预览图
              </Text>
            </View>
          )}

          <View className={styles.dayInfo}>
            <Text>恢复星球第 </Text>
            <Text className={styles.dayHighlight}>{day}</Text>
            <Text> 天 · 已坚持 {user.checkInDays} 天</Text>
          </View>
        </View>

        <View className={styles.foodSection}>
          <View className={styles.sectionTitle}>
            <Text>🍽️</Text>
            <Text>今日合规餐单</Text>
            <Text className={styles.selectedCount}>（已选 {selectedFoods.length} 项）</Text>
          </View>

          <View className={styles.foodTips}>
            💡 选择今天吃了哪些合规食物，生成专属分享图，分享给好友一起监督~
          </View>

          <View className={styles.foodGrid}>
            {presetGreenFoods.map(food => {
              const isSelected = selectedFoods.includes(food.name)
              return (
                <View
                  key={food.id}
                  className={classnames(styles.foodItem, isSelected && styles.selected)}
                  onClick={() => handleToggleFood(food.name)}
                >
                  <View className={styles.foodCheckbox}>
                    <Text className={styles.checkmark}>✓</Text>
                  </View>
                  <View className={styles.foodInfo}>
                    <Text className={styles.foodName}>
                      <Text className={styles.foodEmoji}>{food.emoji}</Text>
                      {' '}{food.name}
                    </Text>
                    <Text className={styles.foodLevel}>绿灯食物</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <View className={styles.actionSection}>
          <View className={styles.sectionTitle}>
            <Text>✨</Text>
            <Text>分享操作</Text>
          </View>

          <View className={styles.actionButtons}>
            <View
              className={classnames(styles.primaryBtn, selectedFoods.length === 0 && styles.disabled)}
              onClick={handleGenerateImage}
            >
              🎨 生成分享图
            </View>

            <View className={styles.btnRow}>
              <View
                className={classnames(styles.secondaryBtn, (!shareImageUrl || selectedFoods.length === 0) && styles.disabled)}
                onClick={handleSaveImage}
              >
                💾 保存图片
              </View>
              <View
                className={classnames(styles.primaryBtn, (!shareImageUrl || selectedFoods.length === 0) && styles.disabled)}
                onClick={handleShareToFriend}
              >
                📤 分享好友
              </View>
            </View>
          </View>

          {selectedFoods.length === 0 && (
            <Text className={styles.tipsText}>
              💡 请先选择今日合规餐单食物后，才能生成和保存或分享哦~
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default SharePage
