import React, { useState, useMemo } from 'react'
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useAppStore } from '@/store/useAppStore'
import { projects } from '@/data/projects'
import { ProjectItem } from '@/types'
import classnames from 'classnames'
import styles from './index.module.scss'

const ProjectSelectPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null)
  const { selectProject, currentProject } = useAppStore()

  const handleRefresh = () => {
    setRefreshing(true)
    console.log('[ProjectSelectPage] 下拉刷新')
    setTimeout(() => {
      setRefreshing(false)
      Taro.showToast({ title: '刷新成功', icon: 'none' })
    }, 1000)
  }

  const handleProjectClick = (project: ProjectItem) => {
    setSelectedProject(project)
    setShowModal(true)
  }

  const handleConfirmSelect = () => {
    if (!selectedProject) return

    if (currentProject?.id === selectedProject.id) {
      Taro.showToast({ title: '当前已是该项目', icon: 'none' })
      setShowModal(false)
      setSelectedProject(null)
      return
    }

    Taro.showModal({
      title: '确认选择',
      content: `选择"${selectedProject.name}"后，将重置当前恢复进度，确认继续吗？`,
      confirmColor: '#FF7A9E',
      success: (res) => {
        if (res.confirm) {
          selectProject(selectedProject.id)
          Taro.showToast({ title: '项目选择成功', icon: 'success' })
          console.log('[ProjectSelectPage] 选择项目:', selectedProject.name)
          setShowModal(false)
          setSelectedProject(null)
          setTimeout(() => {
            Taro.switchTab({ url: '/pages/home/index' })
          }, 500)
        }
      }
    })
  }

  const handleCancelSelect = () => {
    setShowModal(false)
    setSelectedProject(null)
  }

  const getLightColor = (color: string) => {
    const colorMap: Record<string, string> = {
      '#FF7A9E': '#FFB6C1',
      '#7C6BFF': '#A89BFF',
      '#00B578': '#66D4A8',
      '#FFAA00': '#FFD27A',
      '#00B42A': '#66D47A',
      '#F53F3F': '#FF8A8A'
    }
    return colorMap[color] || '#FFB6C1'
  }

  const getBgColor = (color: string) => {
    const colorMap: Record<string, string> = {
      '#FF7A9E': '#FFF5F7',
      '#7C6BFF': '#F0EBFF',
      '#00B578': '#E8FAF2',
      '#FFAA00': '#FFF7E8',
      '#00B42A': '#E8FAEE',
      '#F53F3F': '#FFECEC'
    }
    return colorMap[color] || '#FFF5F7'
  }

  const projectList = useMemo(() => {
    return projects.map(project => ({
      ...project,
      cardColor: project.color,
      cardColorLight: getLightColor(project.color),
      cardColorBg: getBgColor(project.color)
    }))
  }, [])

  useDidShow(() => {
    console.log('[ProjectSelectPage] 页面显示')
  })

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
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>选择你的医美项目</Text>
          <Text className={styles.subtitle}>为你定制专属恢复计划</Text>
        </View>

        {projectList.length > 0 ? (
          <View className={styles.projectList}>
            {projectList.map(project => (
              <View
                key={project.id}
                className={classnames(
                  styles.projectCard,
                  currentProject?.id === project.id && styles.selected
                )}
                style={{
                  '--card-color': project.cardColor,
                  '--card-color-light': project.cardColorLight,
                  '--card-color-bg': project.cardColorBg
                } as React.CSSProperties}
                onClick={() => handleProjectClick(project)}
              >
                <View className={styles.projectIcon}>
                  {project.icon}
                </View>
                <View className={styles.projectInfo}>
                  <Text className={styles.projectName}>{project.name}</Text>
                  <View className={styles.projectRecovery}>
                    <Text>⏱️</Text>
                    <Text>恢复周期 {project.recoveryDays} 天</Text>
                  </View>
                  <Text className={styles.projectDesc}>{project.description}</Text>
                </View>
                <Text className={styles.projectArrow}>→</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔍</Text>
            <Text className={styles.emptyText}>
              暂无项目数据{'\n'}
              请稍后再试~
            </Text>
          </View>
        )}
      </View>

      {showModal && selectedProject && (
        <View className={styles.modalOverlay} onClick={handleCancelSelect}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalIcon}>{selectedProject.icon}</Text>
            <Text className={styles.modalTitle}>确认选择该项目</Text>
            <Text className={styles.modalDesc}>
              选择后将为您定制专属恢复计划
            </Text>
            <View className={styles.modalProjectInfo}>
              <Text className={styles.modalProjectName}>{selectedProject.name}</Text>
              <Text className={styles.modalProjectRecovery}>
                恢复周期 {selectedProject.recoveryDays} 天
              </Text>
            </View>
            <View className={styles.modalButtons}>
              <View
                className={classnames(styles.modalBtn, styles.cancel)}
                onClick={handleCancelSelect}
              >
                再想想
              </View>
              <View
                className={classnames(styles.modalBtn, styles.confirm)}
                onClick={handleConfirmSelect}
              >
                确认选择
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default ProjectSelectPage
