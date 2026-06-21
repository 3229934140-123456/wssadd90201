import React, { useState, useMemo } from 'react'
import { View, Text, Image, Textarea, Button, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { useAppStore } from '@/store/useAppStore'
import { getToday, getRelativeTime } from '@/utils/date'
import { MoodOption, DailyRecord } from '@/types'
import MoodSelector from '@/components/MoodSelector'
import styles from './index.module.scss'

const swellingLevels = [
  { level: 1, emoji: '😊', label: '无肿胀' },
  { level: 2, emoji: '🙂', label: '轻微' },
  { level: 3, emoji: '😐', label: '中度' },
  { level: 4, emoji: '😣', label: '明显' },
  { level: 5, emoji: '😫', label: '严重' }
]

const RecordPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null)
  const [swellingLevel, setSwellingLevel] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const { dailyRecords, addDailyRecord, completedTaskIds, currentDay, currentProject } = useAppStore()

  const todayRecord = useMemo(() => {
    return dailyRecords.find(r => r.date === getToday())
  }, [dailyRecords])

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[RecordPage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...photos, ...res.tempFilePaths].slice(0, 3)
        setPhotos(newPhotos)
        console.log('[RecordPage] 选择图片:', newPhotos)
      },
      fail: (err) => {
        console.error('[RecordPage] 选择图片失败:', err)
        setPhotos([
          'https://picsum.photos/id/64/300/300',
          'https://picsum.photos/id/91/300/300'
        ])
      }
    })
  }

  const handleDeletePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
  }

  const handleMoodChange = (mood: MoodOption) => {
    setSelectedMood(mood)
  }

  const handleSwellingSelect = (level: number) => {
    setSwellingLevel(level)
  }

  const handleNoteChange = (e: any) => {
    setNote(e.detail.value)
  }

  const handleSubmit = () => {
    if (!selectedMood) {
      Taro.showToast({ title: '请选择心情', icon: 'none' })
      return
    }
    if (photos.length === 0) {
      Taro.showToast({ title: '请上传照片', icon: 'none' })
      return
    }

    const record: DailyRecord = {
      id: Date.now().toString(),
      date: getToday(),
      mood: selectedMood.value,
      moodEmoji: selectedMood.emoji,
      swellingLevel: swellingLevel || undefined,
      note: note || undefined,
      photos: photos,
      completedTasks: [...completedTaskIds]
    }

    addDailyRecord(record)
    
    setSelectedMood(null)
    setSwellingLevel(null)
    setNote('')
    setPhotos([])
    
    Taro.showToast({ title: '记录成功！+50能量', icon: 'none' })
    console.log('[RecordPage] 提交记录:', record)
  }

  const handleViewPhoto = (photo: string) => {
    Taro.previewImage({
      urls: [photo],
      current: photo
    })
  }

  useDidShow(() => {
    console.log('[RecordPage] 页面显示')
  })

  const historyRecords = dailyRecords.filter(r => r.date !== getToday())

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
      {currentProject && (
        <View className={styles.compareSection}>
          <View className={styles.compareTitle}>
            <Text>📊</Text>
            <Text>恢复对比</Text>
          </View>
          <View className={styles.compareImages}>
            <View className={styles.CompareImage}>
              <View className={styles.compareImageWrapper}>
                <Image 
                  className={styles.compareImageImg} 
                  src="https://picsum.photos/id/177/300/300" 
                  mode="aspectFill"
                />
              </View>
              <Text className={styles.compareLabel}>术后第1天</Text>
            </View>
            <View className={styles.CompareImage}>
              <View className={styles.compareImageWrapper}>
                <Image 
                  className={styles.compareImageImg} 
                  src="https://picsum.photos/id/64/300/300" 
                  mode="aspectFill"
                />
              </View>
              <Text className={styles.compareLabel}>今天 (第{currentDay}天)</Text>
            </View>
          </View>
        </View>
      )}

      <View className={styles.todayRecordSection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>今日记录</Text>
          <Text style={{ fontSize: 24, color: '#86909C' }}>{getToday()}</Text>
        </View>

        {todayRecord ? (
          <View className={styles.historyItem}>
            <View className={styles.historyPhotos}>
              {todayRecord.photos.slice(0, 2).map((photo, index) => (
                <View key={index} className={styles.historyPhoto} onClick={() => handleViewPhoto(photo)}>
                  <Image className={styles.historyPhotoImage} src={photo} mode="aspectFill" />
                </View>
              ))}
            </View>
            <View className={styles.historyContent}>
              <View className={styles.historyHeader}>
                <Text className={styles.historyDate}>今天已记录</Text>
                <Text className={styles.historyMood}>{todayRecord.moodEmoji}</Text>
              </View>
              {todayRecord.swellingLevel && (
                <View className={styles.historyMeta}>
                  <View className={styles.historySwelling}>
                    <Text>肿胀程度：</Text>
                    <Text>{swellingLevels.find(s => s.level === todayRecord.swellingLevel)?.label}</Text>
                  </View>
                </View>
              )}
              {todayRecord.note && (
                <Text className={styles.historyNote}>{todayRecord.note}</Text>
              )}
              <Text className={styles.historyTasks}>
                完成 {todayRecord.completedTasks.length} 个任务
              </Text>
            </View>
          </View>
        ) : (
          <View className={styles.recordCard}>
            <MoodSelector
              value={selectedMood?.value}
              onChange={handleMoodChange}
            />

            <View className={styles.swellingSection}>
              <Text className={styles.swellingTitle}>📈 肿胀程度</Text>
              <View className={styles.swellingLevels}>
                {swellingLevels.map(item => (
                  <View
                    key={item.level}
                    className={classnames(styles.swellingLevel, swellingLevel === item.level && styles.selected)}
                    onClick={() => handleSwellingSelect(item.level)}
                  >
                    <Text className={styles.swellingEmoji}>{item.emoji}</Text>
                    <Text className={styles.swellingLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.swellingSection}>
              <Text className={styles.swellingTitle}>📸 恢复照片</Text>
              {photos.length > 0 ? (
                <View className={styles.photoPreview}>
                  {photos.map((photo, index) => (
                    <View key={index} className={styles.photoItem}>
                      <Image
                        className={styles.photoImage}
                        src={photo}
                        mode="aspectFill"
                        onClick={() => handleViewPhoto(photo)}
                      />
                      <View className={styles.photoDelete} onClick={() => handleDeletePhoto(index)}>
                        ✕
                      </View>
                    </View>
                  ))}
                  {photos.length < 3 && (
                    <View className={styles.photoItem} onClick={handleChooseImage}>
                      <View className={styles.photoUpload} style={{ height: '100%', border: 'none' }}>
                        <Text className={styles.uploadIcon}>+</Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View className={styles.photoUpload} onClick={handleChooseImage}>
                  <Text className={styles.uploadIcon}>📷</Text>
                  <Text className={styles.uploadText}>点击上传恢复照片（最多3张）</Text>
                </View>
              )}
            </View>

            <View className={styles.noteSection}>
              <Text className={styles.noteTitle}>📝 恢复日记</Text>
              <Textarea
                className={styles.noteInput}
                placeholder="记录今天的恢复感受、饮食情况等..."
                value={note}
                onInput={handleNoteChange}
                maxlength={500}
                showConfirmBar={false}
              />
            </View>

            <Button className={styles.submitBtn} onClick={handleSubmit}>
              保存记录
            </Button>
          </View>
        )}
      </View>

      <View className={styles.historySection}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleText}>历史记录</Text>
        </View>

        {historyRecords.length > 0 ? (
          historyRecords.map(record => (
            <View key={record.id} className={styles.historyItem}>
              <View className={styles.historyPhotos}>
                {record.photos.slice(0, 2).map((photo, index) => (
                  <View key={index} className={styles.historyPhoto} onClick={() => handleViewPhoto(photo)}>
                    <Image className={styles.historyPhotoImage} src={photo} mode="aspectFill" />
                  </View>
                ))}
              </View>
              <View className={styles.historyContent}>
                <View className={styles.historyHeader}>
                  <Text className={styles.historyDate}>{getRelativeTime(record.date)}</Text>
                  <Text className={styles.historyMood}>{record.moodEmoji}</Text>
                </View>
                {record.swellingLevel && (
                  <View className={styles.historyMeta}>
                    <View className={styles.historySwelling}>
                      <Text>肿胀：</Text>
                      <Text>{swellingLevels.find(s => s.level === record.swellingLevel)?.label}</Text>
                    </View>
                  </View>
                )}
                {record.note && (
                  <Text className={styles.historyNote}>{record.note}</Text>
                )}
                <Text className={styles.historyTasks}>
                  完成 {record.completedTasks.length} 个任务
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyHistory}>
            <Text className={styles.emptyIcon}>📔</Text>
            <Text className={styles.emptyTitle}>暂无历史记录</Text>
            <Text className={styles.emptyDesc}>坚持每天记录，见证美丽蜕变~</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default RecordPage
