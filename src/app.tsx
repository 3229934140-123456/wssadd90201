import React, { useEffect } from 'react';
import { useDidShow, useDidHide, useRouter, Taro } from '@tarojs/taro';
import { useAppStore } from '@/store/useAppStore';
import './app.scss';

function App(props) {
  const { currentProject } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    console.log('[App] 应用启动');
    const { checkAndResetDailyTasks } = useAppStore.getState();
    checkAndResetDailyTasks();
    checkProjectSelection();
  }, []);

  useDidShow(() => {
    console.log('[App] 应用显示');
    const { checkAndResetDailyTasks } = useAppStore.getState();
    checkAndResetDailyTasks();
    checkProjectSelection();
  });

  useDidHide(() => {
    console.log('[App] 应用隐藏');
  });

  const checkProjectSelection = () => {
    const path = router.path;
    const noProjectRequiredPages = [
      'pages/project-select/index',
      'pages/comfort/index',
      'pages/share/index'
    ];

    if (!currentProject && !noProjectRequiredPages.includes(path)) {
      console.log('[App] 未选择项目，跳转到项目选择页');
      Taro.redirectTo({
        url: '/pages/project-select/index'
      });
    }
  };

  return props.children;
}

export default App;
