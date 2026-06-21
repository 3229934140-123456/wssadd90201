import React, { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { BlindBoxQuestion } from '@/types'
import { getRandomBlindBoxQuestion } from '@/data/tasks'
import styles from './index.module.scss'

interface BlindBoxProps {
  onComplete?: (isCorrect: boolean, energy: number) => void
}

const BlindBox: React.FC<BlindBoxProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState<BlindBoxQuestion | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const openBox = () => {
    const q = getRandomBlindBoxQuestion()
    setQuestion(q)
    setIsOpen(true)
    setSelectedIndex(null)
    setShowResult(false)
    console.log('[BlindBox] 打开盲盒，问题:', q.question)
  }

  const selectOption = (index: number) => {
    if (showResult || !question) return
    setSelectedIndex(index)
  }

  const submitAnswer = () => {
    if (selectedIndex === null || !question) return
    
    const correct = selectedIndex === question.correctIndex
    setIsCorrect(correct)
    setShowResult(true)
    
    const energy = correct ? 20 : 5
    Taro.showToast({
      title: correct ? `回答正确！+${energy}能量` : `答错了~ +${energy}鼓励分`,
      icon: 'none',
      duration: 2000
    })
    
    if (onComplete) {
      onComplete(correct, energy)
    }
  }

  const resetBox = () => {
    setIsOpen(false)
    setQuestion(null)
    setSelectedIndex(null)
    setShowResult(false)
  }

  return (
    <View className={styles.container}>
      {!isOpen ? (
        <View className={styles.box} onClick={openBox}>
          <View className={styles.boxInner}>
            <Text className={styles.boxIcon}>🎁</Text>
            <Text className={styles.boxTitle}>禁忌盲盒</Text>
            <Text className={styles.boxSubtitle}>点击开启，答题赢能量</Text>
          </View>
        </View>
      ) : (
        <View className={styles.questionCard}>
          <View className={styles.questionHeader}>
            <Text className={styles.questionIcon}>❓</Text>
            <Text className={styles.questionTitle}>禁忌知识问答</Text>
          </View>
          
          {question && (
            <>
              <Text className={styles.questionText}>{question.question}</Text>
              
              <View className={styles.options}>
                {question.options.map((option, index) => (
                  <View
                    key={index}
                    className={classnames(
                      styles.option,
                      selectedIndex === index && styles.selected,
                      showResult && index === question.correctIndex && styles.correct,
                      showResult && selectedIndex === index && index !== question.correctIndex && styles.wrong
                    )}
                    onClick={() => selectOption(index)}
                  >
                    <Text className={styles.optionLabel}>{['A', 'B', 'C', 'D'][index]}</Text>
                    <Text className={styles.optionText}>{option}</Text>
                  </View>
                ))}
              </View>
              
              {showResult && (
                <View className={styles.explanation}>
                  <Text className={styles.explanationTitle}>💡 解析</Text>
                  <Text className={styles.explanationText}>{question.explanation}</Text>
                </View>
              )}
              
              <View className={styles.actions}>
                {!showResult ? (
                  <Button 
                    className={classnames(styles.submitBtn, selectedIndex === null && styles.disabled)}
                    disabled={selectedIndex === null}
                    onClick={submitAnswer}
                  >
                    提交答案
                  </Button>
                ) : (
                  <Button className={styles.againBtn} onClick={resetBox}>
                    再来一次
                  </Button>
                )}
              </View>
            </>
          )}
        </View>
      )}
    </View>
  )
}

export default BlindBox
