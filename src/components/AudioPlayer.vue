<!--
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-07-03 17:57:57
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-07-03 17:58:05
 * @FilePath: /AI-project/berarbobo-discovery/src/components/AudioPlayer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="audio-container">
    <audio ref="player" controls @error="handleError">
      <source :src="objectUrl" type="audio/mpeg">
      <p>您的浏览器不支持音频播放</p>
    </audio>
    <div v-if="error" class="error-tip">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { convertToWav } from '@/utils/audio';

const props = defineProps({
  buffer: ArrayBuffer
});

const player = ref<HTMLAudioElement>();
const objectUrl = ref('');
const error = ref('');

const initPlayer = async () => {
  try {
    const blob = new Blob([props.buffer], { type: 'audio/mpeg' });
    
    // 格式验证
    if (!blob.type.startsWith('audio/')) {
      throw new Error('无效的音频格式');
    }

    // 创建对象URL
    objectUrl.value = URL.createObjectURL(blob);

    // 添加自动播放逻辑
    setTimeout(() => {
      player.value?.play().catch(err => {
        error.value = `播放失败: ${err.message}`;
      });
    }, 500);

  } catch (err) {
    // 格式转换回退
    console.warn('尝试WAV格式转换:', err);
    const wavBlob = await convertToWav(props.buffer);
    objectUrl.value = URL.createObjectURL(wavBlob);
  }
};

const handleError = (e: Event) => {
  const mediaError = (e.target as HTMLAudioElement).error;
  error.value = `播放错误: ${mediaError?.message || '未知错误'}`;
};

watch(() => props.buffer, initPlayer);

onUnmounted(() => {
  URL.revokeObjectURL(objectUrl.value);
});
</script>